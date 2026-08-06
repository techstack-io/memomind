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

- direct_response: the person is describing a concrete, practical, or urgent
  situation where clarity and a grounded response serve them better than an
  exercise — financial stress, relational conflict, decisions requiring real
  engagement with consequences. State the insight plainly and move the
  conversation forward through it in this turn.

- guided_discovery: the person's situation has emotional or reflective depth
  but isn't yet in genuine inquiry — for example, noticing a pattern in
  themselves (spiritual pride, avoidance, self-judgment) that they haven't
  fully examined. Ask one specific, pointed question that draws out the
  noticing the insight depends on, before offering the insight itself.

- living_inquiry: the selected reflection concerns the nature of self,
  awareness, or a similarly direct, experiential inquiry — where being told
  the conclusion actively undermines the practice. Offer a concrete, doable
  invitation to look or notice, specific enough that the person could act on
  it right now. Do not state the Core Insight this turn.

When choosing between guided_discovery and living_inquiry, prefer
living_inquiry only when the reflection's own content frames the teaching as
something to be looked into directly, not merely explained.

If recent conversation history shows an invitation or question was already
offered in guided_discovery or living_inquiry mode and the user has now
responded to it, this turn should move toward stating the Core Insight,
grounded specifically in what the user reported noticing — not the original
insight restated as if their response hadn't been read.

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