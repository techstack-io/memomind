"""Shared, enforced vocabulary for Reflection Object retrieval_signals.

Every knowledge-base .md file's frontmatter must draw its emotions,
patterns, contexts, and core_principles from these enums -- not free text.
This is what keeps embedding-based retrieval reliable as more traditions
and entries are authored: without a shared vocabulary, near-synonyms
(feeling_stuck vs. stuck vs. feeling_trapped) silently fragment retrieval
quality.

Originally seeded from lojong-001's tags (Lojong only). Expanded to cover
the full practice engine: Four Brahma-viharas, Eightfold Path,
mindfulness, impermanence, and dependent origination. Adding a new tag is
a deliberate edit here, not something any slogan/entry file can invent on
its own -- that's the point.

Note: MindTrainingPoint below is structural metadata about a slogan's
place in the traditional Lojong outline, not a retrieval signal like the
enums above it -- it doesn't describe a user's situation, it describes
the source material itself.
"""

from enum import StrEnum


class EmotionTag(StrEnum):
    ...
    # Original (Lojong)
    OVERWHELMED = "overwhelmed"
    DISCOURAGED = "discouraged"
    UNCERTAIN = "uncertain"
    HELPLESS = "helpless"

    # Brahma-viharas (Metta/Karuna/Mudita/Upekkha often surface these)
    RESENTFUL = "resentful"
    ENVIOUS = "envious"
    IRRITATED = "irritated"
    LONELY = "lonely"

    # Mindfulness / dependent origination
    ANXIOUS = "anxious"
    RESTLESS = "restless"

    # Impermanence
    GRIEVING = "grieving"
    AFRAID = "afraid"

    # Expanded emotional range (added for lojong-002)
    SAD = "sad"
    DISAPPOINTED = "disappointed"
    HURT = "hurt"
    NOSTALGIC = "nostalgic"


class PatternTag(StrEnum):
    # Original (Lojong)
    CATASTROPHIZING = "catastrophizing"
    EXTERNAL_BLAME = "external_blame"
    SELF_PITY = "self_pity"
    FEELING_STUCK = "feeling_stuck"

    # Brahma-viharas
    COMPARISON = "comparison"
    JUDGING_OTHERS = "judging_others"
    WITHHOLDING_KINDNESS = "withholding_kindness"

    # Mindfulness
    RUMINATION = "rumination"
    AVOIDANCE = "avoidance"
    AUTOPILOT = "autopilot"

    # Impermanence / dependent origination
    CLINGING = "clinging"
    RESISTING_CHANGE = "resisting_change"

    # Cognitive distortions (added for lojong-002)
    TAKING_THOUGHTS_AS_FACTS = "taking_thoughts_as_facts"
    OVERIDENTIFICATION = "overidentification"
    PERSONALIZING = "personalizing"
    MIND_READING = "mind_reading"
    FORTUNE_TELLING = "fortune_telling"
    BLACK_AND_WHITE_THINKING = "black_and_white_thinking"
    FIXED_IDENTITY = "fixed_identity"


class ContextTag(StrEnum):
    # Original (Lojong)
    WORK = "work"
    RELATIONSHIPS = "relationships"
    HEALTH = "health"
    MAJOR_LIFE_TRANSITION = "major_life_transition"

    # Broaden relationships bucket without over-fragmenting it
    PARENTING = "parenting"
    FRIENDSHIP = "friendship"

    # Common triggers across traditions
    FINANCES = "finances"
    GRIEF_AND_LOSS = "grief_and_loss"
    SOCIAL_MEDIA = "social_media"

    # Expanded relational/situational contexts (added for lojong-002)
    FAMILY_CONFLICT = "family_conflict"
    FAILURE_OR_REJECTION = "failure_or_rejection"


class CorePrincipleTag(StrEnum):
    # Original (Lojong)
    ACCEPTANCE = "acceptance"
    PERSONAL_AGENCY = "personal_agency"
    IMPERMANENCE = "impermanence"
    HONEST_SELF_REFLECTION = "honest_self_reflection"

    # Four Brahma-viharas
    LOVING_KINDNESS = "loving_kindness"       # Metta
    COMPASSION = "compassion"                 # Karuna
    SYMPATHETIC_JOY = "sympathetic_joy"       # Mudita
    EQUANIMITY = "equanimity"                 # Upekkha

    # Eightfold Path -- kept at full granularity since the tradition
    # itself is explicitly structured as eight named limbs
    RIGHT_VIEW = "right_view"
    RIGHT_INTENTION = "right_intention"
    RIGHT_SPEECH = "right_speech"
    RIGHT_ACTION = "right_action"
    RIGHT_LIVELIHOOD = "right_livelihood"
    RIGHT_EFFORT = "right_effort"
    RIGHT_MINDFULNESS = "right_mindfulness"
    RIGHT_CONCENTRATION = "right_concentration"

    # Mindfulness (as its own practice, distinct from the Eightfold limb)
    PRESENT_MOMENT_AWARENESS = "present_moment_awareness"
    NON_JUDGMENTAL_OBSERVATION = "non_judgmental_observation"

    # Dependent origination
    INTERCONNECTEDNESS = "interconnectedness"
    NON_ATTACHMENT = "non_attachment"
    
    
class Difficulty(StrEnum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    
    
class MindTrainingPoint(StrEnum):
    """The seven points structuring the 59 Chekawa Lojong slogans.
    Lojong-specific -- entries from other traditions leave this unset.
    """

    RESOLVE_TO_BEGIN = "resolve_to_begin"
    TRAIN_IN_EMPATHY_AND_COMPASSION = "train_in_empathy_and_compassion"
    TRANSFORM_UNFAVORABLE_CIRCUMSTANCES = "transform_unfavorable_circumstances"
    INTEGRATE_PRACTICE_INTO_DAILY_LIFE = "integrate_practice_into_daily_life"
    EVALUATE_THE_TRAINED_MIND = "evaluate_the_trained_mind"
    COMMITMENTS_OF_MIND_TRAINING = "commitments_of_mind_training"
    GUIDELINES_FOR_MIND_TRAINING = "guidelines_for_mind_training"
