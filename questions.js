const LANGUAGES = ["en", "af"];
const RESPONDENT_TYPES = ["adult", "teen", "parent", "couple"];

const QUESTIONNAIRE_UI = {
  en: {
    shellTitle: "Sensory Screening Questionnaire",
    shellSubtitle: "Understanding sensory experiences, one gentle step at a time",
    introModalTitle: "Before you begin",
    introModalLead:
      "In this questionnaire you will simply answer yes or no questions. You may need to generalise a little — if you are unsure, ask yourself: if I had to choose, would this be a yes or a no?",
    introModalPurpose:
      "The idea is to identify sensory preferences — what you (or your child) tend to prefer and how the senses respond — so we can see how best to support you going forward.",
    introModalDisclaimer:
      "This is not a standardised assessment tool. It is a questionnaire used to guide therapy and to help increase self-awareness. It is in no way a diagnostic tool.",
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
    couple: "We're a couple",
    coupleDesc: "We each complete our own questionnaire — on this device or another — then compare and merge our profiles.",
    coupleHubTag: "Couples trail",
    coupleHubTitle: "Two questionnaires, one shared profile",
    coupleHubDesc:
      "Each of you completes a separate sensory questionnaire. You can do them at different times, on different phones or computers. When both are finished, we’ll bring your profiles together.",
    coupleSessionLabel: "Couple session code",
    coupleShareHint:
      "Send your partner their personal link. They can open it later on any device. When they finish, they can send you their completion code (or you can paste it here) so both results live in this session.",
    couplePartnerA: "Partner 1",
    couplePartnerB: "Partner 2",
    coupleNamePlaceholder: "First name (optional)",
    coupleStatusNotStarted: "Not started",
    coupleStatusInProgress: "In progress",
    coupleStatusComplete: "Complete",
    coupleStart: "Start questionnaire",
    coupleContinue: "Continue questionnaire",
    coupleViewResults: "View my results",
    coupleCopyLink: "Copy my link",
    coupleLinkCopied: "Link copied",
    coupleExport: "Copy completion code",
    coupleExportCopied: "Completion code copied",
    coupleExportHint: "Paste this into the couple hub on another device to add these results to the shared session.",
    coupleImportTitle: "Add a partner’s results from another device",
    coupleImportDesc: "Paste the completion code they copied after finishing.",
    coupleImportPlaceholder: "Paste completion code here…",
    coupleImportBtn: "Import results",
    coupleImportOk: "Partner results imported.",
    coupleImportBad: "That code could not be read. Ask your partner to copy it again.",
    coupleImportMismatch: "That code belongs to a different couple session.",
    coupleBothReady: "Both questionnaires are complete.",
    coupleViewMerge: "View combined couple profile",
    coupleWaitingOther: "Waiting for the other partner to finish.",
    couplePrint: "Download / print combined report",
    coupleCombinedTitle: "Submit your combined couple report",
    coupleCombinedLead:
      "You are the last partner to finish. Submit and combine both questionnaires so Soulful Sensory OT receives your shared report.",
    coupleCombinedSubmit: "Submit and combine my results with my partner",
    coupleCombinedSending: "Sending your combined couple report to the therapist…",
    coupleCombinedSent: "Your combined couple report was sent successfully.",
    coupleCombinedError:
      "We couldn’t send your combined couple report automatically. Please message Cayley on WhatsApp to let her know you’ve finished, and try Send again.",
    coupleNextStepsTitle: "What happens next",
    coupleNextStepsLead:
      "You’ve finished your part. Your partner still needs to complete their own questionnaire. When they finish, they can submit and combine both results for your OT.",
    coupleNextStep1:
      "Copy your partner’s link and send it to them (WhatsApp, email, or text). They can open it later on their own phone or computer.",
    coupleNextStep2:
      "Also copy your completion code and keep it somewhere safe — or send it to them. If they finish on another device, this code lets their results join the same couple session.",
    coupleNextStep3:
      "When they have finished, ask them to copy their completion code and send it back to you — or have them submit and combine from their results screen.",
    coupleNextStep4:
      "Return to the couple hub, paste their code under “Add a partner’s results from another device” if needed, then open the combined couple profile and submit the shared report.",
    coupleNextStepsSameDevice:
      "If your partner will use this same device: go back to the couple hub and start their questionnaire when they are ready. After they finish, they can submit and combine both results.",
    coupleCopyPartnerLink: "Copy partner’s link",
    couplePartnerLinkCopied: "Partner’s link copied",
    coupleBackToHub: "Back to couple hub",
    coupleMergeTitle: "Your combined sensory profiles",
    coupleMergeDesc: "Side-by-side snapshots of how each of you tends to respond. Use this as a starting point for conversation — your OT can explore the detail with you.",
    coupleCompareTitle: "How your sensory preferences meet",
    coupleCompareIntro:
      "These comparisons draw on your answers about vision, movement, taste, touch and how you each recharge — useful starting points for shared spaces, activity, meals, affection and downtime.",
    coupleCompareVisualTitle: "Visual clutter & shared spaces",
    coupleCompareMovementTitle: "Movement, intensity & thrill-seeking",
    coupleCompareTasteTitle: "Taste, flavour & cooking together",
    coupleCompareTouchTitle: "Touch, affection & personal space",
    coupleCompareRegulateTitle: "How each of you regulates and recharges",
    coupleCompareWorkTitle: "Work situations & after-work needs",
    coupleCompareWorkIntro:
      "This compares where and how you each work, your everyday sensory needs, and what you tend to need after the workday — including where you can support each other, and where one of you may need to meet a need independently.",
    coupleWorkBucketTitle: "Work, sensory load & your sensory bucket",
    coupleWorkBucketLead:
      "Work is one of the biggest contributors to your overall sensory experience because a significant portion of your week is spent in your work environment. The type of work you do, your working hours, social demands, physical activity, noise levels, amount of change and opportunities for quiet or recovery can all influence how quickly your sensory bucket fills.",
    coupleWorkBucketInsightLabel: "Key idea",
    coupleWorkBucketInsight:
      "A person’s sensory needs do not necessarily change because of their job — but their capacity for additional sensory input can change throughout the day.",
    coupleWorkBucketInsightNote:
      "When your sensory bucket becomes fuller, you may have less capacity to tolerate input that you would normally manage comfortably.",
    coupleWorkBucketBridgeBefore: "Your work environment can also either",
    coupleWorkBucketBridgeEmphasis: "meet or leave unmet your natural sensory needs",
    coupleWorkBucketUnderLabel: "When work underfills",
    coupleWorkBucketUnderText:
      "A sensory-seeking or highly social person who works alone from home in a quiet environment may receive too little movement, social interaction and stimulation during the day. They may therefore have a stronger need to get out, socialise or seek stimulation after work.",
    coupleWorkBucketOverLabel: "When work overfills",
    coupleWorkBucketOverText:
      "Someone who is more socially reserved and works in a busy open-plan environment — particularly in a people-focused or helping profession — may have their social, auditory and emotional sensory buckets filled very quickly. They may benefit from quieter independent work, administrative tasks, a private workspace or occasional work-from-home days.",
    coupleWorkBucketSystemLabel: "Across the senses",
    coupleWorkBucketSystemBefore:
      "The same principle applies to individual sensory systems. An auditory-seeking person may enjoy sound and conversation, but if their job involves continuous talking, background noise and a busy environment,",
    coupleWorkBucketSystemEmphasis:
      "their auditory bucket may become full by the end of the working day",
    coupleWorkBucketSystemAfter:
      "At home they may then seek quiet and become much less tolerant of additional noise — not because their profile has changed, but because",
    coupleWorkBucketSystemEmphasisEnd: "their available capacity has already been used",
    coupleWorkBucketCloseBefore:
      "Understanding your work environment helps identify whether your daily routine is",
    coupleWorkBucketCloseEmphasis: "meeting, exceeding or leaving gaps in your sensory needs",
    coupleWorkBucketCloseAfter:
      "Small adjustments — incorporating movement, varying social interaction, creating quieter periods or changing your workspace — may help you keep a more balanced sensory bucket through the day and reduce the need for significant recovery afterwards.",
    coupleCompareThriveTitle: "What each of you needs to thrive",
    coupleCompareThriveIntro:
      "A short snapshot for each partner, drawn from the patterns above — use it as a practical checklist at home and after work.",
    coupleCompareConflictTitle: "Possible areas of conflict due to sensory differences",
    coupleCompareConflictIntro:
      "When sensory needs pull in opposite directions, the same home, meal, hug or Saturday plan can feel connecting for one of you and draining for the other. These are common friction points — not proof that either of you is “difficult.” Use them as conversation starters.",
    coupleCompareConflictTips: "Try this",
    coupleCompareParentingTitle: "Parenting & supporting each other’s recharge",
    coupleCompareParentingIntro:
      "When you are parents, children’s noise, touch and constant demand can empty a sensory battery quickly. This section looks at how you can protect each other’s recharge time — especially if one of you is more touch-sensitive or sound-sensitive.",
    coupleCompareWeek: "During the week",
    coupleCompareWeekend: "Over the weekend",
    coupleCompareTogether: "Together",
    coupleMergeIntroTitle: "Understanding sensory needs together",
    coupleMergeIntroLead:
      "A gentle guide to why your differences matter — and how awareness can strengthen your relationship.",
    coupleMergeIntroP1:
      "Every person experiences the world through their senses differently — and in a relationship, those differences matter. What feels calming to one partner can feel draining to another; what one person needs more of, the other may need less of. Neither is wrong. Both are real.",
    coupleMergeIntroP2:
      "Similar sensory needs can feel easy and natural together. Different needs are not a flaw in your relationship — they can become a strength when you understand them. One partner’s steadiness can ground the other; one partner’s energy can invite joy and movement. Complementing and contrasting sensory styles can balance a home, a routine and a shared life.",
    coupleMergeIntroP3:
      "It begins with awareness: noticing your own sensory patterns — how light, noise, touch, movement, taste and downtime affect your mood, energy and patience. Then extending that same curiosity to your partner: what fills their cup, what empties it, and what they need after a long day.",
    coupleMergeIntroP4:
      "When sensory needs go unnoticed or unmet, the impact is rarely only physical. It shows up in irritability, withdrawal, tension or conflict that seems to be about something else — but is often rooted in overload or under-stimulation. Many couples already support each other in small ways without realising that is exactly what they are doing.",
    coupleMergeIntroP5:
      "This report is a starting point for conversation, not a verdict. With empathy, clear communication and small practical adjustments, you can support each other more intentionally — and grow as a couple who understands not only what you share, but how you differ.",
    coupleSenseQuoteLabel: "Why this sense matters for couples",
    coupleSenseQuoteVisual:
      "The spaces we share become the backdrop to our relationship — what we see around us shapes how safe, calm or overwhelmed we feel at home.",
    coupleSenseWhyVisual:
      "Visual input is often underestimated in couples. Clutter, lighting or a busy environment can fill one partner’s sensory bucket while the other barely notices. Naming what you each need from shared spaces is one of the quickest ways to reduce friction at home.",
    coupleSenseQuoteMovement:
      "Movement is not just exercise — for many people it is how the nervous system resets, focuses and finds calm.",
    coupleSenseWhyMovement:
      "Partners often differ in how much movement, intensity or thrill they need. One may crave activity to decompress while the other needs stillness. Understanding this helps you plan weekends, holidays and daily routines without one person feeling dragged along or held back.",
    coupleSenseQuoteTaste:
      "Sharing food is one of the oldest languages of care — taste and smell carry memory, comfort and connection.",
    coupleSenseWhyTaste:
      "Meal preferences can be deeply sensory, not merely picky. Spice, texture or strong smells can overwhelm a sensitive system, while a seeking partner may want variety and intensity. Cooking and eating together works best when you talk about what feels ‘enough’ versus ‘too much’.",
    coupleSenseQuoteTouch:
      "Touch can speak louder than words — and the absence of the right touch at the right time can leave a partner feeling unseen.",
    coupleSenseWhyTouch:
      "Personal space, affection and physical closeness are core sensory experiences in a relationship. One partner may need more touch to feel connected; another may need more distance to feel regulated. Neither is rejection — it is nervous-system wiring.",
    coupleSenseQuoteRegulate:
      "Rest is not laziness — it is the body’s way of refilling the capacity to connect, listen and show up for each other.",
    coupleSenseWhyRegulate:
      "How you each recharge after work, on weekends and during stress is often where couples collide quietly. One may need solitude; the other may need people, movement or noise. Protecting each other’s recovery — even when it looks different — is one of the most loving things you can do.",
    coupleClosingQuote:
      "You don’t have to experience the world in the same way to experience it well together. When couples understand each other’s sensory needs, communicate openly and meet each other halfway, their differences can become a strength rather than a source of conflict.",
    coupleWorkTag: "Work & home life",
    coupleWorkTitle: "A few questions about work",
    coupleWorkDesc:
      "This short section helps compare how work shapes your energy, downtime and home life. If you do not currently work (for example you mainly look after children or the home), you can skip the work questions.",
    coupleWorkEmploymentLabel: "Do you currently work (paid employment)?",
    coupleWorkEmploymentYes: "Yes, I work",
    coupleWorkEmploymentNo: "No — I don’t currently work / I mainly look after children or the home",
    coupleWorkSkipNote: "We’ll only ask the parenting question below, then you can continue.",
    coupleWorkLocationLabel: "I work…",
    coupleWorkLocationOffice: "At the office",
    coupleWorkLocationHome: "At home",
    coupleWorkLocationBoth: "Both office and at home",
    coupleWorkLocationOther: "Other",
    coupleWorkLocationOtherPlaceholder: "Please describe…",
    coupleWorkWithLabel: "I work…",
    coupleWorkWithPeople: "With people",
    coupleWorkWithAlone: "Alone",
    coupleWorkWithScreens: "On screens",
    coupleWorkWithScreensPeople: "Screens and people combined",
    coupleWorkWithOther: "Other",
    coupleWorkWithOtherPlaceholder: "Please describe…",
    coupleWorkHoursLabel: "My working hours look like…",
    coupleWorkHoursPlaceholder: "e.g. 8:00–16:30, shift work, mornings only…",
    coupleWorkEndOfDayLabel: "At the end of a working day I like to:",
    coupleWorkEndOfDayHint: "You can choose more than one.",
    coupleWorkEndGetOut: "Get out",
    coupleWorkEndSitRelax: "Just sit and relax",
    coupleWorkEndWithPeople: "Do something with other people",
    coupleWorkEndAlone: "Be alone",
    coupleWorkRechargeLabel: "The best way for me to recharge after a long day of work is…",
    coupleWorkRechargeHint: "You can choose more than one.",
    coupleWorkRechargeActive: "To be active and outdoors",
    coupleWorkRechargeHome: "To relax at home doing something I love",
    coupleWorkRechargeOthersHome: "To spend time with others at home",
    coupleWorkRechargeOthersOut: "To spend time with others outside of the home",
    coupleWorkRechargeOther: "Other",
    coupleWorkRechargeOtherPlaceholder: "Please describe…",
    coupleWorkSaturdayLabel:
      "If you have had a fairly busy week of work, what would a recharging Saturday look like for you (you can be selfish)?",
    coupleWorkSaturdayPlaceholder: "Describe your ideal recharging Saturday…",
    coupleWorkParentLabel: "I am a parent",
    coupleWorkParentYes: "Yes",
    coupleWorkParentNo: "No",
    coupleWorkRequired: "Please complete the work section before continuing.",
    coupleWorkRequiredEmployment: "Please choose whether you currently work.",
    coupleWorkResultsTitle: "Work & home life",
    coupleMergeBack: "Back to couple hub",
    coupleYourTurn: "You are completing as",
    coupleSavedLocal:
      "Progress for this couple session is saved in this browser. Use each partner’s link and completion codes so the other device can join the same session.",
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
    idealSaturdayHomeClose:
      "By understanding your sensory needs, you can create a home and family environment that supports regulation, healthy relationships, and everyday wellbeing.",
    teenTrailOverviewQuote:
      "Your senses are how you meet the world — and how you learn what helps you feel like yourself again.",
    teenTrailOverviewIntro:
      "Your sensory systems are not just about sound, touch, or movement — they are part of how you manage emotions too. When you feel overwhelmed, anxious, or stressed, your body is often telling you what it needs more of, or less of. Knowing your sensory pattern helps you find ways to switch off, refill your bucket, get back to the things you love, and figure out what matters to you and what makes you tick.",
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
    profileTitle: "Your sensory trail profile",
    profileTitleParent: "Your child’s sensory trail profile",
    profileIntro: "A clear reading of the sensory patterns highlighted in this screening. These results are descriptive and are not a diagnosis.",
    profileIntroParent:
      "A clear reading of the sensory patterns highlighted in this screening — written for you as the parent. These results are descriptive and are not a diagnosis.",
    parentReportIntroTitle: "Reading your child’s trail",
    parentReportIntroLead: "Every child experiences the world in their own way.",
    parentReportIntroP1:
      "This report maps how your child tends to notice, seek, and recover from sensory input at home and through the day.",
    parentReportIntroP2:
      "Use it as a shared language with your family and care team — a guide for what helps, what overwhelms, and where small changes can make everyday life easier.",
    parentReportIntroP3:
      "There is no right or wrong trail. Understanding your child’s pattern is the first step toward supporting them with more ease.",
    parentClosingQuote:
      "When we understand a child’s sensory trail, we can walk beside them with more patience, flexibility, and care.",
    overallPattern: "Overall pattern",
    sensitiveSignals: "sensitive signals",
    seekingSignals: "seeking signals",
    descriptiveMap: "This is a descriptive map of the answers — not a diagnosis.",
    overallScoreLabel: "Overall score",
    overallScoreNote: "Every question in this screening added together into one reading.",
    overallSensitiveTotal: "Sensitive / avoiding",
    overallNeutralTotal: "Sensory neutral",
    overallSeekingTotal: "Sensory seeking",
    overallBalanceLabel: "Overall balance",
    overallSystemsLabel: "How the senses split",
    teenScoreBoardKicker: "Overall reading",
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
    scoreLeanSensitiveShort: "−",
    scoreLeanNeutralShort: "Balanced",
    scoreLeanSeekingShort: "+",
    thresholdLegend:
      "Low threshold = notices input quickly (sensitive). Medium = more typical / mixed. High threshold = needs more input (seeking).",
    settingBridgeKicker: "Next",
    settingBridgeHeading: "Where your senses meet everyday life",
    settingBridgeQuoteHome:
      "Understanding your sensory needs is not about changing who you are — it’s about creating an environment where you can thrive.",
    settingBridgeQuoteWork:
      "Understanding your sensory needs is not about changing who you are — it’s about creating an environment where you can thrive.",
    settingBridgeCredit: "Soulful Sensory OT",
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
    teenCrewKicker: "Your Sensory Trail Character",
    teenCrewTitle: "Your Sensory Trail Character",
    teenCrewTitleParent: "Your child’s Sensory Trail Character",
    teenCrewOverviewTitle: "Your Sensory Trail Profile",
    teenCrewOverviewTitleParent: "Your child’s Sensory Trail Profile",
    teenCrewMatchTitle: "Your matched trail",
    teenCrewMatchTitleParent: "Your child’s matched trail",
    teenCrewMatchLead:
      "Based on the overall score from this screening, here is the trail style that fits your answers most closely.",
    teenCrewMatchLeadParent:
      "Based on the overall score from this screening, here is the trail style that fits your child’s answers most closely.",
    teenCrewDescriptionTitle: "Your matched trail description",
    teenCrewDescriptionTitleParent: "Your child’s matched trail description",
    teenCrewIntro:
      "We all experience the world differently. Here are the three trail styles — then which one your answers matched most closely.",
    teenCrewIntroParent:
      "We all experience the world differently. Here are the three trail styles — then which one your child’s answers matched most closely.",
    teenCrewSummaryAria:
      "Infographic of the three sensory trail profiles: Sensory Observer, Sensory Adaptor, and Sensory Explorer",
    teenCrewYouAre: "You are",
    teenCrewYouAreParent: "Your child is",
    teenCrewBadge: "That’s you",
    teenCrewBadgeParent: "That’s them",
    teenCrewDetailTitle: "Your matched trail",
    teenCrewDetailTitleParent: "Your child’s matched trail",
    teenCrewTraitsTitle: "Top traits of your sensory trail character",
    teenCrewCrewTitle: "The three trail styles",
    teenCrewCrewIntro:
      "Every crew needs all three: the Explorer who seeks more input, the Observer who notices detail quickly, and the Adaptor who flexes in the middle.",
    teenCrewWhyTitle: "Why every summit needs all three",
    teenCrewWhyBody:
      "The Sensory Explorer (higher sensory threshold) has the courage and energy to go first — checking the route ahead and seeing if it’s safe to climb. The Sensory Observer (lower sensory threshold) picks up the animals, the weather shift, new smells, how the trail snacks taste, and any holes or loose stones before the crew steps into them — and may need steadier breaks along the way. The Sensory Adaptor (medium / mixed threshold) reads the group and fits where they are needed — surging forward, slowing down, or holding the middle of the rope so the whole crew stays together.",
    teenCrewFooter:
      "There is no right or wrong profile. Your trail is unique — this is a descriptive map, not a diagnosis.",
    teenCrewFooterParent:
      "There is no right or wrong profile. Your child’s trail is unique — this is a descriptive map, not a diagnosis.",
    briefScoresKicker: "Your sensory scores",
    briefScoresKickerParent: "Your child’s sensory scores",
    briefScoresTitle: "Results at a glance",
    briefScoresIntro:
      "A quick view of the overall pattern and how each sense leaned. This is descriptive, not a diagnosis.",
    briefScoresIntroParent:
      "A quick view of the overall pattern and how each sense leaned. This is descriptive, not a diagnosis.",
    briefScoresHomeQuote:
      "Home is where your nervous system spends much of its time recovering. Understanding your sensory preferences allows you to intentionally create spaces and routines that promote calm, comfort, and emotional wellbeing.",
    trailInterpretSectionLabel: "Interpretation",
    senseSupportKicker: "Support by sense",
    senseSupportTitle: "How to support each sensory system",
    senseSupportTitleParent: "How to support each of your child’s sensory systems",
    senseSupportIntro:
      "Practical supports matched to how each sense scored — short, specific, and ready to use.",
    senseSupportIntroWork:
      "Practical work supports matched to how each sense scored — including how to prepare before work, what helps during the day, and how to decompress afterwards.",
    senseSupportIntroHome:
      "Practical home supports matched to how each sense scored — including rooms, routines, and how you set up the house.",
    senseSupportIntroParent:
      "Practical supports matched to how each of your child’s senses scored — short, specific, and ready to use.",
    senseSupportHowLabel: "Try this",
    senseSupportLeanLabel: "Scored",
    senseSupportIntroTeen:
      "Your senses at school and at home — more options, matched to how you scored.",
    senseSupportSchoolKicker: "At school",
    senseSupportSchoolTitle: "Your school moves",
    senseSupportSchoolLead:
      "Cheat-sheet energy. Pick one move, try it for about two minutes, then check if the lesson feels easier.",
    senseSupportHomeChapterKicker: "At home",
    senseSupportHomeChapterTitle: "Your home setup",
    senseSupportHomeChapterLead:
      "Same senses after the bell — your room, homework, and how you recover.",
    senseSupportModeLow: "Turn it down",
    senseSupportModeMid: "Mix it",
    senseSupportModeHigh: "Turn it up",
    senseSupportMoveLabel: "Moves",
    teenCrewExplorerName: "Sensory Explorer",
    teenCrewExplorerTag: "High threshold – Sensory seeker",
    teenCrewExplorerSummary:
      "You seek out experiences, movement, and stimulation to feel energised and engaged.",
    teenCrewExplorerSummaryParent:
      "They seek out experiences, movement, and stimulation to feel energised and engaged.",
    teenCrewExplorerSummaryTeen:
      "In learning and free time — at a campus, online at home, or mixed — you often feel best with movement, variety, and something interesting to do.",
    teenCrewExplorerBody:
      "Your sensory threshold sits higher — you often like more sensory input, not less. Busy days, new places, movement, sound and fresh sights tend to wake you up. Stillness can feel flat, so you go looking for the next thing to do and see. On the mountain you are the one who hikes ahead with plenty of energy, can keep going for a good stretch, tests the route, and comes back with the report: it’s wild up there — and worth it.",
    teenCrewExplorerBodyParent:
      "Your child’s sensory threshold sits higher — they often like more sensory input, not less. Busy days, new places, movement, sound and fresh sights tend to wake them up. Stillness can feel flat, so they go looking for the next thing to do and see. On the mountain they are the one who hikes ahead with plenty of energy, can keep going for a good stretch, tests the route, and comes back with the report: it’s wild up there — and worth it.",
    teenCrewExplorerBodyTeen:
      "Your sensory threshold sits higher — you usually need more input to feel switched on. Long still lessons or quiet study blocks (on campus or online at home) and slow hobbies can feel flat, while sport, music, gaming with friends, drama, art that keeps your hands busy, or trying new places tends to wake you up. You may learn better after movement, a break, PE, a walk around the house, or a quick stretch than after sitting for a long stretch. Hobbies with movement, sound, challenge or social energy often fit you well — and restlessness is often your body asking for more input, not “not trying.”",
    teenCrewExplorerRole:
      "Higher-threshold scout — loves input, busyness and new terrain; has the energy to keep going and check if the path ahead is safe.",
    teenCrewExplorerRoleTeen:
      "Seeks movement, variety and stimulation — in learning, hobbies and with friends — to stay focused and energised.",
    teenCrewExplorerTraits: [
      "Likes new activities and does well with change.",
      "Enjoys a lot of sensory stimulation, social environments, and exploring new places.",
      "Does not get sensory overload easily.",
      "Can get bored easily in quiet, calm, and predictable settings.",
      "Enjoys a challenge and fast-paced environments.",
      "Often brings a sense of excitement and energy.",
      "Curious — likes to figure things out and is inquisitive.",
    ],
    teenCrewExplorerTraitsTeen: [
      "Likes new activities and does well with change.",
      "Enjoys a lot of sensory stimulation, social environments, and exploring new places.",
      "Does not get sensory overload easily.",
      "Can get bored easily in quiet, calm, and predictable settings.",
      "Enjoys a challenge and fast-paced environments.",
      "Often brings a sense of excitement and energy.",
      "Curious — likes to figure things out and is inquisitive.",
    ],
    teenCrewAdaptorName: "Sensory Adaptor",
    teenCrewAdaptorTag: "Medium threshold – Balanced",
    teenCrewAdaptorSummary:
      "You can adapt to different situations and find your balance between stimulation and rest.",
    teenCrewAdaptorSummaryParent:
      "They can adapt to different situations and find their balance between stimulation and rest.",
    teenCrewAdaptorSummaryTeen:
      "Your needs shift across the learning day and your hobbies — sometimes you want more buzz, sometimes you need things quieter.",
    teenCrewAdaptorBody:
      "Your sensory threshold sits in the flexible middle — sometimes you want more input, sometimes you need less. You shift with home life, school or work, the weather on the trail and the people around you. On the mountain you can climb with the explorers when the day asks for energy, or slow down with the observers when it asks for care — you fit where the crew needs you, and that keeps everyone moving.",
    teenCrewAdaptorBodyParent:
      "Your child’s sensory threshold sits in the flexible middle — sometimes they want more input, sometimes they need less. They shift with home life, school, the weather on the trail and the people around them. On the mountain they can climb with the explorers when the day asks for energy, or slow down with the observers when it asks for care — they fit where the crew needs them, and that keeps everyone moving.",
    teenCrewAdaptorBodyTeen:
      "Your sensory threshold sits in the flexible middle — some lessons, friends and hobbies feel easy; others ask you to turn the volume up or down. That can be a busy campus day, a quiet online morning at home, or a study night after sport. You often do well when you can choose: headphones for focus, a walk before homework, a lively interest one day and a quieter one the next. Noticing which subjects, sports and hangouts leave you settled — and which leave you flat or overloaded — is more useful than one fixed label.",
    teenCrewAdaptorRole:
      "Medium-threshold middle — reads the group, matches the pace, and keeps high- and low-threshold hikers walking as one crew.",
    teenCrewAdaptorRoleTeen:
      "Flexes between busy and calm — in learning, hobbies and with friends — and does best with choices that match the day.",
    teenCrewAdaptorTraits: [
      "Flexible and able to adjust to different environments.",
      "Can enjoy both busy and quiet settings.",
      "Likes a balance.",
      "Likes social time, but also time to recharge in their own space.",
      "Is comfortable with variety.",
      "Practical — able to focus on what needs to be done despite changes around them.",
      "Likes both new activities and familiar ones they already know.",
    ],
    teenCrewAdaptorTraitsTeen: [
      "Flexible and able to adjust to different environments.",
      "Can enjoy both busy and quiet settings.",
      "Likes a balance.",
      "Likes social time, but also time to recharge in their own space.",
      "Is comfortable with variety.",
      "Practical — able to focus on what needs to be done despite changes around them.",
      "Likes both new activities and familiar ones they already know.",
    ],
    teenCrewObserverName: "Sensory Observer",
    teenCrewObserverTag: "Low threshold – Sensitive",
    teenCrewObserverSummary:
      "You notice the details others might miss and can be deeply aware of your environment.",
    teenCrewObserverSummaryParent:
      "They notice the details others might miss and can be deeply aware of their environment.",
    teenCrewObserverSummaryTeen:
      "You notice a lot in learning and hobbies — detail, mood and atmosphere — and quieter settings often help you do your best.",
    teenCrewObserverBody:
      "Your sensory threshold sits lower — you are very aware and pick things up quickly. A change in the weather, a new smell on the breeze, how the trail snacks taste, a bird call, a loose stone underfoot: it all registers. That awareness is a real strength on the mountain. You may also need more regular breaks during the hike so your system can settle before the next stretch — and when you do, the whole crew notices what they would have missed.",
    teenCrewObserverBodyParent:
      "Your child’s sensory threshold sits lower — they are very aware and pick things up quickly. A change in the weather, a new smell on the breeze, how the trail snacks taste, a bird call, a loose stone underfoot: it all registers. That awareness is a real strength on the mountain. They may also need more regular breaks during the hike so their system can settle before the next stretch — and when they do, the whole crew notices what they would have missed.",
    teenCrewObserverBodyTeen:
      "Your sensory threshold sits lower — you pick up noise, screens, bright light, textures, smells and people’s moods quickly, whether you learn on a busy campus or online at home. That awareness can be a real strength in subjects and hobbies that need careful noticing — art, music, reading, design, caring for others, detail work. Busy group calls, shared spaces or stacked demands can take more energy than they look like from the outside. After a full learning day you may need a quieter reset before homework, sport or social plans. Calmer clubs, softer study spaces and hobbies you enjoy without overload help you stay sharp rather than drained.",
    teenCrewObserverRole:
      "Lower-threshold lookout — spots detail fast (weather, smells, tastes, hazards) and benefits from steadier breaks along the trail.",
    teenCrewObserverRoleTeen:
      "Notices detail and atmosphere quickly — in learning and hobbies — and thrives with calmer spaces and steadier resets.",
    teenCrewObserverTraits: [
      "Likes to have their own space; not bothered by missing out on events.",
      "Intuitive — picks up people’s mood and energy quickly.",
      "Needs a calm and predictable environment.",
      "Chaos or unpredictability can create anxiety.",
      "Likes a heads-up before events and change.",
      "Prefers familiar activities and things they already know.",
      "Brings a sense of calm, a listening ear, and a grounding personality.",
      "Needs recovery time to recharge between activities.",
    ],
    teenCrewObserverTraitsTeen: [
      "Likes to have their own space; not bothered by missing out on events.",
      "Intuitive — picks up people’s mood and energy quickly.",
      "Needs a calm and predictable environment.",
      "Chaos or unpredictability can create anxiety.",
      "Likes a heads-up before events and change.",
      "Prefers familiar activities and things they already know.",
      "Brings a sense of calm, a listening ear, and a grounding personality.",
      "Needs recovery time to recharge between activities.",
    ],
    teenCrewCrewIntroTeen:
      "Every crew needs all three styles. Here’s how they often show up in learning (campus, online or mixed), hobbies and everyday teenage life — then which one your answers matched most closely.",
    teenCrewTraitsTitleTeen: "Top traits of your sensory trail character",
    teenCrewDetailTitleTeen: "Your matched trail",
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
    thankYouActivation:
      "Your screening was received, but the therapist inbox still needs a one-time email confirmation from FormSubmit. Check soulfulsensoryot@gmail.com (and Spam), click Activate/Confirm, then tap Send again.",
    thankYouFileProtocol:
      "This page was opened as a saved file, so email cannot send. Open it through a web address (for example a local server), complete again, or tap Send again from that address.",
    thankYouNetworkBlocked:
      "The browser blocked the email request — often an ad blocker or privacy extension. Pause the blocker for this site (or try another browser), then tap Send again.",
    thankYouRetry: "Send again",
    thankYouHome: "Back to home",
    summaryKicker: "Screening complete",
    summaryTitle: "Thank you — your answers were received",
    summaryBannerLead: "A brief confirmation while your detailed sensory report stays with your therapist.",
    summaryIntro:
      "This is only a brief confirmation. A follow-up session with your therapist is needed to understand what your results mean and how they show up in everyday life.",
    summaryNextKicker: "Next step",
    summaryNextTitle: "Book a follow-up session",
    summaryNextBannerLead: "Walk through your full profile together on the trail ahead.",
    summaryNextBody:
      "Your therapist has the full sensory report. Book an online or in-person session with Soulful Sensory OT to walk through the detailed findings together.",
    summaryBookCta: "Book a follow-up session",
    summaryOverallKicker: "Overall pattern",
    summaryOverallNote: "This label is a starting point only — meaning and next steps are covered in your follow-up session.",
    summaryDomainsKicker: "Sense-by-sense glance",
    summaryDomainsTitle: "Pattern labels by sense",
    summaryDomainsNote: "These short labels are not a full interpretation. Your therapist will unpack them with you.",
    summaryTrailKicker: "Trail character",
    summaryTrailNote: "Your matched character is shared briefly here. The full trail profile is part of your feedback session.",
    summaryEditorTitle: "What’s included in the short report",
    summaryEditorLead:
      "Patients on a brief-report invite always see the completion note and follow-up prompt. Turn extras on only if you want them included.",
    summaryEditorLegend: "Optional short-report sections",
    summaryEditorOverall: "Overall pattern label",
    summaryEditorOverallHint: "Show the high-level pattern name only.",
    summaryEditorDomains: "Sense-by-sense glance",
    summaryEditorDomainsHint: "Show each sense with a short pattern label.",
    summaryEditorTrail: "Trail character name",
    summaryEditorTrailHint: "Show the matched character name when the trail profile applies.",
    summaryEditorNote: "Changes apply to all brief patient reports on this device.",
    summaryEditorBack: "Back to dashboard",
    inviteBanner: "Your answers will be sent securely to your therapist. After you finish, you’ll see a thank-you screen — results are shared with your therapist, not shown here.",
    inviteBannerBasic:
      "Your answers will be sent securely to your therapist. After you finish, you’ll see a brief confirmation — a follow-up session is needed to understand your results.",
    inviteBannerFull:
      "Your answers will be sent securely to your therapist. After you finish, you’ll also see your full sensory trail profile here.",
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
      "Personalise a short work report: choose which sections to include, edit the details, and add extra headings if needed. Sensory scores, workplace challenges, and recommendations can each be switched on or off before you print.",
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
    workReportScaleIntro:
      "Each sense is shown on a three-part scale: low, medium and high threshold.",
    workReportScaleLow: "Low",
    workReportScaleMid: "Medium",
    workReportScaleHigh: "High",
    workReportScaleLowHint: "notices input quickly",
    workReportScaleMidHint: "typical / mixed",
    workReportScaleHighHint: "needs more input",
    workReportScaleStatusLow: "Low threshold",
    workReportScaleStatusMid: "Medium threshold",
    workReportScaleStatusHigh: "High threshold",
    workReportPresentationLabel: "How this can show up at work",
    workReportPhasePrepare: "Before the workday",
    workReportPhaseDuring: "During the workday",
    workReportPhaseRecover: "After work",
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
      "Personalise this school letter: choose which sections to include, pick a sensory snapshot style, add typed notes, and create extra headings if needed. Then print a short report for teachers or support staff.",
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
    settingReportEditorEyebrow: "Customise this letter",
    settingReportEditorTitle: "Sections to include",
    settingReportEditorLead:
      "Turn sections on or off to shape what appears in the printed work or school report. The live preview updates as you choose.",
    settingReportEditorLegend: "Report sections",
    settingReportEditorDetailsHint: "Name, role/school, and reason for referral.",
    settingReportEditorAboutHint: "Short explanation of the sensory screening.",
    settingReportEditorOverloadHint: "Explains sensory overload and anxiety at school.",
    settingReportEditorReferralHint: "Referral / occupational therapy support wording.",
    settingReportEditorScoresHint: "Three-part sensory score scale (low, balanced, high).",
    settingReportEditorVisualHint: "Teen-friendly sensory snapshot graphic.",
    settingReportEditorChallengesHint: "How each sensory pattern can show up at work.",
    settingReportEditorRecsHint: "Work supports for before, during and after the workday.",
    settingReportEditorGeneralRecsHint: "General workplace supports list.",
    settingReportEditorNotesHint: "Optional typed notes for teachers or support staff.",
    settingReportEditorClosingLabel: "Closing note",
    settingReportEditorClosingHint: "Guidance disclaimer at the end of the letter.",
    settingReportCustomTitle: "Additional headings",
    settingReportCustomLead:
      "Add your own headings and paragraphs when this letter needs something extra.",
    settingReportCustomEmpty: "No custom headings yet.",
    settingReportCustomAdd: "Add heading",
    settingReportCustomRemove: "Remove",
    settingReportCustomHeadingLabel: "Custom section",
    settingReportCustomHeading: "Heading",
    settingReportCustomHeadingPlaceholder: "e.g. Classroom observations",
    settingReportCustomBody: "Content",
    settingReportCustomBodyPlaceholder: "Write the paragraph that should appear under this heading…",
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
    reportConclusionKicker: "Conclusion",
    reportConclusionTitle: "The trail ahead",
    reportConclusionBody:
      "You’ve found your sensory trail profile — a map, not a label. It offers clues about what helps you feel regulated, focused and supported, and what your nervous system might need from you. The next step isn’t to fit yourself into the world; it’s to learn how to support yourself within it.",
    reportConclusionBodyParent:
      "You’ve found your child’s sensory trail profile — a map, not a label. It offers clues about what helps them feel regulated, focused and supported, and what their nervous system might need from you. The next step isn’t to fit them into the world; it’s to learn how to support them within it.",
    reportConclusionQuote:
      "When you understand your sensory needs, you understand yourself a little better.",
    reportConclusionQuoteParent:
      "When you understand your child’s sensory needs, you understand them a little better.",
    reportConclusionCredit: "Soulful Sensory OT",
  },
  af: {
    shellTitle: "Sensoriese Siftingsvraelys",
    shellSubtitle: "Verstaan sensoriese ervarings, een rustige tree op ’n slag",
    introModalTitle: "Voordat jy begin",
    introModalLead:
      "In hierdie vraelys hoef jy net ja/nee-vrae te beantwoord. Jy sal dalk ’n bietjie moet veralgemeen — as jy onseker is, vra jouself: as ek moet kies, sou dit ’n ja of ’n nee wees?",
    introModalPurpose:
      "Die doel is om sensoriese voorkeure te identifiseer — wat jy (of jou kind) verkies en hoe die sintuie reageer — sodat ons kan sien hoe om jou vorentoe die beste te ondersteun.",
    introModalDisclaimer:
      "Dit is nie ’n gestandaardiseerde assesseringshulpmiddel nie. Dit is ’n vraelys wat gebruik word om terapie te lei en selfbewustheid te help verhoog. Dit is geensins ’n diagnostiese hulpmiddel nie.",
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
    couple: "Ons is ’n paartjie",
    coupleDesc: "Elkeen voltooi ons eie vraelys — op hierdie toestel of ’n ander — en daarna vergelyk en saamvoeg ons profiele.",
    coupleHubTag: "Paartjie-roete",
    coupleHubTitle: "Twee vraelyste, een gedeelde profiel",
    coupleHubDesc:
      "Elkeen van julle voltooi ’n aparte sensoriese vraelys. Julle kan dit op verskillende tye, op verskillende fone of rekenaars doen. Wanneer albei klaar is, bring ons julle profiele bymekaar.",
    coupleSessionLabel: "Paartjie-sessiekode",
    coupleShareHint:
      "Stuur jou vennoot hul eie skakel. Hulle kan dit later op enige toestel oopmaak. Wanneer hulle klaarmaak, kan hulle hul voltooiingskode vir jou stuur (of jy kan dit hier plak) sodat albei resultate in hierdie sessie leef.",
    couplePartnerA: "Vennoot 1",
    couplePartnerB: "Vennoot 2",
    coupleNamePlaceholder: "Voornaam (opsioneel)",
    coupleStatusNotStarted: "Nog nie begin nie",
    coupleStatusInProgress: "Besig",
    coupleStatusComplete: "Klaar",
    coupleStart: "Begin vraelys",
    coupleContinue: "Gaan voort met vraelys",
    coupleViewResults: "Sien my resultate",
    coupleCopyLink: "Kopieer my skakel",
    coupleLinkCopied: "Skakel gekopieer",
    coupleExport: "Kopieer voltooiingskode",
    coupleExportCopied: "Voltooiingskode gekopieer",
    coupleExportHint: "Plak dit in die paartjie-spilpunt op ’n ander toestel om hierdie resultate by die gedeelde sessie te voeg.",
    coupleImportTitle: "Voeg ’n vennoot se resultate van ’n ander toestel by",
    coupleImportDesc: "Plak die voltooiingskode wat hulle na klaarmaak gekopieer het.",
    coupleImportPlaceholder: "Plak voltooiingskode hier…",
    coupleImportBtn: "Voer resultate in",
    coupleImportOk: "Vennoot se resultate is ingevoer.",
    coupleImportBad: "Daardie kode kon nie gelees word nie. Vra jou vennoot om dit weer te kopieer.",
    coupleImportMismatch: "Daardie kode behoort aan ’n ander paartjie-sessie.",
    coupleBothReady: "Albei vraelyste is klaar.",
    coupleViewMerge: "Sien gekombineerde paartjie-profiel",
    coupleWaitingOther: "Wag dat die ander vennoot klaarmaak.",
    couplePrint: "Aflaai / druk gekombineerde verslag",
    coupleCombinedTitle: "Dien julle gekombineerde paartjie-verslag in",
    coupleCombinedLead:
      "Jy is die laaste vennoot wat klaargemaak het. Dien in en kombineer albei vraelyste sodat Soulful Sensory OT julle gedeelde verslag ontvang.",
    coupleCombinedSubmit: "Dien in en kombineer my resultate met my vennoot",
    coupleCombinedSending: "Julle gekombineerde paartjie-verslag word aan die terapeut gestuur…",
    coupleCombinedSent: "Julle gekombineerde paartjie-verslag is suksesvol gestuur.",
    coupleCombinedError:
      "Ons kon nie julle gekombineerde paartjie-verslag outomaties stuur nie. Stuur asseblief vir Cayley ’n WhatsApp om te sê julle is klaar, en probeer Weer stuur.",
    coupleNextStepsTitle: "Wat gebeur nou",
    coupleNextStepsLead:
      "Jy het jou deel klaargemaak. Jou vennoot moet nog hul eie vraelys voltooi. Wanneer hulle klaarmaak, kan hulle albei resultate indien en kombineer vir julle OT.",
    coupleNextStep1:
      "Kopieer jou vennoot se skakel en stuur dit vir hulle (WhatsApp, e-pos of boodskap). Hulle kan dit later op hul eie foon of rekenaar oopmaak.",
    coupleNextStep2:
      "Kopieer ook jou voltooiingskode en hou dit veilig — of stuur dit vir hulle. As hulle op ’n ander toestel klaarmaak, laat hierdie kode hul resultate by dieselfde paartjie-sessie aansluit.",
    coupleNextStep3:
      "Wanneer hulle klaar is, vra hulle om hul voltooiingskode te kopieer en terug te stuur — of laat hulle vanaf hul resultate-skerm indien en kombineer.",
    coupleNextStep4:
      "Gaan terug na die paartjie-spilpunt, plak hul kode onder “Voeg ’n vennoot se resultate van ’n ander toestel by” indien nodig, open die gekombineerde paartjie-profiel, en dien die gedeelde verslag in.",
    coupleNextStepsSameDevice:
      "As jou vennoot hierdie selfde toestel gaan gebruik: gaan terug na die paartjie-spilpunt en begin hul vraelys wanneer hulle gereed is. Nadat hulle klaarmaak, kan hulle albei resultate indien en kombineer.",
    coupleCopyPartnerLink: "Kopieer vennoot se skakel",
    couplePartnerLinkCopied: "Vennoot se skakel is gekopieer",
    coupleBackToHub: "Terug na paartjie-spilpunt",
    coupleMergeTitle: "Julle gekombineerde sensoriese profiele",
    coupleMergeDesc: "Sy-aan-sy grepe van hoe elkeen van julle geneig is om te reageer. Gebruik dit as ’n beginpunt vir gesprek — julle arbeidsterapeut kan die besonderhede saam met julle verken.",
    coupleCompareTitle: "Hoe julle sensoriese voorkeure mekaar ontmoet",
    coupleCompareIntro:
      "Hierdie vergelykings kom uit julle antwoorde oor sig, beweging, smaak, tas en hoe elkeen herlaai — nuttige beginpunte vir gedeelde ruimtes, aktiwiteit, etes, toegeneentheid en stilte-tyd.",
    coupleCompareVisualTitle: "Visuele rommel & gedeelde ruimtes",
    coupleCompareMovementTitle: "Beweging, intensiteit & spanningsoeke",
    coupleCompareTasteTitle: "Smaak, geur & saam kook",
    coupleCompareTouchTitle: "Aanraking, toegeneentheid & persoonlike ruimte",
    coupleCompareRegulateTitle: "Hoe elkeen van julle reguleer en herlaai",
    coupleCompareWorkTitle: "Werksituasies & behoeftes ná werk",
    coupleCompareWorkIntro:
      "Hierdie vergelyk waar en hoe elkeen van julle werk, julle alledaagse sensoriese behoeftes, en wat julle ná die werkdag nodig het — insluitend waar julle mekaar kan ondersteun, en waar een van julle dalk ’n behoefte self moet vervul.",
    coupleWorkBucketTitle: "Werk, sensoriese lading & jou sensoriese emmer",
    coupleWorkBucketLead:
      "Werk is een van die grootste bydraers tot jou algehele sensoriese ervaring, omdat ’n beduidende deel van jou week in jou werksomgewing deurgebring word. Die tipe werk wat jy doen, jou werksure, sosiale eise, fisieke aktiwiteit, geraasvlakke, hoeveelheid verandering en geleenthede vir stilte of herstel kan alles beïnvloed hoe vinnig jou sensoriese emmer vol raak.",
    coupleWorkBucketInsightLabel: "Kernidee",
    coupleWorkBucketInsight:
      "’n Persoon se sensoriese behoeftes verander nie noodwendig as gevolg van hul werk nie — maar hul kapasiteit vir bykomende sensoriese inset kan deur die dag verander.",
    coupleWorkBucketInsightNote:
      "Wanneer jou sensoriese emmer voller word, mag jy minder kapasiteit hê om inset te verdra wat jy normaalweg gemaklik sou hanteer.",
    coupleWorkBucketBridgeBefore: "Jou werksomgewing kan ook óf jou natuurlike sensoriese behoeftes",
    coupleWorkBucketBridgeEmphasis: "bevredig, óf dit onvervul laat",
    coupleWorkBucketUnderLabel: "Wanneer werk te min gee",
    coupleWorkBucketUnderText:
      "’n Sensories-soekende of hoogs sosiale persoon wat alleen van die huis af in ’n stil omgewing werk, mag te min beweging, sosiale interaksie en stimulasie gedurende die dag ontvang. Hulle mag daarom ’n sterker behoefte hê om ná werk uit te gaan, sosiaal te wees of stimulasie te soek.",
    coupleWorkBucketOverLabel: "Wanneer werk te vol maak",
    coupleWorkBucketOverText:
      "Iemand wat sosiaal meer gereserveerd is en in ’n besige oopplan-omgewing werk — veral in ’n mense-gerigte of versorgende beroep — mag hul sosiale, ouditiewe en emosionele sensoriese emmers baie vinnig vol hê. Hulle mag baat by stiller onafhanklike werk, administratiewe take, ’n private werkplek of soms tuiswerk-dae.",
    coupleWorkBucketSystemLabel: "Oor die sintuie heen",
    coupleWorkBucketSystemBefore:
      "Dieselfde beginsel geld vir individuele sensoriese stelsels. ’n Ouditief-soekende persoon mag klank en gesprek geniet, maar as hul werk deurlopende praat, agtergrondgeraas en ’n besige omgewing behels,",
    coupleWorkBucketSystemEmphasis:
      "mag hul ouditiewe emmer teen die einde van die werkdag vol wees",
    coupleWorkBucketSystemAfter:
      "By die huis mag hulle dan stilte soek en baie minder verdraagsaam teenoor bykomende geraas wees — nie omdat hul profiel verander het nie, maar omdat",
    coupleWorkBucketSystemEmphasisEnd: "hul beskikbare kapasiteit reeds gedurende die dag gebruik is",
    coupleWorkBucketCloseBefore:
      "Om jou werksomgewing te verstaan help om te sien of jou daaglikse roetine jou sensoriese behoeftes",
    coupleWorkBucketCloseEmphasis: "bevredig, oorskry of gapings laat",
    coupleWorkBucketCloseAfter:
      "Klein aanpassings — beweging inbou, sosiale interaksie wissel, stiller periodes skep of jou werkplek verander — kan help om ’n meer gebalanseerde sensoriese emmer deur die dag te hou en die behoefte aan groot herstel daarna te verminder.",
    coupleCompareThriveTitle: "Wat elkeen van julle nodig het om te floreer",
    coupleCompareThriveIntro:
      "’n Kort greep vir elke vennoot, uit die patrone hierbo — gebruik dit as ’n praktiese kontrolelys by die huis en ná werk.",
    coupleCompareConflictTitle: "Moontlike konflikareas as gevolg van sensoriese verskille",
    coupleCompareConflictIntro:
      "Wanneer sensoriese behoeftes in teenoorgestelde rigtings trek, kan dieselfde huis, ete, drukkie of Saterdagplan vir die een verbindend voel en vir die ander uitputtend. Dit is algemene wrywingpunte — nie bewys dat een van julle “moeilik” is nie. Gebruik dit as gesprekbeginners.",
    coupleCompareConflictTips: "Probeer dit",
    coupleCompareParentingTitle: "Ouerskap & mekaar se herlaai ondersteun",
    coupleCompareParentingIntro:
      "Wanneer julle ouers is, kan kinders se geraas, aanraking en konstante eise ’n sensoriese battery vinnig leegmaak. Hierdie afdeling kyk hoe julle mekaar se herlaai-tyd kan beskerm — veral as een van julle meer tas-sensitief of klank-sensitief is.",
    coupleCompareWeek: "Gedurende die week",
    coupleCompareWeekend: "Oor die naweek",
    coupleCompareTogether: "Saam",
    coupleMergeIntroTitle: "Sensoriese behoeftes saam verstaan",
    coupleMergeIntroLead:
      "’n Sagte gids oor waarom julle verskille saak maak — en hoe bewustheid julle verhouding kan versterk.",
    coupleMergeIntroP1:
      "Elke persoon ervaar die wêreld deur hul sintuie anders — en in ’n verhouding maak daardie verskille saak. Wat vir een vennoot kalmerend voel, kan vir die ander uitputtend wees; wat die een meer nodig het, het die ander dalk minder nodig. Geen van die twee is verkeerd nie. Beide is eg.",
    coupleMergeIntroP2:
      "Soortgelyke sensoriese behoeftes kan natuurlik en maklik saam voel. Verskillende behoeftes is nie ’n gebrek in julle verhouding nie — hulle kan ’n sterkte word wanneer julle dit verstaan. Een vennoot se stadigheid kan die ander grond; een vennoot se energie kan vreugde en beweging nooi. Sensoriese style wat mekaar aanvul of kontrasteer, kan ’n huis, ’n roetine en ’n gedeelde lewe balanseer.",
    coupleMergeIntroP3:
      "Dit begin met bewustheid: let op jou eie sensoriese patrone — hoe lig, geraas, aanraking, beweging, smaak en stilte-tyd jou gemoed, energie en geduld beïnvloed. Brei dieselfde nuuskierigheid dan uit na jou vennoot: wat vul hul emmer, wat maak dit leeg, en wat het hulle nodig ná ’n lang dag.",
    coupleMergeIntroP4:
      "Wanneer sensoriese behoeftes onopgemerk of onvervul bly, is die impak selde net fisies. Dit wys as prikkelbaarheid, terugtrekking, spanning of konflik wat oor iets anders lyk — maar dikwels in oorlaai of onder-stimulasie gewortel is. Baie paartjies ondersteun mekaar reeds op klein maniere sonder om te besef dat dit presies is wat hulle doen.",
    coupleMergeIntroP5:
      "Hierdie verslag is ’n beginpunt vir gesprek, nie ’n oordeel nie. Met empatie, duidelike kommunikasie en klein praktiese aanpassings kan julle mekaar meer doelbewus ondersteun — en groei as ’n paartjie wat nie net verstaan wat julle deel nie, maar ook hoe julle verskil.",
    coupleSenseQuoteLabel: "Waarom hierdie sintuig vir paartjies saak maak",
    coupleSenseQuoteVisual:
      "Die spasies wat ons deel word die agtergrond van ons verhouding — wat ons om ons sien, vorm hoe veilig, kalm of oorweldig ons tuis voel.",
    coupleSenseWhyVisual:
      "Visuele inset word in paartjies dikwels onderskat. Rommel, beligting of ’n besige omgewing kan een vennoot se sensoriese emmer vul terwyl die ander skaars opmerk. Om te noem wat julle elk van gedeelde spasies nodig het, is een van die vinnigste maniere om wrywing tuis te verminder.",
    coupleSenseQuoteMovement:
      "Beweging is nie net oefening nie — vir baie mense is dit hoe die senuweestelsel herstel, fokus en kalmte vind.",
    coupleSenseWhyMovement:
      "Vennote verskil dikwels in hoeveel beweging, intensiteit of spanning hulle nodig het. Een mag aktiwiteit verkies om te herlaai terwyl die ander stilte nodig het. Om dit te verstaan help julle om naweke, vakansies en daaglikse roetines te beplan sonder dat een persoon meegesleep of teruggehou voel.",
    coupleSenseQuoteTaste:
      "Kos deel is een van die oudste tale van sorg — smaak en reuk dra herinnering, gemak en verbinding.",
    coupleSenseWhyTaste:
      "Maalvoorkeure kan diep sensories wees, nie net kieskeurig nie. Pittigheid, tekstuur of sterk reuke kan ’n sensitiewe stelsel oorweldig, terwyl ’n soekende vennoot dalk variasie en intensiteit wil hê. Saam kook en eet werk die beste wanneer julle bespreek wat ‘genoeg’ versus ‘te veel’ voel.",
    coupleSenseQuoteTouch:
      "Aanraking kan harder praat as woorde — en die afwesigheid van die regte aanraking op die regte tyd kan ’n vennoot onsigbaar laat voel.",
    coupleSenseWhyTouch:
      "Persoonlike ruimte, toegeneentheid en fisieke nabyheid is kern-sensoriese ervarings in ’n verhouding. Een vennoot het dalk meer aanraking nodig om verbinding te voel; ’n ander het dalk meer afstand nodig om gereguleerd te voel. Geen van die twee is verwerping nie — dit is senuweestelsel-bedrading.",
    coupleSenseQuoteRegulate:
      "Rus is nie luiheid nie — dit is die liggaam se manier om weer kapasiteit te kry om te verbind, te luister en vir mekaar daar te wees.",
    coupleSenseWhyRegulate:
      "Hoe julle elk herlaai ná werk, oor naweke en in tye van stres is dikwels waar paartjies stil bots. Een het dalk alleen-tyd nodig; die ander het dalk mense, beweging of geraas nodig. Om mekaar se herstel te beskerm — selfs wanneer dit anders lyk — is een van die liefdevolste dinge wat julle kan doen.",
    coupleClosingQuote:
      "Julle hoef nie die wêreld op dieselfde manier te ervaar om dit goed saam te ervaar nie. Wanneer paartjies mekaar se sensoriese behoeftes verstaan, openlik kommunikeer en mekaar halfpad tegemoet kom, kan hulle verskille ’n sterkte word eerder as ’n bron van konflik.",
    coupleWorkTag: "Werk & huislike lewe",
    coupleWorkTitle: "’n Paar vrae oor werk",
    coupleWorkDesc:
      "Hierdie kort afdeling help om te vergelyk hoe werk julle energie, stilte-tyd en huislike lewe vorm. As jy nie tans werk nie (byvoorbeeld jy pas hoofsaaklik kinders of die huis op), kan jy die werkvrae oorslaan.",
    coupleWorkEmploymentLabel: "Werk jy tans (betaalde werk)?",
    coupleWorkEmploymentYes: "Ja, ek werk",
    coupleWorkEmploymentNo: "Nee — ek werk nie tans nie / ek pas hoofsaaklik kinders of die huis op",
    coupleWorkSkipNote: "Ons vra net die ouerskap-vraag hieronder, en dan kan jy voortgaan.",
    coupleWorkLocationLabel: "Ek werk…",
    coupleWorkLocationOffice: "By die kantoor",
    coupleWorkLocationHome: "By die huis",
    coupleWorkLocationBoth: "Beide kantoor en by die huis",
    coupleWorkLocationOther: "Ander",
    coupleWorkLocationOtherPlaceholder: "Beskryf asseblief…",
    coupleWorkWithLabel: "Ek werk…",
    coupleWorkWithPeople: "Met mense",
    coupleWorkWithAlone: "Alleen",
    coupleWorkWithScreens: "Op skerms",
    coupleWorkWithScreensPeople: "Skerms en mense gekombineer",
    coupleWorkWithOther: "Ander",
    coupleWorkWithOtherPlaceholder: "Beskryf asseblief…",
    coupleWorkHoursLabel: "My werksure lyk so…",
    coupleWorkHoursPlaceholder: "bv. 8:00–16:30, skofwerk, net oggende…",
    coupleWorkEndOfDayLabel: "Aan die einde van ’n werkdag hou ek daarvan om:",
    coupleWorkEndOfDayHint: "Jy mag meer as een kies.",
    coupleWorkEndGetOut: "Uitgaan",
    coupleWorkEndSitRelax: "Net sit en ontspan",
    coupleWorkEndWithPeople: "Iets saam met ander mense doen",
    coupleWorkEndAlone: "Alleen wees",
    coupleWorkRechargeLabel: "Die beste manier vir my om na ’n lang werkdag te herlaai is…",
    coupleWorkRechargeHint: "Jy mag meer as een kies.",
    coupleWorkRechargeActive: "Om aktief en buite te wees",
    coupleWorkRechargeHome: "Om by die huis te ontspan met iets waarvan ek hou",
    coupleWorkRechargeOthersHome: "Om tyd saam met ander by die huis deur te bring",
    coupleWorkRechargeOthersOut: "Om tyd saam met ander buite die huis deur te bring",
    coupleWorkRechargeOther: "Ander",
    coupleWorkRechargeOtherPlaceholder: "Beskryf asseblief…",
    coupleWorkSaturdayLabel:
      "As jy ’n redelik besige week van werk gehad het, hoe sou ’n herladende Saterdag vir jou lyk (jy mag selfsugtig wees)?",
    coupleWorkSaturdayPlaceholder: "Beskryf jou ideale herladende Saterdag…",
    coupleWorkParentLabel: "Ek is ’n ouer",
    coupleWorkParentYes: "Ja",
    coupleWorkParentNo: "Nee",
    coupleWorkRequired: "Voltooi asseblief die werksafdeling voordat jy voortgaan.",
    coupleWorkRequiredEmployment: "Kies asseblief of jy tans werk.",
    coupleWorkResultsTitle: "Werk & huislike lewe",
    coupleMergeBack: "Terug na paartjie-spilpunt",
    coupleYourTurn: "Jy voltooi as",
    coupleSavedLocal:
      "Vordering vir hierdie paartjie-sessie word in hierdie blaaier gestoor. Gebruik elkeen se skakel en voltooiingskodes sodat die ander toestel by dieselfde sessie kan aansluit.",
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
    idealSaturdayHomeClose:
      "Deur jou sensoriese behoeftes te verstaan, kan jy ’n huis- en gesinsomgewing skep wat regulering, gesonde verhoudings en alledaagse welstand ondersteun.",
    teenTrailOverviewQuote:
      "Jou sintuie is hoe jy die wêreld ontmoet — en hoe jy leer wat help om weer jouself te voel.",
    teenTrailOverviewIntro:
      "Jou sensoriese stelsels gaan nie net oor klank, aanraking of beweging nie — hulle maak deel uit van hoe jy emosies bestuur. Wanneer jy oorweldig, angstig of gestres voel, sê jou liggaam dikwels wat dit meer of minder nodig het. Om jou sensoriese patroon te ken, help jou maniere vind om af te skakel, jou emmer weer te vul, terug te beweeg na wat jy liefhet, en uit te figure wat vir jou belangrik is en wat jou laat lewe.",
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
    profileTitle: "Jou sensoriese roete-profiel",
    profileTitleParent: "Jou kind se sensoriese roete-profiel",
    profileIntro: "’n Duidelike lesing van die sensoriese patrone wat in hierdie sifting uitgelig is. Hierdie resultate is beskrywend en is nie ’n diagnose nie.",
    profileIntroParent:
      "’n Duidelike lesing van die sensoriese patrone wat in hierdie sifting uitgelig is — geskryf vir jou as die ouer. Hierdie resultate is beskrywend en is nie ’n diagnose nie.",
    parentReportIntroTitle: "Jou kind se roete lees",
    parentReportIntroLead: "Elke kind ervaar die wêreld op hul eie manier.",
    parentReportIntroP1:
      "Hierdie verslag kaart hoe jou kind geneig is om sensoriese insette by die huis en deur die dag op te merk, te soek en daarvan te herstel.",
    parentReportIntroP2:
      "Gebruik dit as ’n gedeelde taal met jou gesin en sorgspan — ’n gids vir wat help, wat oorweldig, en waar klein veranderinge die alledaagse lewe makliker kan maak.",
    parentReportIntroP3:
      "Daar is geen regte of verkeerde roete nie. Om jou kind se patroon te verstaan is die eerste tree om hulle met meer gemak te ondersteun.",
    parentClosingQuote:
      "Wanneer ons ’n kind se sensoriese roete verstaan, kan ons met meer geduld, buigsaamheid en sorg langs hulle stap.",
    overallPattern: "Algehele patroon",
    sensitiveSignals: "sensitiewe seine",
    seekingSignals: "soekende seine",
    descriptiveMap: "Dit is ’n beskrywende kaart van die antwoorde — nie ’n diagnose nie.",
    overallScoreLabel: "Algehele telling",
    overallScoreNote: "Elke vraag in hierdie sifting saam getel in een lesing.",
    overallSensitiveTotal: "Sensitief / vermydend",
    overallNeutralTotal: "Sensories neutraal",
    overallSeekingTotal: "Sensories soekend",
    overallBalanceLabel: "Algehele balans",
    overallSystemsLabel: "Hoe die sintuie verdeel",
    teenScoreBoardKicker: "Algehele lesing",
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
    scoreLeanSensitiveShort: "−",
    scoreLeanNeutralShort: "Gebalanseerd",
    scoreLeanSeekingShort: "+",
    thresholdLegend:
      "Lae drempel = merk insette vinnig op (sensitief). Medium = meer tipies / gemeng. Hoë drempel = het meer insette nodig (soekend).",
    settingBridgeKicker: "Volgende",
    settingBridgeHeading: "Waar jou sintuie die alledaagse lewe ontmoet",
    settingBridgeQuoteHome:
      "Om jou sensoriese behoeftes te verstaan gaan nie daaroor om te verander wie jy is nie — dit gaan daaroor om ’n omgewing te skep waarin jy kan floreer.",
    settingBridgeQuoteWork:
      "Om jou sensoriese behoeftes te verstaan gaan nie daaroor om te verander wie jy is nie — dit gaan daaroor om ’n omgewing te skep waarin jy kan floreer.",
    settingBridgeCredit: "Soulful Sensory OT",
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
    teenCrewKicker: "Jou Sensoriese Roetekarakter",
    teenCrewTitle: "Jou Sensoriese Roetekarakter",
    teenCrewTitleParent: "Jou kind se Sensoriese Roetekarakter",
    teenCrewOverviewTitle: "Jou Sensoriese Roeteprofiel",
    teenCrewOverviewTitleParent: "Jou kind se Sensoriese Roeteprofiel",
    teenCrewMatchTitle: "Jou ooreenstemmende roete",
    teenCrewMatchTitleParent: "Jou kind se ooreenstemmende roete",
    teenCrewMatchLead:
      "Gebaseer op die algehele telling van hierdie sifting, is hier die roetestyl wat die naaste by jou antwoorde pas.",
    teenCrewMatchLeadParent:
      "Gebaseer op die algehele telling van hierdie sifting, is hier die roetestyl wat die naaste by jou kind se antwoorde pas.",
    teenCrewDescriptionTitle: "Jou ooreenstemmende roete-beskrywing",
    teenCrewDescriptionTitleParent: "Jou kind se ooreenstemmende roete-beskrywing",
    teenCrewIntro:
      "Ons ervaar almal die wêreld verskillend. Hier is die drie roetestyle — en dan watter een jou antwoorde die naaste gepas het.",
    teenCrewIntroParent:
      "Ons ervaar almal die wêreld verskillend. Hier is die drie roetestyle — en dan watter een jou kind se antwoorde die naaste gepas het.",
    teenCrewSummaryAria:
      "Infografika van die drie sensoriese roeteprofiele: Sensoriese Waarnemer, Sensoriese Aanpasser, en Sensoriese Verkenner",
    teenCrewYouAre: "Jy is",
    teenCrewYouAreParent: "Jou kind is",
    teenCrewBadge: "Dis jy",
    teenCrewBadgeParent: "Dis hulle",
    teenCrewDetailTitle: "Jou ooreenstemmende roete",
    teenCrewDetailTitleParent: "Jou kind se ooreenstemmende roete",
    teenCrewTraitsTitle: "Top eienskappe van jou sensoriese roete-karakter",
    teenCrewCrewTitle: "Die drie roetestyle",
    teenCrewCrewIntro:
      "Elke span het al drie nodig: die Verkenner wat meer insette soek, die Waarnemer wat detail vinnig merk, en die Aanpasser wat in die middel buig.",
    teenCrewWhyTitle: "Hoekom elke piek al drie nodig het",
    teenCrewWhyBody:
      "Die Sensoriese Verkenner (hoër sensoriese drempel) het die moed en energie om eerste te gaan — om die roete vooruit te toets en te sien of dit veilig is om te klim. Die Sensoriese Waarnemer (laer sensoriese drempel) merk die diere, die weerverskuiwing, nuwe reuke, hoe die roetesnacks smaak, en enige gate of los klippe op voordat die span daarin stap — en mag meer gereelde pouses langs die pad nodig hê. Die Sensoriese Aanpasser (medium / gemengde drempel) lees die groep en pas in waar hulle nodig is — vorentoe, stadiger, of in die middel van die tou sodat die hele span saam bly.",
    teenCrewFooter:
      "Daar is geen regte of verkeerde profiel nie. Jou roete is uniek — dit is ’n beskrywende kaart, nie ’n diagnose nie.",
    teenCrewFooterParent:
      "Daar is geen regte of verkeerde profiel nie. Jou kind se roete is uniek — dit is ’n beskrywende kaart, nie ’n diagnose nie.",
    briefScoresKicker: "Jou sensoriese tellings",
    briefScoresKickerParent: "Jou kind se sensoriese tellings",
    briefScoresTitle: "Resultate in ’n oogopslag",
    briefScoresIntro:
      "’n Vinnige blik op die algehele patroon en hoe elke sintuig geneig het. Dit is beskrywend, nie ’n diagnose nie.",
    briefScoresIntroParent:
      "’n Vinnige blik op die algehele patroon en hoe elke sintuig geneig het. Dit is beskrywend, nie ’n diagnose nie.",
    briefScoresHomeQuote:
      "Die huis is waar jou senuweestelsel die meeste van sy tyd herstel. As jy jou sensoriese voorkeure verstaan, kan jy doelbewus ruimtes en roetines skep wat kalmte, gemak en emosionele welstand bevorder.",
    trailInterpretSectionLabel: "Interpretasie",
    senseSupportKicker: "Ondersteuning per sintuig",
    senseSupportTitle: "Hoe om elke sensoriese stelsel te ondersteun",
    senseSupportTitleParent: "Hoe om elk van jou kind se sensoriese stelsels te ondersteun",
    senseSupportIntro:
      "Praktiese steun wat by elke sintuig se telling pas — kort, spesifiek, en gereed om te gebruik.",
    senseSupportIntroWork:
      "Praktiese werksteun wat by elke sintuig se telling pas — insluitend hoe om voor die werk voor te berei, wat gedurende die dag help, en hoe om daarna te ontspan.",
    senseSupportIntroHome:
      "Praktiese tuissteun wat by elke sintuig se telling pas — insluitend kamers, roetines, en hoe jy die huis opstel.",
    senseSupportIntroParent:
      "Praktiese steun wat by elke sintuig se telling van jou kind pas — kort, spesifiek, en gereed om te gebruik.",
    senseSupportHowLabel: "Probeer dit",
    senseSupportLeanLabel: "Telling",
    senseSupportIntroTeen:
      "Jou sinne by die skool en by die huis — meer opsies, pasgemaak by hoe jy getel het.",
    senseSupportSchoolKicker: "By die skool",
    senseSupportSchoolTitle: "Jou skool-moves",
    senseSupportSchoolLead:
      "Spiekkaart-energie. Kies een move, probeer dit vir ongeveer twee minute, kyk dan of die les makliker voel.",
    senseSupportHomeChapterKicker: "By die huis",
    senseSupportHomeChapterTitle: "Jou tuisopstelling",
    senseSupportHomeChapterLead:
      "Dieselfde sinne ná die skoolklok — jou kamer, huiswerk, en hoe jy herstel.",
    senseSupportModeLow: "Draai dit af",
    senseSupportModeMid: "Meng dit",
    senseSupportModeHigh: "Draai dit op",
    senseSupportMoveLabel: "Moves",
    teenCrewExplorerName: "Sensoriese Verkenner",
    teenCrewExplorerTag: "Hoë drempel – Sensoriese soeker",
    teenCrewExplorerSummary:
      "Jy soek ervarings, beweging en stimulasie om energiek en betrokke te voel.",
    teenCrewExplorerSummaryParent:
      "Hulle soek ervarings, beweging en stimulasie om energiek en betrokke te voel.",
    teenCrewExplorerSummaryTeen:
      "In leer- en vrye tyd — op ’n kampus, aanlyn by die huis, of gemeng — voel jy dikwels die beste met beweging, afwisseling en iets interessants om te doen.",
    teenCrewExplorerBody:
      "Jou sensoriese drempel sit hoër — jy hou dikwels van meer sensoriese insette, nie minder nie. Besige dae, nuwe plekke, beweging, klank en vars uitsigte wek jou gewoonlik op. Stilte kan flou voel, so jy soek die volgende ding om te doen en te sien. Op die berg is jy die een wat met baie energie vooruit stap, ’n goeie ruk kan aanhou, die roete toets, en terugkom met die berig: dit is wild daar bo — en die moeite werd.",
    teenCrewExplorerBodyParent:
      "Jou kind se sensoriese drempel sit hoër — hulle hou dikwels van meer sensoriese insette, nie minder nie. Besige dae, nuwe plekke, beweging, klank en vars uitsigte wek hulle gewoonlik op. Stilte kan flou voel, so hulle soek die volgende ding om te doen en te sien. Op die berg is hulle die een wat met baie energie vooruit stap, ’n goeie ruk kan aanhou, die roete toets, en terugkom met die berig: dit is wild daar bo — en die moeite werd.",
    teenCrewExplorerBodyTeen:
      "Jou sensoriese drempel sit hoër — jy het gewoonlik meer insette nodig om wakker en betrokke te voel. Lang stil lesse of stil studieblokke (op ’n kampus of aanlyn by die huis) en stadige stokperdjies kan flou voel, terwyl sport, musiek, speletjies met vriende, drama, kuns wat jou hande besig hou, of nuwe plekke jou opwek. Jy leer dalk beter ná beweging, ’n pouse, LO, ’n stap in die huis, of ’n vinnige strek as ná lank sit. Stokperdjies met beweging, klank, uitdaging of sosiale energie pas dikwels by jou — en rusteloosheid is dikwels jou liggaam wat meer insette vra, nie “nie probeer nie.”",
    teenCrewExplorerRole:
      "Hoër-drempel verkenner — hou van insette, besigheid en nuwe terrein; het die energie om aan te hou en te kyk of die pad vooruit veilig is.",
    teenCrewExplorerRoleTeen:
      "Soek beweging, afwisseling en stimulasie — in leer, stokperdjies en by vriende — om gefokus en energiek te bly.",
    teenCrewExplorerTraits: [
      "Hou van nuwe aktiwiteite en vaar goed met verandering.",
      "Geniet baie sensoriese stimulasie, sosiale omgewings en die verkenning van nuwe plekke.",
      "Raak nie maklik sensories oorlaai nie.",
      "Kan maklik verveeld raak in stil, kalm en voorspelbare omgewings.",
      "Geniet ’n uitdaging en vinnige omgewings.",
      "Bring dikwels ’n gevoel van opwinding en energie.",
      "Nuuskierig — hou daarvan om dinge uit te vind en is ondersoekend.",
    ],
    teenCrewExplorerTraitsTeen: [
      "Hou van nuwe aktiwiteite en vaar goed met verandering.",
      "Geniet baie sensoriese stimulasie, sosiale omgewings en die verkenning van nuwe plekke.",
      "Raak nie maklik sensories oorlaai nie.",
      "Kan maklik verveeld raak in stil, kalm en voorspelbare omgewings.",
      "Geniet ’n uitdaging en vinnige omgewings.",
      "Bring dikwels ’n gevoel van opwinding en energie.",
      "Nuuskierig — hou daarvan om dinge uit te vind en is ondersoekend.",
    ],
    teenCrewAdaptorName: "Sensoriese Aanpasser",
    teenCrewAdaptorTag: "Medium drempel – Gebalanseerd",
    teenCrewAdaptorSummary:
      "Jy kan by verskillende situasies aanpas en jou balans tussen stimulasie en rus vind.",
    teenCrewAdaptorSummaryParent:
      "Hulle kan by verskillende situasies aanpas en hul balans tussen stimulasie en rus vind.",
    teenCrewAdaptorSummaryTeen:
      "Jou behoeftes verskuif deur die leerdag en jou stokperdjies — partykeer wil jy meer gons, partykeer moet dinge stiller wees.",
    teenCrewAdaptorBody:
      "Jou sensoriese drempel sit in die buigsame middel — partykeer wil jy meer insette hê, partykeer minder. Jy verskuif saam met die huis, skool of werk, die weer op die roete en die mense om jou. Op die berg kan jy saam met die verkenners klim wanneer die dag energie vra, of saam met die waarnemers stadiger word wanneer dit omsigtigheid vra — jy pas in waar die span jou nodig het, en dit hou almal aan die gang.",
    teenCrewAdaptorBodyParent:
      "Jou kind se sensoriese drempel sit in die buigsame middel — partykeer wil hulle meer insette hê, partykeer minder. Hulle verskuif saam met die huis, skool, die weer op die roete en die mense om hulle. Op die berg kan hulle saam met die verkenners klim wanneer die dag energie vra, of saam met die waarnemers stadiger word wanneer dit omsigtigheid vra — hulle pas in waar die span hulle nodig het, en dit hou almal aan die gang.",
    teenCrewAdaptorBodyTeen:
      "Jou sensoriese drempel sit in die buigsame middel — party lesse, vriende en stokperdjies voel maklik; ander vra dat jy die volume op- of afdraai. Dit kan ’n besige kampusdag wees, ’n stil aanlyn oggend by die huis, of studietyd ná sport. Jy vaar dikwels goed wanneer jy kan kies: oorfone vir fokus, ’n stap voor huiswerk, ’n lewendige belangstelling een dag en ’n stiller een die volgende. Om te merk watter vakke, sport en hangouts jou geset laat — en watter jou plat of oorlaai laat — is nuttiger as een vaste etiket.",
    teenCrewAdaptorRole:
      "Medium-drempel middel — lees die groep, pas die tempo, en hou hoë- en lae-drempel stappers as een span.",
    teenCrewAdaptorRoleTeen:
      "Buig tussen besig en kalm — in leer, stokperdjies en by vriende — en vaar die beste met keuses wat by die dag pas.",
    teenCrewAdaptorTraits: [
      "Buigsaam en in staat om by verskillende omgewings aan te pas.",
      "Kan beide besige en stil omgewings geniet.",
      "Hou van balans.",
      "Hou van sosiale tyd, maar ook tyd om in hul eie ruimte te herlaai.",
      "Is gemaklik met afwisseling.",
      "Prakties — kan fokus op wat gedoen moet word ten spyte van veranderinge om hulle.",
      "Hou van beide nuwe aktiwiteite en bekende dinge wat hulle reeds ken.",
    ],
    teenCrewAdaptorTraitsTeen: [
      "Buigsaam en in staat om by verskillende omgewings aan te pas.",
      "Kan beide besige en stil omgewings geniet.",
      "Hou van balans.",
      "Hou van sosiale tyd, maar ook tyd om in hul eie ruimte te herlaai.",
      "Is gemaklik met afwisseling.",
      "Prakties — kan fokus op wat gedoen moet word ten spyte van veranderinge om hulle.",
      "Hou van beide nuwe aktiwiteite en bekende dinge wat hulle reeds ken.",
    ],
    teenCrewObserverName: "Sensoriese Waarnemer",
    teenCrewObserverTag: "Lae drempel – Sensitief",
    teenCrewObserverSummary:
      "Jy merk die besonderhede op wat ander dalk mis en kan diep bewus wees van jou omgewing.",
    teenCrewObserverSummaryParent:
      "Hulle merk die besonderhede op wat ander dalk mis en kan diep bewus wees van hul omgewing.",
    teenCrewObserverSummaryTeen:
      "Jy merk baie in leer en stokperdjies — detail, stemming en atmosfeer — en stiller omgewings help jou dikwels om jou beste te doen.",
    teenCrewObserverBody:
      "Jou sensoriese drempel sit laer — jy is baie bewus en merk dinge vinnig op. ’n Verandering in die weer, ’n nuwe reuk op die wind, hoe die roetesnacks smaak, ’n voëlroep, ’n los klip onder jou voet: dit alles registreer. Daardie bewustheid is ’n regte krag op die berg. Jy mag ook meer gereelde pouses tydens die stap nodig hê sodat jou stelsel kan sak voor die volgende stuk — en wanneer jy dit doen, merk die hele span wat hulle sou misgeloop het.",
    teenCrewObserverBodyParent:
      "Jou kind se sensoriese drempel sit laer — hulle is baie bewus en merk dinge vinnig op. ’n Verandering in die weer, ’n nuwe reuk op die wind, hoe die roetesnacks smaak, ’n voëlroep, ’n los klip onder hul voet: dit alles registreer. Daardie bewustheid is ’n regte krag op die berg. Hulle mag ook meer gereelde pouses tydens die stap nodig hê sodat hul stelsel kan sak voor die volgende stuk — en wanneer hulle dit doen, merk die hele span wat hulle sou misgeloop het.",
    teenCrewObserverBodyTeen:
      "Jou sensoriese drempel sit laer — jy merk geraas, skerms, helder lig, teksture, reuke en mense se stemmings vinnig op, of jy nou op ’n besige kampus of aanlyn by die huis leer. Daardie bewustheid kan ’n regte krag wees in vakke en stokperdjies wat noukeurige waarneming vra — kuns, musiek, lees, ontwerp, omgee vir ander, detailwerk. Besige groepoproepe, gedeelde ruimtes of gestapelde eise kan meer energie vat as wat dit van buite lyk. Ná ’n vol leerdag het jy dalk ’n stiller herstel nodig voor huiswerk, sport of planne. Kalmer klubs, sagter studieruimtes en stokperdjies wat jy geniet sonder oorlading help jou skerp bly eerder as uitgeput.",
    teenCrewObserverRole:
      "Laer-drempel uitkyk — merk detail vinnig (weer, reuke, smake, gevare) en baat by meer gereelde pouses op die roete.",
    teenCrewObserverRoleTeen:
      "Merk detail en atmosfeer vinnig — in leer en stokperdjies — en floreer met kalmer ruimtes en meer gereelde herstel.",
    teenCrewObserverTraits: [
      "Hou daarvan om hul eie ruimte te hê; word nie gesteur deur gebeure mis te loop nie.",
      "Intuïtief — merk mense se stemming en energie vinnig op.",
      "Het ’n kalm en voorspelbare omgewing nodig.",
      "Chaos of onvoorspelbaarheid kan angs skep.",
      "Hou daarvan om vooraf te weet van gebeure en verandering.",
      "Verkies bekende aktiwiteite en dinge wat hulle reeds ken.",
      "Bring ’n gevoel van kalmte, ’n luisterende oor en ’n grondende persoonlikheid.",
      "Het hersteltyd nodig om tussen aktiwiteite te herlaai.",
    ],
    teenCrewObserverTraitsTeen: [
      "Hou daarvan om hul eie ruimte te hê; word nie gesteur deur gebeure mis te loop nie.",
      "Intuïtief — merk mense se stemming en energie vinnig op.",
      "Het ’n kalm en voorspelbare omgewing nodig.",
      "Chaos of onvoorspelbaarheid kan angs skep.",
      "Hou daarvan om vooraf te weet van gebeure en verandering.",
      "Verkies bekende aktiwiteite en dinge wat hulle reeds ken.",
      "Bring ’n gevoel van kalmte, ’n luisterende oor en ’n grondende persoonlikheid.",
      "Het hersteltyd nodig om tussen aktiwiteite te herlaai.",
    ],
    teenCrewCrewIntroTeen:
      "Elke span het al drie style nodig. Hier is hoe hulle dikwels in leer (kampus, aanlyn of gemeng), stokperdjies en tienerlewe lyk — en dan watter een jou antwoorde die naaste gepas het.",
    teenCrewTraitsTitleTeen: "Top eienskappe van jou sensoriese roete-karakter",
    teenCrewDetailTitleTeen: "Jou gepaste roete",
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
    thankYouActivation:
      "Jou sifting is ontvang, maar die terapeut se inkassie moet eers FormSubmit se eenmalige bevestiging-e-pos klik. Kyk in soulfulsensoryot@gmail.com (en Spam), klik Bevestig/Activate, en tik dan Weer stuur.",
    thankYouFileProtocol:
      "Hierdie bladsy is as ’n gestoorde lêer oopgemaak, so e-pos kan nie stuur nie. Maak dit oop via ’n webadres (bv. ’n plaaslike bediener) en probeer Weer stuur.",
    thankYouNetworkBlocked:
      "Die blaaier het die e-posversoek geblokkeer — dikwels ’n advertensieblokkering of privaatheiduitbreiding. Skakel dit tydelik af vir hierdie werf (of probeer ’n ander blaaier), en tik dan Weer stuur.",
    thankYouRetry: "Stuur weer",
    thankYouHome: "Terug na tuis",
    summaryKicker: "Sifting voltooi",
    summaryTitle: "Dankie — jou antwoorde is ontvang",
    summaryBannerLead: "’n Kort bevestiging terwyl jou gedetailleerde sensoriese verslag by jou terapeut bly.",
    summaryIntro:
      "Dit is net ’n kort bevestiging. ’n Opvolgsessie met jou terapeut is nodig om te verstaan wat jou resultate beteken en hoe dit in die alledaagse lewe wys.",
    summaryNextKicker: "Volgende stap",
    summaryNextTitle: "Bespreek ’n opvolgsessie",
    summaryNextBannerLead: "Loop saam deur jou volle profiel op die pad vorentoe.",
    summaryNextBody:
      "Jou terapeut het die volle sensoriese verslag. Bespreek ’n aanlyn- of persoonlike sessie met Soulful Sensory OT om die gedetailleerde bevindinge saam deur te werk.",
    summaryBookCta: "Bespreek ’n opvolgsessie",
    summaryOverallKicker: "Algehele patroon",
    summaryOverallNote: "Hierdie etiket is net ’n beginpunt — betekenis en volgende stappe word in jou opvolgsessie gedek.",
    summaryDomainsKicker: "Sintuig-vir-sintuig blik",
    summaryDomainsTitle: "Patroonetikette per sintuig",
    summaryDomainsNote: "Hierdie kort etikette is nie ’n volle interpretasie nie. Jou terapeut sal dit saam met jou uitpak.",
    summaryTrailKicker: "Roete-karakter",
    summaryTrailNote: "Jou gekoppelde karakter word hier kort gedeel. Die volle roete-profiel vorm deel van jou terugvoersessie.",
    summaryEditorTitle: "Wat in die kort verslag ingesluit is",
    summaryEditorLead:
      "Pasiënte op ’n kort-verslag-uitnodiging sien altyd die voltooiingsnota en opvolgversoek. Skakel ekstra afdelings net aan as jy wil hê dit moet ingesluit word.",
    summaryEditorLegend: "Opsionele kort-verslag-afdelings",
    summaryEditorOverall: "Algehele patroon-etiket",
    summaryEditorOverallHint: "Wys net die hoëvlak-patroonnaam.",
    summaryEditorDomains: "Sintuig-vir-sintuig blik",
    summaryEditorDomainsHint: "Wys elke sintuig met ’n kort patroon-etiket.",
    summaryEditorTrail: "Roete-karakter-naam",
    summaryEditorTrailHint: "Wys die gekoppelde karakternaam wanneer die roete-profiel geld.",
    summaryEditorNote: "Veranderinge geld vir alle kort pasiëntverslae op hierdie toestel.",
    summaryEditorBack: "Terug na paneelbord",
    inviteBanner: "Jou antwoorde word veilig aan jou terapeut gestuur. Ná afhandeling sien jy net ’n dankie-skerm — resultate gaan na jou terapeut, nie hierheen nie.",
    inviteBannerBasic:
      "Jou antwoorde word veilig aan jou terapeut gestuur. Ná afhandeling sien jy ’n kort bevestiging — ’n opvolgsessie is nodig om jou resultate te verstaan.",
    inviteBannerFull:
      "Jou antwoorde word veilig aan jou terapeut gestuur. Ná afhandeling sien jy ook jou volle sensoriese roete-profiel hier.",
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
      "Personaliseer hierdie werkplekbrief: kies watter afdelings om in te sluit, wysig die besonderhede, en voeg ekstra opskrifte by indien nodig. Druk dan ’n bondige verslag met sensoriese tellings, werkplekuitdagings en praktiese aanbevelings.",
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
    workReportScaleIntro:
      "Elke sin word op ’n drieledige skaal gewys: lae, medium en hoë drempel.",
    workReportScaleLow: "Laag",
    workReportScaleMid: "Medium",
    workReportScaleHigh: "Hoog",
    workReportScaleLowHint: "merk inset vinnig op",
    workReportScaleMidHint: "tipies / gemeng",
    workReportScaleHighHint: "benodig meer inset",
    workReportScaleStatusLow: "Lae drempel",
    workReportScaleStatusMid: "Medium drempel",
    workReportScaleStatusHigh: "Hoë drempel",
    workReportPresentationLabel: "Hoe dit by die werk kan lyk",
    workReportPhasePrepare: "Voor die werksdag",
    workReportPhaseDuring: "Tydens die werksdag",
    workReportPhaseRecover: "Ná werk",
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
      "Personaliseer hierdie skoolbrief: kies watter afdelings om in te sluit, kies ’n sensoriese momentopname-styl, voeg getikte notas by, en skep ekstra opskrifte indien nodig. Druk dan ’n kort verslag vir onderwysers of ondersteuningspersoneel.",
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
    settingReportEditorEyebrow: "Pas hierdie brief aan",
    settingReportEditorTitle: "Afdelings om in te sluit",
    settingReportEditorLead:
      "Skakel afdelings aan of af om te bepaal wat in die gedrukte werk- of skoolverslag verskyn. Die lewendige voorskou werk saam soos jy kies.",
    settingReportEditorLegend: "Verslagafdelings",
    settingReportEditorDetailsHint: "Naam, rol/skool, en rede vir verwysing.",
    settingReportEditorAboutHint: "Kort verduideliking van die sensoriese sifting.",
    settingReportEditorOverloadHint: "Verduidelik sensoriese oorlading en angs by die skool.",
    settingReportEditorReferralHint: "Verwysing- / arbeidsterapie-ondersteuningswoorde.",
    settingReportEditorScoresHint: "Drieledige sensoriese telling-skaal (laag, gebalanseerd, hoog).",
    settingReportEditorVisualHint: "Tiener-vriendelike sensoriese momentopname-grafika.",
    settingReportEditorChallengesHint: "Hoe elke sensoriese patroon by die werk kan lyk.",
    settingReportEditorRecsHint: "Werkplekondersteuning voor, tydens en ná die werksdag.",
    settingReportEditorGeneralRecsHint: "Lys van algemene werkplekondersteuning.",
    settingReportEditorNotesHint: "Opsionele getikte notas vir onderwysers of ondersteuningspersoneel.",
    settingReportEditorClosingLabel: "Afsluitnota",
    settingReportEditorClosingHint: "Riglyn-vrywaring aan die einde van die brief.",
    settingReportCustomTitle: "Bykomende opskrifte",
    settingReportCustomLead:
      "Voeg jou eie opskrifte en paragrawe by wanneer hierdie brief iets ekstra nodig het.",
    settingReportCustomEmpty: "Nog geen pasgemaakte opskrifte nie.",
    settingReportCustomAdd: "Voeg opskrif by",
    settingReportCustomRemove: "Verwyder",
    settingReportCustomHeadingLabel: "Pasgemaakte afdeling",
    settingReportCustomHeading: "Opskrif",
    settingReportCustomHeadingPlaceholder: "bv. Klaskamerwaarnemings",
    settingReportCustomBody: "Inhoud",
    settingReportCustomBodyPlaceholder: "Skryf die paragraaf wat onder hierdie opskrif moet verskyn…",
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
    reportConclusionKicker: "Gevolgtrekking",
    reportConclusionTitle: "Die pad vorentoe",
    reportConclusionBody:
      "Jy het jou sensoriese roete-profiel gevind — ’n kaart, nie ’n etiket nie. Dit bied leidrade oor wat jou help om gereguleerd, gefokus en ondersteun te voel, en wat jou senuweestelsel dalk van jou nodig het. Die volgende tree is nie om jouself in die wêreld te forseer nie; dit is om te leer hoe om jouself daarin te ondersteun.",
    reportConclusionBodyParent:
      "Jy het jou kind se sensoriese roete-profiel gevind — ’n kaart, nie ’n etiket nie. Dit bied leidrade oor wat hulle help om gereguleerd, gefokus en ondersteun te voel, en wat hulle senuweestelsel dalk van jou nodig het. Die volgende tree is nie om hulle in die wêreld te forseer nie; dit is om te leer hoe om hulle daarin te ondersteun.",
    reportConclusionQuote:
      "Wanneer jy jou sensoriese behoeftes verstaan, verstaan jy jouself ’n bietjie beter.",
    reportConclusionQuoteParent:
      "Wanneer jy jou kind se sensoriese behoeftes verstaan, verstaan jy hulle ’n bietjie beter.",
    reportConclusionCredit: "Soulful Sensory OT",
  },
};

const RESPONDENT_OPTIONS = {
  adult: { labelKey: "adult", descKey: "adultDesc" },
  teen: { labelKey: "teen", descKey: "teenDesc" },
  parent: { labelKey: "parent", descKey: "parentDesc" },
  couple: { labelKey: "couple", descKey: "coupleDesc" },
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
    couple: [["name", "Your name and surname", "text", true], ["age", "Your age", "number", true], ["email", "Email", "email", true]],
  },
  af: {
    adult: [["name", "Naam en van", "text", true], ["age", "Ouderdom", "number", true], ["email", "E-posadres", "email", true], ["occupation", "Beroep / universiteit / kollege", "text", false]],
    teen: [["name", "Naam en van", "text", true], ["age", "Ouderdom", "number", true], ["email", "Jou of ’n ouer / voog se e-posadres", "email", true], ["occupation", "Skool / graad", "text", false]],
    parent: [["name", "Kind se naam en van", "text", true], ["age", "Kind se ouderdom", "number", true], ["parentName", "Ouer / voog se naam en van", "text", true], ["email", "Ouer / voog se e-posadres", "email", true], ["occupation", "Skool / graad", "text", false]],
    couple: [["name", "Jou naam en van", "text", true], ["age", "Jou ouderdom", "number", true], ["email", "E-posadres", "email", true]],
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
    types: ["sensitive", "sensitive", "seeking", "sensitive", "sensitive", "seeking", "sensitive", "seeking", "sensitive"],
    copy: {
      en: {
        title: "Tactile Processing",
        shortTitle: "Tactile",
        description:
          "These questions explore food textures, clothing textures and physical touch.",
        blurb: "Food textures, clothing textures and physical touch.",
      },
      af: {
        title: "Tasprosessering",
        shortTitle: "Tas",
        description:
          "Hierdie vrae ondersoek voedselteksture, kledingteksture en fisieke aanraking.",
        blurb: "Voedselteksture, kledingteksture en fisieke aanraking.",
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
        couple: [
          "Certain clothing textures, such as scratchy or tight-fitting fabrics, are uncomfortable for me.",
          "Clothing labels or seams irritate me, and I often remove them.",
          "I am comfortable when people are in my personal space.",
          "I feel uncomfortable in queues or crowded spaces where people are very close to me.",
          "I dislike getting my hands messy, for example with paint, sand, glue or food.",
          "I enjoy appropriate physical affection, such as hugs, from people I trust.",
          "I avoid certain foods because their texture feels unpleasant.",
          "I like to show love to my partner through physical affection like hugs and kisses.",
          "I prefer more personal space with my partner and tend to show love in ways that are not mainly physical touch (for example words, time together, or thoughtful acts).",
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
        couple: [
          "Sekere kledingteksture, soos krapperige of styfpassende materiaal, voel vir my ongemaklik.",
          "Etikette of nate in klere irriteer my, en ek verwyder dit dikwels.",
          "Ek is gemaklik wanneer mense in my persoonlike ruimte is.",
          "Ek voel ongemaklik in rye of oorvol plekke waar mense baie naby aan my is.",
          "Ek hou nie daarvan om my hande vuil te maak met verf, sand, gom of kos nie.",
          "Ek geniet gepaste fisieke aanraking, soos drukkies, van mense wat ek vertrou.",
          "Ek vermy sekere kosse omdat die tekstuur onaangenaam voel.",
          "Ek hou daarvan om liefde aan my vennoot te wys deur fisieke aanraking soos drukkies en soene.",
          "Ek verkies meer persoonlike ruimte met my vennoot en is geneig om liefde te wys op maniere wat nie hoofsaaklik fisieke aanraking is nie (byvoorbeeld woorde, tyd saam, of deurdagte gebare).",
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
    types: ["neutral", "sensitive", "seeking", "sensitive", "sensitive", "sensitive", "seeking", "sensitive", "seeking"],
    copy: {
      en: {
        title: "Visual Processing",
        shortTitle: "Visual",
        description:
          "These questions explore responses to light, colour, clutter and visually busy environments.",
        blurb: "Taking in light, colour, clutter and what is seen around you.",
      },
      af: {
        title: "Visuele Prosessering",
        shortTitle: "Visueel",
        description:
          "Hierdie vrae ondersoek reaksies op lig, kleur, rommeligheid en visueel besige omgewings.",
        blurb: "Inneem van lig, kleur, rommeligheid en wat rondom gesien word.",
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
        couple: [
          "I keep my surroundings organised and generally prefer a tidy space.",
          "I am sensitive to bright lights, fluorescent lighting or glare.",
          "When dressing or decorating, I enjoy bright colours and bold patterns.",
          "When dressing or decorating, I prefer softer, neutral colours such as beige, white, green or navy.",
          "I become distracted when there is a lot happening visually around me.",
          "I feel more comfortable in dimly lit rooms.",
          "I enjoy opening curtains or blinds to let in natural light.",
          "I have to have a neat, organised space at home.",
          "I am comfortable with some clutter at home.",
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
        couple: [
          "Ek hou my omgewing georganiseerd en verkies gewoonlik ’n netjiese ruimte.",
          "Ek is sensitief vir helder ligte, fluoresserende lig of glans.",
          "Wanneer ek aantrek of dekor, geniet ek helder kleure en opvallende patrone.",
          "Wanneer ek aantrek of dekor, verkies ek sagter, neutrale kleure soos beige, wit, groen of vlootblou.",
          "Ek raak afgelei wanneer daar visueel baie rondom my gebeur.",
          "Ek voel gemakliker in vertrekke met dowwe lig.",
          "Ek geniet dit om gordyne of blindings oop te maak sodat natuurlike lig kan inkom.",
          "Ek moet ’n netjiese, georganiseerde ruimte by die huis hê.",
          "Ek is gemaklik met ’n bietjie rommel by die huis.",
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
    types: [
      "sensitive",
      "seeking",
      "sensitive",
      "sensitive",
      "neutral",
      "seeking",
      "seeking",
      "sensitive",
      "neutral",
      "seeking",
      "seeking",
      "sensitive",
    ],
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
        couple: [
          "Busy places, such as shopping centres or restaurants, leave me feeling tired or drained.",
          "I enjoy being around lots of people and social activity.",
          "I prefer quieter environments and small groups to large gatherings.",
          "After spending time in a busy environment, I usually need quiet time to recharge.",
          "During the week I recharge best with quieter, sedentary activities such as reading, drawing, art or watching TV.",
          "During the week I recharge best through movement or active activities.",
          "During the week I recharge best by being social and around people.",
          "During the week I recharge best with alone time.",
          "Over the weekend I recharge best with quieter, sedentary activities such as reading, drawing, art or watching TV.",
          "Over the weekend I recharge best through movement or active activities.",
          "Over the weekend I recharge best by being social and around people.",
          "Over the weekend I recharge best with alone time.",
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
        couple: [
          "Besige plekke, soos winkelsentrums of restaurante, laat my moeg of uitgeput voel.",
          "Ek geniet dit om tussen baie mense en sosiale aktiwiteit te wees.",
          "Ek verkies stiller omgewings en klein groepies bo groot byeenkomste.",
          "Nadat ek tyd in ’n besige omgewing deurgebring het, het ek gewoonlik stilte nodig om te herlaai.",
          "Gedurende die week herlaai ek die beste met stiller, sittende aktiwiteite soos lees, teken, kuns of TV kyk.",
          "Gedurende die week herlaai ek die beste deur beweging of aktiewe aktiwiteite.",
          "Gedurende die week herlaai ek die beste deur sosiaal te wees en tussen mense te wees.",
          "Gedurende die week herlaai ek die beste met alleen-tyd.",
          "Oor die naweek herlaai ek die beste met stiller, sittende aktiwiteite soos lees, teken, kuns of TV kyk.",
          "Oor die naweek herlaai ek die beste deur beweging of aktiewe aktiwiteite.",
          "Oor die naweek herlaai ek die beste deur sosiaal te wees en tussen mense te wees.",
          "Oor die naweek herlaai ek die beste met alleen-tyd.",
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
  return DOMAIN_DEFINITIONS.map((domain) => {
    const bank = domain.questions[safeLanguage] || domain.questions.en;
    // Couple uses adult self-report questions until couple-specific wording is added.
    const questionTexts = bank[safeRespondent] || bank.adult;
    return {
      id: domain.id,
      icon: domain.icon,
      title: domain.copy[safeLanguage].title,
      shortTitle: domain.copy[safeLanguage].shortTitle,
      description: domain.copy[safeLanguage].description,
      blurb: domain.copy[safeLanguage].blurb || "",
      questions: questionTexts.map((text, index) => ({
        text,
        type: domain.types[index],
      })),
    };
  });
}
