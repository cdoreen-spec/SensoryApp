/**
 * One-page therapist summary attached to a completed-report email.
 * Built from the saved answers with the same scoring functions as the report.
 * The full report is left unchanged.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const COPY = {
  en: {
    brand: "Soulful Sensory OT",
    kicker: "Therapist summary",
    systems: "Sensory systems",
    saturday: "Best Saturday",
    saturdayEmpty: "Not filled in.",
    closer: "Pulled out of the totals",
    foot: "One-page attachment with the completed report. A picture of how this person answers, not a diagnosis.",
    yes: "Yes",
    no: "No",
    unanswered: "Not answered",
    crowds: "Crowds",
    respondent: { adult: "Adult", teen: "Teen", parent: "Parent", couple: "Couple" },
    context: { work: "Work", home: "Home", school: "School", homeSchool: "Home & school" },
  },
  af: {
    brand: "Soulful Sensory OT",
    kicker: "Terapeut-opsomming",
    systems: "Sintuigstelsels",
    saturday: "Beste Saterdag",
    saturdayEmpty: "Nie ingevul nie.",
    closer: "Uit die totale gehaal",
    foot: "Een bladsy saam met die voltooide verslag. ’n Prent van hoe hierdie persoon antwoord, nie ’n diagnose nie.",
    yes: "Ja",
    no: "Nee",
    unanswered: "Nie beantwoord nie",
    crowds: "Skares",
    respondent: { adult: "Volwassene", teen: "Tiener", parent: "Ouer", couple: "Egpaar" },
    context: { work: "Werk", home: "Huis", school: "Skool", homeSchool: "Huis en skool" },
  },
};

const GROUP_ORDER = ["loud", "physical-touch", "thrill", "crowd"];

let engine = null;

function sourceRoot() {
  const candidates = [
    __dirname,
    path.join(__dirname, ".."),
    path.join(__dirname, "..", ".."),
    process.cwd(),
  ];
  return (
    candidates.find(
      (dir) => fs.existsSync(path.join(dir, "scoring.js")) && fs.existsSync(path.join(dir, "questions.js"))
    ) || path.join(__dirname, "..")
  );
}

function loadEngine() {
  if (engine) return engine;
  const root = sourceRoot();
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "questions.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(root, "scoring.js"), "utf8"), context);
  engine = context;
  return engine;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clip(value, max) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trim() : text;
}

function languageOf(record) {
  return record?.language === "af" ? "af" : "en";
}

function copyFor(language) {
  return COPY[language] || COPY.en;
}

function cleanAnswers(raw) {
  const answers = {};
  if (!raw || typeof raw !== "object") return answers;
  for (const [domain, list] of Object.entries(raw)) {
    if (!/^[a-zA-Z]+$/.test(domain) || !Array.isArray(list)) continue;
    answers[domain] = list.slice(0, 40).map((value) => {
      if (value === true) return true;
      if (value === false) return false;
      return null;
    });
  }
  return answers;
}

function personName(record) {
  const summary = record?.summary || {};
  const demo = record?.demographics || {};
  return clip(summary.patientName || demo.name || summary.completerName || "Patient", 160) || "Patient";
}

function formatDate(iso) {
  const date = new Date(iso || "");
  if (Number.isNaN(date.getTime())) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Johannesburg",
    }).format(date);
  } catch (_) {
    return "";
  }
}

function markerFor(profile) {
  if (profile === "sensitive") return 14;
  if (profile === "seeking") return 86;
  return 50;
}

function answerWord(value, copy) {
  if (value === true) return copy.yes;
  if (value === false) return copy.no;
  return copy.unanswered;
}

function cardTitle(facet, group, copy) {
  if (facet.id === "crowd") return copy.crowds;
  if (facet.id === "loud" || facet.id === "thrill") return group.title;
  return facet.title || group.title;
}

function pageFromRecord(record) {
  if (!record || typeof record !== "object") return null;
  const answers = cleanAnswers(record.answers);
  if (!Object.keys(answers).length) return null;
  const scoring = loadEngine();
  const language = languageOf(record);
  const copy = copyFor(language);
  const respondent = ["adult", "teen", "parent", "couple"].includes(record.respondent)
    ? record.respondent
    : "adult";
  const domains = scoring.getSensoryDomains(language, respondent);
  const scores = scoring.scoreAllDomains(answers, domains, language, respondent);
  const labels = scoring.getProfileLabels(language, respondent);
  const findings = scoring.getSpecificSensoryFindings(answers, language, respondent);
  const senses = Array.from(scores).map((score) => {
    const meta = labels[score.profile] || labels.neutral;
    const reading = scoring.getThresholdReading(score.id, score.profile, {
      language,
      respondent,
    });
    return {
      name: score.shortTitle || score.title || score.id,
      threshold: meta.thresholdLabel || "",
      lean: clip(reading?.implication || "", 280),
      mark: markerFor(score.profile),
    };
  });
  const facets = [];
  for (const group of findings.groups || []) {
    for (const facet of group.facets || []) {
      facets.push({ group, facet });
    }
  }
  facets.sort((a, b) => GROUP_ORDER.indexOf(a.facet.id) - GROUP_ORDER.indexOf(b.facet.id));
  const groups = facets.map(({ group, facet }) => ({
    title: cardTitle(facet, group, copy),
    line: clip(facet.headline || "", 240),
    score: clip(facet.score || "", 80),
    items: Array.from(facet.items || []).map((item) => ({
      q: clip(item.label || "", 240),
      a: answerWord(item.value, copy),
    })),
  }));
  const context = copy.context[record.lifeContext] || "";
  const pathway = [copy.respondent[respondent] || "", context].filter(Boolean).join(" · ");
  return {
    name: personName(record),
    pathway,
    date: formatDate(record.completedAt),
    saturday: clip(record.idealSaturday, 4000),
    senses,
    groups,
    language,
  };
}

function buildSummaryPages(records) {
  return (Array.isArray(records) ? records : [])
    .map((record) => {
      try {
        return pageFromRecord(record);
      } catch (err) {
        console.error("Therapist summary page skipped:", err.message);
        return null;
      }
    })
    .filter(Boolean);
}

function answerRow(item) {
  return `<div class="qa"><span>${escapeHtml(item.q)}</span><strong>${escapeHtml(item.a)}</strong></div>`;
}

function senseCard(sense) {
  const mark = Math.max(0, Math.min(100, Number(sense.mark) || 50));
  return `<article class="sense">
    <header><h3>${escapeHtml(sense.name)}</h3><b>${escapeHtml(sense.threshold)}</b></header>
    <div class="track" aria-hidden="true"><i style="left:${mark}%"></i></div>
    <p>${escapeHtml(sense.lean)}</p>
  </article>`;
}

function groupCard(group) {
  const score = group.score ? `<span>${escapeHtml(group.score)}</span>` : "";
  return `<section class="group">
    <header><h3>${escapeHtml(group.title)}</h3>${score}</header>
    <p class="line">${escapeHtml(group.line)}</p>
    ${group.items.map(answerRow).join("")}
  </section>`;
}

function sheetHtml(page) {
  const copy = copyFor(page.language);
  const meta = [page.pathway, page.date].filter(Boolean).join(" · ");
  const saturday = page.saturday
    ? `<blockquote>${escapeHtml(page.saturday)}</blockquote>`
    : `<p class="empty">${escapeHtml(copy.saturdayEmpty)}</p>`;
  return `<article class="sheet">
    <header class="top">
      <div>
        <p class="brand">${escapeHtml(copy.brand)}</p>
        <h1>${escapeHtml(page.name)}</h1>
        <p class="meta">${escapeHtml(meta)}</p>
      </div>
      <p class="kicker">${escapeHtml(copy.kicker)}</p>
    </header>
    <h2>${escapeHtml(copy.systems)}</h2>
    <div class="senses">${page.senses.map(senseCard).join("")}</div>
    <h2>${escapeHtml(copy.saturday)}</h2>
    <div class="saturday">${saturday}</div>
    <h2>${escapeHtml(copy.closer)}</h2>
    <div class="groups">${page.groups.map(groupCard).join("")}</div>
    <p class="foot">${escapeHtml(copy.foot)}</p>
  </article>`;
}

function renderTherapistSummaryHtml(pages) {
  const list = Array.isArray(pages) ? pages.filter(Boolean) : [];
  if (!list.length) return "";
  const lang = list[0].language === "af" ? "af" : "en";
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(list.map((page) => page.name).join(" · "))} — ${escapeHtml(copyFor(lang).kicker)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f7f4ec; color: #2a332c; font-family: "Segoe UI", Helvetica, Arial, sans-serif; }
    .sheet { width: 190mm; margin: 0 auto; padding: 8mm 0 4mm; page-break-after: always; }
    .sheet:last-child { page-break-after: auto; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .brand, .kicker, .meta, h2 { margin: 0; color: #5c675e; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; }
    h1 { margin: 2px 0 0; font-size: 20px; line-height: 1.2; color: #244b38; font-weight: 650; }
    .meta { margin-top: 3px; text-transform: none; letter-spacing: 0; font-size: 11px; }
    h2 { margin: 11px 0 6px; }
    .senses, .groups { display: grid; gap: 7px 8px; }
    .senses { grid-template-columns: repeat(3, 1fr); }
    .groups { grid-template-columns: 1fr 1fr; }
    .sense, .group { break-inside: avoid; }
    .sense { background: #e7efe6; padding: 7px 8px 8px; }
    .sense header, .group header, .qa { display: flex; justify-content: space-between; gap: 8px; align-items: baseline; }
    .sense h3, .group h3 { margin: 0; font-size: 12px; color: #244b38; }
    .sense b, .group header span, .qa strong { font-size: 11px; font-weight: 650; }
    .track { position: relative; height: 3px; margin: 6px 0 5px; background: #d2dfd1; }
    .track i { position: absolute; top: -2px; width: 7px; height: 7px; margin-left: -3px; background: #244b38; }
    .sense p, .line, .qa span, .empty, .foot { margin: 0; font-size: 10.5px; line-height: 1.35; color: #3d4941; }
    .saturday { border-left: 2px solid #365b46; padding: 1px 0 1px 10px; }
    .saturday blockquote { margin: 0; font-family: Georgia, Palatino, "Times New Roman", serif; font-size: 12.5px; line-height: 1.4; font-style: italic; }
    .group { padding-top: 2px; }
    .group header { border-bottom: 1px solid #d5ddd0; padding-bottom: 3px; }
    .line { margin: 4px 0 5px; color: #5c675e; }
    .qa { margin-top: 3px; }
    .qa span { flex: 1; }
    .foot { margin-top: 10px; color: #5c675e; }
  </style>
</head>
<body>
${list.map(sheetHtml).join("\n")}
</body>
</html>`;
}

function summaryFilename(pages) {
  const slug = pages
    .map((page) => page.name)
    .filter(Boolean)
    .slice(0, 2)
    .join("-and-")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${slug || "patient"}-therapist-summary.html`;
}

function therapistSummaryAttachment(records) {
  const pages = buildSummaryPages(records);
  if (!pages.length) return null;
  return {
    filename: summaryFilename(pages),
    content: renderTherapistSummaryHtml(pages),
    contentType: "text/html; charset=utf-8",
  };
}

module.exports = {
  buildSummaryPages,
  renderTherapistSummaryHtml,
  therapistSummaryAttachment,
};
