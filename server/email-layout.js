/**
 * Branded HTML email layout for Soulful Sensory OT.
 * Images are attached inline (cid:) so they display without a public URL.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ASSET_DIR = path.join(ROOT, "assets", "email");

const COLORS = {
  sage: "#769488",
  forest: "#244b38",
  cream: "#f7f4ec",
  paper: "#fffcf6",
  ink: "#2a332c",
  muted: "#5c675e",
  line: "#d5ddd0",
  button: "#365b46",
};

const FONTS = {
  serif: "Georgia, 'Palatino Linotype', Palatino, 'Times New Roman', Times, serif",
  sans: "'Segoe UI', Helvetica, Arial, sans-serif",
};

function assetPath(name) {
  return path.join(ASSET_DIR, name);
}

function fileIfExists(name) {
  const filePath = assetPath(name);
  return fs.existsSync(filePath) ? filePath : "";
}

function emailAttachments() {
  const files = [
    { filename: "brand.png", path: fileIfExists("brand.png"), cid: "ssot-brand" },
    { filename: "hero.jpg", path: fileIfExists("hero.jpg"), cid: "ssot-hero" },
  ];
  return files.filter((file) => file.path);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstName(name) {
  return String(name || "there").trim().split(/\s+/)[0] || "there";
}

function paragraphHtml(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="margin:0 0 16px;font-family:${FONTS.sans};font-size:16px;line-height:1.65;color:${COLORS.ink};">${escapeHtml(
          block
        ).replace(/\n/g, "<br>")}</p>`
    )
    .join("");
}

function headingHtml(text) {
  if (!text) return "";
  return `<p style="margin:0 0 10px;font-family:${FONTS.sans};font-size:16px;line-height:1.3;font-weight:700;color:${COLORS.forest};">${escapeHtml(
    text
  )}</p>`;
}

function parseSections(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }
  return [];
}

function sectionRow(label, value) {
  if (value == null || value === "") return "";
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid ${COLORS.line};font-family:${FONTS.sans};font-size:13px;color:${COLORS.muted};width:42%;">${escapeHtml(
        label
      )}</td>
      <td style="padding:8px 0;border-bottom:1px solid ${COLORS.line};font-family:${FONTS.serif};font-size:16px;color:${COLORS.forest};">${escapeHtml(
        value
      )}</td>
    </tr>`;
}

function sectionHtml(section) {
  if (!section || !section.heading) return "";
  const rows = Array.isArray(section.rows) ? section.rows : [];
  const rowHtml = rows
    .map((row) => {
      const label = Array.isArray(row) ? row[0] : row?.label;
      const value = Array.isArray(row) ? row[1] : row?.value;
      return sectionRow(label, value);
    })
    .join("");
  const text = section.text
    ? `<p style="margin:${rowHtml ? "12px 0 0" : "0"};font-family:${FONTS.serif};font-size:18px;line-height:1.4;color:${COLORS.forest};">${escapeHtml(
        section.text
      )}</p>`
    : "";
  if (!rowHtml && !text) return "";
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:${COLORS.cream};border:1px solid ${COLORS.line};border-radius:14px;">
      <tr>
        <td style="padding:16px 20px;">
          ${headingHtml(section.heading)}
          ${
            rowHtml
              ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}</table>`
              : ""
          }
          ${text}
        </td>
      </tr>
    </table>`;
}

function detailRow(label, value) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.line};font-family:${FONTS.sans};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.muted};width:38%;">${escapeHtml(
        label
      )}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.line};font-family:${FONTS.serif};font-size:16px;color:${COLORS.forest};">${escapeHtml(
        value
      )}</td>
    </tr>`;
}

function ctaButton(url, label) {
  if (!url) return "";
  const safeUrl = escapeHtml(url);
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 22px;">
      <tr>
        <td align="center" bgcolor="${COLORS.button}" style="border-radius:28px;background:${COLORS.button};">
          <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;font-family:${FONTS.sans};font-size:15px;font-weight:600;letter-spacing:0.02em;color:#ffffff;text-decoration:none;">${escapeHtml(
            label
          )}</a>
        </td>
      </tr>
    </table>`;
}

function inviteCopy(options) {
  const name = firstName(options.name);
  return {
    eyebrow: "Questionnaire",
    title: "Your sensory questionnaire",
    hero: "Please complete your assigned questionnaire",
    bodyHtml: `
      <p style="margin:0 0 16px;font-family:${FONTS.serif};font-size:22px;line-height:1.35;color:${COLORS.forest};">Dear ${escapeHtml(
        name
      )},</p>
      <p style="margin:0 0 16px;font-family:${FONTS.sans};font-size:16px;line-height:1.65;color:${COLORS.ink};">
        An account has been created for you at <strong>Soulful Sensory OT</strong> so you can complete a sensory questionnaire.
      </p>
      <p style="margin:0 0 18px;font-family:${FONTS.sans};font-size:16px;line-height:1.65;color:${COLORS.ink};">
        Please open the questionnaire and use the email and password provided to access it.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;background:${COLORS.cream};border:1px solid ${COLORS.line};border-radius:14px;">
        <tr>
          <td style="padding:18px 22px;">
            ${headingHtml("Sign-in details")}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${detailRow("Email", options.email)}
              ${detailRow("Password", options.password || "The password your therapist sent you")}
              ${detailRow("Expires", options.expiresAt || "14 days from today")}
            </table>
          </td>
        </tr>
      </table>
      ${ctaButton(options.inviteUrl, "Open the questionnaire")}
      <p style="margin:0 0 8px;font-family:${FONTS.sans};font-size:14px;line-height:1.6;color:${COLORS.muted};">
        If the button does not work, copy this link into your browser:
      </p>
      <p style="margin:0 0 18px;font-family:${FONTS.sans};font-size:13px;line-height:1.5;color:${COLORS.button};word-break:break-all;">${escapeHtml(
        options.inviteUrl || ""
      )}</p>
      <p style="margin:0;font-family:${FONTS.sans};font-size:16px;line-height:1.6;color:${COLORS.forest};">Kind regards,<br>Cayley Alberts<br>Occupational Therapist<br>Soulful Sensory OT</p>
    `,
  };
}

function resetCopy(options) {
  return {
    eyebrow: "Account",
    title: "Reset your password",
    hero: "Password reset request",
    bodyHtml: `
      <p style="margin:0 0 16px;font-family:${FONTS.serif};font-size:22px;line-height:1.35;color:${COLORS.forest};">Dear ${escapeHtml(
        firstName(options.name)
      )},</p>
      <p style="margin:0 0 16px;font-family:${FONTS.sans};font-size:16px;line-height:1.65;color:${COLORS.ink};">
        We received a request to reset the password for this Soulful Sensory OT therapist account.
      </p>
      ${ctaButton(options.resetUrl || options.inviteUrl, "Set a new password")}
      <p style="margin:0;font-family:${FONTS.sans};font-size:14px;line-height:1.6;color:${COLORS.muted};">
        This link expires in 24 hours. If you did not request a reset, you can ignore this email.
      </p>
    `,
  };
}

function reportCopy(options) {
  const sections = parseSections(options.sections);
  const intro =
    options.intro ||
    "A sensory questionnaire has been completed. This is a short notice — open the patient register in the web app for the full report.";
  const sectionsMarkup = sections.map(sectionHtml).join("");
  const fallback = !sectionsMarkup && options.message ? paragraphHtml(options.message) : "";
  return {
    eyebrow: "Questionnaire complete",
    title: options.subject || "Completed sensory questionnaire",
    hero: "A questionnaire has been completed",
    bodyHtml: `
      ${headingHtml("Questionnaire complete")}
      <p style="margin:0 0 18px;font-family:${FONTS.sans};font-size:16px;line-height:1.65;color:${COLORS.ink};">${escapeHtml(
        intro
      )}</p>
      ${sectionsMarkup}
      ${fallback}
    `,
  };
}

function noticeCopy(options) {
  return {
    eyebrow: "Practice notice",
    title: options.subject || "Soulful Sensory OT",
    hero: "",
    bodyHtml: paragraphHtml(options.message),
  };
}

function contentFor(options) {
  const kind = String(options.kind || "").toLowerCase();
  if (kind === "invite") return inviteCopy(options);
  if (kind === "password-reset") return resetCopy(options);
  if (kind === "report") return reportCopy(options);
  return noticeCopy(options);
}

function buildEmailHtml(options, { publicImages } = {}) {
  const content = contentFor(options);
  const src = {
    brand: publicImages ? "/assets/email/brand.png" : "cid:ssot-brand",
    hero: publicImages ? "/assets/email/hero.jpg?v=path-crop2" : "cid:ssot-hero",
  };
  const title = content.title || "Soulful Sensory OT";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.sage};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(
    content.hero || title
  )}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.sage};">
    <tr>
      <td align="center" style="padding:28px 12px 40px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${COLORS.paper};border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(36,75,56,0.18);">
          <tr>
            <td align="center" bgcolor="${COLORS.sage}" style="padding:22px 24px 8px;background:${COLORS.sage};">
              <img src="${src.brand}" width="168" alt="Soulful Sensory OT" style="display:block;width:168px;max-width:70%;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="font-size:0;line-height:0;background:${COLORS.forest};">
              <img src="${src.hero}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:300px;object-fit:cover;object-position:center 32%;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:28px 34px 12px;background:${COLORS.paper};">
              ${content.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 34px 28px;background:${COLORS.paper};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid ${COLORS.line};padding-top:18px;">
                    <p style="margin:0 0 6px;font-family:${FONTS.serif};font-size:15px;color:${COLORS.forest};">Soulful Sensory OT</p>
                    <p style="margin:0;font-family:${FONTS.sans};font-size:13px;line-height:1.6;color:${COLORS.muted};">
                      Cayley Alberts · 068 901 4209<br>
                      soulfulsensoryot@gmail.com<br>
                      This screening does not constitute a diagnosis. Results are for guidance only.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
  buildEmailHtml,
  emailAttachments,
  COLORS,
};
