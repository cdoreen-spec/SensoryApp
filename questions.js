const LANGUAGES = ["en", "af"];
const RESPONDENT_TYPES = ["adult", "teen", "parent"];

const QUESTIONNAIRE_UI = {
  en: {
    shellTitle: "Sensory Screening Questionnaire",
    shellSubtitle: "Understanding sensory experiences, one gentle step at a time",
    introModalTitle: "Before you begin",
    introModalLead:
      "In this questionnaire you will simply answer yes or no questions. You may need to generalise a little — if you are unsure, ask yourself: if I had to choose, would this be a yes or a no?",
    introModalPurpose:
      "The idea is to identify sensory preferences — what you (or your child) tend to prefer and how the senses respond — so we can see how best to support you going forward.",
    introModalNote:
      "There are no right or wrong answers. It is also fine if some of your answers seem to pull in opposite directions — sensory preferences are often mixed. Take your time, and go with your first instinct.",
    introModalCta: "Got it — let’s begin",
    chooseRespondent: "Who is completing this questionnaire?",
    chooseRespondentDesc: "Choose the option that best describes you. The questions will adjust to suit your age and perspective.",
    adult: "I'm an adult",
    adultDesc: "I am answering about my own sensory experiences.",
    teen: "I'm a teenager",
    teenDesc: "I am answering about my own sensory experiences at home and at school.",
    parent: "I'm a parent",
    parentDesc: "I am answering about my child’s sensory experiences.",
    answerMixedNote:
      "It is completely fine to say yes to questions that seem opposite. You might enjoy both high-impact and low-impact sport, or like a busy environment as well as your own quiet space. Answer each question on its own — mixed preferences are common and expected.",
    answerMixedNoteParent:
      "It is completely fine to say yes to questions that seem opposite. Your child might enjoy both high-impact and low-impact sport, or like a busy environment as well as their own quiet space. Answer each question on its own — mixed preferences are common and expected.",
    answerMixedNoteLabel: "A note about answering",
    language: "Language",
    english: "English",
    afrikaans: "Afrikaans",
    continue: "Continue",
    seeResults: "See results",
    back: "Back",
    draftResumeTitle: "Continue where you left off?",
    draftContinue: "Continue saved progress",
    draftStartOver: "Start over",
    draftSavedAt: "Saved on this device · {when}",
    draftSavedGeneric: "Saved on this device",
    draftDeviceNote: "Your answers stay on this browser until you finish or start over.",
    draftAutoSaveHint: "Progress is saved on this device — you can close and continue later.",
    consent: "Consent",
    consentTag: "Trailhead · Before we begin",
    consentDesc:
      "You may only continue once the required consent below has been given. You may also select who is permitted to have access to your results.",
    consentDescWork:
      "You may only continue once the required consent below has been given, including permission for Soulful Sensory OT to access your results. You may also choose whether your workplace may have access — that option is voluntary.",
    consentRequiredHeading: "Required consent",
    consentSharingHeading: "Who may access your results (optional)",
    consentSharingDesc:
      "Select who you give permission to access your results. Under POPIA, we only share personal or health-related information with others when you give permission below, or when the law requires it. You may continue without selecting any of these options.",
    consentSharingHeadingWork: "Who may access your results",
    consentSharingDescWork:
      "Soulful Sensory OT requires permission to access your results. Sharing with your workplace or employer is optional — you may leave that unticked and still continue.",
    consentPrivacyNote:
      "Soulful Sensory OT processes personal information in line with the Protection of Personal Information Act 4 of 2013 (POPIA). You may request access to, correction of, or withdrawal of consent regarding your information by contacting us.",
    sharingSummaryTitle: "Sharing permissions",
    sharingSummaryIntro:
      "Recorded at the start of this screening — what Soulful Sensory OT may share, and with whom.",
    sharingSummaryAllowed: "May share",
    sharingSummaryNotGiven: "Permission not given",
    sharingSummaryClinicianNote:
      "Use this as your quick guide before discussing findings with parents, school, or other professionals.",
    detailsTag: "About you",
    detailsTitle: "Your details",
    detailsTitleParent: "Your child’s details",
    detailsDesc: "This information provides helpful context and allows us to contact you if needed.",
    detailsDescParent: "Please provide your child’s details and your contact information.",
    yes: "Yes",
    no: "No",
    answerAria: "Answer for question",
    answered: "questions answered",
    step: "Step",
    of: "of",
    results: "Your results",
    trailhead: "Trailhead",
    details: "Details",
    screening: "Screening",
    viewpoint: "Viewpoint",
    progressAria: "Questionnaire progress",
    requiredConsent: "Required consent must be given before you can continue.",
    consentGateTitle: "Consent required to continue",
    consentGateDisclaimer:
      "You can only continue once every required consent statement below has been ticked. Choosing who may access your results is separate and optional — those choices do not unlock Continue.",
    consentGateDisclaimerWork:
      "You can only continue once every required consent statement has been ticked, including permission for Soulful Sensory OT to access your results. Workplace access remains optional.",
    requiredRespondent: "Please choose who is completing the questionnaire.",
    requiredContext: "Please choose which setting this screening is most about.",
    requiredField: "Please complete the",
    validEmail: "Please enter a valid email address.",
    answerAll: "Please answer all questions before continuing",
    unanswered: "is unanswered",
    idealSaturdayTag: "Almost there",
    idealSaturdayTitle: "One last reflection",
    idealSaturdayTitleTeen: "One last question",
    idealSaturdayPromptAdult:
      "Please describe what your best Saturday would look like. Money and other people’s plans do not matter this time — if you could shape the day entirely around what you enjoy, how would it unfold from morning to evening?",
    idealSaturdayPromptTeen:
      "What would your absolute best Saturday look like? Don’t worry about money or what anyone else wants — if you could do anything you like, how would your day go from morning to night?",
    idealSaturdayPromptParent:
      "Please describe what your child’s best Saturday would look like. Money and other people’s plans do not matter this time — if the day could be shaped entirely around what they enjoy, how would it unfold from morning to evening?",
    idealSaturdayHintAdult:
      "There is no right answer. Include the pace, places, people (or solitude), movement, sounds, and anything else that would make the day feel like yours.",
    idealSaturdayHintTeen:
      "Be as real as you like — sleep-ins, sport, friends, gaming, being outside, music, food, chill time… whatever would make it your day.",
    idealSaturdayHintParent:
      "Include the pace, places, people, play, rest, and sensory feel of a day that would truly suit your child.",
    idealSaturdayPlaceholderAdult: "Start with the morning, then walk through the rest of the day…",
    idealSaturdayPlaceholderTeen: "Start with how you’d wake up, then what you’d do next…",
    idealSaturdayPlaceholderParent: "Start with their morning, then how the rest of their day would go…",
    idealSaturdayRequired: "Please share a little about that best Saturday before continuing.",
    idealSaturdayResultsTitle: "Best Saturday",
    idealSaturdayResultsIntro: "A free-text snapshot of what an ideal day looks like — useful sensory clues beyond the yes/no scores.",
    contextTag: "Your setting",
    chooseContext: "Where should we focus?",
    chooseContextAdultDesc: "Choose whether these results should lean more toward work, or toward family and home life. Your summary, sense-by-sense readings and sensory diet ideas will all be written for the setting you choose.",
    chooseContextTeenDesc: "Your results cover both family / home life and school — questions, summaries and sensory diet ideas reflect both parts of your day.",
    contextWork: "Work",
    contextWorkDesc: "Focus, meetings, open-plan noise, screens and the pace of your working day.",
    contextHome: "Family / home",
    contextHomeDesc: "Home routines, rest, chores, shared spaces and family life.",
    contextHomeTeenDesc: "Home routines, rest, shared spaces and family life.",
    contextSchool: "School",
    contextSchoolDesc: "Classrooms, assemblies, homework, friends and the school day.",
    contextHomeSchool: "Home & school",
    contextHomeSchoolDesc: "Family life at home and your school day — classrooms, homework, rest and shared spaces.",
    focusedOn: "Focused on",
    contextResultsNote:
      "Because you chose {setting}, the overall pattern, score table and recommendations below are written for that part of your life.",
    contextResultsNoteTeen:
      "Your overall pattern, score table and recommendations below are written for both home and school life.",
    contextDetailsNote: "Each sense also shows what the pattern can look like {setting}, and what tends to help there.",
    contextDetailsNoteTeen: "Each sense also shows what the pattern can look like at home and at school, and what tends to help in both places.",
    contextHelps: "What helps here:",
    settingGuideDomainHints: "Extra notes from your strongest sense patterns",
    dietContextNote: "The first ideas under each sense are chosen for {setting}. The rest work anywhere in your day.",
    dietContextNoteTeen: "The first ideas under each sense are chosen for home and school. The rest work anywhere in your day.",
    dietEverywhere: "Anytime, anywhere",
    profileTitle: "Your sensory profile",
    profileTitleParent: "Your child’s sensory profile",
    profileIntro: "A clear reading of the sensory patterns highlighted in this screening. These results are descriptive and are not a diagnosis.",
    overallPattern: "Overall pattern",
    sensitiveSignals: "sensitive signals",
    seekingSignals: "seeking signals",
    descriptiveMap: "This is a descriptive map of the answers — not a diagnosis.",
    overallScoreLabel: "Overall score",
    overallScoreNote: "Every question in this screening added together into one reading.",
    overallSensitiveTotal: "Sensitive / avoiding",
    overallNeutralTotal: "Sensory neutral",
    overallSeekingTotal: "Sensory seeking",
    overallItemsScored: "Questions asked",
    overallBalanceLabel: "Overall balance",
    overallSystemsLabel: "How the senses split",
    teenOverallAxisSensitive: "Picks up sensory input quickly",
    teenOverallAxisSeeking: "Needs more sensory input",
    teenSenseAxis: {
      auditory: {
        sensitive: "Notices sound quickly",
        seeking: "Can tolerate a lot of sound",
      },
      tactile: {
        sensitive: "Notices touch quickly",
        seeking: "Can tolerate a lot of touch",
      },
      movement: {
        sensitive: "Notices movement quickly",
        seeking: "Can tolerate a lot of movement",
      },
      visual: {
        sensitive: "Notices visual input quickly",
        seeking: "Can tolerate a lot of visual input",
      },
      smellTaste: {
        sensitive: "Notices smells and tastes quickly",
        seeking: "Can tolerate a lot of smell and taste",
      },
      everyday: {
        sensitive: "Notices everyday sensory load quickly",
        seeking: "Can tolerate a lot of everyday sensory load",
      },
    },
    sensitive: "Sensitive",
    seeking: "Seeking",
    quiet: "Quiet",
    you: "You",
    yourChild: "Your child",
    acrossSenses: "Across the senses",
    ridgeTitle: "Sensory ridge line",
    ridgeHelp: "Higher peaks mean more answers in that system highlighted a sensory response.",
    sense: "Sense",
    senseBySense: "Sense by sense",
    scoreTableKicker: "Interpretation",
    scoreTableTitle: "Your sensory picture",
    scoreTableTitleAdult: "Your senses at a glance",
    scoreTableIntro:
      "Each sense gets its own snapshot: how quickly you notice input, and what tends to help.",
    scoreTableIntroAdult:
      "A visual card for each sense — threshold, what it can look like day to day, and what tends to help.",
    scoreTableIntroParent:
      "A visual card for each sense — threshold, what it can look like day to day for your child, and what tends to help.",
    interpretCoverTitle: "Explaining my sensory systems",
    interpretCoverTitleParent: "Explaining my child's sensory systems",
    interpretCoverQuote:
      "Your senses are how you meet the world — understanding them is a kinder way to meet yourself.",
    interpretCoverQuoteParent:
      "When we understand a child's senses, we understand more of how they meet the world — and how to meet them there.",
    interpretCoverCredit: "Soulful Sensory OT",
    interpretCoverBrandTag: "Occupational Therapy Services",
    interpretCoverPreparedFor: "Prepared for",
    interpretCoverDateLabel: "Date of assessment",
    interpretCoverReportTitle: "Sensory questionnaire results",
    interpretCoverStudioMark: "SoulfulSensoryOT",
    interpretCoverParentLabel: "Parent / guardian",
    interpretCoverNameLabel: "Name",
    interpretCoverSurnameLabel: "Surname",
    tocKicker: "This report",
    tocTitle: "Contents",
    tocIntro: "Each heading below matches a page in your sensory report.",
    reportPageLabel: "Page",
    interpretGlossaryKicker: "Before you read on",
    interpretGlossaryTitle: "A short sensory glossary",
    interpretGlossaryIntro:
      "A few plain-language words that help the pages ahead make more sense. You do not need to memorise them — just keep them nearby as you read your results.",
    interpretGlossary: [
      {
        id: "input",
        term: "Sensory input",
        definition:
          "The information your body takes in through sight, sound, touch, movement, smell, taste, and body awareness. For example, bright lights, a busy classroom, the feel of a jumper, or the smell of lunch.",
      },
      {
        id: "systems",
        term: "Sensory systems",
        definition:
          "The different pathways that carry that information to your brain so you can make sense of the world around you — for example the auditory system (hearing) and the tactile system (touch).",
      },
      {
        id: "threshold",
        term: "Sensory threshold",
        definition:
          "How much sensory input it takes before your nervous system notices or responds. Think of it like the volume dial: some people notice the radio sooner; others need it louder before they tune in.",
      },
      {
        id: "low",
        term: "Low threshold",
        definition:
          "Your system notices input quickly. Even small amounts can feel strong or hard to ignore — for example a flickering light, a scratchy label, or background chatter that others barely notice.",
      },
      {
        id: "high",
        term: "High threshold",
        definition:
          "Your system needs more input before it really registers. For example, a person can tolerate a lot of sound and still focus without getting frustrated — while quiet or still settings can feel underwhelming.",
      },
      {
        id: "sensitive",
        term: "Sensory sensitive",
        definition:
          "A low-threshold pattern: you notice and react to sensory input more readily than others might. For example, a person may pick up sound quickly and get overwhelmed quickly in a loud environment.",
      },
      {
        id: "seeking",
        term: "Sensory seeking",
        definition:
          "A high-threshold pattern: you look for more input to feel settled or alert — for example fidgeting, craving movement, turning music up, or preferring busy, stimulating spaces.",
      },
      {
        id: "neutral",
        term: "Sensory neutral",
        definition:
          "A more balanced pattern: input is usually manageable day to day. For example, a busy shop or a quiet room is both okay most of the time — though tired, busy or stressful days can shift this.",
      },
      {
        id: "overload",
        term: "Sensory overload",
        definition:
          "When too much input stacks up at once and your system struggles to keep up. For example, a noisy mall after a long day can leave someone feeling overwhelmed, anxious, irritable, or shut down.",
      },
      {
        id: "needs",
        term: "Sensory needs",
        definition:
          "What your nervous system requires — more, less, or different kinds of input — to feel regulated and able to function. For example, a person might need a quieter environment, softer clothing, or regular movement breaks.",
      },
    ],
    interpretSensesKicker: "Meet the senses",
    interpretSensesTitle: "Our senses",
    interpretSensesSubtitle: "Seven ways we experience and navigate the world.",
    interpretSensesAria:
      "Infographic: Our senses — seven ways we experience and navigate the world. Visual, taste, touch, smell, hearing, movement and body awareness, and everyday sensory experiences — each with a short plain-language description.",
    interpretWorldKicker: "How it works",
    interpretWorldTitle: "Our sensory world",
    interpretWorldAria:
      "Infographic: Sensory input shapes everything. Input from what we see, hear, touch, smell, taste and feel is processed in the brain and nervous system, then shapes emotions, body responses, behaviour and choices — impacting productivity, relationships, wellbeing, learning and everyday life.",
    scoreGlanceTitle: "Sense cards",
    scoreColSense: "Sensory system",
    scoreColThreshold: "Threshold",
    scoreColImplication: "What this means",
    scoreColRecommendation: "What can help",
    scoreLeanSensitive: "Notices sensory input quickly",
    scoreLeanNeutral: "Usually balanced",
    scoreLeanSeeking: "Looks for more sensory input",
    thresholdLegend:
      "Low threshold = notices input quickly (sensitive). Medium = more typical / mixed. High threshold = needs more input (seeking).",
    settingBridgeKicker: "Next",
    settingBridgeHeading: "Where your senses meet everyday life",
    settingBridgeQuoteHome:
      "Understanding your sensory needs is not about changing who you are — it’s about creating an environment where you can thrive.",
    settingBridgeQuoteWork:
      "Understanding your sensory needs is not about changing who you are — it’s about creating an environment where you can thrive.",
    settingBridgeCredit: "Soulful Sensory OT",
    settingBridgeFamilyLabel: "Teenagers & family",
    settingBridgeAdultHomeLabel: "Adults at home",
    teenMapKicker: "Sensory road map",
    teenMapTitle: "Your sensory road map",
    teenMapIntro:
      "Every sense gets its own stop on the map. The picture shows the system, and the colour shows whether you notice that input quickly, sit fairly balanced, or go looking for more of it.",
    teenMapStopLabel: "Stop",
    teenCheatTitle: "Cheat sheet: what to do in the moment",
    teenCheatIntro:
      "Quick moves matched to your own results. Pick one, give it about two minutes, then check how you feel.",
    teenCheatBored: "Bored or flat",
    teenCheatBoredHint: "Your body is asking for more input.",
    teenCheatFrustrated: "Frustrated or anxious",
    teenCheatFrustratedHint: "Ground yourself first, then go back to the task.",
    teenCheatOverload: "Too much / overloaded",
    teenCheatOverloadHint: "Turn the volume of the world down before anything else.",
    teenCrewKicker: "Your Sensory Trail Profile",
    teenCrewTitle: "Your Sensory Trail Profile",
    teenCrewTitleParent: "Your child’s Sensory Trail Profile",
    teenCrewIntro:
      "We all experience the world differently. Your results show which trail style most reflects you.",
    teenCrewIntroParent:
      "We all experience the world differently. These results show which trail style most reflects your child.",
    teenCrewSummaryAria:
      "Infographic of the three sensory trail profiles: Sensory Observer, Sensory Adaptor, and Sensory Explorer",
    teenCrewYouAre: "You are",
    teenCrewYouAreParent: "Your child is",
    teenCrewBadge: "That’s you",
    teenCrewBadgeParent: "That’s them",
    teenCrewDetailTitle: "Your matched character",
    teenCrewDetailTitleParent: "Your child’s matched character",
    teenCrewTraitsTitle: "What this often looks like",
    teenCrewCrewTitle: "The three trail styles",
    teenCrewCrewIntro:
      "On a high trail you need one of each. High-threshold courage up front, low-threshold awareness on the path, and a medium-threshold adaptor holding the middle.",
    teenCrewWhyTitle: "Why every summit needs all three",
    teenCrewWhyBody:
      "The Sensory Explorer (higher sensory threshold) has the courage and energy to go first — checking the route ahead and seeing if it’s safe to climb. The Sensory Observer (lower sensory threshold) picks up the animals, the weather shift, new smells, how the trail snacks taste, and any holes or loose stones before the crew steps into them — and may need steadier breaks along the way. The Sensory Adaptor (medium / mixed threshold) reads the group and fits where they are needed — surging forward, slowing down, or holding the middle of the rope so the whole crew stays together.",
    teenCrewFooter:
      "There is no right or wrong profile. Your trail is unique, and understanding it is the first step to thriving on your journey.",
    teenCrewFooterParent:
      "There is no right or wrong profile. Your child’s trail is unique, and understanding it is the first step to helping them thrive on their journey.",
    teenCrewExplorerName: "Sensory Explorer",
    teenCrewExplorerTag: "High threshold – Sensory seeker",
    teenCrewExplorerSummary:
      "You seek out experiences, movement, and stimulation to feel energised and engaged.",
    teenCrewExplorerSummaryParent:
      "They seek out experiences, movement, and stimulation to feel energised and engaged.",
    teenCrewExplorerBody:
      "Your sensory threshold sits higher — you often like more sensory input, not less. Busy days, new places, movement, sound and fresh sights tend to wake you up. Stillness can feel flat, so you go looking for the next thing to do and see. On the mountain you are the one who hikes ahead with plenty of energy, can keep going for a good stretch, tests the route, and comes back with the report: it’s wild up there — and worth it.",
    teenCrewExplorerBodyParent:
      "Your child’s sensory threshold sits higher — they often like more sensory input, not less. Busy days, new places, movement, sound and fresh sights tend to wake them up. Stillness can feel flat, so they go looking for the next thing to do and see. On the mountain they are the one who hikes ahead with plenty of energy, can keep going for a good stretch, tests the route, and comes back with the report: it’s wild up there — and worth it.",
    teenCrewExplorerRole:
      "Higher-threshold scout — loves input, busyness and new terrain; has the energy to keep going and check if the path ahead is safe.",
    teenCrewExplorerTraits: [
      "Naturally drawn to movement, excitement, and novelty.",
      "Needs more stimulation to feel satisfied.",
      "Enjoys challenges, variety, and fast-paced environments.",
      "May get restless or bored in calm, quiet settings.",
      "Thrives with exploration, risk-taking, and adventure.",
      "Brings energy, enthusiasm, and spontaneity.",
    ],
    teenCrewAdaptorName: "Sensory Adaptor",
    teenCrewAdaptorTag: "Medium threshold – Balanced",
    teenCrewAdaptorSummary:
      "You can adapt to different situations and find your balance between stimulation and rest.",
    teenCrewAdaptorSummaryParent:
      "They can adapt to different situations and find their balance between stimulation and rest.",
    teenCrewAdaptorBody:
      "Your sensory threshold sits in the flexible middle — sometimes you want more input, sometimes you need less. You shift with home life, school or work, the weather on the trail and the people around you. On the mountain you can climb with the explorers when the day asks for energy, or slow down with the observers when it asks for care — you fit where the crew needs you, and that keeps everyone moving.",
    teenCrewAdaptorBodyParent:
      "Your child’s sensory threshold sits in the flexible middle — sometimes they want more input, sometimes they need less. They shift with home life, school, the weather on the trail and the people around them. On the mountain they can climb with the explorers when the day asks for energy, or slow down with the observers when it asks for care — they fit where the crew needs them, and that keeps everyone moving.",
    teenCrewAdaptorRole:
      "Medium-threshold middle — reads the group, matches the pace, and keeps high- and low-threshold hikers walking as one crew.",
    teenCrewAdaptorTraits: [
      "Flexible and able to adjust to different environments.",
      "Manageable awareness of sensory input.",
      "Can enjoy both busy and quiet settings.",
      "Uses strategies to stay regulated and focused.",
      "Seeks balance, routine, and choices that support them.",
      "Often acts as a bridge between different needs.",
    ],
    teenCrewObserverName: "Sensory Observer",
    teenCrewObserverTag: "Low threshold – Sensitive",
    teenCrewObserverSummary:
      "You notice the details others might miss and can be deeply aware of your environment.",
    teenCrewObserverSummaryParent:
      "They notice the details others might miss and can be deeply aware of their environment.",
    teenCrewObserverBody:
      "Your sensory threshold sits lower — you are very aware and pick things up quickly. A change in the weather, a new smell on the breeze, how the trail snacks taste, a bird call, a loose stone underfoot: it all registers. That awareness is a real strength on the mountain. You may also need more regular breaks during the hike so your system can settle before the next stretch — and when you do, the whole crew notices what they would have missed.",
    teenCrewObserverBodyParent:
      "Your child’s sensory threshold sits lower — they are very aware and pick things up quickly. A change in the weather, a new smell on the breeze, how the trail snacks taste, a bird call, a loose stone underfoot: it all registers. That awareness is a real strength on the mountain. They may also need more regular breaks during the hike so their system can settle before the next stretch — and when they do, the whole crew notices what they would have missed.",
    teenCrewObserverRole:
      "Lower-threshold lookout — spots detail fast (weather, smells, tastes, hazards) and benefits from steadier breaks along the trail.",
    teenCrewObserverTraits: [
      "Keenly aware of sights, sounds, textures, smells, and subtle changes around them.",
      "Easily affected by busy, noisy, or chaotic environments.",
      "Needs time to recharge and process.",
      "Thoughtful, reflective, and observant.",
      "Often picks up on others’ emotions and needs.",
      "Thrives in calm, predictable routines and peaceful spaces.",
    ],
    pathwaysTitle: "Sensory pathways",
    pathwaysHelp: "Follow each sense down the trail. Leaves show highlighted answers; the dial shows whether that sense leans sensitive or seeking.",
    responseMosaic: "Response mosaic",
    lean: "Lean",
    highlighted: "Highlighted",
    contactTitle: "Would you like us to contact you?",
    contactYes: "Yes, please contact me about these responses or a comprehensive sensory assessment",
    contactNo: "No, thank you",
    thankYouTitle: "Thank you for completing the sensory questionnaire",
    thankYouBody: "The results will be sent to the therapist.",
    thankYouSending: "Sending your screening to the therapist…",
    thankYouSent: "Your screening was sent successfully.",
    thankYouError:
      "We couldn’t send your screening automatically. Please message Cayley on WhatsApp to let her know you’ve finished, and try Send again.",
    thankYouRetry: "Send again",
    thankYouHome: "Back to home",
    summaryTitle: "A brief look at your overall pattern",
    summaryIntro:
      "Here is a high-level summary of the pattern highlighted in this screening. The detailed sense-by-sense report, strategies, and printable pack are shared during a feedback session with your therapist.",
    summaryNextTitle: "Want the full sensory profile?",
    summaryNextBody:
      "Book an online or in-person feedback session with Soulful Sensory OT to walk through your detailed results and what they mean for everyday life.",
    summaryBookCta: "Book a feedback session",
    inviteBanner: "Your answers will be sent securely to your therapist. After you finish, you’ll see a thank-you screen — results are shared with your therapist, not shown here.",
    inviteBannerBasic:
      "Your answers will be sent securely to your therapist. After you finish, you’ll see a brief overall summary — the detailed report is shared in a feedback session.",
    inviteBannerFull:
      "Your answers will be sent securely to your therapist. After you finish, you’ll also see your full sensory profile here.",
    inviteHomeScroll: "Scroll down to read more — when you’re ready, start the questionnaire at the bottom of the page.",
    inviteHomeStartTitle: "Ready to begin?",
    inviteHomeStartLead: "When you’ve read through the page, tap below to start your sensory screening.",
    inviteHomeStartCta: "Start the sensory screening",
    inviteHomeStartNote: "Takes about 10–15 minutes · Progress saves on this device",
    review: "Review answers",
    print: "Download / print report",
    workReportKicker: "For work",
    workReportAskTitle: "Would you like to create a work report?",
    workReportTitle: "Create a work referral report",
    workReportSubtitle: "A concise letter you can share with your workplace or occupational therapist",
    workReportAskYes: "Yes, create a work report",
    workReportAskNo: "No, thank you",
    workReportOpen: "Create work report",
    workReportClose: "Hide work report",
    workReportIntro:
      "Personalise a short work report with sensory scores, current workplace challenges linked to those scores, and practical recommendations (workspace, headphones, movement breaks, task timing, flexi-hours, and more).",
    workReportName: "Full name",
    workReportJobTitle: "Job title",
    workReportReason: "Reason for referral",
    workReportReasonPlaceholder: "e.g. difficulty concentrating in an open-plan office; fatigue after meetings",
    workReportPreview: "Report preview",
    workReportPrint: "Print work report",
    workReportDocTitle: "Sensory screening — workplace report",
    workReportPreparedBy: "Prepared for workplace support planning",
    workReportSectionAbout: "About this screening",
    workReportAboutBody:
      "{name} completed a sensory screening questionnaire with Soulful Sensory OT. The screening describes sensory response patterns across hearing, touch, movement, vision, smell, taste and everyday sensory load. It is not a diagnosis.",
    workReportSectionReferral: "Referral",
    workReportReferralBody:
      "{name} has been referred to an occupational therapist to assist with sensory strategies going forward, and to refine workplace recommendations based on the screening results below.",
    workReportSectionDetails: "Personal details",
    workReportLabelName: "Name",
    workReportLabelJob: "Job title",
    workReportLabelReason: "Reason for referral",
    workReportNotProvided: "Not provided",
    workReportSectionScores: "Sensory score summary",
    workReportSectionChallenges: "Current challenges in the work environment",
    workReportSectionRecs: "Workplace recommendations",
    workReportGeneralRecs: "General workplace supports",
    workReportClosing:
      "These recommendations are guidance only. Please adapt them with the treating occupational therapist and, where appropriate, the employee’s line manager or occupational health team.",
    workReportClinic: "Soulful Sensory OT",
    schoolReportKicker: "For school",
    schoolReportAskTitle: "Would you like to create a school report?",
    schoolReportSubtitle: "A short letter you can share with teachers or support staff",
    schoolReportAskYes: "Yes, create a school report",
    schoolReportAskNo: "No, thank you",
    schoolReportIntro:
      "Personalise a short school report: it confirms a sensory questionnaire was completed, notes areas of sensitivity and seeking, lists strategies discussed to support the student at school, and lets you add extra typed information if needed.",
    schoolReportName: "Full name",
    schoolReportSchoolGrade: "School / grade",
    schoolReportReason: "Reason for support / concern",
    schoolReportReasonPlaceholder: "e.g. difficulty concentrating in a busy classroom; overwhelm after noisy break times",
    schoolReportPreview: "Report preview",
    schoolReportPrint: "Print school report",
    schoolReportDocTitle: "Sensory screening — school report",
    schoolReportPreparedBy: "Prepared for school support planning",
    schoolReportSectionAbout: "About this screening",
    schoolReportAboutBody:
      "{name} completed a sensory screening questionnaire with Soulful Sensory OT. The screening was used to identify areas of sensory sensitivity where {name} may become overwhelmed, as well as possible areas of sensory-seeking behaviour. It describes sensory response patterns across hearing, touch, movement, vision, smell, taste and everyday sensory load.",
    schoolReportSectionOverload: "Sensory overload and anxiety",
    schoolReportOverloadBody:
      "Sensory overload happens when the brain receives more sensory information than it can comfortably process at once — for example noise, bright lights, crowds, touch, movement, strong smells and a fast pace stacking together during the school day. When this load builds up, the nervous system can stay on high alert. For a student, that often shows up as rising anxiety, feeling overwhelmed, difficulty concentrating, irritability, wanting to leave the situation, or shutting down. Over time, repeated overload can make school feel unsafe or exhausting, even when the student wants to cope and succeed.",
    schoolReportSectionReferral: "Occupational therapy support",
    schoolReportReferralBody:
      "Through sensory strategies, the occupational therapist worked with {name} to put practical tools in place to manage anxiety better and to work toward meeting {name}’s sensory needs at school. These strategies aim to reduce the risk of overload, support calmer focus and concentration, and help {name} stay regulated through the school day. The recommendations below can be used by teaching and support staff alongside ongoing occupational therapy input.",
    schoolReportSectionDetails: "Personal details",
    schoolReportLabelName: "Name",
    schoolReportLabelSchool: "School / grade",
    schoolReportLabelReason: "Reason for support / concern",
    schoolReportNotProvided: "Not provided",
  schoolReportSectionScores: "Sensory score summary",
  schoolReportSectionVisual: "Your sensory snapshot",
  schoolReportVisualAsk: "Choose a visual style for the report",
  schoolReportVisualHint: "Pick the teen-friendly snapshot that best fits this student — it will appear in the printed report.",
  schoolReportVisualBalance: "Balance bars",
  schoolReportVisualBalanceDesc: "Shows each sense on a line from notices sensory input quickly → looks for more sensory input",
  schoolReportVisualDials: "Sense dials",
  schoolReportVisualDialsDesc: "Circular dials that show low, medium or high threshold at a glance",
  schoolReportVisualCards: "Sense cards",
  schoolReportVisualCardsDesc: "Bright cards with an icon and a simple status for each sense",
  schoolReportVisualLegendSensitive: "Notices sensory input quickly",
  schoolReportVisualLegendNeutral: "Usually balanced",
  schoolReportVisualLegendSeeking: "Looks for more sensory input",
  schoolReportVisualAxisLeft: "Notices sensory input quickly",
  schoolReportVisualAxisRight: "Looks for more sensory input",
  schoolReportSectionRecs: "School recommendations",
  schoolReportSectionNotes: "Additional information",
  schoolReportNotesAsk: "Would you like to add extra typed information?",
  schoolReportNotesAskYes: "Yes, add extra information",
  schoolReportNotesAskNo: "No, not needed",
  schoolReportNotesLabel: "Extra typed information",
  schoolReportNotesPlaceholder:
    "Type any extra observations, classroom context, agreed strategies, or notes for teachers…",
  schoolReportNotesEmpty: "No additional notes added.",
  schoolReportClosing:
      "These recommendations are guidance only. Please adapt them with the treating occupational therapist and, where appropriate, the student’s teachers, learning support team or school-based support team.",
    schoolReportClinic: "Soulful Sensory OT",
    mayNotice: "What you may notice",
    mayNoticeChild: "What you may notice",
    supportHeading: "What can help",
    dietTitle: "More ideas by sense",
    dietSubtitle: "A fuller bank of sensory diet ideas for each system",
    dietSubtitleChild: "A fuller bank of sensory diet ideas for each system",
    dietIntro:
      "Pick what fits from these ideas, and adapt them with your occupational therapist.",
    dietIntroChild:
      "Pick what fits from these ideas for your child, and adapt them with your occupational therapist.",
    dietOpen: "Browse more ideas by sense",
    dietClose: "Hide idea bank",
    dietEmpty: "Complete the screening to see tailored ideas for each sense.",
  },
  af: {
    shellTitle: "Sensoriese Siftingsvraelys",
    shellSubtitle: "Verstaan sensoriese ervarings, een rustige tree op ’n slag",
    introModalTitle: "Voordat jy begin",
    introModalLead:
      "In hierdie vraelys hoef jy net ja/nee-vrae te beantwoord. Jy sal dalk ’n bietjie moet veralgemeen — as jy onseker is, vra jouself: as ek moet kies, sou dit ’n ja of ’n nee wees?",
    introModalPurpose:
      "Die doel is om sensoriese voorkeure te identifiseer — wat jy (of jou kind) verkies en hoe die sintuie reageer — sodat ons kan sien hoe om jou vorentoe die beste te ondersteun.",
    introModalNote:
      "Daar is geen regte of verkeerde antwoorde nie. Dit is ook reg as party antwoorde in teenoorgestelde rigtings lyk trek — sensoriese voorkeure is dikwels gemeng. Neem jou tyd, en volg jou eerste intuïsie.",
    introModalCta: "Ek verstaan — kom ons begin",
    chooseRespondent: "Wie voltooi hierdie vraelys?",
    chooseRespondentDesc: "Kies die opsie wat jou die beste beskryf. Die vrae sal by jou ouderdom en perspektief aanpas.",
    adult: "Ek is ’n volwassene",
    adultDesc: "Ek antwoord oor my eie sensoriese ervarings.",
    teen: "Ek is ’n tiener",
    teenDesc: "Ek antwoord oor my eie sensoriese ervarings by die huis én by die skool.",
    parent: "Ek is ’n ouer",
    parentDesc: "Ek antwoord oor my kind se sensoriese ervarings.",
    answerMixedNote:
      "Dit is heeltemal reg om ja te sê op vrae wat teenoorgesteld lyk. Jy kan byvoorbeeld van beide hoë-impak- en lae-impaksport hou, of van ’n besige omgewing én van jou eie stil ruimte. Beantwoord elke vraag op sy eie — gemengde voorkeure is algemeen en verwag.",
    answerMixedNoteParent:
      "Dit is heeltemal reg om ja te sê op vrae wat teenoorgesteld lyk. Jou kind kan byvoorbeeld van beide hoë-impak- en lae-impaksport hou, of van ’n besige omgewing én van hulle eie stil ruimte. Beantwoord elke vraag op sy eie — gemengde voorkeure is algemeen en verwag.",
    answerMixedNoteLabel: "’n Nota oor antwoorde",
    language: "Taal",
    english: "Engels",
    afrikaans: "Afrikaans",
    continue: "Gaan voort",
    seeResults: "Sien resultate",
    back: "Terug",
    draftResumeTitle: "Gaan voort waar jy opgehou het?",
    draftContinue: "Gaan voort met gestoorde vordering",
    draftStartOver: "Begin oor",
    draftSavedAt: "Gestoor op hierdie toestel · {when}",
    draftSavedGeneric: "Gestoor op hierdie toestel",
    draftDeviceNote: "Jou antwoorde bly in hierdie blaaier totdat jy klaarmaak of oorbegin.",
    draftAutoSaveHint: "Vordering word op hierdie toestel gestoor — jy kan toemaak en later voortgaan.",
    consent: "Toestemming",
    consentTag: "Beginpunt · Voordat ons begin",
    consentDesc:
      "Jy kan slegs voortgaan sodra die vereiste toestemming hieronder gegee is. Jy mag ook kies wie toegang tot jou resultate mag hê.",
    consentDescWork:
      "Jy kan slegs voortgaan sodra die vereiste toestemming hieronder gegee is, insluitend toestemming dat Soulful Sensory OT toegang tot jou resultate mag hê. Jy mag ook kies of jou werkplek toegang mag hê — daardie opsie is vrywillig.",
    consentRequiredHeading: "Vereiste toestemming",
    consentSharingHeading: "Wie mag toegang tot jou resultate hê (opsioneel)",
    consentSharingDesc:
      "Kies wie jy toestemming gee om toegang tot jou resultate te hê. Kragtens POPIA deel ons persoonlike of gesondheidsverwante inligting slegs met ander wanneer jy hieronder toestemming gee, of wanneer die wet dit vereis. Jy mag voortgaan sonder om enige van hierdie opsies te kies.",
    consentSharingHeadingWork: "Wie mag toegang tot jou resultate hê",
    consentSharingDescWork:
      "Soulful Sensory OT benodig toestemming om toegang tot jou resultate te hê. Deling met jou werkplek of werkgewer is opsioneel — jy mag dit ongemerk laat en steeds voortgaan.",
    consentPrivacyNote:
      "Soulful Sensory OT verwerk persoonlike inligting in ooreenstemming met die Wet op die Beskerming van Persoonlike Inligting 4 van 2013 (POPIA). Jy mag toegang tot, regstelling van, of die terugtrekking van toestemming rakende jou inligting versoek deur ons te kontak.",
    sharingSummaryTitle: "Delingstoestemmings",
    sharingSummaryIntro:
      "Aangeteken aan die begin van hierdie sifting — wat Soulful Sensory OT mag deel, en met wie.",
    sharingSummaryAllowed: "Mag deel",
    sharingSummaryNotGiven: "Toestemming nie gegee nie",
    sharingSummaryClinicianNote:
      "Gebruik dit as jou kitsgids voordat jy bevindinge met ouers, die skool, of ander professionele persone bespreek.",
    detailsTag: "Meer besonderhede",
    detailsTitle: "Jou besonderhede",
    detailsTitleParent: "Jou kind se besonderhede",
    detailsDesc: "Hierdie inligting gee nuttige konteks en stel ons in staat om jou te kontak indien nodig.",
    detailsDescParent: "Verskaf asseblief jou kind se besonderhede en jou kontakinligting.",
    yes: "Ja",
    no: "Nee",
    answerAria: "Antwoord vir vraag",
    answered: "vrae beantwoord",
    step: "Stap",
    of: "van",
    results: "Jou resultate",
    trailhead: "Beginpunt",
    details: "Besonderhede",
    screening: "Sifting",
    viewpoint: "Uitsigpunt",
    progressAria: "Vraelysvordering",
    requiredConsent: "Vereiste toestemming moet gegee word voordat jy kan voortgaan.",
    consentGateTitle: "Toestemming word vereis om voort te gaan",
    consentGateDisclaimer:
      "Jy kan slegs voortgaan sodra elke vereiste toestemmingsverklaring hieronder gemerk is. Om te kies wie toegang tot jou resultate mag hê, is apart en opsioneel — daardie keuses maak nie Gaan voort oop nie.",
    consentGateDisclaimerWork:
      "Jy kan slegs voortgaan sodra elke vereiste toestemmingsverklaring gemerk is, insluitend toestemming dat Soulful Sensory OT toegang tot jou resultate mag hê. Werkplektoegang bly opsioneel.",
    requiredRespondent: "Kies asseblief wie die vraelys voltooi.",
    requiredContext: "Kies asseblief die omgewing waarop hierdie sifting die meeste fokus.",
    requiredField: "Voltooi asseblief die",
    validEmail: "Voer asseblief ’n geldige e-posadres in.",
    answerAll: "Beantwoord asseblief al die vrae voordat jy voortgaan",
    unanswered: "is onbeantwoord",
    idealSaturdayTag: "Amper klaar",
    idealSaturdayTitle: "Een laaste nadenke",
    idealSaturdayTitleTeen: "Een laaste vraag",
    idealSaturdayPromptAdult:
      "Beskryf asseblief hoe jou beste Saterdag sou lyk. Geld en ander mense se planne tel nie hierdie keer nie — as jy die dag heeltemal om dit wat jy geniet kon bou, hoe sou dit van oggend tot aand ontvou?",
    idealSaturdayPromptTeen:
      "Hoe sou jou absolute beste Saterdag lyk? Moenie bekommerd wees oor geld of wat enige iemand anders wil hê nie — as jy enigiets kon doen waarvan jy hou, hoe sou jou dag van oggend tot aand lyk?",
    idealSaturdayPromptParent:
      "Beskryf asseblief hoe jou kind se beste Saterdag sou lyk. Geld en ander mense se planne tel nie hierdie keer nie — as die dag heeltemal om dit wat hulle geniet gebou kon word, hoe sou dit van oggend tot aand ontvou?",
    idealSaturdayHintAdult:
      "Daar is geen regte antwoord nie. Sluit die tempo, plekke, mense (of alleenheid), beweging, klanke, en enigiets anders in wat die dag joune sou laat voel.",
    idealSaturdayHintTeen:
      "Wees so eerlik as jy wil — uitslaap, sport, vriende, speletjies, buite wees, musiek, kos, ontspan… wat ook al dit jou dag sou maak.",
    idealSaturdayHintParent:
      "Sluit die tempo, plekke, mense, speel, rus, en die sensoriese gevoel van ’n dag in wat regtig by jou kind sou pas.",
    idealSaturdayPlaceholderAdult: "Begin by die oggend, en stap dan deur die res van die dag…",
    idealSaturdayPlaceholderTeen: "Begin by hoe jy sou wakker word, en wat jy dan volgende sou doen…",
    idealSaturdayPlaceholderParent: "Begin by hulle oggend, en hoe die res van hulle dag sou verloop…",
    idealSaturdayRequired: "Deel asseblief ’n bietjie oor daardie beste Saterdag voordat jy voortgaan.",
    idealSaturdayResultsTitle: "Beste Saterdag",
    idealSaturdayResultsIntro: "’n Vryteks-oomblik van hoe ’n ideale dag lyk — nuttige sensoriese leidrade buite die ja/nee-tellings.",
    contextTag: "Jou omgewing",
    chooseContext: "Waarop moet ons fokus?",
    chooseContextAdultDesc: "Kies of hierdie resultate meer na werk, of na familie- en huislike lewe moet neig. Jou opsomming, sintuig-vir-sintuig lesings en sensoriese dieet-idees sal alles vir die omgewing wat jy kies, geskryf word.",
    chooseContextTeenDesc: "Jou resultate dek beide familie- / huislike lewe en skool — vrae, opsommings en sensoriese dieet-idees weerspieël albei dele van jou dag.",
    contextWork: "Werk",
    contextWorkDesc: "Fokus, vergaderings, oopplan-geraas, skerms en die tempo van jou werksdag.",
    contextHome: "Familie / huis",
    contextHomeDesc: "Huisroetines, rus, take, gedeelde ruimtes en familielewe.",
    contextHomeTeenDesc: "Huisroetines, rus, gedeelde ruimtes en familielewe.",
    contextSchool: "Skool",
    contextSchoolDesc: "Klaskamers, byeenkomste, huiswerk, vriende en die skooldag.",
    contextHomeSchool: "Huis & skool",
    contextHomeSchoolDesc: "Familielewe by die huis en jou skooldag — klaskamers, huiswerk, rus en gedeelde ruimtes.",
    focusedOn: "Gefokus op",
    contextResultsNote:
      "Omdat jy {setting} gekies het, is die algehele patroon, telling-tabel en aanbevelings hieronder vir daardie deel van jou lewe geskryf.",
    contextResultsNoteTeen:
      "Jou algehele patroon, telling-tabel en aanbevelings hieronder is vir beide huis- én skoollewe geskryf.",
    contextDetailsNote: "Elke sintuig wys ook hoe die patroon {setting} kan lyk, en wat daar geneig is om te help.",
    contextDetailsNoteTeen: "Elke sintuig wys ook hoe die patroon by die huis en by die skool kan lyk, en wat op albei plekke geneig is om te help.",
    contextHelps: "Wat hier help:",
    settingGuideDomainHints: "Ekstra notas uit jou sterkste sintuigpatrone",
    dietContextNote: "Die eerste idees onder elke sintuig is vir {setting} gekies. Die res werk enige plek in jou dag.",
    dietContextNoteTeen: "Die eerste idees onder elke sintuig is vir huis en skool gekies. Die res werk enige plek in jou dag.",
    dietEverywhere: "Enige tyd, enige plek",
    profileTitle: "Jou sensoriese profiel",
    profileTitleParent: "Jou kind se sensoriese profiel",
    profileIntro: "’n Duidelike lesing van die sensoriese patrone wat in hierdie sifting uitgelig is. Hierdie resultate is beskrywend en is nie ’n diagnose nie.",
    overallPattern: "Algehele patroon",
    sensitiveSignals: "sensitiewe seine",
    seekingSignals: "soekende seine",
    descriptiveMap: "Dit is ’n beskrywende kaart van die antwoorde — nie ’n diagnose nie.",
    overallScoreLabel: "Algehele telling",
    overallScoreNote: "Elke vraag in hierdie sifting saam getel in een lesing.",
    overallSensitiveTotal: "Sensitief / vermydend",
    overallNeutralTotal: "Sensories neutraal",
    overallSeekingTotal: "Sensories soekend",
    overallItemsScored: "Vrae gevra",
    overallBalanceLabel: "Algehele balans",
    overallSystemsLabel: "Hoe die sintuie verdeel",
    teenOverallAxisSensitive: "Vat sensoriese insette vinnig op",
    teenOverallAxisSeeking: "Benodig meer sensoriese insette",
    teenSenseAxis: {
      auditory: {
        sensitive: "Merk klank vinnig op",
        seeking: "Kan baie klank verdra",
      },
      tactile: {
        sensitive: "Merk aanraking vinnig op",
        seeking: "Kan baie aanraking verdra",
      },
      movement: {
        sensitive: "Merk beweging vinnig op",
        seeking: "Kan baie beweging verdra",
      },
      visual: {
        sensitive: "Merk visuele insette vinnig op",
        seeking: "Kan baie visuele insette verdra",
      },
      smellTaste: {
        sensitive: "Merk reuke en smake vinnig op",
        seeking: "Kan baie reuk en smaak verdra",
      },
      everyday: {
        sensitive: "Merk alledaagse sensoriese las vinnig op",
        seeking: "Kan baie alledaagse sensoriese las verdra",
      },
    },
    sensitive: "Sensitief",
    seeking: "Soekend",
    quiet: "Stil",
    you: "Jy",
    yourChild: "Jou kind",
    acrossSenses: "Oor al die sintuie",
    ridgeTitle: "Sensoriese rantlyn",
    ridgeHelp: "Hoër pieke beteken dat meer antwoorde in daardie stelsel ’n sensoriese reaksie uitgelig het.",
    sense: "Sintuig",
    senseBySense: "Sintuig vir sintuig",
    scoreTableKicker: "Interpretasie",
    scoreTableTitle: "Jou sensoriese prentjie",
    scoreTableTitleAdult: "Jou sintuie in ’n oogopslag",
    scoreTableIntro:
      "Elke sintuig kry sy eie momentopname: hoe vinnig jy insette merk, en wat gewoonlik help.",
    scoreTableIntroAdult:
      "’n Visuele kaartjie vir elke sintuig — drempel, hoe dit dag tot dag kan lyk, en wat gewoonlik help.",
    scoreTableIntroParent:
      "’n Visuele kaartjie vir elke sintuig — drempel, hoe dit dag tot dag vir jou kind kan lyk, en wat gewoonlik help.",
    interpretCoverTitle: "Verduideliking van my sensoriese stelsels",
    interpretCoverTitleParent: "Verduideliking van my kind se sensoriese stelsels",
    interpretCoverQuote:
      "Jou sintuie is hoe jy die wêreld ontmoet — om hulle te verstaan is ’n sagter manier om jouself te ontmoet.",
    interpretCoverQuoteParent:
      "Wanneer ons ’n kind se sintuie verstaan, verstaan ons meer van hoe hulle die wêreld ontmoet — en hoe om hulle daar te ontmoet.",
    interpretCoverCredit: "Soulful Sensory OT",
    interpretCoverBrandTag: "Arbeidsterapiedienste",
    interpretCoverPreparedFor: "Opgestel vir",
    interpretCoverDateLabel: "Datum van assessering",
    interpretCoverReportTitle: "Sensoriese vraelysresultate",
    interpretCoverStudioMark: "SoulfulSensoryOT",
    interpretCoverParentLabel: "Ouer / voog",
    interpretCoverNameLabel: "Naam",
    interpretCoverSurnameLabel: "Van",
    tocKicker: "Hierdie verslag",
    tocTitle: "Inhoudsopgawe",
    tocIntro: "Elke opskrif hieronder pas by ’n bladsy in jou sensoriese verslag.",
    reportPageLabel: "Bladsy",
    interpretGlossaryKicker: "Voor jy verder lees",
    interpretGlossaryTitle: "’n Kort sensoriese verklarende woordeboek",
    interpretGlossaryIntro:
      "’n Paar eenvoudige woorde wat die bladsye vorentoe makliker maak. Jy hoef hulle nie te onthou nie — hou hulle net naby terwyl jy jou resultate lees.",
    interpretGlossary: [
      {
        id: "input",
        term: "Sensoriese insette",
        definition:
          "Die inligting wat jou liggaam inneem deur sig, klank, aanraking, beweging, reuk, smaak en liggaamsbewustheid. Byvoorbeeld helder ligte, ’n besige klaskamer, die gevoel van ’n trui, of die reuk van middagete.",
      },
      {
        id: "systems",
        term: "Sensoriese stelsels",
        definition:
          "Die verskillende paaie wat daardie inligting na jou brein dra sodat jy sin kan maak van die wêreld om jou — byvoorbeeld die ouditiewe stelsel (gehoor) en die taktiewe stelsel (aanraking).",
      },
      {
        id: "threshold",
        term: "Sensoriese drempel",
        definition:
          "Hoeveel sensoriese insette dit neem voordat jou senuweestelsel dit merk of daarop reageer. Dink daaraan soos ’n volume-knop: sommige mense hoor die radio gouer; ander het dit harder nodig voordat hulle intune.",
      },
      {
        id: "low",
        term: "Lae drempel",
        definition:
          "Jou stelsel merk insette vinnig op. Selfs klein hoeveelhede kan sterk voel of moeilik wees om te ignoreer — byvoorbeeld ’n flikkerende lig, ’n jeukerige etiket, of agtergrondpraatjies wat ander skaars opmerk.",
      },
      {
        id: "high",
        term: "Hoë drempel",
        definition:
          "Jou stelsel het meer insette nodig voordat dit regtig registreer. Byvoorbeeld, iemand kan baie klank verdra en steeds fokus sonder om gefrustreerd te raak — terwyl stil of stilstaande omgewings te flou kan voel.",
      },
      {
        id: "sensitive",
        term: "Sensories sensitief",
        definition:
          "’n Lae-drempelpatroon: jy merk sensoriese insette vinniger op en reageer makliker daarop as ander dalk sou. Byvoorbeeld, iemand kan klank vinnig optel en vinnig oorweldig raak in ’n lawaaierige omgewing.",
      },
      {
        id: "seeking",
        term: "Sensories soekend",
        definition:
          "’n Hoë-drempelpatroon: jy soek meer insette om geanker of wakker te voel — byvoorbeeld friemel, beweging begeer, musiek harder sit, of besige, stimulerende ruimtes verkies.",
      },
      {
        id: "neutral",
        term: "Sensories neutraal",
        definition:
          "’n Meer gebalanseerde patroon: insette is gewoonlik van dag tot dag hanteerbaar. Byvoorbeeld, ’n besige winkel of ’n stil kamer is albei meestal okay — al kan moeg, besige of stresvolle dae dit verskuif.",
      },
      {
        id: "overload",
        term: "Sensoriese oorlading",
        definition:
          "Wanneer te veel insette tegelyk opbou en jou stelsel sukkel om by te hou. Byvoorbeeld, ’n lawaaierige winkelcentrum ná ’n lang dag kan iemand oorweldig, angstig, geïrriteerd of afgeskakel laat voel.",
      },
      {
        id: "needs",
        term: "Sensoriese behoeftes",
        definition:
          "Wat jou senuweestelsel nodig het — meer, minder, of ander soorte insette — om gereguleerd te voel en te kan funksioneer. Byvoorbeeld, iemand mag ’n stiller omgewing, sagter klere, of gereelde bewegingspouses nodig hê.",
      },
    ],
    interpretSensesKicker: "Ontmoet die sintuie",
    interpretSensesTitle: "Ons sintuie",
    interpretSensesSubtitle: "Sewe maniere waarop ons die wêreld ervaar en navigeer.",
    interpretSensesAria:
      "Infografika: Ons sintuie — sewe maniere waarop ons die wêreld ervaar en navigeer. Visueel, smaak, tas, reuk, gehoor, beweging en liggaamsbewustheid, en alledaagse sensoriese ervarings — elkeen met ’n kort, eenvoudige beskrywing.",
    interpretWorldKicker: "Hoe dit werk",
    interpretWorldTitle: "Ons sensoriese wêreld",
    interpretWorldAria:
      "Infografika: Sensoriese insette vorm alles. Insette van wat ons sien, hoor, voel, ruik, proe en ervaar word in die brein en senuweestelsel verwerk, en vorm dan emosies, liggaamsreaksies, gedrag en keuses — met ’n invloed op produktiwiteit, verhoudings, welstand, leer en alledaagse lewe.",
    scoreGlanceTitle: "Sintuig-kaartjies",
    scoreColSense: "Sensoriese stelsel",
    scoreColThreshold: "Drempel",
    scoreColImplication: "Wat dit beteken",
    scoreColRecommendation: "Wat kan help",
    scoreLeanSensitive: "Merk vinnig op",
    scoreLeanNeutral: "Gewoonlik gebalanseerd",
    scoreLeanSeeking: "Soek meer",
    thresholdLegend:
      "Lae drempel = merk insette vinnig op (sensitief). Medium = meer tipies / gemeng. Hoë drempel = het meer insette nodig (soekend).",
    settingBridgeKicker: "Volgende",
    settingBridgeHeading: "Waar jou sintuie die alledaagse lewe ontmoet",
    settingBridgeQuoteHome:
      "Om jou sensoriese behoeftes te verstaan gaan nie daaroor om te verander wie jy is nie — dit gaan daaroor om ’n omgewing te skep waarin jy kan floreer.",
    settingBridgeQuoteWork:
      "Om jou sensoriese behoeftes te verstaan gaan nie daaroor om te verander wie jy is nie — dit gaan daaroor om ’n omgewing te skep waarin jy kan floreer.",
    settingBridgeCredit: "Soulful Sensory OT",
    settingBridgeFamilyLabel: "Tieners & familie",
    settingBridgeAdultHomeLabel: "Volwassenes by die huis",
    teenMapKicker: "Sensoriese roetekaart",
    teenMapTitle: "Jou sensoriese roetekaart",
    teenMapIntro:
      "Elke sintuig kry sy eie stop op die kaart. Die prentjie wys die stelsel, en die kleur wys of jy daardie insette vinnig merk, redelik gebalanseerd is, of meer daarvan gaan soek.",
    teenMapStopLabel: "Stop",
    teenCheatTitle: "Kits-gids: wat om in die oomblik te doen",
    teenCheatIntro:
      "Vinnige stappe wat by jou eie resultate pas. Kies een, gee dit sowat twee minute, en kyk dan hoe jy voel.",
    teenCheatBored: "Verveeld of pap",
    teenCheatBoredHint: "Jou liggaam vra meer insette.",
    teenCheatFrustrated: "Gefrustreerd of angstig",
    teenCheatFrustratedHint: "Anker jouself eers, gaan dan terug na die taak.",
    teenCheatOverload: "Te veel / oorstimuleer",
    teenCheatOverloadHint: "Draai eers die wêreld se volume af voor enigiets anders.",
    teenCrewKicker: "Jou Sensoriese Roeteprofiel",
    teenCrewTitle: "Jou Sensoriese Roeteprofiel",
    teenCrewTitleParent: "Jou kind se Sensoriese Roeteprofiel",
    teenCrewIntro:
      "Ons ervaar almal die wêreld verskillend. Jou resultate wys watter roetestyl die meeste by jou pas.",
    teenCrewIntroParent:
      "Ons ervaar almal die wêreld verskillend. Hierdie resultate wys watter roetestyl die meeste by jou kind pas.",
    teenCrewSummaryAria:
      "Infografika van die drie sensoriese roeteprofiele: Sensoriese Waarnemer, Sensoriese Aanpasser, en Sensoriese Verkenner",
    teenCrewYouAre: "Jy is",
    teenCrewYouAreParent: "Jou kind is",
    teenCrewBadge: "Dis jy",
    teenCrewBadgeParent: "Dis hulle",
    teenCrewDetailTitle: "Jou ooreenstemmende karakter",
    teenCrewDetailTitleParent: "Jou kind se ooreenstemmende karakter",
    teenCrewTraitsTitle: "Hoe dit dikwels lyk",
    teenCrewCrewTitle: "Die drie roetestyle",
    teenCrewCrewIntro:
      "Op ’n hoë roete het jy een van elkeen nodig. Hoë-drempel moed voor, lae-drempel bewustheid op die pad, en ’n medium-drempel aanpasser wat die middel hou.",
    teenCrewWhyTitle: "Hoekom elke piek al drie nodig het",
    teenCrewWhyBody:
      "Die Sensoriese Verkenner (hoër sensoriese drempel) het die moed en energie om eerste te gaan — om die roete vooruit te toets en te sien of dit veilig is om te klim. Die Sensoriese Waarnemer (laer sensoriese drempel) merk die diere, die weerverskuiwing, nuwe reuke, hoe die roetesnacks smaak, en enige gate of los klippe op voordat die span daarin stap — en mag meer gereelde pouses langs die pad nodig hê. Die Sensoriese Aanpasser (medium / gemengde drempel) lees die groep en pas in waar hulle nodig is — vorentoe, stadiger, of in die middel van die tou sodat die hele span saam bly.",
    teenCrewFooter:
      "Daar is geen regte of verkeerde profiel nie. Jou roete is uniek, en om dit te verstaan is die eerste stap om op jou reis te floreer.",
    teenCrewFooterParent:
      "Daar is geen regte of verkeerde profiel nie. Jou kind se roete is uniek, en om dit te verstaan is die eerste stap om hulle op hul reis te help floreer.",
    teenCrewExplorerName: "Sensoriese Verkenner",
    teenCrewExplorerTag: "Hoë drempel – Sensoriese soeker",
    teenCrewExplorerSummary:
      "Jy soek ervarings, beweging en stimulasie om energiek en betrokke te voel.",
    teenCrewExplorerSummaryParent:
      "Hulle soek ervarings, beweging en stimulasie om energiek en betrokke te voel.",
    teenCrewExplorerBody:
      "Jou sensoriese drempel sit hoër — jy hou dikwels van meer sensoriese insette, nie minder nie. Besige dae, nuwe plekke, beweging, klank en vars uitsigte wek jou gewoonlik op. Stilte kan flou voel, so jy soek die volgende ding om te doen en te sien. Op die berg is jy die een wat met baie energie vooruit stap, ’n goeie ruk kan aanhou, die roete toets, en terugkom met die berig: dit is wild daar bo — en die moeite werd.",
    teenCrewExplorerBodyParent:
      "Jou kind se sensoriese drempel sit hoër — hulle hou dikwels van meer sensoriese insette, nie minder nie. Besige dae, nuwe plekke, beweging, klank en vars uitsigte wek hulle gewoonlik op. Stilte kan flou voel, so hulle soek die volgende ding om te doen en te sien. Op die berg is hulle die een wat met baie energie vooruit stap, ’n goeie ruk kan aanhou, die roete toets, en terugkom met die berig: dit is wild daar bo — en die moeite werd.",
    teenCrewExplorerRole:
      "Hoër-drempel verkenner — hou van insette, besigheid en nuwe terrein; het die energie om aan te hou en te kyk of die pad vooruit veilig is.",
    teenCrewExplorerTraits: [
      "Natuurlik aangetrokke tot beweging, opwinding en nuutheid.",
      "Het meer stimulasie nodig om tevrede te voel.",
      "Geniet uitdagings, afwisseling en vinnige omgewings.",
      "Kan rusteloos of verveeld raak in stil, kalm omgewings.",
      "Floreer met verkenning, risiko en avontuur.",
      "Bring energie, entoesiasme en spontaniteit.",
    ],
    teenCrewAdaptorName: "Sensoriese Aanpasser",
    teenCrewAdaptorTag: "Medium drempel – Gebalanseerd",
    teenCrewAdaptorSummary:
      "Jy kan by verskillende situasies aanpas en jou balans tussen stimulasie en rus vind.",
    teenCrewAdaptorSummaryParent:
      "Hulle kan by verskillende situasies aanpas en hul balans tussen stimulasie en rus vind.",
    teenCrewAdaptorBody:
      "Jou sensoriese drempel sit in die buigsame middel — partykeer wil jy meer insette hê, partykeer minder. Jy verskuif saam met die huis, skool of werk, die weer op die roete en die mense om jou. Op die berg kan jy saam met die verkenners klim wanneer die dag energie vra, of saam met die waarnemers stadiger word wanneer dit omsigtigheid vra — jy pas in waar die span jou nodig het, en dit hou almal aan die gang.",
    teenCrewAdaptorBodyParent:
      "Jou kind se sensoriese drempel sit in die buigsame middel — partykeer wil hulle meer insette hê, partykeer minder. Hulle verskuif saam met die huis, skool, die weer op die roete en die mense om hulle. Op die berg kan hulle saam met die verkenners klim wanneer die dag energie vra, of saam met die waarnemers stadiger word wanneer dit omsigtigheid vra — hulle pas in waar die span hulle nodig het, en dit hou almal aan die gang.",
    teenCrewAdaptorRole:
      "Medium-drempel middel — lees die groep, pas die tempo, en hou hoë- en lae-drempel stappers as een span.",
    teenCrewAdaptorTraits: [
      "Buigsaam en in staat om by verskillende omgewings aan te pas.",
      "Hanteerbare bewustheid van sensoriese insette.",
      "Kan beide besige en stil omgewings geniet.",
      "Gebruik strategieë om gereguleerd en gefokus te bly.",
      "Soek balans, roetine en keuses wat hulle ondersteun.",
      "Tree dikwels as ’n brug tussen verskillende behoeftes op.",
    ],
    teenCrewObserverName: "Sensoriese Waarnemer",
    teenCrewObserverTag: "Lae drempel – Sensitief",
    teenCrewObserverSummary:
      "Jy merk die besonderhede op wat ander dalk mis en kan diep bewus wees van jou omgewing.",
    teenCrewObserverSummaryParent:
      "Hulle merk die besonderhede op wat ander dalk mis en kan diep bewus wees van hul omgewing.",
    teenCrewObserverBody:
      "Jou sensoriese drempel sit laer — jy is baie bewus en merk dinge vinnig op. ’n Verandering in die weer, ’n nuwe reuk op die wind, hoe die roetesnacks smaak, ’n voëlroep, ’n los klip onder jou voet: dit alles registreer. Daardie bewustheid is ’n regte krag op die berg. Jy mag ook meer gereelde pouses tydens die stap nodig hê sodat jou stelsel kan sak voor die volgende stuk — en wanneer jy dit doen, merk die hele span wat hulle sou misgeloop het.",
    teenCrewObserverBodyParent:
      "Jou kind se sensoriese drempel sit laer — hulle is baie bewus en merk dinge vinnig op. ’n Verandering in die weer, ’n nuwe reuk op die wind, hoe die roetesnacks smaak, ’n voëlroep, ’n los klip onder hul voet: dit alles registreer. Daardie bewustheid is ’n regte krag op die berg. Hulle mag ook meer gereelde pouses tydens die stap nodig hê sodat hul stelsel kan sak voor die volgende stuk — en wanneer hulle dit doen, merk die hele span wat hulle sou misgeloop het.",
    teenCrewObserverRole:
      "Laer-drempel uitkyk — merk detail vinnig (weer, reuke, smake, gevare) en baat by meer gereelde pouses op die roete.",
    teenCrewObserverTraits: [
      "Skerp bewus van sig, klank, teksture, reuke en subtiele veranderinge om hulle.",
      "Maklik beïnvloed deur besige, lawaaierige of chaotiese omgewings.",
      "Het tyd nodig om te herlaai en te verwerk.",
      "Denkende, reflektief en waarnemend.",
      "Merk dikwels ander se emosies en behoeftes op.",
      "Floreer in kalm, voorspelbare roetines en vreedsame ruimtes.",
    ],
    pathwaysTitle: "Sensoriese paaie",
    pathwaysHelp: "Volg elke sintuig langs die roete. Blare wys uitgeligte antwoorde; die wyser wys of die sintuig sensitief of soekend neig.",
    responseMosaic: "Reaksiemosaïek",
    lean: "Neiging",
    highlighted: "Uitgelig",
    contactTitle: "Wil jy hê ons moet jou kontak?",
    contactYes: "Ja, kontak my asseblief oor hierdie antwoorde of ’n omvattende sensoriese assessering",
    contactNo: "Nee, dankie",
    thankYouTitle: "Dankie dat jy die sensoriese vraelys voltooi het",
    thankYouBody: "Die resultate sal aan die terapeut gestuur word.",
    thankYouSending: "Jou sifting word aan die terapeut gestuur…",
    thankYouSent: "Jou sifting is suksesvol gestuur.",
    thankYouError:
      "Ons kon nie jou sifting outomaties stuur nie. Stuur asseblief vir Cayley ’n WhatsApp om te sê jy is klaar, en probeer Weer stuur.",
    thankYouRetry: "Stuur weer",
    thankYouHome: "Terug na tuis",
    summaryTitle: "’n Kort blik op jou algehele patroon",
    summaryIntro:
      "Hier is ’n hoëvlak-opsomming van die patroon wat in hierdie sifting uitgelig is. Die gedetailleerde sintuig-vir-sintuig-verslag, strategieë en drukpakket word tydens ’n terugvoersessie met jou terapeut gedeel.",
    summaryNextTitle: "Wil jy die volle sensoriese profiel hê?",
    summaryNextBody:
      "Bespreek ’n aanlyn- of persoonlike terugvoersessie met Soulful Sensory OT om jou gedetailleerde resultate en wat dit vir die alledaagse lewe beteken, deur te werk.",
    summaryBookCta: "Bespreek ’n terugvoersessie",
    inviteBanner: "Jou antwoorde word veilig aan jou terapeut gestuur. Ná afhandeling sien jy net ’n dankie-skerm — resultate gaan na jou terapeut, nie hierheen nie.",
    inviteBannerBasic:
      "Jou antwoorde word veilig aan jou terapeut gestuur. Ná afhandeling sien jy ’n kort algehele opsomming — die gedetailleerde verslag word in ’n terugvoersessie gedeel.",
    inviteBannerFull:
      "Jou antwoorde word veilig aan jou terapeut gestuur. Ná afhandeling sien jy ook jou volle sensoriese profiel hier.",
    inviteHomeScroll: "Rol af om meer te lees — wanneer jy gereed is, begin die vraelys onderaan die bladsy.",
    inviteHomeStartTitle: "Gereed om te begin?",
    inviteHomeStartLead: "Wanneer jy die bladsy deurgelees het, tik hieronder om jou sensoriese sifting te begin.",
    inviteHomeStartCta: "Begin die sensoriese sifting",
    inviteHomeStartNote: "Neem sowat 10–15 minute · Vordering stoor op hierdie toestel",
    review: "Hersien antwoorde",
    print: "Aflaai / druk verslag",
    workReportKicker: "Vir werk",
    workReportAskTitle: "Wil jy ’n werkverslag skep?",
    workReportTitle: "Skep ’n werkverwysingsverslag",
    workReportSubtitle: "’n Bondige brief wat jy met jou werkplek of arbeidsterapeut kan deel",
    workReportAskYes: "Ja, skep ’n werkverslag",
    workReportAskNo: "Nee, dankie",
    workReportOpen: "Skep werkverslag",
    workReportClose: "Versteek werkverslag",
    workReportIntro:
      "Personaliseer ’n kort werkverslag met sensoriese tellings, huidige werkplekuitdagings gekoppel aan daardie tellings, en praktiese aanbevelings (werkspasie, oorfone, bewegingspouses, taaktydsberaming, fleksi-ure, en meer).",
    workReportName: "Volle naam",
    workReportJobTitle: "Positel",
    workReportReason: "Rede vir verwysing",
    workReportReasonPlaceholder: "bv. moeilikheid om in ’n oopplan-kantoor te konsentreer; moegheid ná vergaderings",
    workReportPreview: "Verslagvoorskou",
    workReportPrint: "Druk werkverslag",
    workReportDocTitle: "Sensoriese sifting — werkplekverslag",
    workReportPreparedBy: "Voorberei vir werkplekondersteuningsbeplanning",
    workReportSectionAbout: "Oor hierdie sifting",
    workReportAboutBody:
      "{name} het ’n sensoriese siftingsvraelys by Soulful Sensory OT voltooi. Die sifting beskryf sensoriese reaksiepatrone oor gehoor, aanraking, beweging, sig, reuk, smaak en daaglikse sensoriese lading. Dit is nie ’n diagnose nie.",
    workReportSectionReferral: "Verwysing",
    workReportReferralBody:
      "{name} is na ’n arbeidsterapeut verwys om voortaan met sensoriese strategieë te help, en om werkplekaanbevelings te verfyn op grond van die siftingsresultate hieronder.",
    workReportSectionDetails: "Persoonlike besonderhede",
    workReportLabelName: "Naam",
    workReportLabelJob: "Positel",
    workReportLabelReason: "Rede vir verwysing",
    workReportNotProvided: "Nie verskaf nie",
    workReportSectionScores: "Opsomming van sensoriese tellings",
    workReportSectionChallenges: "Huidige uitdagings in die werksomgewing",
    workReportSectionRecs: "Werkplekaanbevelings",
    workReportGeneralRecs: "Algemene werkplekondersteuning",
    workReportClosing:
      "Hierdie aanbevelings is slegs riglyne. Pas dit asseblief saam met die behandelende arbeidsterapeut en, waar toepaslik, die werknemer se lynbestuurder of beroepsgesondheidspan aan.",
    workReportClinic: "Soulful Sensory OT",
    schoolReportKicker: "Vir skool",
    schoolReportAskTitle: "Wil jy ’n skoolverslag skep?",
    schoolReportSubtitle: "’n Kort brief wat jy met onderwysers of ondersteuningspersoneel kan deel",
    schoolReportAskYes: "Ja, skep ’n skoolverslag",
    schoolReportAskNo: "Nee, dankie",
    schoolReportIntro:
      "Personaliseer ’n kort skoolverslag: dit bevestig dat ’n sensoriese vraelys voltooi is, noem areas van sensitiwiteit en soekgedrag, lys strategieë wat bespreek is om die leerling by die skool te ondersteun, en laat jou ekstra getikte inligting byvoeg indien nodig.",
    schoolReportName: "Volle naam",
    schoolReportSchoolGrade: "Skool / graad",
    schoolReportReason: "Rede vir ondersteuning / kommer",
    schoolReportReasonPlaceholder: "bv. moeilikheid om in ’n besige klaskamer te konsentreer; oorweldiging ná lawaaierige pouses",
    schoolReportPreview: "Verslagvoorskou",
    schoolReportPrint: "Druk skoolverslag",
    schoolReportDocTitle: "Sensoriese sifting — skoolverslag",
    schoolReportPreparedBy: "Voorberei vir skoolondersteuningsbeplanning",
    schoolReportSectionAbout: "Oor hierdie sifting",
    schoolReportAboutBody:
      "{name} het ’n sensoriese siftingsvraelys by Soulful Sensory OT voltooi. Die sifting is gebruik om areas van sensoriese sensitiwiteit te identifiseer waar {name} oorweldig kan raak, asook moontlike areas van sensoriese soekgedrag. Dit beskryf sensoriese reaksiepatrone oor gehoor, aanraking, beweging, sig, reuk, smaak en daaglikse sensoriese lading.",
    schoolReportSectionOverload: "Sensoriese oorlading en angs",
    schoolReportOverloadBody:
      "Sensoriese oorlading gebeur wanneer die brein meer sensoriese inligting ontvang as wat dit op een slag gemaklik kan verwerk — byvoorbeeld geraas, helder ligte, skares, aanraking, beweging, sterk reuke en ’n vinnige tempo wat saam tydens die skooldag opeenstapel. Wanneer hierdie lading opbou, kan die senuweestelsel op hoë paraatheid bly. Vir ’n leerling wys dit dikwels as stygende angs, ’n gevoel van oorweldiging, moeilikheid om te konsentreer, geïrriteerdheid, ’n begeerte om die situasie te verlaat, of afskakel. Met verloop van tyd kan herhaalde oorlading skool onveilig of uitputtend laat voel, selfs wanneer die leerling wil klaarkom en slaag.",
    schoolReportSectionReferral: "Arbeidsterapie-ondersteuning",
    schoolReportReferralBody:
      "Deur sensoriese strategieë het die arbeidsterapeut saam met {name} gewerk om praktiese hulpmiddels in plek te stel om angs beter te bestuur en te werk aan die vervulling van {name} se sensoriese behoeftes by die skool. Hierdie strategieë beoog om die risiko van oorlading te verminder, kalmer fokus en konsentrasie te ondersteun, en {name} te help om gereguleerd te bly deur die skooldag. Die aanbevelings hieronder kan deur onderrig- en ondersteuningspersoneel saam met voortgesette arbeidsterapie-insette gebruik word.",
    schoolReportSectionDetails: "Persoonlike besonderhede",
    schoolReportLabelName: "Naam",
    schoolReportLabelSchool: "Skool / graad",
    schoolReportLabelReason: "Rede vir ondersteuning / kommer",
    schoolReportNotProvided: "Nie verskaf nie",
  schoolReportSectionScores: "Opsomming van sensoriese tellings",
  schoolReportSectionVisual: "Jou sensoriese momentopname",
  schoolReportVisualAsk: "Kies ’n visuele styl vir die verslag",
  schoolReportVisualHint: "Kies die tiener-vriendelike momentopname wat die beste by hierdie leerling pas — dit verskyn in die gedrukte verslag.",
  schoolReportVisualBalance: "Balansstawe",
  schoolReportVisualBalanceDesc: "Wys elke sintuig op ’n lyn van merk vinnig op → soek meer",
  schoolReportVisualDials: "Sintuigwysers",
  schoolReportVisualDialsDesc: "Ronde wysers wat lae, medium of hoë drempel in een oogopslag wys",
  schoolReportVisualCards: "Sintuigkaarte",
  schoolReportVisualCardsDesc: "Heldere kaarte met ’n ikoon en ’n eenvoudige status vir elke sintuig",
  schoolReportVisualLegendSensitive: "Merk vinnig op",
  schoolReportVisualLegendNeutral: "Gewoonlik gebalanseerd",
  schoolReportVisualLegendSeeking: "Soek meer",
  schoolReportVisualAxisLeft: "Merk vinnig op",
  schoolReportVisualAxisRight: "Soek meer",
  schoolReportSectionRecs: "Skoolaanbevelings",
  schoolReportSectionNotes: "Addisionele inligting",
  schoolReportNotesAsk: "Wil jy ekstra getikte inligting byvoeg?",
  schoolReportNotesAskYes: "Ja, voeg ekstra inligting by",
  schoolReportNotesAskNo: "Nee, nie nodig nie",
  schoolReportNotesLabel: "Ekstra getikte inligting",
  schoolReportNotesPlaceholder:
    "Tik enige ekstra waarnemings, klaskamer-konteks, ooreengekome strategieë of notas vir onderwysers…",
  schoolReportNotesEmpty: "Geen bykomende notas bygevoeg nie.",
  schoolReportClosing:
      "Hierdie aanbevelings is slegs riglyne. Pas dit asseblief saam met die behandelende arbeidsterapeut en, waar toepaslik, die leerling se onderwysers, leerondersteuningspan of skoolgebaseerde ondersteuningspan aan.",
    schoolReportClinic: "Soulful Sensory OT",
    mayNotice: "Wat jy dalk kan opmerk",
    mayNoticeChild: "Wat jy dalk kan opmerk",
    supportHeading: "Wat kan help",
    dietTitle: "Meer idees per sintuig",
    dietSubtitle: "’n Vollediger bank van sensoriese dieet-idees vir elke stelsel",
    dietSubtitleChild: "’n Vollediger bank van sensoriese dieet-idees vir elke stelsel",
    dietIntro:
      "Kies wat pas uit hierdie idees, en pas dit saam met jou arbeidsterapeut aan.",
    dietIntroChild:
      "Kies wat pas uit hierdie idees vir jou kind, en pas dit saam met jou arbeidsterapeut aan.",
    dietOpen: "Blaai deur meer idees per sintuig",
    dietClose: "Versteek ideebank",
    dietEmpty: "Voltooi die sifting om pasgemaakte idees vir elke sintuig te sien.",
  },
};

const RESPONDENT_OPTIONS = {
  adult: { labelKey: "adult", descKey: "adultDesc" },
  teen: { labelKey: "teen", descKey: "teenDesc" },
  parent: { labelKey: "parent", descKey: "parentDesc" },
};

const CONSENT_COPY = {
  en: {
    adult: {
      required: [
        "I understand that this questionnaire is a screening tool and does not constitute a diagnosis.",
        "I understand that my responses and personal details are confidential and will be used only for clinical / assessment purposes by Soulful Sensory OT.",
        "I understand that my personal information (including health-related information in my responses) will be collected and processed in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA).",
        "I understand that completing this questionnaire does not establish a therapeutic relationship until this has been discussed with my occupational therapist.",
        "I consent to Soulful Sensory OT storing my information securely for assessment purposes, and I understand I may request access to, correction of, or withdrawal of consent regarding my information by contacting Soulful Sensory OT.",
        "I understand that information will not be shared with third parties without my permission, except where disclosure is required by law or necessary to protect someone’s safety.",
      ],
      sharing: [
        {
          id: "treatingTeam",
          shortLabel: "Treating team",
          label: "I give permission for Soulful Sensory OT to share relevant findings with my treating team (for example a GP, psychologist, or other therapists).",
        },
      ],
      sharingWork: [
        {
          id: "soulfulSensory",
          shortLabel: "Soulful Sensory OT",
          label: "I give permission for Soulful Sensory OT to access and use my questionnaire results for assessment purposes.",
          required: true,
        },
        {
          id: "employer",
          shortLabel: "Workplace / employer",
          label: "I give permission for Soulful Sensory OT to share relevant findings with my workplace or employer.",
        },
      ],
    },
    teen: {
      required: [
        "I understand that this questionnaire helps describe my sensory experiences but does not give me a diagnosis.",
        "I understand that my answers and personal details will be kept confidential and used only for clinical / assessment purposes by Soulful Sensory OT.",
        "I understand that my personal information (including health-related information in my answers) will be collected and handled in line with POPIA (South Africa’s privacy law).",
        "I understand that a parent or guardian may need to give permission before assessment or therapy can begin.",
        "I agree that Soulful Sensory OT may store my information securely for assessment purposes, and that I (or my parent / guardian) can ask to see, correct, or withdraw consent about this information by contacting Soulful Sensory OT.",
        "I understand that my information will not be shared with other people without permission, except where the law requires it or someone needs protecting.",
      ],
      sharing: [
        {
          id: "soulfulSensory",
          shortLabel: "Soulful Sensory OT",
          label: "I give permission for Soulful Sensory OT to access and use my questionnaire results for assessment purposes.",
        },
        {
          id: "parents",
          shortLabel: "Parent(s) / guardian(s)",
          label: "I give permission for Soulful Sensory OT to share relevant findings with my parent(s) or guardian(s).",
        },
        {
          id: "school",
          shortLabel: "School (teachers / support staff)",
          label: "I give permission for Soulful Sensory OT to share relevant findings with my school (for example teachers or support staff).",
        },
        {
          id: "treatingTeam",
          shortLabel: "Treating team",
          label: "I give permission for Soulful Sensory OT to share relevant findings with my treating team (for example a doctor, psychologist, or other therapists).",
        },
      ],
    },
    parent: {
      required: [
        "I understand that this questionnaire is a screening tool and does not constitute a diagnosis of my child.",
        "I confirm that I am the child’s parent or legal guardian and may provide this information.",
        "I understand that these responses and our personal details are confidential and will be used only for clinical / assessment purposes by Soulful Sensory OT.",
        "I understand that my child’s and my personal information (including health-related information in these responses) will be collected and processed in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA).",
        "I consent to Soulful Sensory OT storing my child’s and my contact information securely for assessment purposes, and I understand I may request access to, correction of, or withdrawal of consent regarding this information by contacting Soulful Sensory OT.",
        "I understand that information will not be shared with third parties without my permission, except where disclosure is required by law or necessary to protect someone’s safety.",
      ],
      sharing: [
        {
          id: "soulfulSensory",
          shortLabel: "Soulful Sensory OT",
          label: "I give permission for Soulful Sensory OT to access and use my child’s questionnaire results for assessment purposes.",
        },
        {
          id: "treatingTeam",
          shortLabel: "Child’s treating team",
          label: "I give permission for Soulful Sensory OT to share relevant findings with my child’s treating team (for example a GP, psychologist, or other therapists).",
        },
      ],
    },
  },
  af: {
    adult: {
      required: [
        "Ek verstaan dat hierdie vraelys ’n siftingsinstrument is en nie ’n diagnose bied nie.",
        "Ek verstaan dat my antwoorde en persoonlike besonderhede vertroulik is en slegs vir kliniese / assesseringsdoeleindes deur Soulful Sensory OT gebruik sal word.",
        "Ek verstaan dat my persoonlike inligting (insluitend gesondheidsverwante inligting in my antwoorde) ingevolge die Wet op die Beskerming van Persoonlike Inligting 4 van 2013 (POPIA) ingesamel en verwerk sal word.",
        "Ek verstaan dat die voltooiing van hierdie vraelys nie ’n terapeutiese verhouding vestig voordat dit met my arbeidsterapeut bespreek is nie.",
        "Ek gee toestemming dat Soulful Sensory OT my inligting veilig vir assesseringsdoeleindes mag stoor, en ek verstaan dat ek toegang tot, regstelling van, of die terugtrekking van toestemming rakende my inligting mag versoek deur Soulful Sensory OT te kontak.",
        "Ek verstaan dat inligting nie met derdes gedeel sal word sonder my toestemming nie, behalwe waar openbaarmaking wetlik vereis word of nodig is om iemand se veiligheid te beskerm.",
      ],
      sharing: [
        {
          id: "treatingTeam",
          shortLabel: "Behandelingspan",
          label: "Ek gee toestemming dat Soulful Sensory OT relevante bevindinge met my behandelingspan mag deel (byvoorbeeld ’n huisarts, sielkundige of ander terapeute).",
        },
      ],
      sharingWork: [
        {
          id: "soulfulSensory",
          shortLabel: "Soulful Sensory OT",
          label: "Ek gee toestemming dat Soulful Sensory OT toegang tot my vraelysresultate mag hê en dit vir assesseringsdoeleindes mag gebruik.",
          required: true,
        },
        {
          id: "employer",
          shortLabel: "Werkplek / werkgewer",
          label: "Ek gee toestemming dat Soulful Sensory OT relevante bevindinge met my werkplek of werkgewer mag deel.",
        },
      ],
    },
    teen: {
      required: [
        "Ek verstaan dat hierdie vraelys help om my sensoriese ervarings te beskryf, maar nie vir my ’n diagnose gee nie.",
        "Ek verstaan dat my antwoorde en persoonlike besonderhede vertroulik gehou en slegs vir kliniese / assesseringsdoeleindes deur Soulful Sensory OT gebruik sal word.",
        "Ek verstaan dat my persoonlike inligting (insluitend gesondheidsverwante inligting in my antwoorde) volgens POPIA (Suid-Afrika se privaatheidswet) ingesamel en hanteer sal word.",
        "Ek verstaan dat ’n ouer of voog dalk toestemming moet gee voordat assessering of terapie kan begin.",
        "Ek stem in dat Soulful Sensory OT my inligting veilig vir assesseringsdoeleindes mag stoor, en dat ek (of my ouer / voog) kan vra om hierdie inligting te sien, te korrigeer, of toestemming terug te trek deur Soulful Sensory OT te kontak.",
        "Ek verstaan dat my inligting nie met ander mense gedeel sal word sonder toestemming nie, behalwe waar die wet dit vereis of iemand beskerm moet word.",
      ],
      sharing: [
        {
          id: "soulfulSensory",
          shortLabel: "Soulful Sensory OT",
          label: "Ek gee toestemming dat Soulful Sensory OT toegang tot my vraelysresultate mag hê en dit vir assesseringsdoeleindes mag gebruik.",
        },
        {
          id: "parents",
          shortLabel: "Ouer(s) / voog(de)",
          label: "Ek gee toestemming dat Soulful Sensory OT relevante bevindinge met my ouer(s) of voog(de) mag deel.",
        },
        {
          id: "school",
          shortLabel: "Skool (onderwysers / ondersteuning)",
          label: "Ek gee toestemming dat Soulful Sensory OT relevante bevindinge met my skool mag deel (byvoorbeeld onderwysers of ondersteuningspersoneel).",
        },
        {
          id: "treatingTeam",
          shortLabel: "Behandelingspan",
          label: "Ek gee toestemming dat Soulful Sensory OT relevante bevindinge met my behandelingspan mag deel (byvoorbeeld ’n dokter, sielkundige of ander terapeute).",
        },
      ],
    },
    parent: {
      required: [
        "Ek verstaan dat hierdie vraelys ’n siftingsinstrument is en nie ’n diagnose van my kind bied nie.",
        "Ek bevestig dat ek die kind se ouer of wettige voog is en hierdie inligting mag verskaf.",
        "Ek verstaan dat hierdie antwoorde en ons persoonlike besonderhede vertroulik is en slegs vir kliniese / assesseringsdoeleindes deur Soulful Sensory OT gebruik sal word.",
        "Ek verstaan dat my kind se en my persoonlike inligting (insluitend gesondheidsverwante inligting in hierdie antwoorde) ingevolge die Wet op die Beskerming van Persoonlike Inligting 4 van 2013 (POPIA) ingesamel en verwerk sal word.",
        "Ek gee toestemming dat Soulful Sensory OT my kind se inligting en my kontakbesonderhede veilig vir assesseringsdoeleindes mag stoor, en ek verstaan dat ek toegang tot, regstelling van, of die terugtrekking van toestemming rakende hierdie inligting mag versoek deur Soulful Sensory OT te kontak.",
        "Ek verstaan dat inligting nie met derdes gedeel sal word sonder my toestemming nie, behalwe waar openbaarmaking wetlik vereis word of nodig is om iemand se veiligheid te beskerm.",
      ],
      sharing: [
        {
          id: "soulfulSensory",
          shortLabel: "Soulful Sensory OT",
          label: "Ek gee toestemming dat Soulful Sensory OT toegang tot my kind se vraelysresultate mag hê en dit vir assesseringsdoeleindes mag gebruik.",
        },
        {
          id: "treatingTeam",
          shortLabel: "Kind se behandelingspan",
          label: "Ek gee toestemming dat Soulful Sensory OT relevante bevindinge met my kind se behandelingspan mag deel (byvoorbeeld ’n huisarts, sielkundige of ander terapeute).",
        },
      ],
    },
  },
};

const DEMOGRAPHIC_COPY = {
  en: {
    adult: [["name", "Name and surname", "text", true], ["age", "Age", "number", true], ["email", "Email", "email", true], ["occupation", "Occupation / university / college", "text", false]],
    teen: [["name", "Name and surname", "text", true], ["age", "Age", "number", true], ["email", "Your or a parent / guardian’s email", "email", true], ["occupation", "School / grade", "text", false]],
    parent: [["name", "Child’s name and surname", "text", true], ["age", "Child’s age", "number", true], ["parentName", "Parent / guardian name and surname", "text", true], ["email", "Parent / guardian email", "email", true], ["occupation", "School / grade", "text", false]],
  },
  af: {
    adult: [["name", "Naam en van", "text", true], ["age", "Ouderdom", "number", true], ["email", "E-posadres", "email", true], ["occupation", "Beroep / universiteit / kollege", "text", false]],
    teen: [["name", "Naam en van", "text", true], ["age", "Ouderdom", "number", true], ["email", "Jou of ’n ouer / voog se e-posadres", "email", true], ["occupation", "Skool / graad", "text", false]],
    parent: [["name", "Kind se naam en van", "text", true], ["age", "Kind se ouderdom", "number", true], ["parentName", "Ouer / voog se naam en van", "text", true], ["email", "Ouer / voog se e-posadres", "email", true], ["occupation", "Skool / graad", "text", false]],
  },
};

const DOMAIN_DEFINITIONS = [
  {
    id: "auditory",
    icon: "🎧",
    types: ["sensitive", "sensitive", "sensitive", "sensitive", "sensitive", "sensitive", "seeking", "seeking"],
    copy: {
      en: {
        title: "Auditory Processing",
        shortTitle: "Auditory",
        description: "These questions explore responses to everyday sounds and noise.",
        blurb: "Hearing and responding to sound and noise.",
      },
      af: {
        title: "Ouditiewe Prosessering",
        shortTitle: "Ouditief",
        description: "Hierdie vrae ondersoek reaksies op alledaagse klanke en geraas.",
        blurb: "Hoor en reageer op klank en geraas.",
      },
    },
    questions: {
      en: {
        adult: [
          "I become overwhelmed in noisy environments.",
          "I am easily distracted by background noise.",
          "I find it difficult to concentrate when there is a lot of noise around me.",
          "I often turn down the volume, close doors or use headphones to reduce noise.",
          "I prefer quiet places over busy or noisy environments.",
          "I avoid places because they are too loud or overwhelming.",
          "I enjoy background noise, such as music, TV or a podcast, while I work or relax.",
          "I often hum, sing, tap, whistle or click without really thinking about it.",
        ],
        teen: [
          "Loud or busy places at home or school can quickly feel like too much for me.",
          "Background noise at home or in class easily pulls my attention away.",
          "I struggle to focus at home or at school when lots of sounds are happening around me.",
          "I turn the volume down, close doors or use headphones when I need less noise.",
          "I would rather be somewhere quiet than somewhere busy and noisy.",
          "I sometimes avoid places at school or at home because they are too loud.",
          "I like having music, TV, a podcast or people talking in the background while I study, do homework or chill.",
          "I often hum, sing, tap, whistle or make clicking sounds without noticing.",
        ],
        parent: [
          "My child becomes overwhelmed in noisy environments.",
          "My child is easily distracted by background noise.",
          "My child finds it difficult to concentrate when there is a lot of noise nearby.",
          "My child turns down the volume, closes doors or uses headphones to reduce noise.",
          "My child prefers quiet places to busy or noisy environments.",
          "My child avoids places because they are too loud or overwhelming.",
          "My child enjoys background noise, such as music, TV or people talking, while working, playing or relaxing.",
          "My child often hums, sings, taps, whistles or clicks without seeming to notice.",
        ],
      },
      af: {
        adult: [
          "Ek raak oorweldig in lawaaierige omgewings.",
          "Agtergrondgeraas lei my maklik af.",
          "Ek sukkel om te konsentreer wanneer daar baie geraas om my is.",
          "Ek draai dikwels die volume af, maak deure toe of gebruik oorfone om geraas te verminder.",
          "Ek verkies stil plekke bo besige of lawaaierige omgewings.",
          "Ek vermy plekke omdat dit te hard of oorweldigend is.",
          "Ek geniet agtergrondklank, soos musiek, TV of ’n potgooi, terwyl ek werk of ontspan.",
          "Ek neurie, sing, tik, fluit of klik dikwels sonder om werklik daarvan bewus te wees.",
        ],
        teen: [
          "Harde of besige plekke by die huis of skool voel gou vir my te veel.",
          "Agtergrondgeraas by die huis of in die klas trek maklik my aandag af.",
          "Ek sukkel om by die huis of by die skool te fokus wanneer baie klanke rondom my gebeur.",
          "Ek draai die volume af, maak deure toe of gebruik oorfone wanneer ek minder geraas nodig het.",
          "Ek sal eerder op ’n stil plek wees as op ’n besige, lawaaierige plek.",
          "Ek vermy soms plekke by die skool of by die huis omdat dit te hard is.",
          "Ek hou daarvan om musiek, TV, ’n potgooi of mense se stemme in die agtergrond te hê terwyl ek leer, huiswerk doen of ontspan.",
          "Ek neurie, sing, tik, fluit of maak klikgeluide sonder dat ek dit altyd agterkom.",
        ],
        parent: [
          "My kind raak oorweldig in lawaaierige omgewings.",
          "Agtergrondgeraas lei my kind maklik af.",
          "My kind sukkel om te konsentreer wanneer daar baie geraas naby is.",
          "My kind draai die volume af, maak deure toe of gebruik oorfone om geraas te verminder.",
          "My kind verkies stil plekke bo besige of lawaaierige omgewings.",
          "My kind vermy plekke omdat dit te hard of oorweldigend is.",
          "My kind geniet agtergrondklank, soos musiek, TV of mense se stemme, terwyl hulle werk, speel of ontspan.",
          "My kind neurie, sing, tik, fluit of klik dikwels sonder om dit skynbaar agter te kom.",
        ],
      },
    },
  },
  {
    id: "tactile",
    icon: "✋",
    types: ["sensitive", "sensitive", "seeking", "sensitive", "sensitive", "seeking", "sensitive"],
    copy: {
      en: {
        title: "Tactile Processing",
        shortTitle: "Tactile",
        description: "These questions explore touch, clothing textures and physical contact.",
        blurb: "Touch, textures and physical contact on the skin.",
      },
      af: {
        title: "Tasprosessering",
        shortTitle: "Tas",
        description: "Hierdie vrae ondersoek aanraking, kledingteksture en fisieke kontak.",
        blurb: "Aanraking, teksture en fisieke kontak op die vel.",
      },
    },
    questions: {
      en: {
        adult: [
          "Certain clothing textures, such as scratchy or tight-fitting fabrics, are uncomfortable for me.",
          "Clothing labels or seams irritate me, and I often remove them.",
          "I am comfortable when people are in my personal space.",
          "I feel uncomfortable in queues or crowded spaces where people are very close to me.",
          "I dislike getting my hands messy, for example with paint, sand, glue or food.",
          "I enjoy appropriate physical affection, such as hugs, from people I trust.",
          "I avoid certain foods because their texture feels unpleasant.",
        ],
        teen: [
          "Scratchy, tight or certain types of clothes feel uncomfortable on my skin at home and at school.",
          "Labels or seams in my clothes bother me, and I often want them removed.",
          "I am okay with people being in my personal space.",
          "Queues or crowded places at school or with family feel uncomfortable when people stand too close to me.",
          "I do not like getting my hands messy with things like paint, sand, glue or food.",
          "I enjoy hugs or other appropriate touch from people I trust.",
          "I avoid some foods because I cannot stand how they feel in my mouth.",
        ],
        parent: [
          "Certain clothing textures, such as scratchy or tight-fitting fabrics, are uncomfortable for my child.",
          "Clothing labels or seams irritate my child, and they often want them removed.",
          "My child is comfortable when people are in their personal space.",
          "My child feels uncomfortable in queues or crowded spaces where people are very close.",
          "My child dislikes getting their hands messy with paint, sand, glue or food.",
          "My child enjoys appropriate physical affection, such as hugs, from people they trust.",
          "My child avoids certain foods because the texture feels unpleasant.",
        ],
      },
      af: {
        adult: [
          "Sekere kledingteksture, soos krapperige of styfpassende materiaal, voel vir my ongemaklik.",
          "Etikette of nate in klere irriteer my, en ek verwyder dit dikwels.",
          "Ek is gemaklik wanneer mense in my persoonlike ruimte is.",
          "Ek voel ongemaklik in rye of oorvol plekke waar mense baie naby aan my is.",
          "Ek hou nie daarvan om my hande vuil te maak met verf, sand, gom of kos nie.",
          "Ek geniet gepaste fisieke aanraking, soos drukkies, van mense wat ek vertrou.",
          "Ek vermy sekere kosse omdat die tekstuur onaangenaam voel.",
        ],
        teen: [
          "Krapperige, stywe of sekere soorte klere voel ongemaklik op my vel by die huis én by die skool.",
          "Etikette of nate in my klere pla my, en ek wil dit dikwels laat uithaal.",
          "Ek is gemaklik wanneer mense in my persoonlike ruimte is.",
          "Rye of oorvol plekke by die skool of saam met familie voel ongemaklik wanneer mense te naby aan my staan.",
          "Ek hou nie daarvan om my hande vuil te maak met goed soos verf, sand, gom of kos nie.",
          "Ek geniet drukkies of ander gepaste aanraking van mense wat ek vertrou.",
          "Ek vermy sekere kosse omdat ek nie hou van hoe dit in my mond voel nie.",
        ],
        parent: [
          "Sekere kledingteksture, soos krapperige of styfpassende materiaal, voel vir my kind ongemaklik.",
          "Etikette of nate in klere irriteer my kind, en hulle wil dit dikwels laat verwyder.",
          "My kind is gemaklik wanneer mense in hulle persoonlike ruimte is.",
          "My kind voel ongemaklik in rye of oorvol plekke waar mense baie naby staan.",
          "My kind hou nie daarvan om hulle hande vuil te maak met verf, sand, gom of kos nie.",
          "My kind geniet gepaste fisieke aanraking, soos drukkies, van mense wat hulle vertrou.",
          "My kind vermy sekere kosse omdat die tekstuur onaangenaam voel.",
        ],
      },
    },
  },
  {
    id: "movement",
    icon: "🏃",
    types: [
      "seeking",
      "seeking",
      "neutral",
      "seeking",
      "seeking",
      "neutral",
      "sensitive",
      "sensitive",
      "seeking",
      "seeking",
      "seeking",
    ],
    copy: {
      en: {
        title: "Movement & Body Awareness",
        shortTitle: "Movement",
        description:
          "These questions explore balance and movement through space, as well as body awareness, physical effort and activity.",
        blurb:
          "Balance and motion through space (vestibular), and knowing where the body is without looking (proprioception).",
      },
      af: {
        title: "Beweging & Liggaamsbewustheid",
        shortTitle: "Beweging",
        description:
          "Hierdie vrae ondersoek balans en beweging deur die ruimte, asook liggaamsbewustheid, fisieke inspanning en aktiwiteit.",
        blurb:
          "Balans en beweging deur die ruimte (vestibulêr), en weet waar die liggaam is sonder om te kyk (propriosepsie).",
      },
    },
    questions: {
      en: {
        adult: [
          "I find it difficult to sit still for long periods and often feel restless.",
          "I enjoy physical activity or exercise, even if I have not done it recently.",
          "I enjoy quieter activities such as reading, writing, art or watching a series.",
          "I enjoy heavy physical effort, such as pushing, pulling, carrying, climbing or jumping.",
          "I enjoy high-impact or forceful activities such as running, boxing, tennis or hockey.",
          "I prefer low-impact activities such as swimming, walking or pilates.",
          "I feel unsettled, dizzy or uncomfortable with spinning, heights or sudden changes in movement.",
          "I prefer to keep my feet firmly on the ground and tend to avoid rides, swings or activities that tip or lift me.",
          "I enjoy activities that involve spinning, swinging, rocking or moving quickly.",
          "I enjoy exciting or adventurous activities that give me an adrenaline rush.",
          "Movement or exercise helps me feel calmer and more focused.",
        ],
        teen: [
          "I struggle to sit still for a long time in class or at home and often feel fidgety or restless.",
          "I enjoy sport, exercise or being physically active.",
          "I enjoy chilled activities like reading, drawing, writing or watching a series.",
          "I enjoy heavy physical effort, like pushing, pulling, carrying, climbing or jumping.",
          "I enjoy high-energy or forceful activities like running, boxing, tennis or hockey.",
          "I prefer gentler activities like swimming, walking or pilates.",
          "Spinning, heights or sudden movement can make me feel unsettled, dizzy or uncomfortable.",
          "I like keeping my feet on the ground and tend to avoid rides, swings or things that tip or lift me.",
          "I enjoy spinning, swinging, rocking or moving fast.",
          "I enjoy exciting or adventurous activities that give me a rush.",
          "Moving or exercising helps me feel calmer and focus better at school and at home.",
        ],
        parent: [
          "My child finds it difficult to sit still for long periods and often appears restless.",
          "My child enjoys sport, exercise or physical activity.",
          "My child enjoys quieter activities such as reading, drawing, art or watching a series.",
          "My child enjoys heavy physical effort, such as pushing, pulling, carrying, climbing or jumping.",
          "My child enjoys high-impact or forceful activities such as running, boxing, tennis or hockey.",
          "My child prefers lower-impact activities such as swimming, walking or pilates.",
          "My child becomes unsettled, dizzy or uncomfortable with spinning, heights or sudden changes in movement.",
          "My child prefers to keep their feet firmly on the ground and tends to avoid rides, swings or activities that tip or lift them.",
          "My child enjoys spinning, swinging, rocking or moving quickly.",
          "My child enjoys exciting or adventurous activities.",
          "Movement or exercise helps my child appear calmer and more focused.",
        ],
      },
      af: {
        adult: [
          "Ek sukkel om vir lang tye stil te sit en voel dikwels rusteloos.",
          "Ek geniet fisieke aktiwiteit of oefening, selfs al het ek dit nie onlangs gedoen nie.",
          "Ek geniet rustiger aktiwiteite soos lees, skryf, kuns of om ’n reeks te kyk.",
          "Ek geniet swaar fisieke inspanning, soos stoot, trek, dra, klim of spring.",
          "Ek geniet hoë-impak- of kragtige aktiwiteite soos hardloop, boks, tennis of hokkie.",
          "Ek verkies lae-impakaktiwiteite soos swem, stap of pilates.",
          "Ek voel ongemaklik, duiselig of onseker by tol, hoogtes of skielike veranderinge in beweging.",
          "Ek verkies om my voete ferm op die grond te hou en vermy gewoonlik ritte, swaai of aktiwiteite wat my kantel of optel.",
          "Ek geniet aktiwiteite wat tol, swaai, wieg of vinnige beweging behels.",
          "Ek geniet opwindende of avontuurlustige aktiwiteite wat my ’n adrenalienstormloop gee.",
          "Beweging of oefening help my om kalmer te voel en beter te fokus.",
        ],
        teen: [
          "Ek sukkel om lank stil te sit in die klas of by die huis en voel dikwels kriewelrig of rusteloos.",
          "Ek geniet sport, oefening of om fisiek aktief te wees.",
          "Ek geniet rustige aktiwiteite soos lees, teken, skryf of om ’n reeks te kyk.",
          "Ek geniet swaar fisieke inspanning, soos stoot, trek, dra, klim of spring.",
          "Ek geniet hoë-energie- of kragtige aktiwiteite soos hardloop, boks, tennis of hokkie.",
          "Ek verkies rustiger aktiwiteite soos swem, stap of pilates.",
          "Tol, hoogtes of skielike beweging kan my ongemaklik, duiselig of onseker laat voel.",
          "Ek hou daarvan om my voete op die grond te hou en vermy gewoonlik ritte, swaai of goed wat my kantel of optel.",
          "Ek geniet dit om te tol, swaai, wieg of vinnig te beweeg.",
          "Ek geniet opwindende of avontuurlustige aktiwiteite wat my ’n adrenalienstormloop gee.",
          "Beweging of oefening help my om by die skool én by die huis kalmer te voel en beter te fokus.",
        ],
        parent: [
          "My kind sukkel om vir lang tye stil te sit en lyk dikwels rusteloos.",
          "My kind geniet sport, oefening of fisieke aktiwiteit.",
          "My kind geniet rustiger aktiwiteite soos lees, teken, kuns of om ’n reeks te kyk.",
          "My kind geniet swaar fisieke inspanning, soos stoot, trek, dra, klim of spring.",
          "My kind geniet hoë-impak- of kragtige aktiwiteite soos hardloop, boks, tennis of hokkie.",
          "My kind verkies lae-impakaktiwiteite soos swem, stap of pilates.",
          "My kind raak ongemaklik, duiselig of onseker by tol, hoogtes of skielike veranderinge in beweging.",
          "My kind verkies om hulle voete ferm op die grond te hou en vermy gewoonlik ritte, swaai of aktiwiteite wat hulle kantel of optel.",
          "My kind geniet dit om te tol, swaai, wieg of vinnig te beweeg.",
          "My kind geniet opwindende of avontuurlustige aktiwiteite.",
          "Beweging of oefening help my kind om kalmer te lyk en beter te fokus.",
        ],
      },
    },
  },
  {
    id: "visual",
    icon: "👁",
    types: ["neutral", "sensitive", "seeking", "sensitive", "sensitive", "sensitive", "seeking"],
    copy: {
      en: {
        title: "Visual Processing",
        shortTitle: "Visual",
        description: "These questions explore responses to light and visually busy environments.",
        blurb: "Taking in light, colour and what is seen around you.",
      },
      af: {
        title: "Visuele Prosessering",
        shortTitle: "Visueel",
        description: "Hierdie vrae ondersoek reaksies op lig en visueel besige omgewings.",
        blurb: "Inneem van lig, kleur en wat rondom gesien word.",
      },
    },
    questions: {
      en: {
        adult: [
          "I keep my surroundings organised and generally prefer a tidy space.",
          "I am sensitive to bright lights, fluorescent lighting or glare.",
          "When dressing or decorating, I enjoy bright colours and bold patterns.",
          "When dressing or decorating, I prefer softer, neutral colours such as beige, white, green or navy.",
          "I become distracted when there is a lot happening visually around me.",
          "I feel more comfortable in dimly lit rooms.",
          "I enjoy opening curtains or blinds to let in natural light.",
        ],
        teen: [
          "I like keeping my room at home or my desk at school organised and tidy.",
          "Bright lights, fluorescent lights or glare bother me at home or at school.",
          "When dressing or decorating, I enjoy bright colours and bold patterns.",
          "When dressing or decorating, I prefer calm, neutral colours like beige, white, green or navy.",
          "I get distracted when there is a lot to look at around me at home or at school.",
          "I feel more comfortable in rooms with softer or dimmer light.",
          "I like opening curtains or blinds to let natural light in.",
        ],
        parent: [
          "My child keeps their surroundings organised and generally prefers a tidy space.",
          "My child is sensitive to bright lights, fluorescent lighting or glare.",
          "When dressing or decorating, my child enjoys bright colours and bold patterns.",
          "When dressing or decorating, my child prefers softer, neutral colours such as beige, white, green or navy.",
          "My child becomes distracted when there is a lot happening visually nearby.",
          "My child appears more comfortable in dimly lit rooms.",
          "My child enjoys natural light and opening curtains or blinds.",
        ],
      },
      af: {
        adult: [
          "Ek hou my omgewing georganiseerd en verkies gewoonlik ’n netjiese ruimte.",
          "Ek is sensitief vir helder ligte, fluoresserende lig of glans.",
          "Wanneer ek aantrek of dekor, geniet ek helder kleure en opvallende patrone.",
          "Wanneer ek aantrek of dekor, verkies ek sagter, neutrale kleure soos beige, wit, groen of vlootblou.",
          "Ek raak afgelei wanneer daar visueel baie rondom my gebeur.",
          "Ek voel gemakliker in vertrekke met dowwe lig.",
          "Ek geniet dit om gordyne of blindings oop te maak sodat natuurlike lig kan inkom.",
        ],
        teen: [
          "Ek hou daarvan om my kamer by die huis of my lessenaar by die skool georganiseerd en netjies te hou.",
          "Helder ligte, fluoresserende lig of glans pla my by die huis of by die skool.",
          "Wanneer ek aantrek of dekor, geniet ek helder kleure en opvallende patrone.",
          "Wanneer ek aantrek of dekor, verkies ek kalm, neutrale kleure soos beige, wit, groen of vlootblou.",
          "Ek raak afgelei wanneer daar by die huis of by die skool baie rondom my is om na te kyk.",
          "Ek voel gemakliker in vertrekke met sagter of dowwer lig.",
          "Ek hou daarvan om gordyne of blindings oop te maak sodat natuurlike lig kan inkom.",
        ],
        parent: [
          "My kind hou hulle omgewing georganiseerd en verkies gewoonlik ’n netjiese ruimte.",
          "My kind is sensitief vir helder ligte, fluoresserende lig of glans.",
          "Wanneer dit by aantrek of dekor kom, geniet my kind helder kleure en opvallende patrone.",
          "Wanneer dit by aantrek of dekor kom, verkies my kind sagter, neutrale kleure soos beige, wit, groen of vlootblou.",
          "My kind raak afgelei wanneer daar visueel baie rondom hulle gebeur.",
          "My kind lyk gemakliker in vertrekke met dowwe lig.",
          "My kind geniet natuurlike lig en om gordyne of blindings oop te maak.",
        ],
      },
    },
  },
  {
    id: "smellTaste",
    icon: "🍃",
    types: ["sensitive", "sensitive", "sensitive", "sensitive", "seeking", "seeking", "seeking", "seeking"],
    copy: {
      en: {
        title: "Smell & Taste",
        shortTitle: "Smell & Taste",
        description: "These questions explore responses to everyday smells and flavours.",
        blurb: "Everyday smells and flavours.",
      },
      af: {
        title: "Reuk & Smaak",
        shortTitle: "Reuk & Smaak",
        description: "Hierdie vrae ondersoek reaksies op alledaagse reuke en smake.",
        blurb: "Alledaagse reuke en smake.",
      },
    },
    questions: {
      en: {
        adult: [
          "Strong smells, such as perfume, cleaning products or cooking odours, quickly feel like too much for me.",
          "I notice smells that other people often miss, and they can distract or bother me.",
          "I avoid certain foods because the taste or aftertaste feels too strong or unpleasant.",
          "I prefer mild or familiar flavours and find very spicy, bitter or intense tastes uncomfortable.",
          "I enjoy strong or interesting smells, such as essential oils, baking, perfume or fresh outdoor air.",
          "I often seek out pleasant scents — for example candles, fragrance, herbs or flavoured drinks.",
          "I enjoy strong flavours, such as spicy, sour, salty or highly seasoned foods.",
          "I like trying new tastes and flavours, and get bored when food feels too bland.",
        ],
        teen: [
          "Strong smells like perfume, cleaning products or cooking can quickly feel like too much for me at home or at school.",
          "I notice smells that other people often miss, and they can distract or bother me.",
          "I avoid some foods because the taste or aftertaste feels too strong or unpleasant.",
          "I prefer mild or familiar flavours and find very spicy, bitter or intense tastes uncomfortable.",
          "I enjoy strong or interesting smells, like essential oils, baking, perfume or fresh outdoor air.",
          "I often look for pleasant scents — for example candles, fragrance, herbs or flavoured drinks.",
          "I enjoy strong flavours, like spicy, sour, salty or highly seasoned foods.",
          "I like trying new tastes and flavours, and get bored when food tastes too bland.",
        ],
        parent: [
          "Strong smells, such as perfume, cleaning products or cooking odours, quickly feel like too much for my child.",
          "My child notices smells that other people often miss, and these can distract or bother them.",
          "My child avoids certain foods because the taste or aftertaste feels too strong or unpleasant.",
          "My child prefers mild or familiar flavours and finds very spicy, bitter or intense tastes uncomfortable.",
          "My child enjoys strong or interesting smells, such as essential oils, baking, perfume or fresh outdoor air.",
          "My child often seeks out pleasant scents — for example candles, fragrance, herbs or flavoured drinks.",
          "My child enjoys strong flavours, such as spicy, sour, salty or highly seasoned foods.",
          "My child likes trying new tastes and flavours, and gets bored when food feels too bland.",
        ],
      },
      af: {
        adult: [
          "Sterk reuke, soos parfuum, skoonmaakprodukte of kookreuke, voel vinnig vir my te veel.",
          "Ek merk reuke op wat ander mense dikwels mis, en dit kan my aflei of pla.",
          "Ek vermy sekere kosse omdat die smaak of nasmaak te sterk of onaangenaam voel.",
          "Ek verkies sagte of bekende smake en vind baie pittige, bitter of intense smake ongemaklik.",
          "Ek geniet sterk of interessante reuke, soos essensiële olies, bak, parfuum of vars buite lug.",
          "Ek soek dikwels aangename geure op — byvoorbeeld kerse, geur, kruie of gegeurde drankies.",
          "Ek geniet sterk smake, soos pittige, suur, sout of sterk gekruide kosse.",
          "Ek hou daarvan om nuwe smake te probeer, en raak verveeld wanneer kos te flou voel.",
        ],
        teen: [
          "Sterk reuke soos parfuum, skoonmaakprodukte of kook kan vinnig vir my te veel voel by die huis of by die skool.",
          "Ek merk reuke op wat ander mense dikwels mis, en dit kan my aflei of pla.",
          "Ek vermy sommige kosse omdat die smaak of nasmaak te sterk of onaangenaam voel.",
          "Ek verkies sagte of bekende smake en vind baie pittige, bitter of intense smake ongemaklik.",
          "Ek geniet sterk of interessante reuke, soos essensiële olies, bak, parfuum of vars buite lug.",
          "Ek soek dikwels aangename geure — byvoorbeeld kerse, geur, kruie of gegeurde drankies.",
          "Ek geniet sterk smake, soos pittige, suur, sout of sterk gekruide kosse.",
          "Ek hou daarvan om nuwe smake te probeer, en raak verveeld wanneer kos te flou smaak.",
        ],
        parent: [
          "Sterk reuke, soos parfuum, skoonmaakprodukte of kookreuke, voel vinnig vir my kind te veel.",
          "My kind merk reuke op wat ander mense dikwels mis, en dit kan hulle aflei of pla.",
          "My kind vermy sekere kosse omdat die smaak of nasmaak te sterk of onaangenaam voel.",
          "My kind verkies sagte of bekende smake en vind baie pittige, bitter of intense smake ongemaklik.",
          "My kind geniet sterk of interessante reuke, soos essensiële olies, bak, parfuum of vars buite lug.",
          "My kind soek dikwels aangename geure op — byvoorbeeld kerse, geur, kruie of gegeurde drankies.",
          "My kind geniet sterk smake, soos pittige, suur, sout of sterk gekruide kosse.",
          "My kind hou daarvan om nuwe smake te probeer, en raak verveeld wanneer kos te flou voel.",
        ],
      },
    },
  },
  {
    id: "everyday",
    icon: "🌿",
    types: ["sensitive", "seeking", "sensitive", "sensitive"],
    copy: {
      en: {
        title: "Everyday Sensory Moments",
        shortTitle: "Everyday",
        description: "These questions explore responses when several sensory experiences happen at once.",
        blurb: "Coping when several senses are busy at once.",
      },
      af: {
        title: "Alledaagse Sensoriese Oomblikke",
        shortTitle: "Alledaags",
        description: "Hierdie vrae ondersoek reaksies wanneer verskeie sensoriese ervarings tegelyk plaasvind.",
        blurb: "Klaarkom wanneer verskeie sintuie tegelyk besig is.",
      },
    },
    questions: {
      en: {
        adult: [
          "Busy places, such as shopping centres or restaurants, leave me feeling tired or drained.",
          "I enjoy being around lots of people and social activity.",
          "I prefer quieter environments and small groups to large gatherings.",
          "After spending time in a busy environment, I usually need quiet time to recharge.",
        ],
        teen: [
          "Busy places like the school hall, shopping centres or restaurants leave me feeling tired or drained.",
          "I enjoy being around lots of people and social activity at school or at home.",
          "I prefer quiet places or spending time with one or two people instead of a big group.",
          "After a busy school day or busy time at home, I usually need some quiet time to recharge.",
        ],
        parent: [
          "Busy places, such as shopping centres or restaurants, leave my child feeling tired or drained.",
          "My child enjoys being around lots of people and social activity.",
          "My child prefers quieter environments and small groups to large gatherings.",
          "After spending time in a busy environment, my child usually needs quiet time to recharge.",
        ],
      },
      af: {
        adult: [
          "Besige plekke, soos winkelsentrums of restaurante, laat my moeg of uitgeput voel.",
          "Ek geniet dit om tussen baie mense en sosiale aktiwiteit te wees.",
          "Ek verkies stiller omgewings en klein groepies bo groot byeenkomste.",
          "Nadat ek tyd in ’n besige omgewing deurgebring het, het ek gewoonlik stilte nodig om te herlaai.",
        ],
        teen: [
          "Besige plekke soos die skoolsaal, winkelsentrums of restaurante laat my moeg of uitgeput voel.",
          "Ek geniet dit om by die skool of by die huis tussen baie mense en sosiale aktiwiteit te wees.",
          "Ek verkies stil plekke of om met een of twee mense te kuier eerder as met ’n groot groep.",
          "Ná ’n besige skooldag of besige tyd by die huis het ek gewoonlik stiltetyd nodig om te herlaai.",
        ],
        parent: [
          "Besige plekke, soos winkelsentrums of restaurante, laat my kind moeg of uitgeput voel.",
          "My kind geniet dit om tussen baie mense en sosiale aktiwiteit te wees.",
          "My kind verkies stiller omgewings en klein groepies bo groot byeenkomste.",
          "Nadat my kind tyd in ’n besige omgewing deurgebring het, het hulle gewoonlik stiltetyd nodig om te herlaai.",
        ],
      },
    },
  },
];

const SENSORY_DOMAIN_IDS = DOMAIN_DEFINITIONS.map((domain) => domain.id);

function getQuestionnaireUi(language = "en") {
  return QUESTIONNAIRE_UI[LANGUAGES.includes(language) ? language : "en"];
}

function getConsentBundle(language = "en", respondent = "adult") {
  const safeLanguage = LANGUAGES.includes(language) ? language : "en";
  const safeRespondent = RESPONDENT_TYPES.includes(respondent) ? respondent : "adult";
  return CONSENT_COPY[safeLanguage]?.[safeRespondent] || CONSENT_COPY.en.adult;
}

function getConsentItems(language = "en", respondent = "adult") {
  return getConsentBundle(language, respondent).required;
}

function getSharingConsentItems(language = "en", respondent = "adult", lifeContext = null) {
  const bundle = getConsentBundle(language, respondent);
  let items =
    respondent === "adult" && lifeContext === "work" && Array.isArray(bundle.sharingWork)
      ? bundle.sharingWork
      : bundle.sharing || [];

  // Parent / school sharing applies to teenagers only — never show these for adult self-report.
  if (respondent === "adult") {
    items = items.filter((item) => item.id !== "parents" && item.id !== "school");
  }

  return items;
}

function createEmptySharingConsent(language = "en", respondent = "adult", lifeContext = null) {
  return Object.fromEntries(
    getSharingConsentItems(language, respondent, lifeContext).map((item) => [item.id, false])
  );
}

function getDemographics(language = "en", respondent = "adult") {
  const fields = DEMOGRAPHIC_COPY[language]?.[respondent] || DEMOGRAPHIC_COPY.en.adult;
  return fields.map(([id, label, type, required]) => ({ id, label, type, required }));
}

function getSensoryDomains(language = "en", respondent = "adult") {
  const safeLanguage = LANGUAGES.includes(language) ? language : "en";
  const safeRespondent = RESPONDENT_TYPES.includes(respondent) ? respondent : "adult";
  return DOMAIN_DEFINITIONS.map((domain) => ({
    id: domain.id,
    icon: domain.icon,
    title: domain.copy[safeLanguage].title,
    shortTitle: domain.copy[safeLanguage].shortTitle,
    description: domain.copy[safeLanguage].description,
    blurb: domain.copy[safeLanguage].blurb || "",
    questions: domain.questions[safeLanguage][safeRespondent].map((text, index) => ({
      text,
      type: domain.types[index],
    })),
  }));
}
