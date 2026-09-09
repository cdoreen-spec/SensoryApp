/**
 * Shared patient store + Gmail sending for Soulful Sensory OT.
 * Used by the Netlify function and the local Node server.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROLES = Object.freeze({
  admin: "admin",
  therapist: "therapist",
  patient: "patient",
});
const STATUS = Object.freeze({
  active: "active",
  pending: "pending",
  disabled: "disabled",
});

const { buildEmailHtml, emailAttachments } = require("./email-layout");
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 24 * 60 * 60 * 1000;
const DATA_DIR = path.join(__dirname, "..", "data");
const FILE_STORE_PATH = process.env.SSOT_STORE_PATH || path.join(DATA_DIR, "store.json");

function clinicianEmail() {
  return normalizeEmail(
    process.env.CLINICIAN_EMAIL || process.env.GMAIL_USER || "soulfulsensoryot@gmail.com"
  );
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function createId(prefix = "id") {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(6).toString("hex")}`;
}

function createSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto.createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

function hashResetToken(token) {
  return hashPassword(String(token || ""), "ssot-reset");
}

function createSessionToken() {
  return crypto.randomBytes(24).toString("hex");
}

function emptyState() {
  return {
    users: [],
    assessments: { version: 1, items: [] },
    coupleSessions: { version: 1, sessions: {} },
    payments: { version: 1, currency: "ZAR", items: [] },
    settings: {},
    sessions: {},
  };
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    firstName: user.firstName || "",
    surname: user.surname || "",
    email: user.email,
    role: user.role,
    status: user.status,
    phone: user.phone || "",
    age: user.age || "",
    notes: user.notes || "",
    questionnaireType: user.questionnaireType || "",
    lifeContext: user.lifeContext || "",
    reasonForReferral: user.reasonForReferral || "",
    expiresAt: user.expiresAt || null,
    inviteToken: user.inviteToken || "",
    createdByUserId: user.createdByUserId || null,
    assessmentId: user.assessmentId || null,
    reportVisibility: user.reportVisibility || "",
    temporaryPassword: user.temporaryPassword || "",
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt || null,
    updatedAt: user.updatedAt || null,
  };
}

function isStaff(user) {
  return Boolean(
    user &&
      user.status === STATUS.active &&
      (user.role === ROLES.admin || user.role === ROLES.therapist)
  );
}

function newer(a, b) {
  const aTime =
    Date.parse(a?.updatedAt || a?.savedAt || a?.completedAt || a?.createdAt || 0) || 0;
  const bTime =
    Date.parse(b?.updatedAt || b?.savedAt || b?.completedAt || b?.createdAt || 0) || 0;
  return aTime >= bTime;
}

function pruneSessions(state) {
  const now = Date.now();
  const sessions = state.sessions || {};
  for (const [token, session] of Object.entries(sessions)) {
    const expires = Date.parse(session?.expiresAt || "") || 0;
    if (!expires || expires < now) delete sessions[token];
  }
  state.sessions = sessions;
}

function seedAdmin(state) {
  const email = normalizeEmail(process.env.ADMIN_EMAIL || "soulfulsensoryot@gmail.com");
  const password = String(process.env.ADMIN_PASSWORD || "SoulfulAdmin2026!");
  const name = String(process.env.ADMIN_NAME || "Cayley Alberts");
  const existing = (state.users || []).find((user) => user.role === ROLES.admin || user.email === email);
  if (existing) {
    existing.role = ROLES.admin;
    existing.status = STATUS.active;
    if (!existing.passwordCustomized && password) {
      existing.salt = createSalt();
      existing.passwordHash = hashPassword(password, existing.salt);
    }
    return;
  }
  const salt = createSalt();
  state.users.push({
    id: createId("user"),
    name,
    email,
    role: ROLES.admin,
    status: STATUS.active,
    phone: process.env.ADMIN_PHONE || "068 901 4209",
    notes: "Primary practice administrator",
    salt,
    passwordHash: hashPassword(password, salt),
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    updatedAt: null,
  });
}

function normalizeState(raw) {
  const state = emptyState();
  if (!raw || typeof raw !== "object") return state;
  state.users = Array.isArray(raw.users) ? raw.users : [];
  if (raw.assessments && Array.isArray(raw.assessments.items)) {
    state.assessments = { version: 1, items: raw.assessments.items };
  } else if (Array.isArray(raw.assessments)) {
    state.assessments = { version: 1, items: raw.assessments };
  }
  if (raw.coupleSessions && typeof raw.coupleSessions.sessions === "object") {
    state.coupleSessions = { version: 1, sessions: raw.coupleSessions.sessions || {} };
  } else if (raw.coupleSessions && typeof raw.coupleSessions === "object") {
    state.coupleSessions = { version: 1, sessions: raw.coupleSessions };
  }
  if (raw.payments && Array.isArray(raw.payments.items)) {
    state.payments = {
      version: 1,
      currency: raw.payments.currency || "ZAR",
      items: raw.payments.items,
    };
  }
  state.settings = raw.settings && typeof raw.settings === "object" ? raw.settings : {};
  state.sessions = raw.sessions && typeof raw.sessions === "object" ? raw.sessions : {};
  return state;
}

function useFileStore() {
  return Boolean(process.env.SSOT_STORE_PATH) || !process.env.NETLIFY;
}

async function loadState() {
  let state;
  if (!useFileStore()) {
    const { getStore } = require("@netlify/blobs");
    const store = getStore("ssot-practice");
    const raw = await store.get("state", { type: "json" });
    state = normalizeState(raw);
  } else {
    try {
      const raw = JSON.parse(fs.readFileSync(FILE_STORE_PATH, "utf8"));
      state = normalizeState(raw);
    } catch (_) {
      state = emptyState();
    }
  }
  const before = state.users.length;
  seedAdmin(state);
  pruneSessions(state);
  if (state.users.length !== before) await saveState(state);
  return state;
}

async function saveState(state) {
  pruneSessions(state);
  if (!useFileStore()) {
    const { getStore } = require("@netlify/blobs");
    const store = getStore("ssot-practice");
    await store.setJSON("state", state);
    return;
  }
  fs.mkdirSync(path.dirname(FILE_STORE_PATH), { recursive: true });
  fs.writeFileSync(FILE_STORE_PATH, JSON.stringify(state, null, 2));
}

function mergeById(existing, incoming) {
  const map = new Map();
  for (const item of existing || []) {
    if (item?.id) map.set(item.id, item);
  }
  for (const item of incoming || []) {
    if (!item?.id) continue;
    const current = map.get(item.id);
    if (!current || newer(item, current)) map.set(item.id, { ...current, ...item });
  }
  return [...map.values()];
}

function mergeUsers(serverUsers, localUsers) {
  const map = new Map();
  const emails = new Map();
  for (const user of serverUsers || []) {
    if (!user?.id) continue;
    map.set(user.id, user);
    if (user.email) emails.set(normalizeEmail(user.email), user.id);
  }
  for (const user of localUsers || []) {
    if (!user?.id) continue;
    const email = normalizeEmail(user.email);
    const existingId = map.has(user.id) ? user.id : emails.get(email);
    if (existingId) {
      const current = map.get(existingId);
      if (newer(user, current)) {
        const merged = { ...current, ...user, id: existingId };
        map.set(existingId, merged);
        if (merged.email) emails.set(normalizeEmail(merged.email), existingId);
      }
      continue;
    }
    map.set(user.id, user);
    if (email) emails.set(email, user.id);
  }
  return [...map.values()];
}

function mergeSnapshot(state, snapshot) {
  if (!snapshot || typeof snapshot !== "object") return state;
  if (Array.isArray(snapshot.users)) state.users = mergeUsers(state.users, snapshot.users);
  const incomingAssessments = Array.isArray(snapshot.assessments)
    ? snapshot.assessments
    : snapshot.assessments?.items;
  if (Array.isArray(incomingAssessments)) {
    state.assessments.items = mergeById(state.assessments.items, incomingAssessments);
  }
  const incomingSessions =
    snapshot.coupleSessions?.sessions ||
    (snapshot.coupleSessions && !snapshot.coupleSessions.version ? snapshot.coupleSessions : null);
  if (incomingSessions && typeof incomingSessions === "object") {
    state.coupleSessions.sessions = { ...state.coupleSessions.sessions, ...incomingSessions };
  }
  const incomingPayments = Array.isArray(snapshot.payments)
    ? snapshot.payments
    : snapshot.payments?.items;
  if (Array.isArray(incomingPayments)) {
    state.payments.items = mergeById(state.payments.items, incomingPayments);
  }
  if (snapshot.settings && typeof snapshot.settings === "object") {
    state.settings = { ...state.settings, ...snapshot.settings };
  }
  return state;
}

function staffSnapshot(state) {
  return {
    users: state.users,
    assessments: state.assessments,
    coupleSessions: state.coupleSessions,
    payments: state.payments,
    settings: state.settings,
    replace: true,
  };
}

function patientSnapshot(state, user) {
  const items = (state.assessments.items || []).filter(
    (item) => item.patientUserId === user.id || item.id === user.assessmentId
  );
  const sessions = {};
  for (const [id, session] of Object.entries(state.coupleSessions.sessions || {})) {
    if (session?.patientUserId === user.id || items.some((item) => item.coupleId === id)) {
      sessions[id] = session;
    }
  }
  return {
    users: [user],
    assessments: { version: 1, items },
    coupleSessions: { version: 1, sessions },
    payments: { version: 1, currency: state.payments.currency, items: [] },
    settings: {},
    replace: false,
  };
}

function getSessionUser(state, token) {
  const raw = String(token || "").trim();
  if (!raw) return null;
  const session = state.sessions?.[raw];
  if (!session) return null;
  const expires = Date.parse(session.expiresAt || "") || 0;
  if (!expires || expires < Date.now()) {
    delete state.sessions[raw];
    return null;
  }
  const user = state.users.find((entry) => entry.id === session.userId);
  if (!user || user.status === STATUS.disabled) return null;
  return user;
}

function issueSession(state, user) {
  pruneSessions(state);
  const token = createSessionToken();
  state.sessions[token] = {
    userId: user.id,
    role: user.role,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
  return token;
}

function gmailConfigured() {
  return Boolean(
    (process.env.GMAIL_USER || clinicianEmail()) && process.env.GMAIL_APP_PASSWORD
  );
}

async function sendGmail({
  to,
  subject,
  message,
  name,
  kind,
  inviteUrl,
  resetUrl,
  questionnaireType,
  expiresAt,
  email,
  password,
  intro,
  sections,
}) {
  if (!gmailConfigured()) {
    const err = new Error(
      "Gmail is not connected yet. Add GMAIL_USER and GMAIL_APP_PASSWORD in the hosting environment (or .env for local testing)."
    );
    err.code = "gmail-not-configured";
    throw err;
  }
  const nodemailer = require("nodemailer");
  const fromUser = process.env.GMAIL_USER || clinicianEmail();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: fromUser,
      pass: String(process.env.GMAIL_APP_PASSWORD).replace(/\s+/g, ""),
    },
  });
  const template = {
    kind: kind || "",
    subject,
    message,
    name,
    inviteUrl,
    resetUrl,
    questionnaireType,
    expiresAt,
    email: email || to,
    password,
    intro,
    sections,
  };
  await transporter.sendMail({
    from: `"Soulful Sensory OT" <${fromUser}>`,
    to,
    replyTo: clinicianEmail(),
    subject: String(subject || "Soulful Sensory OT"),
    text: String(message || ""),
    html: buildEmailHtml(template),
    attachments: emailAttachments(),
  });
  return { provider: "gmail", to, name: name || "" };
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(status, body) {
  return { status, body };
}

function canReceivePasswordReset(user) {
  return Boolean(
    user &&
      user.status === STATUS.active &&
      (user.role === ROLES.therapist || user.role === ROLES.admin)
  );
}

function buildResetUrl(token, origin) {
  const base = String(origin || process.env.APP_ORIGIN || "").replace(/\/$/, "");
  if (!base) return "";
  return `${base}/?reset=${encodeURIComponent(token)}`;
}

async function handleLogin(state, body) {
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  const user = state.users.find((entry) => entry.email === email);
  if (!user || hashPassword(password, user.salt) !== user.passwordHash) {
    return json(401, { ok: false, error: "Incorrect email or password." });
  }
  if (user.status === STATUS.pending) {
    return json(403, { ok: false, error: "This therapist account is awaiting admin approval." });
  }
  if (user.status === STATUS.disabled) {
    return json(403, { ok: false, error: "This account has been disabled. Contact the admin." });
  }
  if (isStaff(user) && body.localSnapshot) {
    mergeSnapshot(state, body.localSnapshot);
  }
  user.lastLoginAt = new Date().toISOString();
  if (user.temporaryPassword) user.temporaryPassword = "";
  user.updatedAt = user.lastLoginAt;
  const token = issueSession(state, user);
  await saveState(state);
  const snapshot = isStaff(user) ? staffSnapshot(state) : patientSnapshot(state, user);
  return json(200, { ok: true, token, user: publicUser(user), ...snapshot });
}

async function handleRegister(state, body) {
  const settings = { requireTherapistApproval: true, allowTherapistSignup: true, ...state.settings };
  const email = normalizeEmail(body.email);
  const name = String(body.name || "").trim();
  const password = String(body.password || "");
  const role = body.role === ROLES.therapist ? ROLES.therapist : ROLES.patient;
  if (!name) return json(400, { ok: false, error: "Please enter your name." });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { ok: false, error: "Please enter a valid email address." });
  }
  if (password.length < 8) {
    return json(400, { ok: false, error: "Password must be at least 8 characters." });
  }
  if (role === ROLES.patient) {
    return json(400, { ok: false, error: "Patient registration is currently closed." });
  }
  if (settings.allowTherapistSignup === false) {
    return json(400, { ok: false, error: "Therapist registration is currently closed." });
  }
  if (state.users.some((entry) => entry.email === email)) {
    return json(400, { ok: false, error: "An account with this email already exists." });
  }
  const salt = createSalt();
  const needsApproval = settings.requireTherapistApproval !== false;
  const user = {
    id: createId("user"),
    name,
    email,
    role,
    status: needsApproval ? STATUS.pending : STATUS.active,
    phone: String(body.phone || "").trim(),
    notes: "",
    salt,
    passwordHash: hashPassword(password, salt),
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    updatedAt: new Date().toISOString(),
  };
  state.users.push(user);
  let token = null;
  if (user.status === STATUS.active) {
    user.lastLoginAt = user.updatedAt;
    token = issueSession(state, user);
  }
  await saveState(state);
  return json(200, {
    ok: true,
    pending: user.status === STATUS.pending,
    token,
    user: publicUser(user),
    ...(token ? staffSnapshot(state) : {}),
  });
}

async function handleHydrate(state, body) {
  const sessionUser = getSessionUser(state, body.sessionToken);
  if (sessionUser && isStaff(sessionUser)) {
    return json(200, { ok: true, ...staffSnapshot(state) });
  }
  if (sessionUser && sessionUser.role === ROLES.patient) {
    return json(200, { ok: true, ...patientSnapshot(state, sessionUser) });
  }
  const inviteToken = String(body.inviteToken || "").trim();
  if (inviteToken) {
    const user = state.users.find((entry) => entry.inviteToken && entry.inviteToken === inviteToken);
    if (user) return json(200, { ok: true, ...patientSnapshot(state, user) });
  }
  const resetToken = String(body.resetToken || "").trim();
  if (resetToken) {
    const tokenHash = hashResetToken(resetToken);
    const user = state.users.find((entry) => entry.resetTokenHash && entry.resetTokenHash === tokenHash);
    if (user) {
      const expires = Date.parse(user.resetTokenExpiresAt || "") || 0;
      if (expires >= Date.now()) {
        return json(200, {
          ok: true,
          replace: false,
          users: [user],
          assessments: { version: 1, items: [] },
          coupleSessions: { version: 1, sessions: {} },
          payments: { version: 1, currency: "ZAR", items: [] },
          settings: {},
        });
      }
    }
  }
  return json(200, { ok: true, replace: false, users: [], empty: true });
}

async function handlePush(state, body) {
  const user = getSessionUser(state, body.sessionToken);
  if (!user) return json(401, { ok: false, error: "Please sign in again." });
  if (isStaff(user)) {
    mergeSnapshot(state, body);
    await saveState(state);
    return json(200, { ok: true, ...staffSnapshot(state) });
  }
  const allowedUsers = Array.isArray(body.users)
    ? body.users.filter((entry) => entry && entry.id === user.id)
    : [];
  if (allowedUsers.length) {
    state.users = mergeUsers(state.users, allowedUsers);
  }
  const incomingAssessments = Array.isArray(body.assessments)
    ? body.assessments
    : body.assessments?.items;
  if (Array.isArray(incomingAssessments)) {
    const allowed = incomingAssessments.filter(
      (item) => item && (item.patientUserId === user.id || item.id === user.assessmentId)
    );
    state.assessments.items = mergeById(state.assessments.items, allowed);
  }
  await saveState(state);
  return json(200, { ok: true, ...patientSnapshot(state, user) });
}

async function handleSendEmail(state, body) {
  const to = normalizeEmail(body.to);
  const clinician = clinicianEmail();
  const sessionUser = getSessionUser(state, body.sessionToken);
  const inviteUser = String(body.inviteToken || "").trim()
    ? state.users.find((entry) => entry.inviteToken === String(body.inviteToken).trim())
    : null;

  let allowed = false;
  if (sessionUser && isStaff(sessionUser)) allowed = true;
  else if (sessionUser && sessionUser.role === ROLES.patient && to === clinician) allowed = true;
  else if (inviteUser && to === clinician) allowed = true;
  else if (body.kind === "password-reset") {
    const target = state.users.find((entry) => entry.email === to);
    allowed = canReceivePasswordReset(target);
    if (!allowed) return json(200, { ok: true, sent: false });
  }

  if (!allowed) return json(401, { ok: false, error: "You are not allowed to send this email." });
  if (!to) return json(400, { ok: false, error: "This email is missing a recipient." });

  const result = await sendGmail({
    to,
    subject: body.subject,
    message: body.message,
    name: body.name,
    kind: body.kind,
    inviteUrl: body.inviteUrl,
    resetUrl: body.resetUrl,
    questionnaireType: body.questionnaireType,
    expiresAt: body.expiresAt,
    email: body.email || to,
    password: body.password,
    intro: body.intro,
    sections: body.sections,
  });
  return json(200, { ok: true, ...result });
}

async function handleRequestPasswordReset(state, body, origin) {
  const email = normalizeEmail(body.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { ok: false, error: "Please enter a valid email address." });
  }
  const user = state.users.find((entry) => entry.email === email);
  if (!canReceivePasswordReset(user)) {
    return json(200, { ok: true, sent: false });
  }
  const token = crypto.randomBytes(32).toString("hex");
  user.resetTokenHash = hashResetToken(token);
  user.resetTokenExpiresAt = new Date(Date.now() + RESET_TTL_MS).toISOString();
  user.updatedAt = new Date().toISOString();
  await saveState(state);
  const resetUrl = buildResetUrl(token, body.origin || origin);
  if (gmailConfigured() && resetUrl) {
    await sendGmail({
      to: user.email,
      subject: "Reset your Soulful Sensory OT password",
      name: user.name,
      kind: "password-reset",
      resetUrl,
      message: [
        `Hello ${user.name || "there"},`,
        "",
        "We received a request to reset the password for this Soulful Sensory OT account.",
        "",
        "Open this link, then choose a new password:",
        resetUrl,
        "",
        "This link expires in 24 hours. If you did not ask to reset your password, you can ignore this email.",
      ].join("\n"),
    });
    return json(200, { ok: true, sent: true, emailed: true, email: user.email, name: user.name });
  }
  return json(200, {
    ok: true,
    sent: true,
    emailed: false,
    token,
    email: user.email,
    name: user.name,
  });
}

async function handleCompleteReset(state, body) {
  const token = String(body.token || "").trim();
  const password = String(body.password || "");
  if (password.length < 8) {
    return json(400, { ok: false, error: "Password must be at least 8 characters." });
  }
  const tokenHash = hashResetToken(token);
  const user = state.users.find((entry) => entry.resetTokenHash && entry.resetTokenHash === tokenHash);
  if (!user) {
    return json(400, { ok: false, error: "This reset link is invalid or has already been used." });
  }
  const expires = Date.parse(user.resetTokenExpiresAt || "") || 0;
  if (!expires || expires < Date.now()) {
    return json(400, { ok: false, error: "This reset link has expired. Please request a new one." });
  }
  user.salt = createSalt();
  user.passwordHash = hashPassword(password, user.salt);
  user.resetTokenHash = null;
  user.resetTokenExpiresAt = null;
  user.passwordCustomized = true;
  user.updatedAt = new Date().toISOString();
  await saveState(state);
  return json(200, { ok: true, user: publicUser(user) });
}

async function handlePeekReset(state, body) {
  const token = String(body.token || "").trim();
  const tokenHash = hashResetToken(token);
  const user = state.users.find((entry) => entry.resetTokenHash && entry.resetTokenHash === tokenHash);
  if (!user) {
    return json(400, {
      ok: false,
      error: "This reset link is invalid or has already been used.",
    });
  }
  const expires = Date.parse(user.resetTokenExpiresAt || "") || 0;
  if (!expires || expires < Date.now()) {
    return json(400, { ok: false, error: "This reset link has expired. Please request a new one." });
  }
  return json(200, { ok: true, user: publicUser(user) });
}

async function handleRequest(body, { origin } = {}) {
  const action = String(body?.action || "").trim();
  if (action === "health") {
    return json(200, {
      ok: true,
      gmailConfigured: gmailConfigured(),
      from: process.env.GMAIL_USER || clinicianEmail(),
    });
  }

  const state = await loadState();
  try {
    if (action === "login") return await handleLogin(state, body);
    if (action === "register") return await handleRegister(state, body);
    if (action === "hydrate") return await handleHydrate(state, body);
    if (action === "push") return await handlePush(state, body);
    if (action === "sendEmail") return await handleSendEmail(state, body);
    if (action === "requestPasswordReset") {
      return await handleRequestPasswordReset(state, body, origin);
    }
    if (action === "peekReset") return await handlePeekReset(state, body);
    if (action === "completeReset") return await handleCompleteReset(state, body);
    return json(400, { ok: false, error: "Unknown request." });
  } catch (err) {
    const message = err?.message || "The server could not complete that request.";
    const status = err?.code === "gmail-not-configured" ? 400 : 500;
    return json(status, { ok: false, error: message, code: err?.code || null });
  }
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
};

async function netlifyHandler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }
  if (event.httpMethod === "GET") {
    const result = await handleRequest({ action: "health" });
    return {
      statusCode: result.status,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify(result.body),
    };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "POST only" }),
    };
  }
  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (_) {
    return {
      statusCode: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "Invalid JSON" }),
    };
  }
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const result = await handleRequest(payload, { origin });
  return {
    statusCode: result.status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify(result.body),
  };
}

function previewEmailHtml(kind = "invite") {
  const sample = {
    kind,
    name: "Alex",
    subject: "Your sensory questionnaire from Soulful Sensory OT",
    questionnaireType: "Adult · Home",
    email: "alex@example.com",
    password: "Trail-example",
    expiresAt: "23 September 2026",
    inviteUrl: "http://127.0.0.1:8787/?invite=1",
    resetUrl: "http://127.0.0.1:8787/?reset=preview",
    message:
      "Hello Alex,\n\nYour occupational therapist has created an account for you to complete a sensory questionnaire.",
  };
  if (kind === "report") {
    sample.subject = "Completed: Alex — Sensory screening";
    sample.intro =
      "A sensory questionnaire has been completed. This is a short notice — open the patient register in the web app for the full report.";
    sample.sections = [
      {
        heading: "Patient details",
        rows: [
          ["Name", "Alex"],
          ["Age", "34"],
          ["Email", "alex@example.com"],
          ["Questionnaire", "Adult · Home"],
        ],
      },
      {
        heading: "Total score",
        rows: [
          ["Sensitive / avoiding", "18"],
          ["Sensory neutral", "11"],
          ["Sensory seeking", "9"],
        ],
      },
      { heading: "Overall pattern", text: "Sensory Sensitive / Avoiding" },
      { heading: "Sensory trail character", text: "Sensory Observer · Low threshold – Sensitive" },
    ];
  }
  return buildEmailHtml(sample, { publicImages: true });
}

module.exports = {
  handleRequest,
  netlifyHandler,
  previewEmailHtml,
};

