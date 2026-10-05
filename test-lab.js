/**
 * Admin-only Sensory Trail Questionnaire Test Lab.
 * Calls the production scoring functions. It does not save patients,
 * assessments, drafts, emails, or payments.
 */
const TEST_LAB_HISTORY_KEY = "ssot-questionnaire-test-lab-v1";
const TEST_LAB_RANDOM_SEED = 20261005;
const TEST_LAB_DISCLAIMER =
  "These results evaluate the internal behaviour and scoring integrity of the Sensory Trail questionnaire. They do not establish psychometric or clinical validation.";

const TEST_LAB_RESPONDENTS = [
  { id: "adult", label: "Adult" },
  { id: "teen", label: "Teen" },
  { id: "parent", label: "Parent" },
  { id: "couple", label: "Couple" },
];

const TEST_LAB_TRAIL = {
  sensitive: "Observer",
  neutral: "Adaptor",
  seeking: "Explorer",
};

const testLab = {
  respondent: "adult",
  open: {},
  custom: {},
  customDomain: "auditory",
  inspectId: null,
  auditFilter: "flagged",
  simSize: 100,
  simMode: "random",
  simulation: null,
  biasSample: null,
  notice: "",
  bundle: null,
  bound: false,
};

function labEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labTrail(profile) {
  return TEST_LAB_TRAIL[profile] || "Adaptor";
}

function labPole(type) {
  if (type === "sensitive" || type === "sensitive-if-no") return "sensitive";
  if (type === "seeking" || type === "seeking-if-no") return "seeking";
  if (type === "neutral") return "neutral";
  return null;
}

function labAnswer(type, endorse) {
  if (!type || type === "neutral") return false;
  const reverse = String(type).endsWith("-if-no");
  return reverse ? !endorse : Boolean(endorse);
}

function labDomains(respondent, language) {
  const lang = language || (typeof state !== "undefined" && state.language) || "en";
  return getSensoryDomains(lang === "af" ? "af" : "en", respondent || "adult");
}

function labMulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function labRateText(rate) {
  if (typeof rate !== "number" || Number.isNaN(rate)) return "—";
  const card = Math.round(rate * 100);
  const tenth = Math.round(rate * 1000) / 10;
  const precise = (Math.round(tenth * 10) / 10).toFixed(1).replace(/\.0$/, "");
  if (Math.round(tenth) !== card) return precise + "% (report card rounds to " + card + "%)";
  return card + "%";
}

function labCloneAnswers(answers) {
  return Object.fromEntries(Object.entries(answers).map(([id, list]) => [id, list.slice()]));
}

function labScore(respondent, answers) {
  const domains = getSensoryDomains("en", respondent);
  const scores = scoreAllDomains(answers, domains, "en", respondent);
  const overall = scoreOverall(scores, "en", respondent);
  return { domains, scores, overall };
}

function labPlan(spec, respondent) {
  if (!spec.plans) return null;
  if (respondent === "couple" && spec.plans.couple) return spec.plans.couple;
  return spec.plans.standard || spec.plans.shared || null;
}

function labAnswersFromPlan(respondent, plan) {
  const domains = getSensoryDomains("en", respondent);
  return Object.fromEntries(
    domains.map((domain) => {
      const want = (plan && plan[domain.id]) || { sensitive: 0, seeking: 0 };
      const left = {
        sensitive: want.sensitive || 0,
        seeking: want.seeking || 0,
      };
      const answers = domain.questions.map((question) => {
        const pole = labPole(question.type);
        if ((pole === "sensitive" || pole === "seeking") && left[pole] > 0) {
          left[pole] -= 1;
          return labAnswer(question.type, true);
        }
        return labAnswer(question.type, false);
      });
      return [domain.id, answers];
    })
  );
}

function labAnswersFor(spec, respondent) {
  const domains = getSensoryDomains("en", respondent);
  if (spec.build === "na") return null;
  if (spec.build === "all") {
    return Object.fromEntries(
      domains.map((domain) => [domain.id, domain.questions.map(() => spec.value)])
    );
  }
  if (spec.build === "endorse") {
    return Object.fromEntries(
      domains.map((domain) => [
        domain.id,
        domain.questions.map((question) => {
          const pole = labPole(question.type);
          if (spec.endorse === "none") return labAnswer(question.type, false);
          return labAnswer(question.type, pole === spec.endorse);
        }),
      ])
    );
  }
  if (spec.build === "plan") return labAnswersFromPlan(respondent, labPlan(spec, respondent));
  if (spec.build === "incomplete") {
    return Object.fromEntries(
      domains.map((domain) => [
        domain.id,
        domain.questions.map((question) => {
          if (domain.id !== "auditory") return null;
          return labAnswer(question.type, labPole(question.type) === "sensitive");
        }),
      ])
    );
  }
  if (spec.build === "alternating") {
    return Object.fromEntries(
      domains.map((domain) => [domain.id, domain.questions.map((_, index) => index % 2 === 0)])
    );
  }
  if (spec.build === "random") {
    const random = labMulberry32(TEST_LAB_RANDOM_SEED);
    return Object.fromEntries(
      domains.map((domain) => [domain.id, domain.questions.map(() => random() < 0.5)])
    );
  }
  if (spec.build === "mostly-observer" || spec.build === "mostly-explorer") {
    const plan = {};
    domains.forEach((domain) => {
      const sensitive = domain.questions.filter((question) => labPole(question.type) === "sensitive").length;
      const seeking = domain.questions.filter((question) => labPole(question.type) === "seeking").length;
      plan[domain.id] =
        spec.build === "mostly-observer"
          ? { sensitive, seeking: seeking ? 1 : 0 }
          : { sensitive: sensitive ? 1 : 0, seeking };
    });
    return labAnswersFromPlan(respondent, plan);
  }
  return null;
}

const LAB_BOUNDARY_OBSERVER = {
  standard: {
    auditory: { sensitive: 3, seeking: 0 },
    tactile: { sensitive: 3, seeking: 0 },
    movement: { sensitive: 2, seeking: 0 },
    visual: { sensitive: 3, seeking: 0 },
    smellTaste: { sensitive: 2, seeking: 0 },
    everyday: { sensitive: 1, seeking: 0 },
  },
  couple: {
    auditory: { sensitive: 3, seeking: 0 },
    tactile: { sensitive: 4, seeking: 0 },
    movement: { sensitive: 2, seeking: 0 },
    visual: { sensitive: 4, seeking: 0 },
    smellTaste: { sensitive: 2, seeking: 0 },
    everyday: { sensitive: 1, seeking: 0 },
  },
};

const LAB_BOUNDARY_EXPLORER = {
  standard: {
    auditory: { sensitive: 0, seeking: 2 },
    tactile: { sensitive: 0, seeking: 1 },
    movement: { sensitive: 0, seeking: 3 },
    visual: { sensitive: 0, seeking: 1 },
    smellTaste: { sensitive: 0, seeking: 2 },
    everyday: { sensitive: 0, seeking: 2 },
  },
};

const LAB_MIXED_HALF = {
  shared: {
    auditory: { sensitive: 99, seeking: 0 },
    tactile: { sensitive: 99, seeking: 0 },
    movement: { sensitive: 0, seeking: 99 },
    visual: { sensitive: 99, seeking: 0 },
    smellTaste: { sensitive: 0, seeking: 99 },
    everyday: { sensitive: 0, seeking: 0 },
  },
};

function labShiftPlan(base, respondent, domainId, pole, delta) {
  const source = respondent === "couple" && base.couple ? base.couple : base.standard;
  const next = {};
  Object.keys(source).forEach((id) => {
    next[id] = { sensitive: source[id].sensitive || 0, seeking: source[id].seeking || 0 };
  });
  next[domainId][pole] = Math.max(0, (next[domainId][pole] || 0) + delta);
  return next;
}

const LAB_CASES = [
  {
    id: "strong-observer",
    name: "Strong Observer",
    blurb: "Every Observer item is endorsed. No Explorer item is endorsed.",
    build: "endorse",
    endorse: "sensitive",
    expectedProfile: "sensitive",
    expectedPattern: "Observer",
  },
  {
    id: "strong-explorer",
    name: "Strong Explorer",
    blurb: "Every Explorer item is endorsed. No Observer item is endorsed.",
    build: "endorse",
    endorse: "seeking",
    expectedProfile: "seeking",
    expectedPattern: "Explorer",
  },
  {
    id: "moderate",
    name: "Genuinely moderate",
    blurb: "No Observer or Explorer item is endorsed. The reverse-scored item is answered so that it does not count.",
    build: "endorse",
    endorse: "none",
    expectedProfile: "neutral",
    expectedPattern: "Adaptor",
  },
  {
    id: "all-no",
    name: "All No",
    blurb: "Every question is answered No. No on the reverse-scored personal-space item still counts as Observer.",
    build: "all",
    value: false,
    expectedProfile: "neutral",
    expectedPattern: "Adaptor",
    concern:
      "All No means little was endorsed. It is not the same as a measured middle. The Adaptor label here mostly means the 50% floor was not reached.",
  },
  {
    id: "all-yes",
    name: "All Yes",
    blurb: "Every question is answered Yes. Yes endorses both poles, except the reverse-scored item.",
    build: "all",
    value: true,
    expectedProfile: "neutral",
    expectedPattern: "Adaptor",
    concern:
      "Both poles are nearly full, so the gap stays under 20 points and the result is Adaptor. That is saturation of both patterns, not a moderate response style.",
    averaging: true,
  },
  {
    id: "all-middle",
    name: "All middle responses",
    blurb: "There is no middle answer on this questionnaire.",
    build: "na",
    expectedProfile: null,
    expectedPattern: "No middle response exists",
    concern: "The scale is Yes or No. A middle-response test cannot be run, so it stays on review.",
  },
  {
    id: "mostly-observer",
    name: "Mostly Observer, some Explorer",
    blurb: "Every Observer item is endorsed, plus the first Explorer item in each sense.",
    build: "mostly-observer",
    expectedProfile: "sensitive",
    expectedPattern: "Observer",
  },
  {
    id: "mostly-explorer",
    name: "Mostly Explorer, some Observer",
    blurb: "Every Explorer item is endorsed, plus the first Observer item in each sense.",
    build: "mostly-explorer",
    expectedProfile: "seeking",
    expectedPattern: "Explorer",
  },
  {
    id: "mixed-half",
    name: "Strong Observer and strong Explorer",
    blurb: "Auditory, touch, and visual are fully Observer. Movement and smell/taste are fully Explorer. Everyday is unendorsed.",
    build: "plan",
    plans: LAB_MIXED_HALF,
    expectedProfile: "neutral",
    expectedPattern: "Adaptor",
    domains: {
      auditory: "sensitive",
      tactile: "sensitive",
      movement: "seeking",
      visual: "sensitive",
      smellTaste: "seeking",
      everyday: "neutral",
    },
    concern:
      "The separate senses keep their opposing labels, but the overall average becomes Adaptor. A person with strong needs in both directions can be described as if the pattern were moderate.",
    averaging: true,
  },
  {
    id: "boundary-observer",
    name: "Observer / Adaptor boundary",
    blurb: "The overall Observer average sits just above 50%. The Explorer average is 0%. Everyday stays under the 50% floor on its own.",
    build: "plan",
    plans: LAB_BOUNDARY_OBSERVER,
    expectedProfile: "sensitive",
    expectedPattern: "Observer",
    domains: {
      auditory: "sensitive",
      tactile: "sensitive",
      movement: "sensitive",
      visual: "sensitive",
      smellTaste: "sensitive",
      everyday: "neutral",
    },
  },
  {
    id: "boundary-explorer",
    name: "Adaptor / Explorer boundary",
    blurb: "The overall Explorer average sits just above 50%. The Observer average is 0%. Touch and visual stay under the floor on their own because one endorsement is not half of a three-item list.",
    build: "plan",
    plans: LAB_BOUNDARY_EXPLORER,
    expectedProfile: "seeking",
    expectedPattern: "Explorer",
    domains: {
      auditory: "seeking",
      tactile: "neutral",
      movement: "seeking",
      visual: "neutral",
      smellTaste: "seeking",
      everyday: "seeking",
    },
  },
  {
    id: "exact-floor",
    name: "Exactly on a threshold",
    blurb: "Auditory is endorsed on exactly 3 of 6 Observer items, which is the 50% floor, and on no Explorer items. The other senses are unendorsed, so the overall average is not on that floor. An exact 20-point gap is not available inside a single sense with these list lengths.",
    build: "plan",
    plans: {
      shared: {
        auditory: { sensitive: 3, seeking: 0 },
        tactile: { sensitive: 0, seeking: 0 },
        movement: { sensitive: 0, seeking: 0 },
        visual: { sensitive: 0, seeking: 0 },
        smellTaste: { sensitive: 0, seeking: 0 },
        everyday: { sensitive: 0, seeking: 0 },
      },
    },
    expectedProfile: "neutral",
    expectedPattern: "Adaptor overall, Observer for hearing",
    domains: {
      auditory: "sensitive",
      tactile: "neutral",
      movement: "neutral",
      visual: "neutral",
      smellTaste: "neutral",
      everyday: "neutral",
    },
  },
  {
    id: "one-below",
    name: "One endorsement below the Observer line",
    blurb: "Same pattern as the Observer boundary, with one fewer Auditory Observer endorsement.",
    build: "plan",
    plans: {
      standard: null,
      couple: null,
    },
    planShift: { base: LAB_BOUNDARY_OBSERVER, domain: "auditory", pole: "sensitive", delta: -1 },
    expectedProfile: "neutral",
    expectedPattern: "Adaptor",
    domains: {
      auditory: "neutral",
      tactile: "sensitive",
      movement: "sensitive",
      visual: "sensitive",
      smellTaste: "sensitive",
      everyday: "neutral",
    },
  },
  {
    id: "one-above",
    name: "One endorsement above the Observer line",
    blurb: "Same pattern as the Observer boundary, with one more Auditory Observer endorsement.",
    build: "plan",
    planShift: { base: LAB_BOUNDARY_OBSERVER, domain: "auditory", pole: "sensitive", delta: 1 },
    expectedProfile: "sensitive",
    expectedPattern: "Observer",
    domains: {
      auditory: "sensitive",
      tactile: "sensitive",
      movement: "sensitive",
      visual: "sensitive",
      smellTaste: "sensitive",
      everyday: "neutral",
    },
  },
  {
    id: "incomplete",
    name: "Incomplete questionnaire",
    blurb: "Only the hearing questions are answered, all in the Observer direction. Every other sense is left blank.",
    build: "incomplete",
    expectedProfile: "sensitive",
    expectedPattern: "Observer",
    domains: { auditory: "sensitive" },
    concern:
      "Blank senses are left out of the average rather than counted as zero. One finished sense can decide the overall label. The live questionnaire blocks an unfinished page. The scoring function itself does not.",
  },
  {
    id: "alternating",
    name: "Alternating extreme answers",
    blurb: "Inside each sense, answers alternate Yes, No, Yes, No.",
    build: "alternating",
    expectedProfile: "neutral",
    expectedPattern: "Adaptor by the arithmetic only",
    concern:
      "Alternating Yes and No has no clinical target. The locked result is Adaptor. Adult, teen, and parent show about 48% Observer and 52% Explorer, so the 20-point lead is missed. If that arithmetic changes, this row fails. It stays on review because the pattern itself is not a meaningful expected style.",
  },
  {
    id: "random",
    name: "Fixed random pattern",
    blurb: "One repeatable Yes/No pattern from seed 20261005. The same seed always builds the same answers.",
    build: "random",
    expectedProfile: "seeking",
    expectedByRespondent: { couple: "neutral" },
    expectedPattern: "Locked arithmetic, not a clinical target",
    concern:
      "Seed 20261005 has no clinical target. Adult, teen, and parent average about 39% Observer and 83% Explorer, which clears the Explorer rule. Couple averages about 56% and 59%, a gap of about 4 points, so the rule returns Adaptor. A change in those results is a fail. The row stays on review because a coin-toss pattern is not an expected sensory style.",
  },
  {
    id: "few-extremes",
    name: "Mostly unendorsed, one extreme sense",
    blurb: "Hearing is fully Observer. Every other item is answered so that it does not endorse either pole.",
    build: "plan",
    plans: {
      shared: {
        auditory: { sensitive: 99, seeking: 0 },
        tactile: { sensitive: 0, seeking: 0 },
        movement: { sensitive: 0, seeking: 0 },
        visual: { sensitive: 0, seeking: 0 },
        smellTaste: { sensitive: 0, seeking: 0 },
        everyday: { sensitive: 0, seeking: 0 },
      },
    },
    expectedProfile: "neutral",
    expectedPattern: "Adaptor overall, Observer for hearing",
    domains: {
      auditory: "sensitive",
      tactile: "neutral",
      movement: "neutral",
      visual: "neutral",
      smellTaste: "neutral",
      everyday: "neutral",
    },
    concern:
      "The overall label is Adaptor while hearing is Observer. Reading only the overall word hides a clear single-sense pattern.",
  },
];

function labResolveAnswers(spec, respondent) {
  if (spec.planShift) {
    const plan = labShiftPlan(spec.planShift.base, respondent, spec.planShift.domain, spec.planShift.pole, spec.planShift.delta);
    return labAnswersFromPlan(respondent, plan);
  }
  return labAnswersFor(spec, respondent);
}

function labExpectedProfile(spec, respondent) {
  if (spec.expectedByRespondent && Object.prototype.hasOwnProperty.call(spec.expectedByRespondent, respondent)) {
    return spec.expectedByRespondent[respondent];
  }
  return spec.expectedProfile;
}

function labCaseStatus(spec, pack, expectedProfile) {
  if (spec.build === "na") return "review";
  if (!pack) return "review";
  if (expectedProfile && pack.overall.profile !== expectedProfile) return "fail";
  if (spec.domains) {
    const missed = Object.keys(spec.domains).some((id) => {
      const score = pack.scores.find((row) => row.id === id);
      return !score || score.profile !== spec.domains[id];
    });
    if (missed) return "fail";
  }
  if (spec.concern) return "review";
  return "pass";
}

function labRunCases(respondent) {
  return LAB_CASES.map((spec) => {
    const answers = labResolveAnswers(spec, respondent);
    const pack = answers ? labScore(respondent, answers) : null;
    const expectedProfile = labExpectedProfile(spec, respondent);
    const status = labCaseStatus(spec, pack, expectedProfile);
    const rounding = pack ? labRoundingMismatch(pack.overall) : false;
    return { spec, answers, pack, status, rounding, expectedProfile };
  });
}

function labRoundingMismatch(overall) {
  if (!overall || typeof overall.sensitiveRate !== "number" || typeof overall.seekingRate !== "number") {
    return false;
  }
  const observer = overall.sensitive;
  const explorer = overall.seeking;
  const looksObserver = observer >= 50 && observer - explorer >= 20;
  const looksExplorer = explorer >= 50 && explorer - observer >= 20;
  const naive = looksObserver ? "sensitive" : looksExplorer ? "seeking" : "neutral";
  return naive !== overall.profile;
}

function labQuestionRows(respondent) {
  const domains = labDomains(respondent);
  const rows = [];
  let number = 0;
  const seen = new Map();
  domains.forEach((domain) => {
    domain.questions.forEach((question, index) => {
      number += 1;
      const key = String(question.text || "").trim().toLowerCase();
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key).push(number);
      rows.push({
        number,
        index,
        domainId: domain.id,
        domain: domain.shortTitle || domain.title,
        text: question.text,
        type: question.type || "",
        pole: labPole(question.type),
      });
    });
  });
  rows.forEach((row) => {
    row.duplicate = row.text && seen.get(String(row.text).trim().toLowerCase()).length > 1;
  });
  return rows;
}

const LAB_DIRECTION_NOTES = [
  {
    domain: "movement",
    index: 5,
    respondents: ["adult", "teen", "parent", "couple"],
    construct: "Movement threshold",
    problem: "Preferring gentler activity is scored as Observer. It may describe activity choice rather than a low sensory threshold.",
  },
  {
    domain: "visual",
    index: 0,
    respondents: ["adult", "teen", "parent", "couple"],
    construct: "Visual sensitivity",
    problem: "Preferring a tidy space is scored as Observer. Organisation can also reflect habit or personality.",
  },
  {
    domain: "everyday",
    index: 1,
    respondents: ["adult", "teen", "parent", "couple"],
    construct: "Everyday sensory load",
    problem: "Enjoying groups is scored as Explorer. This can reflect social preference as well as sensory seeking.",
  },
  {
    domain: "everyday",
    index: 2,
    respondents: ["adult", "teen", "parent", "couple"],
    construct: "Everyday sensory load",
    problem: "Preferring small groups is scored as Observer. This can reflect social preference as well as sensory sensitivity.",
  },
  {
    domain: "visual",
    index: 7,
    respondents: ["couple"],
    construct: "Visual sensitivity",
    problem: "The couple form has a second tidiness item scored as Observer, so a preference for neatness can be counted twice.",
  },
  {
    domain: "visual",
    index: 8,
    respondents: ["couple"],
    construct: "Visual sensitivity",
    problem: "Comfort with clutter is reverse-scored toward Observer. Together with the tidiness items, neatness and clutter can pull the same way.",
  },
  {
    domain: "tactile",
    index: 8,
    respondents: ["couple"],
    construct: "Touch",
    problem: "Preferring less physical affection with a partner is scored as Observer. It may describe the relationship as well as touch sensitivity.",
  },
];

function labDirectionNote(respondent, row) {
  return (
    LAB_DIRECTION_NOTES.find(
      (note) =>
        note.domain === row.domainId &&
        note.index === row.index &&
        note.respondents.indexOf(respondent) !== -1
    ) || null
  );
}

function labParentInference(text) {
  return /overwhelmed|uncomfortable|feel|feels|feeling|bored|too much|distract|notice|unsettled|dizzy|sensitive|bother|oorweldig|ongemaklik|voel|verveeld|te veel|aflei|onseker|duiselig|sensitief/i.test(
    text || ""
  );
}

function labAudit(respondent) {
  return labQuestionRows(respondent).map((row) => {
    const flags = [];
    let status = "pass";
    const note = labDirectionNote(respondent, row);
    if (!row.type) {
      status = "fail";
      flags.push("No scoring type is attached to this question.");
    }
    if (row.duplicate) {
      status = status === "fail" ? status : "review";
      flags.push("This wording appears more than once.");
    }
    if (row.pole === "neutral") {
      status = status === "fail" ? status : "review";
      flags.push("Answered and then left out of both rates, so it cannot change the classification.");
    }
    if (row.type && String(row.type).endsWith("-if-no")) {
      status = status === "fail" ? status : "review";
      flags.push("Reverse scored. A No counts toward " + labTrail(row.pole) + ". Check that the wording still matches that direction.");
    }
    if (note) {
      status = status === "fail" ? status : "review";
      flags.push(note.problem);
    }
    if (respondent === "parent" && labParentInference(row.text)) {
      status = status === "fail" ? status : "review";
      flags.push("May ask a parent to infer an inner experience rather than only report what they can see.");
    }
    const endorse =
      row.pole === "sensitive"
        ? String(row.type).endsWith("-if-no")
          ? "No counts as Observer"
          : "Yes counts as Observer"
        : row.pole === "seeking"
          ? "Yes counts as Explorer"
          : "Not in either rate";
    return Object.assign({}, row, {
      status,
      flags,
      endorse,
      note,
      observer: row.pole === "sensitive" ? "1 if endorsed" : "0",
      explorer: row.pole === "seeking" ? "1 if endorsed" : "0",
      adaptor: "0 — Adaptor is not an item score",
    });
  });
}

function labWording(respondent, audit) {
  return audit
    .filter((row) => row.status !== "pass")
    .map((row) => ({
      question: row.text,
      number: row.number,
      domain: row.domain,
      construct: (row.note && row.note.construct) || row.domain + " · " + (row.pole ? labTrail(row.pole) : "not scored"),
      problem: row.flags.join(" "),
      direction: row.endorse,
      review: "Read the item on its own. Decide whether Yes or No still means what the scoring type assumes. This flag is not a rewrite and it is not a verdict that the item is invalid.",
    }));
}

function labMixed(respondent) {
  const moderate = labScore(respondent, labAnswersFor({ build: "endorse", endorse: "none" }, respondent));
  const scenarios = [
    {
      id: "auditory-movement",
      name: "High auditory sensitivity + high movement seeking",
      plan: {
        auditory: { sensitive: 99, seeking: 0 },
        movement: { sensitive: 0, seeking: 99 },
      },
    },
    {
      id: "visual-movement",
      name: "High visual sensitivity + high movement seeking",
      plan: {
        visual: { sensitive: 99, seeking: 0 },
        movement: { sensitive: 0, seeking: 99 },
      },
      note: "Movement includes heavy work, spinning, and activity. Proprioception is not a separate score.",
    },
    {
      id: "tactile-movement",
      name: "High tactile sensitivity + high movement seeking",
      plan: {
        tactile: { sensitive: 99, seeking: 0 },
        movement: { sensitive: 0, seeking: 99 },
      },
    },
    {
      id: "split-all",
      name: "Three senses fully Observer, three fully Explorer",
      plan: {
        auditory: { sensitive: 99, seeking: 0 },
        tactile: { sensitive: 99, seeking: 0 },
        visual: { sensitive: 99, seeking: 0 },
        movement: { sensitive: 0, seeking: 99 },
        smellTaste: { sensitive: 0, seeking: 99 },
        everyday: { sensitive: 0, seeking: 99 },
      },
    },
    {
      id: "half",
      name: "Extreme Observer in half the senses, extreme Explorer in others",
      plan: LAB_MIXED_HALF.shared,
    },
  ];
  return scenarios.map((scenario) => {
    const pack = labScore(respondent, labAnswersFromPlan(respondent, scenario.plan));
    const sameLabel = pack.overall.profile === moderate.overall.profile;
    const closeScores =
      Math.abs((pack.overall.sensitive || 0) - (moderate.overall.sensitive || 0)) <= 15 &&
      Math.abs((pack.overall.seeking || 0) - (moderate.overall.seeking || 0)) <= 15;
    return {
      id: scenario.id,
      name: scenario.name,
      note: scenario.note || "",
      pack,
      moderate,
      sameLabel,
      closeScores,
      concern: sameLabel,
    };
  });
}

function labDomainsReport(respondent, audit) {
  const domains = getSensoryDomains("en", respondent);
  return domains.map((domain) => {
    const items = audit.filter((row) => row.domainId === domain.id);
    const observer = items.filter((row) => row.pole === "sensitive").length;
    const explorer = items.filter((row) => row.pole === "seeking").length;
    const adaptor = items.filter((row) => row.pole === "neutral").length;
    const larger = Math.max(observer, explorer, 1);
    const smaller = Math.min(observer, explorer);
    return {
      id: domain.id,
      title: domain.shortTitle || domain.title,
      blurb: domain.blurb || "",
      count: items.length,
      observer,
      explorer,
      adaptor,
      imbalance: larger > 0 ? Math.round((1 - smaller / larger) * 100) : 0,
    };
  });
}

function labContribution(respondent) {
  const domains = getSensoryDomains("en", respondent);
  const domainCount = domains.length || 1;
  const rows = [];
  let number = 0;
  domains.forEach((domain) => {
    const observerPool = domain.questions.filter((question) => labPole(question.type) === "sensitive").length;
    const explorerPool = domain.questions.filter((question) => labPole(question.type) === "seeking").length;
    domain.questions.forEach((question, index) => {
      number += 1;
      const pole = labPole(question.type);
      const observerShare = pole === "sensitive" && observerPool ? 1 / observerPool : 0;
      const explorerShare = pole === "seeking" && explorerPool ? 1 / explorerPool : 0;
      const overallShare = (observerShare || explorerShare) / domainCount;
      let flag = "pass";
      let note = "Ordinary share of its list.";
      if (!pole) {
        flag = "fail";
        note = "No scoring type.";
      } else if (pole === "neutral") {
        flag = "review";
        note = "This answer cannot move the classification.";
      } else if (observerShare >= 0.3 || explorerShare >= 0.3) {
        flag = "review";
        note = "One answer moves this sense by " + Math.round((observerShare || explorerShare) * 100) + " points because the list is short.";
      }
      rows.push({
        number,
        index,
        domain: domain.shortTitle || domain.title,
        text: question.text,
        observerShare,
        explorerShare,
        overallShare,
        flag,
        note,
      });
    });
  });
  return rows;
}

function labDomainStrips(domain) {
  const observerPool = domain.questions.filter((question) => labPole(question.type) === "sensitive").length;
  const explorerPool = domain.questions.filter((question) => labPole(question.type) === "seeking").length;
  function strip(kind, pool, pole) {
    const steps = [];
    let previous = null;
    for (let count = 0; count <= pool; count += 1) {
      const left = { sensitive: 0, seeking: 0 };
      left[pole] = count;
      const answers = domain.questions.map((question) => {
        const itemPole = labPole(question.type);
        if (itemPole === pole && left[pole] > 0) {
          left[pole] -= 1;
          return labAnswer(question.type, true);
        }
        return labAnswer(question.type, false);
      });
      const result = scoreDomain(domain.questions, answers);
      const changed = previous && previous !== result.profile;
      steps.push({ count, profile: result.profile, rate: pole === "sensitive" ? result.sensitiveRate : result.seekingRate, changed });
      previous = result.profile;
    }
    return { kind, steps };
  }
  return [strip("Observer endorsements, Explorer held at none", observerPool, "sensitive"), strip("Explorer endorsements, Observer held at none", explorerPool, "seeking")];
}

function labThresholds(respondent) {
  return getSensoryDomains("en", respondent).map((domain) => ({
    id: domain.id,
    title: domain.shortTitle || domain.title,
    strips: labDomainStrips(domain),
  }));
}

function labSensitivity(respondent) {
  const targets = ["boundary-observer", "one-below", "mixed-half", "strong-observer", "all-yes"];
  const cases = labRunCases(respondent).filter((row) => targets.indexOf(row.spec.id) !== -1 && row.answers);
  return cases.map((row) => {
    const flips = [];
    const domains = getSensoryDomains("en", respondent);
    domains.forEach((domain) => {
      (row.answers[domain.id] || []).forEach((value, index) => {
        if (typeof value !== "boolean") return;
        const next = labCloneAnswers(row.answers);
        next[domain.id][index] = !value;
        const scored = labScore(respondent, next);
        if (scored.overall.profile !== row.pack.overall.profile) {
          flips.push({
            domain: domain.shortTitle || domain.title,
            number: index + 1,
            text: domain.questions[index].text,
            from: value ? "Yes" : "No",
            to: value ? "No" : "Yes",
            before: row.pack.overall.profile,
            after: scored.overall.profile,
          });
        }
      });
    });
    return { id: row.spec.id, name: row.spec.name, before: row.pack.overall.profile, flips };
  });
}

function labIntegrity(respondent, audit, cases) {
  const checks = [];
  const missing = audit.filter((row) => !row.type);
  checks.push({
    name: "Every question has a scoring type",
    status: missing.length ? "fail" : "pass",
    detail: missing.length ? missing.length + " questions have no type." : "Every loaded question has a type.",
  });
  checks.push({
    name: "Stable question IDs",
    status: "warning",
    detail: "Questions are stored by their position in the sense, not by an ID. Reordering items would attach old answers to new wording.",
  });
  const dupes = audit.filter((row) => row.duplicate);
  checks.push({
    name: "Duplicate wording",
    status: dupes.length ? "warning" : "pass",
    detail: dupes.length ? dupes.length + " items repeat wording." : "No exact repeated wording in this questionnaire.",
  });
  const full = cases.find((row) => row.spec.id === "all-yes");
  const expectedScored = audit.length;
  const scored = full && full.pack ? full.pack.overall.scored : 0;
  checks.push({
    name: "Every question reaches the scorer",
    status: scored === expectedScored ? "pass" : "fail",
    detail: "All Yes scored " + scored + " of " + expectedScored + " questions.",
  });
  const overMax = (cases || []).some((row) => {
    if (!row.pack) return false;
    return row.pack.scores.some(
      (score) =>
        score.sensitive > score.sensitivePool ||
        score.seeking > score.seekingPool ||
        (typeof score.sensitiveRate === "number" && score.sensitiveRate > 1) ||
        (typeof score.seekingRate === "number" && score.seekingRate > 1) ||
        row.pack.overall.sensitive > 100 ||
        row.pack.overall.seeking > 100
    );
  });
  checks.push({
    name: "Scores stay inside their maximum",
    status: overMax ? "fail" : "pass",
    detail: overMax ? "A rate went above 100% or a count went above its list." : "Rates stayed at or under 100% on the automated cases.",
  });
  const blank = cases.find((row) => row.spec.id === "incomplete");
  checks.push({
    name: "Missing answers",
    status: "warning",
    detail: blank
      ? "The unfinished case classified as " +
        labTrail(blank.pack.overall.profile) +
        ". Blank senses were omitted from the average. The questionnaire screen blocks this; the function does not."
      : "Incomplete case did not run.",
  });
  const floor = classifyRates(0.5, 0.3);
  const underFloor = classifyRates(0.49, 0);
  const tie = classifyRates(1, 1);
  const gapMiss = classifyRates(0.5, 0.31);
  const thresholdOk =
    floor.profile === "sensitive" &&
    underFloor.profile === "neutral" &&
    tie.profile === "neutral" &&
    gapMiss.profile === "neutral" &&
    classifyRates(0, 0.5).profile === "seeking";
  checks.push({
    name: "Published thresholds",
    status: thresholdOk ? "pass" : "fail",
    detail: thresholdOk
      ? "50% of a pole and a 20-point lead, checked on fixed pairs: 0.50 vs 0.30 is Observer, 0.49 vs 0 is Adaptor, 1 vs 1 is Adaptor, 0.50 vs 0.31 is Adaptor, 0 vs 0.50 is Explorer."
      : "classifyRates did not return the hand-specified label for a fixed pair.",
  });
  const rounded = cases.filter((row) => row.rounding);
  checks.push({
    name: "Rounding versus classification",
    status: rounded.length ? "warning" : "pass",
    detail: rounded.length
      ? rounded.map((row) => row.spec.name).join(", ") + " show rounded percentages that suggest a different label from the one returned."
      : "On these cases, the rounded card percentages suggest the same label as the unrounded rule.",
  });
  checks.push({
    name: "Frontend and backend",
    status: "pass",
    detail: "The server stores answers and does not calculate a profile. There is no second scoring result to compare. Reports on this device recalculate with scoreOverall.",
  });
  checks.push({
    name: "Report graphs",
    status: "warning",
    detail: "Each sense on the report uses a fixed marker for Observer, Adaptor, or Explorer. The overall marker uses a stretched balance scale. Neither marker is the Observer percentage.",
  });
  checks.push({
    name: "Couple story layer",
    status: respondent === "couple" ? "warning" : "pass",
    detail:
      respondent === "couple"
        ? "The couple classification uses scoreOverall. Separate story functions also read selected answers for the couple narrative. This lab checks the classification, not those paragraphs."
        : "Adult, teen, and parent reports take the classification from scoreOverall.",
  });
  const af = getSensoryDomains("af", respondent);
  const en = getSensoryDomains("en", respondent);
  const sameShape = af.every((domain, index) => domain.questions.length === en[index].questions.length && domain.questions.every((question, item) => question.type === en[index].questions[item].type));
  checks.push({
    name: "English and Afrikaans item map",
    status: sameShape ? "pass" : "fail",
    detail: sameShape ? "Afrikaans uses the same types in the same order. Wording differs." : "English and Afrikaans types or counts differ.",
  });
  return checks;
}

function labCounts(cases) {
  return {
    pass: cases.filter((row) => row.status === "pass").length,
    review: cases.filter((row) => row.status === "review").length,
    fail: cases.filter((row) => row.status === "fail").length,
    total: cases.length,
  };
}

function labIssues(report) {
  const issues = [];
  const allYes = report.cases.find((row) => row.spec.id === "all-yes");
  const mixed = report.cases.find((row) => row.spec.id === "mixed-half");
  const incomplete = report.cases.find((row) => row.spec.id === "incomplete");
  if (report.cases.some((row) => row.status === "fail")) {
    issues.push({
      priority: "high",
      section: "suite",
      title: "An automated case missed its hand-specified result",
      text: report.cases
        .filter((row) => row.status === "fail")
        .map((row) => row.spec.name)
        .join(", "),
    });
  }
  if (allYes && allYes.pack) {
    issues.push({
      priority: "high",
      section: "suite",
      title: "Answering Yes to everything becomes Adaptor",
      text:
        "Observer average " +
        allYes.pack.overall.sensitive +
        "%, Explorer average " +
        allYes.pack.overall.seeking +
        "%. The gap is under 20 points, so the label is Adaptor even though both patterns are nearly full.",
    });
  }
  if (mixed && mixed.pack) {
    issues.push({
      priority: "high",
      section: "mixed",
      title: "Opposing senses can average into Adaptor",
      text: "Hearing, touch, and visual stay Observer while movement and smell/taste stay Explorer. The overall label is " + labTrail(mixed.pack.overall.profile) + ".",
    });
  }
  if (incomplete && incomplete.pack) {
    issues.push({
      priority: "high",
      section: "suite",
      title: "Blank senses drop out of the average",
      text: "A questionnaire with only hearing answered was classified " + labTrail(incomplete.pack.overall.profile) + ". The live form blocks unfinished pages. The scoring function does not.",
    });
  }
  const short = report.contribution.filter((row) => row.flag === "review" && row.note.indexOf("short") !== -1).length;
  if (short) {
    issues.push({
      priority: "medium",
      section: "contribution",
      title: "Some answers move a sense much further than others",
      text: short + " items sit on a short list, so one Yes changes that sense’s rate by about a third.",
    });
  }
  const excluded = report.audit.filter((row) => row.pole === "neutral").length;
  if (excluded) {
    issues.push({
      priority: "medium",
      section: "audit",
      title: excluded + " questions never enter the classification",
      text: "They are stored, then left out of both rates. Adaptor is what remains when neither pole clears the rule. It is not a score these items add up to.",
    });
  }
  if (report.cases.some((row) => row.rounding)) {
    issues.push({
      priority: "medium",
      section: "threshold",
      title: "A rounded percentage can suggest the wrong label",
      text: report.cases
        .filter((row) => row.rounding)
        .map((row) => row.spec.name)
        .join(", "),
    });
  }
  issues.push({
    priority: "medium",
    section: "integrity",
    title: "The report graphs do not plot the percentages",
    text: "Sense markers snap to Observer, Adaptor, or Explorer. The overall marker is a stretched balance scale.",
  });
  issues.push({
    priority: "low",
    section: "compare",
    title: "The score card and the trail page use different words",
    text: "The engine says sensitive, neutral, and seeking. The trail page says Observer, Adaptor, and Explorer. The score card still says Sensitive, Neutral, and Seeking.",
  });
  issues.push({
    priority: "low",
    section: "integrity",
    title: "Questions have no permanent ID",
    text: "Answers are kept by position. That is safe only while the item order stays the same.",
  });
  return issues;
}

function labBuildReport(respondent) {
  const audit = labAudit(respondent);
  const cases = labRunCases(respondent);
  const integrity = labIntegrity(respondent, audit, cases);
  return {
    respondent,
    questionCount: audit.length,
    audit,
    wording: labWording(respondent, audit),
    cases,
    counts: labCounts(cases),
    mixed: labMixed(respondent),
    domains: labDomainsReport(respondent, audit),
    contribution: labContribution(respondent),
    thresholds: labThresholds(respondent),
    sensitivity: labSensitivity(respondent),
    integrity,
    issues: null,
  };
}

function labBundle() {
  const language = typeof state !== "undefined" && state.language === "af" ? "af" : "en";
  if (testLab.bundle && testLab.bundle.language === language) return testLab.bundle;
  const reports = {};
  TEST_LAB_RESPONDENTS.forEach((item) => {
    reports[item.id] = labBuildReport(item.id);
    reports[item.id].issues = labIssues(reports[item.id]);
  });
  testLab.bundle = { reports, language, builtAt: new Date().toISOString() };
  return testLab.bundle;
}

function labReport() {
  const bundle = labBundle();
  return bundle.reports[testLab.respondent] || bundle.reports.adult;
}

function labSimulate(respondent, mode, count, seed) {
  const domains = getSensoryDomains("en", respondent);
  const totals = { sensitive: 0, neutral: 0, seeking: 0 };
  const random = labMulberry32(seed);
  for (let index = 0; index < count; index += 1) {
    const answers = {};
    domains.forEach((domain, domainIndex) => {
      let extreme = null;
      if (mode === "domain-extremes") {
        const roll = random();
        extreme = roll < 0.34 ? "sensitive" : roll < 0.67 ? "seeking" : "none";
      }
      answers[domain.id] = domain.questions.map((question) => {
        const pole = labPole(question.type);
        if (!pole || pole === "neutral") return random() < 0.5;
        if (mode === "domain-extremes") return labAnswer(question.type, pole === extreme);
        let chance = 0.5;
        if (mode === "observer") chance = pole === "sensitive" ? 0.85 : 0.15;
        else if (mode === "explorer") chance = pole === "seeking" ? 0.85 : 0.15;
        else if (mode === "neutral-weighted") chance = 0.15;
        else if (mode === "mixed") {
          const observerDomain = domainIndex % 2 === 0;
          chance = observerDomain ? (pole === "sensitive" ? 0.9 : 0.1) : pole === "seeking" ? 0.9 : 0.1;
        }
        return labAnswer(question.type, random() < chance);
      });
    });
    const overall = scoreOverall(scoreAllDomains(answers, domains, "en", respondent), "en", respondent);
    totals[overall.profile] += 1;
  }
  return { respondent, mode, count, seed, totals };
}

function labBiasText(sample) {
  if (!sample) return [];
  const n = sample.count || 1;
  const pct = (key) => Math.round((sample.totals[key] / n) * 100);
  const lines = [
    pct("sensitive") + "% Observer, " + pct("neutral") + "% Adaptor, " + pct("seeking") + "% Explorer in this random sample.",
  ];
  const ranked = ["sensitive", "neutral", "seeking"].sort((a, b) => sample.totals[b] - sample.totals[a]);
  if (ranked[0] === "neutral" && pct("neutral") >= 45) {
    lines.push(pct("neutral") + "% of these randomly generated questionnaires classified as Adaptor.");
  }
  if (Math.abs(pct("sensitive") - pct("seeking")) >= 15) {
    lines.push(
      labTrail(ranked[0] === "neutral" ? (pct("sensitive") > pct("seeking") ? "sensitive" : "seeking") : ranked[0]) +
        " appeared more often than the other pole under this Yes/No coin toss. That describes this sample. It does not prove the questionnaire is valid or invalid."
    );
  }
  return lines;
}

function labReadHistory() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(TEST_LAB_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function labWriteHistory(entries) {
  localStorage.setItem(TEST_LAB_HISTORY_KEY, JSON.stringify(entries.slice(0, 40)));
}

function labSaveHistory() {
  const report = labReport();
  const integrityFails = report.integrity.filter((check) => check.status === "fail").length;
  const integrityWarnings = report.integrity.filter((check) => check.status === "warning").length;
  const entry = {
    marker: "TEST DATA",
    savedAt: new Date().toISOString(),
    respondent: report.respondent,
    questionCount: report.questionCount,
    passed: report.counts.pass,
    review: report.counts.review,
    failed: report.counts.fail,
    integrityFails,
    integrityWarnings,
    mixedFlags: report.mixed.filter((row) => row.concern).length,
    simulation:
      testLab.simulation && testLab.simulation.respondent === report.respondent
        ? {
            mode: testLab.simulation.mode,
            count: testLab.simulation.count,
            totals: testLab.simulation.totals,
          }
        : null,
  };
  const history = labReadHistory();
  history.unshift(entry);
  labWriteHistory(history);
  testLab.notice = "Test summary saved in the test-data store. No patient record was created.";
}

function labExportText() {
  const bundle = labBundle();
  const report = labReport();
  const lines = [
    "SENSORY TRAIL QUESTIONNAIRE TEST LAB",
    "TEST DATA — not a clinical record",
    "",
    TEST_LAB_DISCLAIMER,
    "",
    "Date: " + new Date().toISOString(),
    "Questionnaire: " + report.respondent,
    "Questions: " + report.questionCount,
    "Item map: questions.js as loaded on this page. English and Afrikaans share types.",
    "Scoring: scoring.js scoreDomain, scoreAllDomains, scoreOverall, classifyRates.",
    "Rule: a pole is named only when its rate is at least 50% and it leads the other pole by at least 20 points. Otherwise the result is Adaptor.",
    "",
    "AUTOMATED CASES",
    report.counts.pass + " passed, " + report.counts.review + " review, " + report.counts.fail + " failed.",
  ];
  report.cases.forEach((row) => {
    lines.push(
      row.spec.name +
        " — expected " +
        row.spec.expectedPattern +
        " — actual " +
        (row.pack ? labTrail(row.pack.overall.profile) : "not run") +
        " — " +
        row.status.toUpperCase()
    );
    if (row.concern || row.spec.concern) lines.push("  " + row.spec.concern);
  });
  lines.push("", "MIXED PATTERNS");
  report.mixed.forEach((row) => {
    lines.push(
      row.name +
        ": " +
        labTrail(row.pack.overall.profile) +
        " (Observer " +
        row.pack.overall.sensitive +
        "%, Explorer " +
        row.pack.overall.seeking +
        "%). Genuinely moderate is " +
        labTrail(row.moderate.overall.profile) +
        "." +
        (row.concern ? " POTENTIAL AVERAGING / CLASSIFICATION CONCERN." : "")
    );
  });
  lines.push("", "INTEGRITY");
  report.integrity.forEach((check) => {
    lines.push(check.status.toUpperCase() + " — " + check.name + " — " + check.detail);
  });
  lines.push("", "TOP ISSUES");
  report.issues.forEach((issue) => {
    lines.push(issue.priority.toUpperCase() + " — " + issue.title + " — " + issue.text);
  });
  lines.push("", "ALL QUESTIONNAIRES");
  TEST_LAB_RESPONDENTS.forEach((item) => {
    const other = bundle.reports[item.id];
    lines.push(
      item.label +
        ": " +
        other.questionCount +
        " questions, tests " +
        other.counts.pass +
        " pass / " +
        other.counts.review +
        " review / " +
        other.counts.fail +
        " fail."
    );
  });
  if (testLab.simulation) {
    const sim = testLab.simulation;
    lines.push("", "SIMULATION", sim.count + " " + sim.mode + " answer sets for " + sim.respondent);
    lines.push(
      "Observer " +
        sim.totals.sensitive +
        ", Adaptor " +
        sim.totals.neutral +
        ", Explorer " +
        sim.totals.seeking
    );
    labBiasText(sim).forEach((line) => lines.push(line));
  }
  lines.push("", TEST_LAB_DISCLAIMER);
  return lines.join("\n");
}

function labDownload(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function labBadge(status) {
  const label = status === "warning" ? "Warning" : status === "pass" ? "Pass" : status === "fail" ? "Fail" : "Review";
  return '<span class="test-lab-badge test-lab-badge--' + labEscape(status) + '">' + label + "</span>";
}

function labBar(percent, tone) {
  const width = Math.max(0, Math.min(100, Number(percent) || 0));
  return (
    '<div class="test-lab-bar test-lab-bar--' +
    tone +
    '" role="img" aria-label="' +
    width +
    '%"><span style="width:' +
    width +
    '%"></span></div>'
  );
}

function labFold(id, title, body, count) {
  const open = testLab.open[id] ? " open" : "";
  return (
    '<details class="test-lab-fold" data-lab-section="' +
    id +
    '"' +
    open +
    "><summary><span>" +
    labEscape(title) +
    "</span>" +
    (count ? '<em>' + labEscape(count) + "</em>" : "") +
    "</summary><div class=\"test-lab-fold__body\">" +
    body +
    "</div></details>"
  );
}

function labAllowed() {
  try {
    if (typeof currentAuthUser !== "function") return false;
    const user = currentAuthUser();
    if (!user || user.role !== "admin" || user.status !== "active") return false;
    if (typeof adminPreviewMode === "function" && adminPreviewMode() !== "admin") return false;
    return true;
  } catch (error) {
    return false;
  }
}

function labBind() {
  if (testLab.bound || typeof document === "undefined") return;
  testLab.bound = true;
  document.addEventListener(
    "toggle",
    (event) => {
      const fold = event.target;
      if (!fold || !fold.dataset || !fold.dataset.labSection) return;
      testLab.open[fold.dataset.labSection] = Boolean(fold.open);
    },
    true
  );
}

function labRenderSuite(report) {
  const rows = report.cases
    .map((row) => {
      const actual = row.pack ? labTrail(row.pack.overall.profile) : "Not run";
      const selected = testLab.inspectId === row.spec.id ? " is-selected" : "";
      return (
        "<tr class=\"" +
        selected +
        "\"><td><button type=\"button\" class=\"test-lab-link\" data-action=\"test-lab-inspect\" data-lab-id=\"" +
        labEscape(row.spec.id) +
        "\">" +
        labEscape(row.spec.name) +
        "</button><p class=\"test-lab-muted\">" +
        labEscape(row.spec.blurb) +
        "</p></td><td>" +
        labEscape(row.spec.expectedPattern) +
        (row.expectedProfile ? "<br>" + labTrail(row.expectedProfile) : "") +
        "</td><td>" +
        labEscape(actual) +
        "</td><td>" +
        (row.pack ? labRateText(row.pack.overall.sensitiveRate) : "—") +
        "</td><td>" +
        (row.pack ? labRateText(row.pack.overall.seekingRate) : "—") +
        "</td><td>" +
        labBadge(row.status) +
        (row.spec.concern ? '<p class="test-lab-muted">' + labEscape(row.spec.concern) + "</p>" : "") +
        (row.rounding ? '<p class="test-lab-muted">Rounded percentages suggest a different label.</p>' : "") +
        (row.averaging || row.spec.averaging ? '<p class="test-lab-flag">Potential averaging / classification concern</p>' : "") +
        "</td></tr>"
      );
    })
    .join("");
  return (
    '<div class="test-lab-table-wrap"><table class="test-lab-table"><thead><tr><th>Test</th><th>Expected</th><th>Actual</th><th>Observer</th><th>Explorer</th><th>Result</th></tr></thead><tbody>' +
    rows +
    "</tbody></table></div>" +
    labInspection(report)
  );
}

function labExplain(pack) {
  const overall = pack.overall;
  const observer = typeof overall.sensitiveRate === "number" ? Math.round(overall.sensitiveRate * 1000) / 10 : null;
  const explorer = typeof overall.seekingRate === "number" ? Math.round(overall.seekingRate * 1000) / 10 : null;
  const gap = typeof overall.diff === "number" ? Math.round(Math.abs(overall.diff) * 1000) / 10 : null;
  return (
    "Observer average " +
    (observer == null ? "—" : observer + "%") +
    ". Explorer average " +
    (explorer == null ? "—" : explorer + "%") +
    ". Gap " +
    (gap == null ? "—" : gap + " points") +
    ". scoreOverall returned " +
    labTrail(overall.profile) +
    ". The published rule names a pole only when that average is at least 50% and leads by at least 20 points. Adaptor is the result when neither pole clears both rules. The threshold stored on this result is " +
    overall.threshold +
    "."
  );
}

function labInspection(report) {
  const row = report.cases.find((item) => item.spec.id === testLab.inspectId);
  if (!row || !row.pack) return "";
  const domains = getSensoryDomains("en", report.respondent);
  let number = 0;
  const questions = domains
    .map((domain) => {
      const score = row.pack.scores.find((item) => item.id === domain.id);
      const items = domain.questions
        .map((question, index) => {
          number += 1;
          const answer = row.answers[domain.id][index];
          const pole = labPole(question.type);
          const shown = answer == null ? "Blank" : answer ? "Yes" : "No";
          let contribution = "Not scored";
          if (answer == null) contribution = "Left out of the average";
          else if (pole === "sensitive" || pole === "seeking") {
            const endorsed = questionEndorsed(question.type, answer === true);
            contribution = endorsed ? labTrail(pole) : "Not endorsed";
          }
          return (
            "<tr><td>" +
            number +
            "</td><td>" +
            labEscape(question.text) +
            "</td><td>" +
            shown +
            "</td><td>" +
            labEscape(contribution) +
            "</td><td>" +
            labEscape(domain.shortTitle || domain.title) +
            "</td></tr>"
          );
        })
        .join("");
      return (
        "<h4>" +
        labEscape(domain.shortTitle || domain.title) +
        " — " +
        labTrail(score.profile) +
        "</h4><p class=\"test-lab-muted\">Observer " +
        score.sensitive +
        " of " +
        score.sensitivePool +
        " (" +
        labRateText(score.sensitiveRate) +
        "). Explorer " +
        score.seeking +
        " of " +
        score.seekingPool +
        " (" +
        labRateText(score.seekingRate) +
        ").</p><div class=\"test-lab-table-wrap\"><table class=\"test-lab-table\"><thead><tr><th>#</th><th>Question</th><th>Answer</th><th>Contribution</th><th>Sense</th></tr></thead><tbody>" +
        items +
        "</tbody></table></div>"
      );
    })
    .join("");
  return (
    '<article class="test-lab-inspect"><header><h3>' +
    labEscape(row.spec.name) +
    "</h3>" +
    labBadge(row.status) +
    '</header><p>' +
    labEscape(labExplain(row.pack)) +
    "</p><ul class=\"test-lab-metrics\"><li><span>Observer</span><strong>" +
    labRateText(row.pack.overall.sensitiveRate) +
    "</strong></li><li><span>Explorer</span><strong>" +
    labRateText(row.pack.overall.seekingRate) +
    "</strong></li><li><span>Classification</span><strong>" +
    labTrail(row.pack.overall.profile) +
    "</strong></li><li><span>Intensity</span><strong>" +
    row.pack.overall.intensity +
    "%</strong></li></ul>" +
    questions +
    "</article>"
  );
}

function labRenderCustom(report) {
  const answers = labCustom(report.respondent);
  const pack = labScore(report.respondent, answers);
  const domains = labDomains(report.respondent);
  const active = domains.find((domain) => domain.id === testLab.customDomain) || domains[0];
  const switches = domains
    .map(
      (domain) =>
        '<button type="button" class="test-lab-chip' +
        (domain.id === active.id ? " is-active" : "") +
        '" data-action="test-lab-custom-domain" data-lab-domain="' +
        domain.id +
        '">' +
        labEscape(domain.shortTitle || domain.title) +
        "</button>"
    )
    .join("");
  const questions = active.questions
    .map((question, index) => {
      const value = answers[active.id][index];
      return (
        '<fieldset class="test-lab-q"><legend><span>' +
        (index + 1) +
        "</span> " +
        labEscape(question.text) +
        '</legend><div><button type="button" class="test-lab-choice' +
        (value === true ? " is-active" : "") +
        '" data-action="test-lab-answer" data-lab-domain="' +
        active.id +
        '" data-lab-index="' +
        index +
        '" data-lab-value="yes">Yes</button><button type="button" class="test-lab-choice' +
        (value === false ? " is-active" : "") +
        '" data-action="test-lab-answer" data-lab-domain="' +
        active.id +
        '" data-lab-index="' +
        index +
        '" data-lab-value="no">No</button></div></fieldset>'
      );
    })
    .join("");
  const domainRows = pack.scores
    .map(
      (score) =>
        "<li><span>" +
        labEscape(score.shortTitle || score.title) +
        "</span><strong>" +
        labTrail(score.profile) +
        "</strong><em>O " +
        labRateText(score.sensitiveRate) +
        " · E " +
        labRateText(score.seekingRate) +
        "</em></li>"
    )
    .join("");
  const bothHigh =
    pack.overall.sensitiveRate >= 0.5 && pack.overall.seekingRate >= 0.5 && pack.overall.profile === "neutral";
  return (
    '<div class="test-lab-live" aria-live="polite"><p class="test-lab-kicker">Live scoring · test mode · nothing is saved</p><h3>' +
    labTrail(pack.overall.profile) +
    "</h3><p>Observer</p>" +
    labBar(pack.overall.sensitive, "observer") +
    "<p>Explorer</p>" +
    labBar(pack.overall.seeking, "explorer") +
    "<p class=\"test-lab-muted\">Adaptor has no bar. It is the label when neither rate clears 50% and a 20-point lead.</p>" +
    (bothHigh ? '<p class="test-lab-flag">Both rates are at least 50%. Adaptor here means the gap is under 20 points.</p>' : "") +
    "<p>" +
    labEscape(labExplain(pack)) +
    '</p><ul class="test-lab-domain-list">' +
    domainRows +
    "</ul></div><div class=\"test-lab-chips\">" +
    switches +
    '</div><p><button type="button" class="btn btn-secondary" data-action="test-lab-clear">Clear this questionnaire</button></p>' +
    questions
  );
}

function labCustom(respondent) {
  if (!testLab.custom[respondent]) {
    const domains = getSensoryDomains("en", respondent);
    testLab.custom[respondent] = Object.fromEntries(
      domains.map((domain) => [domain.id, domain.questions.map(() => null)])
    );
  }
  return testLab.custom[respondent];
}

function labRenderAudit(report) {
  const filter = testLab.auditFilter;
  const rows = report.audit.filter((row) => {
    if (filter === "flagged") return row.status !== "pass";
    if (filter === "pass") return row.status === "pass";
    return true;
  });
  const body = rows
    .map(
      (row) =>
        "<tr><td>" +
        row.number +
        "</td><td>" +
        labEscape(row.text) +
        "</td><td>" +
        labEscape(report.respondent) +
        "</td><td>Yes or No</td><td>" +
        labEscape(row.endorse) +
        "</td><td>" +
        labEscape(row.pole ? labTrail(row.pole) : "None") +
        "</td><td>" +
        row.observer +
        "</td><td>" +
        row.adaptor +
        "</td><td>" +
        row.explorer +
        "</td><td>" +
        (String(row.type).endsWith("-if-no") ? "Yes" : "No") +
        "</td><td>" +
        labEscape(row.domain) +
        "</td><td>questions.js · scoreDomain</td><td>" +
        labBadge(row.status) +
        (row.flags.length ? '<p class="test-lab-muted">' + labEscape(row.flags.join(" ")) + "</p>" : "") +
        "</td></tr>"
    )
    .join("");
  const flagged = report.audit.filter((row) => row.status !== "pass").length;
  return (
    '<div class="test-lab-chips"><button type="button" class="test-lab-chip' +
    (filter === "flagged" ? " is-active" : "") +
    '" data-action="test-lab-audit-filter" data-lab-filter="flagged">Needs review (' +
    flagged +
    ')</button><button type="button" class="test-lab-chip' +
    (filter === "all" ? " is-active" : "") +
    '" data-action="test-lab-audit-filter" data-lab-filter="all">All</button><button type="button" class="test-lab-chip' +
    (filter === "pass" ? " is-active" : "") +
    '" data-action="test-lab-audit-filter" data-lab-filter="pass">Pass</button></div><div class="test-lab-table-wrap"><table class="test-lab-table"><thead><tr><th>#</th><th>Wording</th><th>Form</th><th>Options</th><th>Values</th><th>Intended pattern</th><th>Observer</th><th>Adaptor</th><th>Explorer</th><th>Reverse</th><th>Sense</th><th>Rule</th><th>Status</th></tr></thead><tbody>' +
    body +
    "</tbody></table></div>"
  );
}

function labRenderWording(report) {
  if (!report.wording.length) return "<p>No wording flags on this questionnaire.</p>";
  return (
    "<p class=\"test-lab-muted\">" +
    report.wording.length +
    " of " +
    report.questionCount +
    " questions are flagged. Overlap with mood, attention, habit, or social preference is marked for review. It is not treated as proof that the question is invalid.</p>" +
    report.wording
      .map(
        (row) =>
          '<article class="test-lab-note"><p class="test-lab-kicker">' +
          labEscape(row.domain) +
          " · question " +
          row.number +
          "</p><h4>Current question</h4><p>" +
          labEscape(row.question) +
          "</p><h4>Intended construct</h4><p>" +
          labEscape(row.construct) +
          "</p><h4>Potential problem</h4><p>" +
          labEscape(row.problem) +
          '</p><p class="test-lab-flag">Potential confound / review</p><h4>Scoring direction</h4><p>' +
          labEscape(row.direction) +
          "</p><h4>Suggested review</h4><p>" +
          labEscape(row.review) +
          "</p></article>"
      )
      .join("")
  );
}

function labRenderMixed(report) {
  return report.mixed
    .map((row) => {
      const domains = row.pack.scores
        .map((score) => labEscape(score.shortTitle || score.title) + " " + labTrail(score.profile))
        .join(" · ");
      return (
        '<article class="test-lab-note"><h4>' +
        labEscape(row.name) +
        "</h4><p>Overall " +
        labTrail(row.pack.overall.profile) +
        " · Observer " +
        row.pack.overall.sensitive +
        "% · Explorer " +
        row.pack.overall.seeking +
        "% · intensity " +
        row.pack.overall.intensity +
        "%</p><p>Genuinely moderate answers: " +
        labTrail(row.moderate.overall.profile) +
        " · Observer " +
        row.moderate.overall.sensitive +
        "% · Explorer " +
        row.moderate.overall.seeking +
        "% · intensity " +
        row.moderate.overall.intensity +
        "%</p><p class=\"test-lab-muted\">" +
        domains +
        "</p>" +
        (row.note ? '<p class="test-lab-muted">' + labEscape(row.note) + "</p>" : "") +
        (row.concern ? '<p class="test-lab-flag">Potential averaging / classification concern</p>' : "") +
        (row.closeScores ? '<p class="test-lab-muted">The overall percentages are also close to the moderate pattern.</p>' : "") +
        "</article>"
      );
    })
    .join("");
}

function labRenderDomains(report) {
  const cards = report.domains
    .map(
      (domain) =>
        '<article class="test-lab-mini"><h4>' +
        labEscape(domain.title) +
        "</h4><p>" +
        domain.count +
        ' questions</p><p>Observer items ' +
        domain.observer +
        " · Explorer items " +
        domain.explorer +
        " · not scored " +
        domain.adaptor +
        "</p>" +
        (domain.blurb ? '<p class="test-lab-muted">' + labEscape(domain.blurb) + "</p>" : "") +
        (domain.imbalance >= 40
          ? '<p class="test-lab-flag">The two lists differ in length, so one answer does not move them equally.</p>'
          : "") +
        "</article>"
    )
    .join("");
  return '<div class="test-lab-mini-grid">' + cards + "</div><p class=\"test-lab-muted\">These are the senses already in the item bank. Movement mixes balance, spinning, heavy work, and activity. Proprioception is not scored on its own.</p>";
}

function labRenderContribution(report) {
  const flagged = report.contribution.filter((row) => row.flag !== "pass");
  const body = flagged
    .map(
      (row) =>
        "<tr><td>" +
        row.number +
        "</td><td>" +
        labEscape(row.domain) +
        "</td><td>" +
        labEscape(row.text) +
        "</td><td>" +
        Math.round(row.observerShare * 100) +
        "%</td><td>" +
        Math.round(row.explorerShare * 100) +
        "%</td><td>" +
        Math.round(row.overallShare * 1000) / 10 +
        '%</td><td>' +
        labBadge(row.flag) +
        '<p class="test-lab-muted">' +
        labEscape(row.note) +
        "</p></td></tr>"
    )
    .join("");
  return (
    '<p class="test-lab-muted">Share of the overall average is how far one endorsement moves that pole’s mean. The final word is still a threshold, so this is not a percent of the label. ' +
    flagged.length +
    " items are flagged. The others have a smaller, ordinary share.</p><div class=\"test-lab-table-wrap\"><table class=\"test-lab-table\"><thead><tr><th>#</th><th>Sense</th><th>Question</th><th>Max Observer share of its list</th><th>Max Explorer share of its list</th><th>Share of the overall average</th><th>Status</th></tr></thead><tbody>" +
    body +
    "</tbody></table></div>"
  );
}

function labRenderSensitivity(report) {
  return report.sensitivity
    .map((row) => {
      const flips = row.flips
        .slice(0, 12)
        .map(
          (flip) =>
            "<li>" +
            labEscape(flip.domain) +
            " " +
            flip.number +
            ": " +
            labEscape(flip.text) +
            " changed from " +
            flip.from +
            " to " +
            flip.to +
            ". Classification " +
            labTrail(flip.before) +
            " → " +
            labTrail(flip.after) +
            ".</li>"
        )
        .join("");
      return (
        '<article class="test-lab-note"><h4>' +
        labEscape(row.name) +
        "</h4><p>Starting classification: " +
        labTrail(row.before) +
        ". Answers that change it: " +
        row.flips.length +
        ".</p>" +
        (row.flips.length
          ? '<ul>' + flips + "</ul>" + (row.flips.length > 12 ? "<p>Further changes are counted above and omitted from the list.</p>" : "")
          : "<p>Changing any single answer left the classification where it was.</p>") +
        "</article>"
      );
    })
    .join("");
}

function labRenderThresholds(report) {
  return report.thresholds
    .map((domain) => {
      const strips = domain.strips
        .map((strip) => {
          const steps = strip.steps
            .map(
              (step) =>
                '<span class="test-lab-step' +
                (step.changed ? " is-change" : "") +
                '">' +
                step.count +
                " · " +
                labTrail(step.profile) +
                "</span>"
            )
            .join("");
          const changes = strip.steps.filter((step) => step.changed).length;
          return (
            "<p><strong>" +
            labEscape(strip.kind) +
            "</strong></p><div class=\"test-lab-steps\">" +
            steps +
            "</div>" +
            (changes ? '<p class="test-lab-flag">The label changes between neighbouring counts.</p>' : "")
          );
        })
        .join("");
      return '<article class="test-lab-note"><h4>' + labEscape(domain.title) + "</h4>" + strips + "</article>";
    })
    .join("") +
    '<p class="test-lab-muted">These strips are one sense at a time, with the other pole unanswered in the scoring sense. The overall label is the average of the six senses and can tell a different story. Exact 20-point gaps are often impossible because lists of 3, 4, 5, or 6 items do not land on 0.20.</p>';
}

function labRenderCompare(bundle) {
  const header = "<tr><th></th>" + TEST_LAB_RESPONDENTS.map((item) => "<th>" + item.label + "</th>").join("") + "</tr>";
  function row(label, pick) {
    return (
      "<tr><th>" +
      labEscape(label) +
      "</th>" +
      TEST_LAB_RESPONDENTS.map((item) => "<td>" + pick(bundle.reports[item.id]) + "</td>").join("") +
      "</tr>"
    );
  }
  const adultTypes = getSensoryDomains("en", "adult")
    .map((domain) => domain.questions.map((question) => question.type).join(","))
    .join("|");
  return (
    '<div class="test-lab-table-wrap"><table class="test-lab-table"><thead>' +
    header +
    "</thead><tbody>" +
    row("Questions", (report) => String(report.questionCount)) +
    row("Response scale", () => "Yes / No") +
    row("Observer items", (report) => String(report.audit.filter((item) => item.pole === "sensitive").length)) +
    row("Explorer items", (report) => String(report.audit.filter((item) => item.pole === "seeking").length)) +
    row("Not scored", (report) => String(report.audit.filter((item) => item.pole === "neutral").length)) +
    row("Reverse scored", (report) => String(report.audit.filter((item) => String(item.type).endsWith("-if-no")).length)) +
    row("Thresholds", () => "50% and 20-point lead") +
    row("Normalisation", () => "Equal weight per sense, then the same rule") +
    row("All Yes", (report) => {
      const found = report.cases.find((item) => item.spec.id === "all-yes");
      return found && found.pack ? labTrail(found.pack.overall.profile) : "—";
    }) +
    row("Strong Observer", (report) => {
      const found = report.cases.find((item) => item.spec.id === "strong-observer");
      return found && found.pack ? labTrail(found.pack.overall.profile) : "—";
    }) +
    row("Item map", (report) => {
      const types = getSensoryDomains("en", report.respondent)
        .map((domain) => domain.questions.map((question) => question.type).join(","))
        .join("|");
      if (report.respondent === "adult") return "Reference";
      return types === adultTypes ? "Same types as Adult" : "REVIEW · different item map, same functions";
    }) +
    "</tbody></table></div><p class=\"test-lab-muted\">Adult, teen, and parent share one item map. Couple is longer. Differences are marked review, not automatically treated as errors. Life context changes the written guidance, not the numbers.</p>"
  );
}

function labRenderIntegrity(report) {
  return report.integrity
    .map(
      (check) =>
        '<article class="test-lab-check">' +
        labBadge(check.status === "warning" ? "warning" : check.status) +
        "<div><h4>" +
        labEscape(check.name) +
        "</h4><p>" +
        labEscape(check.detail) +
        "</p></div></article>"
    )
    .join("");
}

function labRenderSimulation() {
  const modes = [
    ["random", "Random"],
    ["observer", "Observer-weighted"],
    ["explorer", "Explorer-weighted"],
    ["neutral-weighted", "Few endorsements"],
    ["mixed", "Mixed poles"],
    ["domain-extremes", "Sense-by-sense extremes"],
  ];
  const sizes = [100, 500, 1000, 5000];
  const modeButtons = modes
    .map(
      ([id, label]) =>
        '<button type="button" class="test-lab-chip' +
        (testLab.simMode === id ? " is-active" : "") +
        '" data-action="test-lab-sim-mode" data-lab-mode="' +
        id +
        '">' +
        label +
        "</button>"
    )
    .join("");
  const sizeButtons = sizes
    .map(
      (size) =>
        '<button type="button" class="test-lab-chip' +
        (testLab.simSize === size ? " is-active" : "") +
        '" data-action="test-lab-sim-size" data-lab-size="' +
        size +
        '">' +
        size +
        "</button>"
    )
    .join("");
  let result = "<p class=\"test-lab-muted\">No simulation yet. Synthetic answers stay in memory and are never written to the patient register.</p>";
  if (testLab.simulation) {
    const sim = testLab.simulation;
    const n = sim.count || 1;
    const pct = (key) => Math.round((sim.totals[key] / n) * 100);
    result =
      "<h4>" +
      sim.count +
      " " +
      labEscape(sim.mode) +
      " answer sets · " +
      labEscape(sim.respondent) +
      "</h4>" +
      labBar(pct("sensitive"), "observer") +
      "<p>Observer " +
      sim.totals.sensitive +
      " (" +
      pct("sensitive") +
      "%)</p>" +
      labBar(pct("neutral"), "adaptor") +
      "<p>Adaptor " +
      sim.totals.neutral +
      " (" +
      pct("neutral") +
      "%)</p>" +
      labBar(pct("seeking"), "explorer") +
      "<p>Explorer " +
      sim.totals.seeking +
      " (" +
      pct("seeking") +
      "%)</p>" +
      labBiasText(sim)
        .map((line) => "<p>" + labEscape(line) + "</p>")
        .join("") +
      '<p class="test-lab-muted">Seed ' +
      sim.seed +
      ". The same seed repeats the same set. These are descriptions of the sample, not a validity verdict.</p>";
  }
  return (
    '<div class="test-lab-chips">' +
    modeButtons +
    "</div><div class=\"test-lab-chips\">" +
    sizeButtons +
    '</div><p><button type="button" class="btn btn-primary" data-action="test-lab-simulate">Run simulation</button></p>' +
    result
  );
}

function labRenderBias(report) {
  const observer = report.audit.filter((row) => row.pole === "sensitive").length;
  const explorer = report.audit.filter((row) => row.pole === "seeking").length;
  const neutral = report.audit.filter((row) => row.pole === "neutral").length;
  let sample = "<p class=\"test-lab-muted\">Run a random sample when you want an estimate of how often each label appears if every answer is a coin toss.</p>";
  if (testLab.biasSample && testLab.biasSample.respondent === report.respondent) {
    sample = labBiasText(testLab.biasSample)
      .map((line) => "<p>" + labEscape(line) + "</p>")
      .join("");
    sample += '<p class="test-lab-muted">Estimate from ' + testLab.biasSample.count + " synthetic answer sets. Not a proof.</p>";
  }
  return (
    "<ul><li>Observer items: " +
    observer +
    ". Explorer items: " +
    explorer +
    ". Items outside both rates: " +
    neutral +
    ".</li><li>The rule is the same in both directions: 50% of that pole and a 20-point lead. The lists are not the same length, so one Explorer Yes often moves a short list further than one Observer Yes moves a long list.</li><li>There is no middle answer. Adaptor is the leftover label, not a third pile of points.</li><li>A blank answer is omitted. That can favour whatever was actually answered.</li></ul>" +
    sample +
    '<p><button type="button" class="btn btn-secondary" data-action="test-lab-bias">Estimate from 1,000 random questionnaires</button></p>'
  );
}

function labRenderHistory() {
  const history = labReadHistory();
  if (!history.length) {
    return '<p class="test-lab-muted">Nothing is saved unless you choose Save this run. A saved summary stores counts only, in a store marked TEST DATA. It is separate from patients, assessments, and emails.</p>';
  }
  const rows = history
    .map(
      (entry) =>
        "<tr><td>" +
        labEscape(entry.savedAt) +
        "</td><td>" +
        labEscape(entry.respondent) +
        "</td><td>" +
        entry.passed +
        " / " +
        entry.review +
        " / " +
        entry.failed +
        "</td><td>" +
        entry.integrityWarnings +
        " warnings, " +
        entry.integrityFails +
        " failures</td><td>" +
        (entry.simulation ? entry.simulation.count + " " + labEscape(entry.simulation.mode) : "—") +
        "</td></tr>"
    )
    .join("");
  return (
    '<div class="test-lab-table-wrap"><table class="test-lab-table"><thead><tr><th>Date</th><th>Questionnaire</th><th>Pass / review / fail</th><th>Integrity</th><th>Simulation</th></tr></thead><tbody>' +
    rows +
    '</tbody></table></div><p><button type="button" class="btn btn-secondary" data-action="test-lab-clear-history">Clear test history</button></p>'
  );
}

function labSummaryCards(report) {
  const fails = report.integrity.filter((check) => check.status === "fail").length + report.counts.fail;
  const warnings =
    report.integrity.filter((check) => check.status === "warning").length + report.counts.review;
  const mixed = report.mixed.filter((row) => row.concern).length;
  const cards = [
    ["Questionnaire", TEST_LAB_RESPONDENTS.find((item) => item.id === report.respondent).label],
    ["Questions", String(report.questionCount)],
    ["Automated tests", report.counts.pass + " pass · " + report.counts.review + " review · " + report.counts.fail + " fail"],
    ["Scoring errors", String(fails)],
    ["Warnings", String(warnings)],
    ["Mixed-pattern concerns", String(mixed)],
  ];
  return (
    '<div class="test-lab-cards">' +
    cards
      .map(
        (card) =>
          '<article class="settings-stat"><span class="settings-stat__value">' +
          labEscape(card[1]) +
          '</span><span class="settings-stat__label">' +
          labEscape(card[0]) +
          "</span></article>"
      )
      .join("") +
    "</div>"
  );
}

function labQa(bundle) {
  const report = bundle.reports[testLab.respondent];
  const integrityFail = report.integrity.some((check) => check.status === "fail") || report.counts.fail > 0;
  const integrityWarn = report.integrity.some((check) => check.status === "warning");
  const mappingFail = report.audit.some((row) => !row.type);
  const mixed = report.mixed.some((row) => row.concern);
  function formStatus(id) {
    const item = bundle.reports[id];
    if (item.counts.fail || item.integrity.some((check) => check.status === "fail")) return "fail";
    if (item.counts.review || item.mixed.some((row) => row.concern)) return "review";
    return "pass";
  }
  const rows = [
    ["Scoring integrity", integrityFail ? "fail" : integrityWarn ? "review" : "pass"],
    ["Automated tests", report.counts.pass + " / " + report.counts.total + " passed without a review flag", report.counts.fail ? "fail" : report.counts.review ? "review" : "pass"],
    ["Question mapping", mappingFail ? "fail" : "pass"],
    ["Threshold stability", report.sensitivity.some((row) => row.flips.length) ? "review" : "pass"],
    ["Mixed pattern handling", mixed ? "warning" : "pass"],
    ["Adult", formStatus("adult")],
    ["Teen", formStatus("teen")],
    ["Parent", formStatus("parent")],
    ["Couple", formStatus("couple")],
  ];
  return (
    '<div class="test-lab-qa">' +
    rows
      .map((row) => {
        const status = row.length === 3 ? row[2] : row[1];
        const text = row.length === 3 ? row[1] : status;
        return '<div><span>' + labEscape(row[0]) + "</span>" + labBadge(status) + (row.length === 3 ? "<small>" + labEscape(text) + "</small>" : "") + "</div>";
      })
      .join("") +
    "</div>"
  );
}

function renderTestLab() {
  labBind();
  if (!labAllowed()) {
    return '<p class="error-banner">Admin access required.</p>';
  }
  const bundle = labBundle();
  const report = bundle.reports[testLab.respondent];
  const selector = TEST_LAB_RESPONDENTS.map(
    (item) =>
      '<button type="button" class="test-lab-chip' +
      (item.id === testLab.respondent ? " is-active" : "") +
      '" data-action="test-lab-respondent" data-lab-respondent="' +
      item.id +
      '">' +
      item.label +
      "</button>"
  ).join("");
  const issues = report.issues
    .map(
      (issue) =>
        '<li class="test-lab-issue test-lab-issue--' +
        issue.priority +
        '"><button type="button" data-action="test-lab-open" data-lab-section="' +
        issue.section +
        '"><strong>' +
        issue.priority +
        "</strong> " +
        labEscape(issue.title) +
        "</button><p>" +
        labEscape(issue.text) +
        "</p></li>"
    )
    .join("");
  return (
    '<div class="test-lab">' +
    (testLab.notice ? '<p class="auth__notice" role="status">' + labEscape(testLab.notice) + "</p>" : "") +
    '<div class="test-lab-toolbar"><div class="test-lab-chips" role="group" aria-label="Questionnaire">' +
    selector +
    '</div><div class="test-lab-toolbar__actions"><button type="button" class="btn btn-secondary" data-action="test-lab-save">Save this run</button><button type="button" class="btn btn-secondary" data-action="test-lab-export">Download test report</button></div></div>' +
    labSummaryCards(report) +
    '<section class="test-lab-panel"><h2>Quality check</h2>' +
    labQa(bundle) +
    "<h3>Top issues to investigate</h3><ol class=\"test-lab-issues\">" +
    issues +
    "</ol><p class=\"test-lab-disclaimer\">" +
    labEscape(TEST_LAB_DISCLAIMER) +
    "</p></section>" +
    labFold("audit", "1. Questionnaire audit", labRenderAudit(report), report.audit.filter((row) => row.status !== "pass").length + " flagged") +
    labFold("wording", "2. Question wording", labRenderWording(report), report.wording.length + " for review") +
    labFold("suite", "3. Automated cases and inspection", labRenderSuite(report), report.counts.pass + " pass · " + report.counts.review + " review") +
    labFold("custom", "4. Custom questionnaire", labRenderCustom(report), "Live score") +
    labFold("mixed", "5. Mixed sensory patterns", labRenderMixed(report), report.mixed.filter((row) => row.concern).length + " concerns") +
    labFold("domains", "6. Senses in this questionnaire", labRenderDomains(report)) +
    labFold("simulation", "7. Large-scale simulation", labRenderSimulation()) +
    labFold("bias", "8. Classification bias", labRenderBias(report)) +
    labFold("contribution", "9. How much each question can move the result", labRenderContribution(report)) +
    labFold("sensitivity", "10. What one changed answer does", labRenderSensitivity(report)) +
    labFold("threshold", "11. Thresholds", labRenderThresholds(report)) +
    labFold("compare", "12. Adult, teen, parent, and couple", labRenderCompare(bundle)) +
    labFold("integrity", "13. Scoring integrity", labRenderIntegrity(report)) +
    labFold("history", "14. Test history", labRenderHistory(), "Saved only when you ask") +
    "</div>"
  );
}

function labRefresh() {
  const y = typeof window !== "undefined" ? window.scrollY : 0;
  if (typeof render === "function") render();
  if (typeof window !== "undefined") window.scrollTo(0, y);
}

function handleTestLabClick(action, btn) {
  if (!labAllowed()) return;
  if (action === "test-lab-respondent") {
    testLab.respondent = btn.dataset.labRespondent || "adult";
    testLab.inspectId = null;
    testLab.notice = "";
    const domains = getSensoryDomains("en", testLab.respondent);
    if (!domains.some((domain) => domain.id === testLab.customDomain)) testLab.customDomain = domains[0].id;
    labRefresh();
    return;
  }
  if (action === "test-lab-open") {
    const section = btn.dataset.labSection;
    if (section) testLab.open[section] = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-inspect") {
    testLab.inspectId = testLab.inspectId === btn.dataset.labId ? null : btn.dataset.labId;
    testLab.open.suite = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-audit-filter") {
    testLab.auditFilter = btn.dataset.labFilter || "flagged";
    testLab.open.audit = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-custom-domain") {
    testLab.customDomain = btn.dataset.labDomain || "auditory";
    testLab.open.custom = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-answer") {
    const answers = labCustom(testLab.respondent);
    const domain = btn.dataset.labDomain;
    const index = Number(btn.dataset.labIndex);
    if (answers[domain] && Number.isInteger(index)) {
      answers[domain][index] = btn.dataset.labValue === "yes";
    }
    testLab.open.custom = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-clear") {
    delete testLab.custom[testLab.respondent];
    testLab.open.custom = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-sim-mode") {
    testLab.simMode = btn.dataset.labMode || "random";
    testLab.open.simulation = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-sim-size") {
    testLab.simSize = Number(btn.dataset.labSize) || 100;
    testLab.open.simulation = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-simulate") {
    testLab.simulation = labSimulate(testLab.respondent, testLab.simMode, testLab.simSize, TEST_LAB_RANDOM_SEED);
    testLab.open.simulation = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-bias") {
    testLab.biasSample = labSimulate(testLab.respondent, "random", 1000, TEST_LAB_RANDOM_SEED + 1);
    testLab.open.bias = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-save") {
    labSaveHistory();
    testLab.open.history = true;
    labRefresh();
    return;
  }
  if (action === "test-lab-clear-history") {
    if (typeof window !== "undefined" && window.confirm("Remove saved test summaries from this browser?")) {
      labWriteHistory([]);
      testLab.notice = "Test history cleared.";
      testLab.open.history = true;
      labRefresh();
    }
    return;
  }
  if (action === "test-lab-export") {
    const stamp = new Date().toISOString().slice(0, 10);
    labDownload("sensory-trail-test-lab-" + testLab.respondent + "-" + stamp + ".txt", labExportText());
    testLab.notice = "Test report downloaded. It was not emailed and it was not added to a patient record.";
    labRefresh();
  }
}
