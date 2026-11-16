const assert = require("node:assert/strict");
const test = require("node:test");
const { buildSummaryPages, renderTherapistSummaryHtml } = require("../server/therapist-summary");

function adultAnswers() {
  const auditory = Array(12).fill(false);
  auditory[0] = true;
  auditory[2] = true;
  auditory[5] = true;
  const tactile = Array(13).fill(false);
  tactile[2] = false;
  tactile[3] = true;
  tactile[5] = false;
  tactile[8] = true;
  tactile[9] = true;
  const movement = Array(16).fill(false);
  movement[9] = true;
  movement[8] = true;
  movement[6] = false;
  movement[7] = false;
  return { auditory, tactile, movement, visual: [], smellTaste: [], everyday: [] };
}

test("card sheet keeps sensory results, Saturday, and the separate yes and no answers", () => {
  const saturday = "Coffee on the stoep, then a quiet walk. <script>alert(1)</script>";
  const [page] = buildSummaryPages([
    {
      id: "sample",
      respondent: "adult",
      language: "en",
      lifeContext: "home",
      completedAt: "2026-11-16T12:00:00.000Z",
      idealSaturday: saturday,
      answers: adultAnswers(),
      demographics: { name: "Jordan M." },
      summary: { patientName: "Jordan M." },
    },
  ]);

  assert.equal(page.name, "Jordan M.");
  assert.match(page.pathway, /Adult/);
  assert.match(page.pathway, /Home/);
  assert.equal(page.senses.length, 6);
  assert.deepEqual(
    page.groups.map((group) => group.title),
    ["Auditory", "Physical touch", "Movement", "Crowds"]
  );
  const touch = page.groups.find((group) => group.title === "Physical touch");
  assert.deepEqual(
    touch.items.map((item) => item.a),
    ["No", "Yes", "Yes"]
  );
  assert.match(touch.items[0].q, /hugs/i);
  assert.match(touch.items[1].q, /Firm pressure/);
  assert.match(touch.items[2].q, /Touches objects/);

  const movement = page.groups.find((group) => group.title === "Movement");
  assert.equal(movement.items[0].a, "Yes");
  assert.match(movement.items[0].q, /adventurous/i);
  assert.match(movement.items[1].q, /spinning/i);

  const auditory = page.groups.find((group) => group.title === "Auditory");
  assert.deepEqual(
    auditory.items.map((item) => item.a),
    ["Yes", "Yes", "Yes"]
  );
  assert.match(auditory.items[0].q, /noisy/i);
  assert.match(auditory.items[1].q, /concentrate/i);
  assert.match(auditory.items[2].q, /too loud/i);

  const crowds = page.groups.find((group) => group.title === "Crowds");
  assert.deepEqual(
    crowds.items.map((item) => item.a),
    ["No", "Yes"]
  );
  assert.match(crowds.items[0].q, /personal space/i);
  assert.match(crowds.items[1].q, /queues or crowded/i);
  assert.equal(page.saturday.includes("<script>"), true);

  const html = renderTherapistSummaryHtml([page]);
  assert.match(html, /Jordan M\./);
  assert.match(html, /Best Saturday/);
  assert.match(html, /Coffee on the stoep/);
  assert.equal(html.includes("<script>"), false);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /Sensory systems/);
  assert.match(html, /Pulled out of the totals/);
});
