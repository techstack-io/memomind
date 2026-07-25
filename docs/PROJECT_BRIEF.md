# MemoMind: AI Design

This document captures the architecture and reasoning decisions behind MemoMind's AI system — not the product brief (see `PROJECT_BRIEF.md`), but *how* the reasoning actually works and why it's built this way.

---

## Two Separate Pipelines

MemoMind's AI does two structurally different jobs. They're easy to conflate into one diagram, but they have different inputs, different timing pressures, and should be built as two separate flows.

---

## 1. Reactive Conversation Pipeline

**Flow:** Message → Analysis → Retrieval & Ranking → Confidence Routing → Generation → (decoupled) Memory Evaluation

1. **Message Analysis** — the model reads the user's message and characterizes it: emotional signals, situational context, behavioral patterns. This is interpretation, not a decision.
2. **Reflection Retrieval & Ranking** — candidate Reflection Objects are pulled from the Knowledge Base and ranked by semantic similarity, contextual relevance, emotional fit, behavioral match, plus safety/suitability filtering.
3. **Confidence is a byproduct of ranking, not a separately computed value.** The top candidate's score *is* the confidence level. There is no independent "how confident am I" step.
4. **Three-way routing on that score:**
   - **High** → the top reflection is woven into the system prompt as guidance for the reply.
   - **Medium** → the model asks a clarifying question instead of offering a reflection. (This is also the right path when several reflections are plausibly relevant but none stands out — ambiguity from genuine crossover between slogans is a legitimate reason for medium confidence, not just low understanding of the user.)
   - **Low** → a plain, warm response, no reflection, no question.
5. **Generation** — the selected prompt path is sent to the model to produce the actual reply.
6. **Memory evaluation runs independently, after the reply logic is decided** — not blocking the response. If the user has memory enabled, the conversation is queued for separate evaluation, regardless of which of the three paths was taken above.

### Retrieval architecture: vector embeddings, not a single LLM judgment call

**Original plan (superseded):** hand the model a compact Tier 1 index (`id`, `title`, `retrieval_signals`, `core_principles` per entry, ~60–70 tokens each) in every prompt and let it reason directly over the whole list to pick the best match — reasonable given Lojong's corpus size (~59 slogans) in isolation, keeping the system to roughly two LLM calls per turn (a judgment call, then a generation call).

**Why this was revisited:** the actual corpus is a genuinely open-ended, multi-tradition knowledge base (Lojong + Four Brahma-viharas + Eightfold Path + mindfulness + impermanence + dependent origination), not a bounded ~59-entry set. Waiting to reactively hit a corpus-size tripwire (originally proposed at ~150–200 entries) before switching architectures would mean re-architecting retrieval *after* the router, the Tier 1 shape, and dependent code are already built around the smaller-scale assumption. Better to build for the intended scale now, while the corpus is still small.

There was also a concrete cost driver: an LLM-reasoning judgment call over a growing Tier 1 index adds a third API call per message (on top of safety moderation and reply generation), and it's the most expensive and slowest of the three as the index grows.

**Decision:** move to vector-embedding-based retrieval.
- Each Tier 1 entry (`retrieval_signals` + `core_principles` text) is embedded once, at authoring time, and stored (pgvector on the existing Railway Postgres).
- Per message, only the user's message is embedded — one cheap embedding API call, not a chat completion.
- Similarity search runs as a DB query, not an LLM call, to find the top 1–2 candidates.
- Only then is the full Tier 2 payload fetched for the winner(s) and fed into the generation call.

**Per-message API call comparison (worst case):**
- No routing at all: 2 calls — Moderation API + reply generation.
- LLM-reasoning judgment call over Tier 1: 3 calls, and the 3rd is the most expensive/slowest.
- Vector-embedding routing (chosen): 3 calls, but the 3rd is a cheap embedding call, not a chat completion.

This replaces only the candidate-selection mechanism. The rest of the pipeline — confidence routing, Tier 2 fetch for the winner, the generation call, safety-as-hard-override — is unchanged.

**Open follow-up:** a shared, enforced vocabulary/taxonomy for `emotions`/`patterns`/`contexts` matters here — embedding quality depends on consistent language in `retrieval_signals`, arguably even more than an LLM-reasoning approach would have needed, since embeddings are more sensitive to exact wording than a model reasoning about meaning.

### Retrieval signal crossover is expected, not a bug

Lojong slogans are overlapping lenses on shared root problems, not a clean partition of human experience. Multiple reflections legitimately sharing `emotions`/`patterns` tags is normal. `patterns` and `core_principles` tend to discriminate between candidates better than `emotions` alone, since emotion tags are the most likely to be shared across many entries.

---

## 2. Retrospective Extraction Pipeline

**Flow:** Log → Categorize & Match → Save → Present for user review/confirmation

This is a different job with different constraints:

- No confidence-routing pressure — nothing is being interrupted, so there's no "should I say something right now" decision to make.
- The model reads a **whole entry** (or a day's worth of breadcrumbs at evening reflection), not a single message.
- Output is **discrete tagged moments, not a single whole-entry verdict.** A single log entry can map to multiple distinct moments across multiple framework concepts.

**Canonical example:** a birthday-morning log entry — buying a cake and making a birthday breakfast for one child, then buying a brownie for the other child so he wouldn't feel left out — doesn't get one tag. It's identified as (at least) two separate moments: the birthday preparation mapping to **Metta** (loving-kindness) and **Mudita** (sympathetic joy), and the brownie decision mapping separately to **Karuṇā** (compassion / preventing suffering before it occurs).

**This pipeline is multi-tradition, not Lojong-only.** The Knowledge Base spans Lojong, the Four Brahma-viharas, and other frameworks, each in the same unified JSON schema under `memologic/knowledge/wisdom/<tradition>/`. Extraction needs to reason across all of them, not just Lojong.

**Architecture:** same pattern as conversation retrieval — hand the model the day's breadcrumbs plus a compact cross-tradition index of concepts, let it reason directly and return structured, categorized moments. One call, structured output, no need for a separate multi-stage analysis chain unless a concrete pressure (corpus size, reuse, cost) shows up later.

**User control:** candidate moments are surfaced to the user for confirmation before being stored — nothing is saved as long-term memory silently.

---

## Where This Fits the Three-Beat Daily Structure

1. **Morning gratitude (Slogan 41)** — fixed ritual content, outside the extraction pipeline entirely. This is priming, not analysis.
2. **Breadcrumb capture, throughout the day** — raw capture, no extraction at this point.
3. **Evening batch reflection** — the Retrospective Extraction Pipeline runs here, across the full day's breadcrumbs at once.

---

## Why the Model "Understands" Emotion at All (elicitation, not teaching)

MemoMind's prompting **elicits latent capability from pretraining — it does not teach the model anything new.** The base model already has associative pattern-recognition for emotional and situational language, learned from massive text corpora during pretraining, long before any API call. What MemoMind's prompts, output formats, and few-shot examples do is **direct that existing capability at a narrow, specific task** — not create the capability itself.

**Practical implication:** the quality of message analysis and reflection selection is bounded by (1) how capable the underlying model already is at this kind of inference — a factor of model choice — and (2) how well the prompt directs that capability toward MemoMind's specific categories and taxonomy. Prompt design can meaningfully improve #2; #1 is mostly fixed short of switching or fine-tuning models.

---

## Safety Architecture

**Per-reflection safety fields (`safety.contraindications`, `fallback_behavior`) are a hard override, not a soft input to the confidence score.** If a candidate reflection is flagged as contraindicated for the detected context (e.g., acute panic, active trauma response, self-harm risk, immediate crisis), it is blocked from being used — full stop — regardless of how well it otherwise scored. A probabilistic ranking process is the wrong place to gate crisis-adjacent content.

**Practical consequence for the retrieval architecture:** safety filtering should NOT live in the Tier 1 compact index that the model reasons over during candidate selection — the LLM's selection reasoning shouldn't be responsible for safety. Instead, safety should run as a **separate, deterministic check** after the model has proposed a candidate, before that candidate is actually used.

This sits underneath, and is more granular than, the app-wide crisis detection layer (which can bypass reflection entirely and redirect to grounded, supportive language and resources).

---

## Copyright & Attribution

- The teachings themselves (Lojong, the Brahma-viharas, etc.) are centuries-old and not under copyright.
- **Any specific translator's or author's wording of a teaching is copyrighted**, even when the underlying teaching is public domain — different published translations of the same slogan demonstrate that wording is itself an act of authorship.
- MemoMind uses **original interpretations, written in Memo's own voice**, not reproductions or close paraphrases of any specific published translation or commentary.
- `memo_interpretation` (and similar fields) are **guidance for the generation call, not literal output.** The model is instructed to apply the idea to what the user specifically shared, not quote or lightly reword the seed text — otherwise responses would feel templated and repetitive across users.

---

## Technical Notes

- **Use `model.ainvoke()`, not `model.invoke()`,** inside async FastAPI routes — the synchronous call blocks the event loop under load, since the OpenAI request is network I/O.
- **Memory evaluation is decoupled and best-effort** — it should not block or delay the user-facing reply. Fire to a background task/queue rather than awaiting it inline.
- **Time-dependent logic must be computed client-side in `useEffect`, not during render** — computing `new Date()`-dependent values (e.g., time-of-day greeting) directly during render causes real SSR/client hydration mismatches when server and client render at slightly different instants.

---

## Open Design Questions / Limits Not Yet Locked In

- **Confidence thresholds** (currently placeholder values) need real calibration once ranking scores exist from actual usage.
- ~~**Corpus size tripwire** for reconsidering embeddings/vector search~~ — **Decided:** moved to vector-embedding-based retrieval proactively (see "Retrieval architecture" above).
- **Shared vocabulary/taxonomy** for `retrieval_signals` (`emotions`/`patterns`/`contexts`) — not yet enforced anywhere; needed for reliable embedding-based matching as more slogans/traditions are authored.
- **Reflection frequency per conversation** — whether to cap how often a reflection is offered in a single session, so MemoMind doesn't start to feel like a fortune-cookie dispenser.
- **Depth/readiness gating** — whether Reflection Objects need a field beyond `difficulty: introductory` to represent how "deep" or overtly Buddhist a concept is, so retrieval can hold back subtler content (e.g., bodhicitta) until a user has sufficient history with the app.