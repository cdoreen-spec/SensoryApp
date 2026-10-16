const test = require("node:test");
const assert = require("node:assert/strict");
const { mergeUsers } = require("../server/ssot-api");

test("the same email can hold more than one patient questionnaire", () => {
  const parent = {
    id: "parent-1",
    email: "family@example.com",
    role: "patient",
    questionnaireType: "parent",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  };
  const teen = {
    id: "teen-1",
    email: "family@example.com",
    role: "patient",
    questionnaireType: "teen",
    lifeContext: "home",
    createdAt: "2026-10-02T00:00:00.000Z",
    updatedAt: "2026-10-02T00:00:00.000Z",
  };
  const adult = {
    id: "adult-1",
    email: "family@example.com",
    role: "patient",
    questionnaireType: "adult",
    lifeContext: "home",
    createdAt: "2026-10-03T00:00:00.000Z",
    updatedAt: "2026-10-03T00:00:00.000Z",
  };

  const merged = mergeUsers([parent], [teen, adult]);
  const ids = merged.map((user) => user.id).sort();
  assert.deepEqual(ids, ["adult-1", "parent-1", "teen-1"]);
  assert.equal(merged.filter((user) => user.email === "family@example.com").length, 3);
});

test("a second copy of the same questionnaire keeps its own account", () => {
  const first = {
    id: "adult-a",
    email: "alex@example.com",
    role: "patient",
    questionnaireType: "adult",
    lifeContext: "home",
    updatedAt: "2026-10-01T00:00:00.000Z",
  };
  const second = {
    id: "adult-b",
    email: "alex@example.com",
    role: "patient",
    questionnaireType: "adult",
    lifeContext: "work",
    updatedAt: "2026-10-04T00:00:00.000Z",
  };
  const merged = mergeUsers([first], [second]);
  assert.equal(merged.length, 2);
  assert.deepEqual(
    merged.map((user) => user.id).sort(),
    ["adult-a", "adult-b"]
  );
});

test("therapist accounts with the same email still collapse to one sign-in", () => {
  const older = {
    id: "therapist-old",
    email: "ot@example.com",
    role: "therapist",
    name: "Older",
    updatedAt: "2026-10-01T00:00:00.000Z",
  };
  const newer = {
    id: "therapist-new",
    email: "ot@example.com",
    role: "therapist",
    name: "Newer",
    updatedAt: "2026-10-05T00:00:00.000Z",
  };
  const merged = mergeUsers([older], [newer]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, "therapist-old");
  assert.equal(merged[0].name, "Newer");
});

test("a patient invite does not replace a therapist who uses that email", () => {
  const therapist = {
    id: "therapist-1",
    email: "ot@example.com",
    role: "therapist",
    name: "Therapist",
    updatedAt: "2026-10-01T00:00:00.000Z",
  };
  const patient = {
    id: "patient-1",
    email: "ot@example.com",
    role: "patient",
    questionnaireType: "couple",
    updatedAt: "2026-10-06T00:00:00.000Z",
  };
  const merged = mergeUsers([therapist], [patient]);
  assert.equal(merged.length, 2);
  assert.equal(merged.find((user) => user.id === "therapist-1").role, "therapist");
  assert.equal(merged.find((user) => user.id === "patient-1").questionnaireType, "couple");
});
