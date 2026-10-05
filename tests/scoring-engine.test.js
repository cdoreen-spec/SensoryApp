/**
 * Independent checks for the production scoring engine.
 * Expected labels are written out here. They are not read back from the engine
 * or from the Test Lab screen.
 */
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const test = require("node:test");
const vm = require("vm");

const root = path.join(__dirname, "..");
const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "questions.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "scoring.js"), "utf8"), context);

const { getSensoryDomains, scoreDomain, scoreAllDomains, scoreOverall, classifyRates, balancePercent } = context;

function pole(type) {
  if (type === "sensitive" || type === "sensitive-if-no") return "sensitive";
  if (type === "seeking" || type === "seeking-if-no") return "seeking";
  if (type === "neutral") return "neutral";
  return null;
}

function answer(type, endorse) {
  if (!type || type === "neutral") return false;
  return String(type).endsWith("-if-no") ? !endorse : Boolean(endorse);
}

function domains(respondent) {
  return getSensoryDomains("en", respondent);
}

function fromPlan(respondent, plan) {
  return Object.fromEntries(
    domains(respondent).map((domain) => {
      const want = plan[domain.id] || { sensitive: 0, seeking: 0 };
      const left = { sensitive: want.sensitive || 0, seeking: want.seeking || 0 };
      return [
        domain.id,
        domain.questions.map((question) => {
          const itemPole = pole(question.type);
          if ((itemPole === "sensitive" || itemPole === "seeking") && left[itemPole] > 0) {
            left[itemPole] -= 1;
            return answer(question.type, true);
          }
          return answer(question.type, false);
        }),
      ];
    })
  );
}

function endorse(respondent, which) {
  return Object.fromEntries(
    domains(respondent).map((domain) => [
      domain.id,
      domain.questions.map((question) => answer(question.type, which === "none" ? false : pole(question.type) === which)),
    ])
  );
}

function all(respondent, value) {
  return Object.fromEntries(domains(respondent).map((domain) => [domain.id, domain.questions.map(() => value)]));
}

function overall(respondent, answers) {
  const set = domains(respondent);
  return scoreOverall(scoreAllDomains(answers, set, "en", respondent), "en", respondent);
}

const observerBoundary = {
  adult: {
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

const explorerBoundary = {
  auditory: { sensitive: 0, seeking: 2 },
  tactile: { sensitive: 0, seeking: 1 },
  movement: { sensitive: 0, seeking: 3 },
  visual: { sensitive: 0, seeking: 1 },
  smellTaste: { sensitive: 0, seeking: 2 },
  everyday: { sensitive: 0, seeking: 2 },
};

test("published pairs name Observer, Explorer, or Adaptor exactly", () => {
  assert.equal(classifyRates(0.5, 0.3).profile, "sensitive");
  assert.equal(classifyRates(0.5, 0).profile, "sensitive");
  assert.equal(classifyRates(0.49, 0).profile, "neutral");
  assert.equal(classifyRates(0.5, 0.31).profile, "neutral");
  assert.equal(classifyRates(1, 1).profile, "neutral");
  assert.equal(classifyRates(0, 0).profile, "neutral");
  assert.equal(classifyRates(0, 0.5).profile, "seeking");
  assert.equal(classifyRates(0.3, 0.5).profile, "seeking");
  assert.equal(classifyRates(null, 1).profile, "neutral");
});

test("balance markers sit at the ends and the middle for the extreme rates", () => {
  assert.equal(balancePercent(0, 0), 50);
  assert.equal(balancePercent(1, 0), 0);
  assert.equal(balancePercent(0, 1), 100);
});

test("adult, teen, and parent use one item map; couple is longer; Afrikaans keeps the types", () => {
  function signature(language, respondent) {
    return getSensoryDomains(language, respondent)
      .map((domain) => domain.id + ":" + domain.questions.map((question) => question.type).join(","))
      .join("|");
  }
  assert.equal(signature("en", "teen"), signature("en", "adult"));
  assert.equal(signature("en", "parent"), signature("en", "adult"));
  assert.equal(signature("af", "adult"), signature("en", "adult"));
  assert.notEqual(signature("en", "couple"), signature("en", "adult"));
  for (const respondent of ["adult", "teen", "parent", "couple"]) {
    for (const language of ["en", "af"]) {
      getSensoryDomains(language, respondent).forEach((domain) => {
        assert.ok(domain.questions.length > 0);
        domain.questions.forEach((question) => {
          assert.equal(typeof question.text, "string");
          assert.ok(question.text.length > 0);
          assert.ok(pole(question.type), question.text);
        });
      });
    }
  }
  assert.equal(domains("adult").reduce((sum, domain) => sum + domain.questions.length, 0), 53);
  assert.equal(domains("couple").reduce((sum, domain) => sum + domain.questions.length, 0), 65);
});

test("strong Observer and strong Explorer are named for every questionnaire", () => {
  for (const respondent of ["adult", "teen", "parent", "couple"]) {
    const observer = overall(respondent, endorse(respondent, "sensitive"));
    const explorer = overall(respondent, endorse(respondent, "seeking"));
    assert.equal(observer.profile, "sensitive", respondent);
    assert.equal(observer.sensitive, 100, respondent);
    assert.equal(observer.seeking, 0, respondent);
    assert.equal(explorer.profile, "seeking", respondent);
    assert.equal(explorer.sensitive, 0, respondent);
    assert.equal(explorer.seeking, 100, respondent);
    const quiet = overall(respondent, endorse(respondent, "none"));
    assert.equal(quiet.profile, "neutral", respondent);
    assert.equal(quiet.sensitive, 0, respondent);
    assert.equal(quiet.seeking, 0, respondent);
  }
});

test("all Yes saturates both poles and is still Adaptor", () => {
  const adult = overall("adult", all("adult", true));
  assert.equal(adult.profile, "neutral");
  assert.equal(adult.sensitive, 97);
  assert.equal(adult.seeking, 100);
  const couple = overall("couple", all("couple", true));
  assert.equal(couple.profile, "neutral");
  assert.equal(couple.sensitive, 95);
  assert.equal(couple.seeking, 100);
});

test("all No is Adaptor and still endorses the reverse-scored item", () => {
  const result = overall("adult", all("adult", false));
  assert.equal(result.profile, "neutral");
  assert.equal(result.sensitive, 3);
  assert.equal(result.seeking, 0);
  const tactile = domains("adult").find((domain) => domain.id === "tactile");
  const scored = scoreDomain(tactile.questions, tactile.questions.map(() => false));
  assert.equal(scored.sensitive, 1);
  assert.equal(scored.sensitivePool, 6);
});

test("the Observer line is one Auditory endorsement wide", () => {
  for (const respondent of ["adult", "teen", "parent"]) {
    const onLine = overall(respondent, fromPlan(respondent, observerBoundary.adult));
    assert.equal(onLine.profile, "sensitive", respondent);
    assert.equal(onLine.sensitive, 52, respondent);
    assert.equal(onLine.seeking, 0, respondent);
    assert.ok(Math.abs(onLine.sensitiveRate - 31 / 60) < 1e-12);
    const plan = Object.fromEntries(
      Object.entries(observerBoundary.adult).map(([id, counts]) => [id, { ...counts }])
    );
    plan.auditory.sensitive = 2;
    const below = overall(respondent, fromPlan(respondent, plan));
    assert.equal(below.profile, "neutral", respondent);
    assert.equal(below.sensitive, 49, respondent);
    plan.auditory.sensitive = 4;
    const above = overall(respondent, fromPlan(respondent, plan));
    assert.equal(above.profile, "sensitive", respondent);
  }
});

test("couple just below the Observer line rounds to 50% and stays Adaptor", () => {
  const plan = Object.fromEntries(Object.entries(observerBoundary.couple).map(([id, counts]) => [id, { ...counts }]));
  const onLine = overall("couple", fromPlan("couple", plan));
  assert.equal(onLine.profile, "sensitive");
  plan.auditory.sensitive = 2;
  const below = overall("couple", fromPlan("couple", plan));
  assert.equal(below.profile, "neutral");
  assert.equal(below.sensitive, 50);
  assert.ok(below.sensitiveRate < 0.5);
});

test("the Explorer line is one Auditory endorsement wide", () => {
  for (const respondent of ["adult", "teen", "parent", "couple"]) {
    const onLine = overall(respondent, fromPlan(respondent, explorerBoundary));
    assert.equal(onLine.profile, "seeking", respondent);
    assert.equal(onLine.seeking, 52, respondent);
    assert.equal(onLine.sensitive, 0, respondent);
    const plan = Object.fromEntries(Object.entries(explorerBoundary).map(([id, counts]) => [id, { ...counts }]));
    plan.auditory.seeking = 1;
    const below = overall(respondent, fromPlan(respondent, plan));
    assert.equal(below.profile, "neutral", respondent);
    plan.auditory.seeking = 3;
    const above = overall(respondent, fromPlan(respondent, plan));
    assert.equal(above.profile, "seeking", respondent);
  }
});

test("opposing senses stay distinct while the overall label becomes Adaptor", () => {
  const plan = {
    auditory: { sensitive: 99, seeking: 0 },
    tactile: { sensitive: 99, seeking: 0 },
    movement: { sensitive: 0, seeking: 99 },
    visual: { sensitive: 99, seeking: 0 },
    smellTaste: { sensitive: 0, seeking: 99 },
    everyday: { sensitive: 0, seeking: 0 },
  };
  for (const respondent of ["adult", "parent", "couple"]) {
    const set = domains(respondent);
    const scores = scoreAllDomains(fromPlan(respondent, plan), set, "en", respondent);
    const result = scoreOverall(scores, "en", respondent);
    assert.equal(result.profile, "neutral", respondent);
    assert.equal(result.sensitive, 50, respondent);
    assert.equal(result.seeking, 33, respondent);
    const byId = Object.fromEntries(scores.map((score) => [score.id, score.profile]));
    assert.equal(byId.auditory, "sensitive");
    assert.equal(byId.tactile, "sensitive");
    assert.equal(byId.visual, "sensitive");
    assert.equal(byId.movement, "seeking");
    assert.equal(byId.smellTaste, "seeking");
    assert.equal(byId.everyday, "neutral");
  }
});

test("a blank questionnaire section is omitted, so one finished sense can decide the label", () => {
  const answers = Object.fromEntries(
    domains("adult").map((domain) => [
      domain.id,
      domain.questions.map((question) => (domain.id === "auditory" ? answer(question.type, pole(question.type) === "sensitive") : null)),
    ])
  );
  const result = overall("adult", answers);
  assert.equal(result.profile, "sensitive");
  assert.equal(result.sensitive, 100);
  assert.equal(result.seeking, 0);
});

test("a neutral item does not change either rate", () => {
  const tactile = domains("adult").find((domain) => domain.id === "tactile");
  const index = tactile.questions.findIndex((question) => question.type === "neutral");
  assert.ok(index >= 0);
  const quiet = tactile.questions.map((question) => answer(question.type, false));
  const yes = quiet.slice();
  yes[index] = true;
  const no = quiet.slice();
  no[index] = false;
  const endorsed = scoreDomain(tactile.questions, yes);
  const declined = scoreDomain(tactile.questions, no);
  assert.equal(endorsed.sensitive, declined.sensitive);
  assert.equal(endorsed.seeking, declined.seeking);
  assert.equal(endorsed.profile, declined.profile);
  assert.equal(endorsed.profile, "neutral");
});

test("reverse scoring counts No, and a non-boolean is treated as No", () => {
  const question = [{ type: "sensitive-if-no", text: "I am comfortable when people are in my personal space." }];
  assert.equal(scoreDomain(question, [false]).sensitive, 1);
  assert.equal(scoreDomain(question, [true]).sensitive, 0);
  assert.equal(scoreDomain(question, ["no"]).sensitive, 1);
  assert.equal(scoreDomain([{ type: "sensitive", text: "Loud rooms overwhelm me." }], ["yes"]).sensitive, 0);
  assert.equal(scoreDomain([{ type: "sensitive", text: "Loud rooms overwhelm me." }], [null]).scored, 0);
});

test("domain rates cannot exceed the answered list", () => {
  for (const respondent of ["adult", "couple"]) {
    const result = scoreAllDomains(all(respondent, true), domains(respondent), "en", respondent);
    result.forEach((score) => {
      assert.ok(score.sensitive <= score.sensitivePool);
      assert.ok(score.seeking <= score.seekingPool);
      if (typeof score.sensitiveRate === "number") assert.ok(score.sensitiveRate <= 1);
      if (typeof score.seekingRate === "number") assert.ok(score.seekingRate <= 1);
    });
    const summary = scoreOverall(result, "en", respondent);
    assert.ok(summary.sensitive <= 100);
    assert.ok(summary.seeking <= 100);
    assert.equal(summary.profile, classifyRates(summary.sensitiveRate, summary.seekingRate).profile);
  }
});
