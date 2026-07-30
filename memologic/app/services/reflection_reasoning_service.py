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

Your task is to interpret the user's current experience through the
selected Lojong reflection.

Do not write Ana's final response.

Instead, create a concise ReflectionPlan that identifies:

- the central contemplative lens for this conversation;
- what appears to be happening for the user;
- the core insight the selected reflection brings to the situation;
- where the conversation should move next;
- which elements of the teaching should naturally inform the response;
- what the response should avoid.

The selected reflection must remain the primary basis of the plan. Do not
replace it with generic therapeutic, productivity, coaching, or self-help
language.

Do not diagnose the user. Do not state assumptions as facts. Base the plan
on the user's actual words, the recent conversation context, and the
selected reflection.

Keep every field concise, specific, and useful to the response-generation
stage.
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