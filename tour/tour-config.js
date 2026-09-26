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
      "narration": "Welcome to SoulfulSensory. It's a simple online sensory profile for teenagers and adults, so you can see how the senses shape ordinary, everyday life.",
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
      "narration": "We all take the world in a little differently. A busy place can feel like too much for some people. Others need a bit more movement, or some sound, just to feel alert. Once those patterns are clearer, the day is easier to manage.",
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
      "narration": "There are a few questionnaires, depending on someone's age and where they spend the day. Adults can look at work, or at home. Teenagers can look at school, or at home. A parent can fill one in about their teenager. And couples can look at their sensory preferences side by side.",
      "captions": [
        { "at": 0, "text": "There are a few questionnaires, depending on someone's age and where they spend the day." },
        { "at": 0.28, "text": "Adults can look at work or home. Teenagers can look at school or home." },
        { "at": 0.68, "text": "A parent can fill one in about their teenager, and couples can look at their preferences side by side." }
      ],
      "lines": [],
      "beats": [
        { "at": 0.02, "action": "highlight", "target": "[data-tour='adult-work']" },
        { "at": 0.22, "action": "highlight", "target": "[data-tour='adult-home']" },
        { "at": 0.38, "action": "highlight", "target": "[data-tour='teen-school']" },
        { "at": 0.52, "action": "highlight", "target": "[data-tour='teen-home']" },
        { "at": 0.68, "action": "highlight", "target": "[data-tour='parent']" },
        { "at": 0.84, "action": "highlight", "target": "[data-tour='couple']" }
      ]
    },
    {
      "id": "completing",
      "title": "Completing the profile",
      "kind": "questions",
      "sample": true,
      "durationMs": 15000,
      "narration": "You fill it in online. The questions are about ordinary sensory moments. The answers are scored for you, so you can see how someone notices sensation, how they respond, and when they go looking for a bit more.",
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
      "narration": "The results sketch a picture of that person's sensory preferences. The idea isn't to put them in a box. It's just to make the patterns easier to see. Where they get overloaded. Where they need a bit more input. And which places or activities tend to support them. From there, it turns into practical ideas for home, school, or work.",
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
      "narration": "Those results can also sit together in a clear report, so the person and their therapist can talk through what it means, and what might actually help.",
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
      "narration": "For therapists, it all sits in one place. You can send a questionnaire, see how it's going, and open the results and the report from the dashboard.",
      "captions": [
        { "at": 0, "text": "For therapists, it all sits in one place." },
        { "at": 0.4, "text": "You can send a questionnaire, see how it's going, and open the results and the report." }
      ],
      "lines": [],
      "beats": [
        { "at": 0.06, "action": "highlight", "target": "[data-tab='create']" },
        { "at": 0.4, "action": "highlight", "target": "[data-assessment-id='tour-sample-progress']" },
        { "at": 0.7, "action": "highlight", "target": "[data-assessment-id='tour-sample-complete']" }
      ]
    },
    {
      "id": "end",
      "title": "Explore the demo",
      "kind": "end",
      "durationMs": 10000,
      "narration": "Sensory needs are different for everyone. Understanding them is often a good first step. Have a look through the demo if you'd like to see a bit more.",
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
