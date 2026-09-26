/* SoulfulSensory 2-minute tour.
   Edit this file to change narration, captions, scene order, timing, and highlights.
   durationMs is the planned length of a scene. "at" is a fraction from 0 to 1.
   If you generate cached narration, delete tour/audio and run scripts/generate-tour-audio.js
   so the recordings match the new wording. */
window.TOUR_SCRIPT = {
  "title": "SoulfulSensory in 2 minutes",
  "scenes": [
    {
      "id": "intro",
      "title": "Introduction",
      "kind": "home",
      "durationMs": 15000,
      "narration": "Welcome to SoulfulSensory — an online sensory profiling platform designed to help teenagers and adults better understand how their sensory preferences influence everyday life.",
      "captions": [
        { "at": 0, "text": "Welcome to SoulfulSensory — an online sensory profiling platform." },
        { "at": 0.42, "text": "It helps teenagers and adults understand how their sensory preferences influence everyday life." }
      ],
      "lines": [
        { "at": 0, "text": "Understand your sensory world." },
        { "at": 0.48, "text": "Sensory profiling for everyday life." }
      ],
      "beats": [
        { "at": 0, "action": "scroll", "target": ".home-hero" }
      ]
    },
    {
      "id": "why",
      "title": "Why sensory profiling",
      "kind": "home",
      "durationMs": 17000,
      "narration": "We all process sensory information differently. For some people, certain environments can feel overwhelming, while others may need more movement, sound or sensory input to feel alert and focused. Understanding these patterns can help make everyday life feel more manageable.",
      "captions": [
        { "at": 0, "text": "We all process sensory information differently." },
        { "at": 0.18, "text": "For some people, certain environments can feel overwhelming, while others may need more movement, sound or sensory input to feel alert and focused." },
        { "at": 0.72, "text": "Understanding these patterns can help make everyday life feel more manageable." }
      ],
      "lines": [
        { "at": 0, "text": "Overwhelmed by busy environments" },
        { "at": 0.2, "text": "Sensitive to noise, touch or movement" },
        { "at": 0.4, "text": "Struggling to focus" },
        { "at": 0.6, "text": "Needing more movement or stimulation" },
        { "at": 0.8, "text": "Feeling depleted after work or school" }
      ],
      "beats": [
        { "at": 0, "action": "scroll", "target": ".home-ot" },
        { "at": 0.45, "action": "scroll", "target": ".home-helps" }
      ]
    },
    {
      "id": "questionnaires",
      "title": "Questionnaires",
      "kind": "home",
      "durationMs": 21000,
      "narration": "SoulfulSensory offers different questionnaires depending on the person's age and everyday environment. Adults can explore their sensory preferences at work or at home, while teenagers can explore their needs at school or at home. A parent can also complete a profile about their teenager, and couples can explore their sensory preferences alongside one another.",
      "captions": [
        { "at": 0, "text": "SoulfulSensory offers different questionnaires depending on the person's age and everyday environment." },
        { "at": 0.28, "text": "Adults can explore their sensory preferences at work or at home, while teenagers can explore their needs at school or at home." },
        { "at": 0.68, "text": "A parent can also complete a profile about their teenager, and couples can explore their sensory preferences alongside one another." }
      ],
      "lines": [],
      "beats": [
        { "at": 0, "action": "highlight", "target": "[data-tour='adult-work']" },
        { "at": 0.34, "action": "highlight", "target": "[data-tour='adult-home']" },
        { "at": 0.46, "action": "highlight", "target": "[data-tour='teen-school']" },
        { "at": 0.58, "action": "highlight", "target": "[data-tour='teen-home']" },
        { "at": 0.72, "action": "highlight", "target": "[data-tour='parent']" },
        { "at": 0.86, "action": "highlight", "target": "[data-tour='couple']" }
      ]
    },
    {
      "id": "completing",
      "title": "Completing the profile",
      "kind": "questions",
      "sample": true,
      "durationMs": 15000,
      "narration": "The questionnaire is completed online and asks about everyday sensory experiences. Responses are automatically scored to help identify patterns in how the person notices, responds to and seeks sensory input.",
      "captions": [
        { "at": 0, "text": "The questionnaire is completed online and asks about everyday sensory experiences." },
        { "at": 0.48, "text": "Responses are automatically scored to help identify patterns in how the person notices, responds to and seeks sensory input." }
      ],
      "lines": [],
      "beats": [
        { "at": 0.08, "action": "answer", "index": 0, "value": "yes" },
        { "at": 0.38, "action": "answer", "index": 1, "value": "no" },
        { "at": 0.68, "action": "answer", "index": 2, "value": "yes" }
      ]
    },
    {
      "id": "results",
      "title": "Sensory profile",
      "kind": "results",
      "sample": true,
      "durationMs": 26000,
      "narration": "The results build a picture of the person's individual sensory preferences. The aim isn't to put someone into a box, but to make patterns easier to recognise — including where they may become overloaded, where they may need more input, and which environments or activities may support them. These insights can be translated into practical strategies for everyday life at home, school or work.",
      "captions": [
        { "at": 0, "text": "The results build a picture of the person's individual sensory preferences." },
        { "at": 0.22, "text": "The aim isn't to put someone into a box, but to make patterns easier to recognise — including where they may become overloaded, where they may need more input, and which environments or activities may support them." },
        { "at": 0.72, "text": "These insights can be translated into practical strategies for everyday life at home, school or work." }
      ],
      "lines": [
        { "at": 0, "text": "Profile complete" },
        { "at": 0.2, "text": "" }
      ],
      "beats": [
        { "at": 0, "action": "scroll", "target": ".results-intro, .home-profile-cover, .card" },
        { "at": 0.22, "action": "highlight", "target": ".trail-profile, .teen-crew" },
        { "at": 0.72, "action": "scroll", "target": ".sensory-diet, .trail-profile" }
      ]
    },
    {
      "id": "report",
      "title": "Report",
      "kind": "results",
      "sample": true,
      "durationMs": 13000,
      "narration": "Results can also be brought together into a clear report, helping the person and their therapist understand the findings and identify practical ways to support their sensory needs.",
      "captions": [
        { "at": 0, "text": "Results can also be brought together into a clear report." },
        { "at": 0.4, "text": "It helps the person and their therapist understand the findings and identify practical ways to support their sensory needs." }
      ],
      "lines": [],
      "beats": [
        { "at": 0.08, "action": "highlight", "target": ".sensory-diet" }
      ]
    },
    {
      "id": "therapist",
      "title": "Therapist dashboard",
      "kind": "dashboard",
      "sample": true,
      "durationMs": 13000,
      "narration": "For therapists, patients and profiles can be managed from one place. Questionnaires can be sent to patients, progress can be monitored, and completed results and reports can be accessed through the therapist dashboard.",
      "captions": [
        { "at": 0, "text": "For therapists, patients and profiles can be managed from one place." },
        { "at": 0.34, "text": "Questionnaires can be sent to patients, progress can be monitored, and completed results and reports can be accessed through the therapist dashboard." }
      ],
      "lines": [],
      "beats": [
        { "at": 0, "action": "highlight", "target": "[data-tab='create']" },
        { "at": 0.28, "action": "highlight", "target": "[data-assessment-id='tour-sample-assigned']" },
        { "at": 0.52, "action": "highlight", "target": "[data-assessment-id='tour-sample-progress']" },
        { "at": 0.76, "action": "highlight", "target": "[data-assessment-id='tour-sample-complete'] .dash-report-switch, [data-assessment-id='tour-sample-complete']" }
      ]
    },
    {
      "id": "end",
      "title": "Explore the demo",
      "kind": "end",
      "durationMs": 10000,
      "narration": "Sensory needs are individual. Understanding them can be an important first step towards finding strategies that fit the person, their environment and their everyday life. Explore the SoulfulSensory demo to learn more.",
      "captions": [
        { "at": 0, "text": "Sensory needs are individual." },
        { "at": 0.18, "text": "Understanding them can be an important first step towards finding strategies that fit the person, their environment and their everyday life." },
        { "at": 0.7, "text": "Explore the SoulfulSensory demo to learn more." }
      ],
      "lines": [
        { "at": 0, "text": "Could sensory profiling support someone you work with?" }
      ],
      "beats": []
    }
  ]
};
