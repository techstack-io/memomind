"""Contemplative reasoning service.

** How does this teaching illuminate this person's experience? **

Takes the reflection selected by retrieval and ranking, interprets it in
the context of the user's current message and recent conversation history,
and returns a structured ReflectionPlan.

This service does not generate Ana's visible response. Its only
responsibility is to determine how the selected Lojong reflection applies
to the user's present experience and what direction the conversation
should take next.
"""

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.schemas.reflection_plan import ReflectionPlan
from app.services.retrieval_service import RetrievalCandidate
from app.settings import get_settings

settings = get_settings()


REFLECTION_REASONING_SYSTEM_PROMPT = """
You are the internal contemplative reasoning layer for Ana, Mettavia's
Lojong-based reflection guide.

Your task is to interpret the user's current experience through the selected
Lojong reflection and create a ReflectionPlan for Ana's final response.

Do not write Ana's visible response.

The selected reflection is the primary contemplative authority for the plan.
Preserve its actual teaching. Do not dilute it into generic reflective
listening, mindfulness language, therapeutic language, coaching, productivity
advice, or self-help.

The plan must make clear what this specific reflection contributes that a
generic compassionate response would not.

For every plan:

- Contemplative Lens must state the selected teaching's distinct way of seeing
  the user's situation.
- User Dynamic must describe what may be happening for the user, using cautious
  language and remaining grounded in their actual words.
- Core Insight must express the central teaching directly and concretely. It
  must not merely say to notice, observe, acknowledge, explore, or become aware.
  This restriction targets generic reflective-listening substitutes for the
  teaching, not a specific practice the reflection itself prescribes. If the
  selected reflection's appropriate tier is itself an observing or noticing
  practice, express that practice directly and concretely — the restriction
  does not require replacing the reflection's own instructions with something
  more assertive.
- Conversation Movement must describe how Ana should move the user through the
  selected teaching, not merely invite further introspection.
- Relevant Elements must contain the specific principles, distinctions, or
  movements from the selected reflection that should appear in the response.
- Avoid must include both reflection-specific safety concerns and ways the
  teaching could be weakened, distorted, moralized, or replaced by generic
  language.
  
Pedagogical Strategy must be chosen deliberately, not defaulted to direct_response:

- direct_response: choose this when the selected teaching can be applied
  clearly and responsibly from facts the user has already provided, and when
  practical clarity or timely action is more useful than further discovery.
  Concrete or urgent circumstances may support direct_response, but financial
  stress, relational conflict, or practical consequences alone do not require
  it. If the Core Insight depends on an inner conclusion, identity judgment,
  or mental movement the user has not yet recognized, prefer guided_discovery
  or living_inquiry first.

- guided_discovery: the Core Insight depends on something the user has not
  yet recognized or articulated. Ask one specific, pointed question that
  helps them discover the particular distinction or pattern the selected
  teaching depends upon. The question should arise naturally from what the
  user actually said and should make the next step of the conversation
  clearer without hinting at the conclusion.

- living_inquiry: the selected reflection concerns the nature of self,
  awareness, or another teaching that is best understood through direct
  experience rather than explanation. Guide the user toward discovering the
  insight through a concrete, immediately accessible invitation to observe
  their present experience. Do not state the Core Insight before the user
  has had an opportunity to notice something for themselves. If they have
  already made a meaningful observation, the next step may be to integrate
  and deepen what they discovered by expressing the Core Insight as a
  natural continuation of their own experience, not as a hidden conclusion
  being revealed.

When choosing between guided_discovery and living_inquiry, prefer
living_inquiry only when the reflection's own content frames the teaching as
something to be looked into directly, not merely explained.

Pedagogical Strategy should reflect the user's current place in the inquiry,
not simply the reflection itself. If the user has already made a meaningful
observation that the selected teaching depends upon, prefer a strategy that
integrates and develops that observation rather than repeating another
observational invitation.

When the selected reflection concerns acceptance, responsibility, agency,
impermanence, blame, or helplessness, preserve the reflection's precise
distinctions. For example:

- acceptance is not resignation;
- responsibility is not self-blame;
- personal agency concerns how one meets the present, not responsibility for
  harm inflicted by others;
- clear seeing comes before reaction;
- the conversation should move from helplessness or blame toward a deliberate
  way of meeting what is actually present.

Do not reduce these teachings to questions such as:

- What do you notice?
- Where do you feel it?
- What happens next in your mind?
- Can you sit with the feeling?

Such questions may be useful only after the plan has first conveyed the
selected reflection's actual insight and direction.

When the selected reflection contains more than one practice or offering —
particularly when they are explicitly gated by the person's readiness,
familiarity, or psychological stability — the plan must select and commit
to exactly one, based on evidence in the user's message and history. Do not
default to the more advanced or more distinctive offering simply because it
expresses the teaching more directly. If the reflection instructs starting
with a gentler practice absent clear signals of readiness for something
deeper, and the user's message shows no such signals, the plan must reflect
the gentler offering — the instruction to "express the teaching directly"
applies to how clearly the chosen tier is conveyed, not to which tier is
chosen.

Do not diagnose the user. Do not state assumptions as facts. Base the plan on
the user's current message, recent conversation history, and the selected
reflection.

Keep every field concise, specific, and useful to the response-generation
stage. The resulting plan should make it difficult for the final response to
ignore or erase the selected Lojong teaching, and should make the chosen
Pedagogical Strategy unambiguous to the generation stage.
""".strip()


def format_list(items: list[str]) -> str:
    """Format a list as Markdown."""

    if not items:
        return "- None provided"

    return "\n".join(f"- {item}" for item in items)


def format_recent_history(
    history: list[tuple[str, str]],
) -> str:
    """Format recent user and assistant exchanges as Markdown."""

    if not history:
        return "No recent conversation history is available."

    formatted_turns: list[str] = []

    for user_message, assistant_message in history:
        formatted_turns.append(
            "\n".join(
                [
                    "### Conversation Turn",
                    "",
                    f"**User:** {user_message}",
                    "",
                    f"**Ana:** {assistant_message}",
                ]
            )
        )

    return "\n\n".join(formatted_turns)


def build_reflection_context(
    reflection: RetrievalCandidate,
) -> str:
    """Format the selected reflection for the reasoning model."""

    return "\n".join(
        [
            "## Selected Reflection",
            "",
            f"**Reflection ID:** {reflection.id}",
            f"**Title:** {reflection.title}",
            f"**Similarity Score:** {reflection.similarity:.3f}",
            "",
            "### Central Point",
            reflection.point or "No separate central point was provided.",
            "",
            "### Memo Interpretation",
            reflection.memo_interpretation,
            "",
            "### Conversation Guidance",
            reflection.conversation_guidance,
            "",
            "### Core Principles",
            format_list(reflection.core_principles),
            "",
            "### Associated Emotions",
            format_list(reflection.emotions),
            "",
            "### Associated Patterns",
            format_list(reflection.patterns),
            "",
            "### Associated Contexts",
            format_list(reflection.contexts),
            "",
            "### Reflection-Specific Safety Guidance",
            reflection.safety or "No additional safety guidance was provided.",
        ]
    )


async def build_reflection_plan(
    message: str,
    reflection: RetrievalCandidate,
    history: list[tuple[str, str]],
) -> ReflectionPlan:
    """Interpret the selected reflection and return a ReflectionPlan."""

    reasoning_model = ChatOpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key,
        temperature=0,
        max_retries=2,
        timeout=30,
    )

    structured_model = reasoning_model.with_structured_output(
        ReflectionPlan
    )

    analysis_prompt = "\n".join(
        [
            "## Current User Message",
            "",
            message,
            "",
            "## Recent Conversation History",
            "",
            format_recent_history(history),
            "",
            build_reflection_context(reflection),
            "",
            "## Task",
            "",
            "Create the internal ReflectionPlan that should guide Ana's final response.",
            "",
            "Preserve the selected reflection's actual teaching and distinctions.",
            "Do not produce a plan that could apply equally well to any reflection.",
            "Do not substitute generic observation, validation, or mindfulness prompts",
            "for the reflection's specific contemplative movement.",
            "",
            f"The reflection_id must be exactly: {reflection.id}",
        ]
    )

    result = await structured_model.ainvoke(
        [
            SystemMessage(
                content=REFLECTION_REASONING_SYSTEM_PROMPT
            ),
            HumanMessage(content=analysis_prompt),
        ]
    )

    return result