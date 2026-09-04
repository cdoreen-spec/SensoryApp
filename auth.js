/**
 * Soulful Sensory OT — client-side accounts & session
 *
 * Users and settings are stored in this browser's localStorage.
 * For multi-device access later, swap the storage layer for a backend.
 */

const AUTH_USERS_KEY = "ssot-users-v1";
const AUTH_SESSION_KEY = "ssot-session-v1";
const AUTH_SETTINGS_KEY = "ssot-settings-v1";

const AUTH_ROLES = Object.freeze({
  admin: "admin",
  therapist: "therapist",
  patient: "patient",
});

const AUTH_STATUS = Object.freeze({
  active: "active",
  pending: "pending",
  disabled: "disabled",
});

function authConfig() {
  return typeof APP_CONFIG !== "undefined" ? APP_CONFIG : {};
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function createSalt() {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
  const payload = `${salt}:${password}`;
  if (typeof crypto !== "undefined" && crypto.subtle?.digest) {
    const data = new TextEncoder().encode(payload);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for non-secure contexts (file://) — still salted, not plaintext.
  let hash = 2166136261;
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv_${(hash >>> 0).toString(16)}`;
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function defaultSettings() {
  const cfg = authConfig();
  return {
    clinicianEmail: cfg.clinicianEmail || "soulfulsensoryot@gmail.com",
    showPainPathway: cfg.showPainPathway === true,
    allowPatientSignup: cfg.allowPatientSignup !== false,
    allowTherapistSignup: cfg.allowTherapistSignup !== false,
    requireTherapistApproval: cfg.requireTherapistApproval !== false,
    practiceName: cfg.practiceName || "Soulful Sensory OT",
  };
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  const users = readJson(AUTH_USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
  writeJson(AUTH_USERS_KEY, users);
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

function createInviteToken() {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function createTemporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  const body = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `Trail-${body}`;
}

function addDaysFromNow(days) {
  const date = new Date();
  date.setTime(date.getTime() + Number(days) * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

function findUserByInviteToken(token) {
  const raw = String(token || "").trim();
  if (!raw) return null;
  return getUsers().find((u) => u.inviteToken && u.inviteToken === raw) || null;
}

function isPatientAssignmentExpired(user) {
  if (!user?.expiresAt) return false;
  const expires = Date.parse(user.expiresAt);
  return Number.isFinite(expires) && expires < Date.now();
}

async function ensureAdminSeed() {
  const cfg = authConfig();
  const email = normalizeEmail(cfg.adminEmail || "soulfulsensoryot@gmail.com");
  const password = String(cfg.adminPassword || "SoulfulAdmin2026!");
  const name = String(cfg.adminName || "Cayley Alberts");
  const users = getUsers();
  const existing = users.find((u) => u.role === AUTH_ROLES.admin || u.email === email);

  if (existing) {
    let changed = false;
    if (existing.role !== AUTH_ROLES.admin || existing.status !== AUTH_STATUS.active) {
      existing.role = AUTH_ROLES.admin;
      existing.status = AUTH_STATUS.active;
      changed = true;
    }
    // Keep the seeded admin password in sync with config.js until they set their own.
    if (existing.email === email && password && !existing.passwordCustomized) {
      const salt = createSalt();
      const passwordHash = await hashPassword(password, salt);
      existing.salt = salt;
      existing.passwordHash = passwordHash;
      changed = true;
    }
    if (changed) {
      existing.updatedAt = new Date().toISOString();
      saveUsers(users);
    }
    return;
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  users.push({
    id: createId(),
    name,
    email,
    role: AUTH_ROLES.admin,
    status: AUTH_STATUS.active,
    phone: cfg.adminPhone || "068 901 4209",
    notes: "Primary practice administrator",
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    updatedAt: null,
  });
  saveUsers(users);
}

function getSettings() {
  const stored = readJson(AUTH_SETTINGS_KEY, null);
  return { ...defaultSettings(), ...(stored && typeof stored === "object" ? stored : {}) };
}

function saveSettings(partial) {
  const next = { ...getSettings(), ...partial, updatedAt: new Date().toISOString() };
  writeJson(AUTH_SETTINGS_KEY, next);
  return next;
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.userId) return null;
    return session;
  } catch (_) {
    return null;
  }
}

function setSession(userId) {
  sessionStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({ userId, startedAt: new Date().toISOString() })
  );
}

function clearSession() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const user = getUsers().find((u) => u.id === session.userId);
  if (!user || user.status === AUTH_STATUS.disabled) {
    clearSession();
    return null;
  }
  return publicUser(user);
}

function isLoggedIn() {
  return Boolean(getCurrentUser());
}

function hasRole(...roles) {
  const user = getCurrentUser();
  return Boolean(user && roles.includes(user.role));
}

function canAccessClinicianTools() {
  const user = getCurrentUser();
  return Boolean(
    user &&
      user.status === AUTH_STATUS.active &&
      (user.role === AUTH_ROLES.admin || user.role === AUTH_ROLES.therapist)
  );
}

function findUserByEmail(email) {
  const normalized = normalizeEmail(email);
  return getUsers().find((u) => u.email === normalized) || null;
}

async function registerUser({ name, email, password, role, phone = "" }) {
  await ensureAdminSeed();
  const settings = getSettings();
  const normalizedEmail = normalizeEmail(email);
  const trimmedName = String(name || "").trim();
  const trimmedPassword = String(password || "");
  const requestedRole = role === AUTH_ROLES.therapist ? AUTH_ROLES.therapist : AUTH_ROLES.patient;

  if (!trimmedName) return { ok: false, error: "Please enter your name." };
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (trimmedPassword.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (requestedRole === AUTH_ROLES.patient && !settings.allowPatientSignup) {
    return { ok: false, error: "Patient registration is currently closed." };
  }
  if (requestedRole === AUTH_ROLES.therapist && !settings.allowTherapistSignup) {
    return { ok: false, error: "Therapist registration is currently closed." };
  }
  if (findUserByEmail(normalizedEmail)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(trimmedPassword, salt);
  const needsApproval =
    requestedRole === AUTH_ROLES.therapist && settings.requireTherapistApproval;

  const user = {
    id: createId(),
    name: trimmedName,
    email: normalizedEmail,
    role: requestedRole,
    status: needsApproval ? AUTH_STATUS.pending : AUTH_STATUS.active,
    phone: String(phone || "").trim(),
    notes: "",
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    updatedAt: null,
  };

  const users = getUsers();
  users.push(user);
  saveUsers(users);

  if (user.status === AUTH_STATUS.active) {
    setSession(user.id);
    user.lastLoginAt = new Date().toISOString();
    saveUsers(users);
  }

  return {
    ok: true,
    user: publicUser(user),
    pending: user.status === AUTH_STATUS.pending,
  };
}

async function loginUser({ email, password }) {
  await ensureAdminSeed();
  const normalizedEmail = normalizeEmail(email);
  const trimmedPassword = String(password || "");
  const users = getUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) return { ok: false, error: "Incorrect email or password." };

  const passwordHash = await hashPassword(trimmedPassword, user.salt);
  if (passwordHash !== user.passwordHash) {
    return { ok: false, error: "Incorrect email or password." };
  }
  if (user.status === AUTH_STATUS.pending) {
    return {
      ok: false,
      error: "This therapist account is awaiting admin approval.",
    };
  }
  if (user.status === AUTH_STATUS.disabled) {
    return { ok: false, error: "This account has been disabled. Contact the admin." };
  }

  user.lastLoginAt = new Date().toISOString();
  if (user.temporaryPassword) user.temporaryPassword = "";
  saveUsers(users);
  setSession(user.id);
  return { ok: true, user: publicUser(user) };
}

function resolveQuestionnaireAssignment(type, lifeContext = "") {
  const raw = String(type || "").trim();
  const context = String(lifeContext || "").trim();
  const assignments = {
    "adult-home": { questionnaireType: "adult", lifeContext: "home" },
    "adult-work": { questionnaireType: "adult", lifeContext: "work" },
    "teen-home": { questionnaireType: "teen", lifeContext: "home" },
    "teen-school": { questionnaireType: "teen", lifeContext: "school" },
    parent: { questionnaireType: "parent", lifeContext: "" },
    couple: { questionnaireType: "couple", lifeContext: "" },
    adult: {
      questionnaireType: "adult",
      lifeContext: context === "work" || context === "home" ? context : "",
    },
    teen: {
      questionnaireType: "teen",
      lifeContext: context === "school" || context === "home" ? context : "",
    },
  };
  return assignments[raw] || null;
}

/**
 * Therapist/admin creates a patient account and assigns a questionnaire.
 * Does not sign in as the patient. All questionnaire types expire after `expiryDays`.
 */
async function createPatientAccount({
  firstName,
  surname,
  email,
  phone,
  age,
  questionnaireType,
  lifeContext = "",
  reasonForReferral,
  createdByUserId = null,
  reportVisibility = "",
  expiryDays = 14,
  assessmentId = null,
}) {
  await ensureAdminSeed();
  const actor = getCurrentUser();
  if (
    !actor ||
    actor.status !== AUTH_STATUS.active ||
    (actor.role !== AUTH_ROLES.admin && actor.role !== AUTH_ROLES.therapist)
  ) {
    return { ok: false, error: "Sign in as a therapist to create a patient account." };
  }

  const trimmedFirst = String(firstName || "").trim();
  const trimmedSurname = String(surname || "").trim();
  const fullName = [trimmedFirst, trimmedSurname].filter(Boolean).join(" ");
  const normalizedEmail = normalizeEmail(email);
  const trimmedPhone = String(phone || "").trim();
  const trimmedAge = String(age || "").trim();
  const trimmedReason = String(reasonForReferral || "").trim();
  const type = String(questionnaireType || "").trim();
  const resolved = resolveQuestionnaireAssignment(type, lifeContext);
  if (!resolved) {
    return { ok: false, error: "Please choose a questionnaire type." };
  }

  if (!trimmedFirst) return { ok: false, error: "Please enter the patient’s name." };
  if (!trimmedSurname) return { ok: false, error: "Please enter the patient’s surname." };
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!trimmedPhone) return { ok: false, error: "Please enter a contact number." };
  const ageNumber = Number(trimmedAge);
  if (!trimmedAge || !Number.isFinite(ageNumber) || ageNumber < 0 || ageNumber > 120) {
    return { ok: false, error: "Please enter a valid age." };
  }
  if (!trimmedReason) return { ok: false, error: "Please enter the reason for referral." };
  if (findUserByEmail(normalizedEmail)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const password = createTemporaryPassword();
  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  const days = Math.max(1, Number(expiryDays) || 14);
  const now = new Date().toISOString();

  const user = {
    id: createId(),
    name: fullName,
    firstName: trimmedFirst,
    surname: trimmedSurname,
    email: normalizedEmail,
    role: AUTH_ROLES.patient,
    status: AUTH_STATUS.active,
    phone: trimmedPhone,
    age: String(Math.round(ageNumber)),
    notes: "",
    questionnaireType: resolved.questionnaireType,
    lifeContext: resolved.lifeContext,
    reasonForReferral: trimmedReason,
    expiresAt: addDaysFromNow(days),
    inviteToken: createInviteToken(),
    createdByUserId: createdByUserId || actor.id,
    assessmentId: assessmentId || null,
    reportVisibility: String(reportVisibility || "").trim(),
    temporaryPassword: password,
    salt,
    passwordHash,
    createdAt: now,
    lastLoginAt: null,
    updatedAt: now,
  };

  const users = getUsers();
  users.push(user);
  saveUsers(users);

  return {
    ok: true,
    user: publicUser(user),
    password,
    expiryDays: days,
  };
}

async function resetPatientPassword(userId) {
  const actor = getCurrentUser();
  if (
    !actor ||
    (actor.role !== AUTH_ROLES.admin && actor.role !== AUTH_ROLES.therapist)
  ) {
    return { ok: false, error: "Only a therapist can reset a patient password." };
  }
  const users = getUsers();
  const user = users.find((entry) => entry.id === userId);
  if (!user || user.role !== AUTH_ROLES.patient) {
    return { ok: false, error: "Patient account not found." };
  }
  const password = createTemporaryPassword();
  const salt = createSalt();
  user.salt = salt;
  user.passwordHash = await hashPassword(password, salt);
  user.temporaryPassword = password;
  if (!user.inviteToken) user.inviteToken = createInviteToken();
  user.updatedAt = new Date().toISOString();
  saveUsers(users);
  return { ok: true, user: publicUser(user), password };
}

function setPatientAssessmentId(userId, assessmentId) {
  const users = getUsers();
  const user = users.find((entry) => entry.id === userId);
  if (!user) return { ok: false, error: "User not found." };
  user.assessmentId = assessmentId || null;
  user.updatedAt = new Date().toISOString();
  saveUsers(users);
  return { ok: true, user: publicUser(user) };
}

const RESET_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function createResetToken() {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashResetToken(token) {
  return hashPassword(String(token || ""), "ssot-reset");
}

function canReceivePasswordReset(user) {
  if (!user) return false;
  if (user.status !== AUTH_STATUS.active) return false;
  return user.role === AUTH_ROLES.therapist || user.role === AUTH_ROLES.admin;
}

/**
 * Creates a one-time reset token for an active therapist/admin account.
 * Always returns ok for a valid email so the UI does not reveal whether the account exists.
 * The raw token is only included when a mailer should actually send the link.
 */
async function requestPasswordReset({ email }) {
  await ensureAdminSeed();
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const users = getUsers();
  const user = users.find((entry) => entry.email === normalizedEmail);
  if (!canReceivePasswordReset(user)) {
    return { ok: true, sent: false };
  }

  const token = createResetToken();
  user.resetTokenHash = await hashResetToken(token);
  user.resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();
  user.updatedAt = new Date().toISOString();
  saveUsers(users);

  return {
    ok: true,
    sent: true,
    token,
    email: user.email,
    name: user.name,
    user: publicUser(user),
  };
}

async function findUserByResetToken(token) {
  const raw = String(token || "").trim();
  if (!raw) return null;
  const tokenHash = await hashResetToken(raw);
  const users = getUsers();
  const user = users.find((entry) => entry.resetTokenHash && entry.resetTokenHash === tokenHash);
  if (!user) return null;
  const expires = Date.parse(user.resetTokenExpiresAt || "");
  if (!Number.isFinite(expires) || expires < Date.now()) {
    return { expired: true, user };
  }
  return { expired: false, user };
}

async function peekPasswordReset(token) {
  const match = await findUserByResetToken(token);
  if (!match || match.expired) {
    return {
      ok: false,
      error: match?.expired
        ? "This reset link has expired. Please request a new one."
        : "This reset link is invalid or has already been used.",
    };
  }
  return { ok: true, user: publicUser(match.user) };
}

async function completePasswordReset({ token, password }) {
  const trimmedPassword = String(password || "");
  if (trimmedPassword.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  const match = await findUserByResetToken(token);
  if (!match || match.expired) {
    return {
      ok: false,
      error: match?.expired
        ? "This reset link has expired. Please request a new one."
        : "This reset link is invalid or has already been used.",
    };
  }

  const users = getUsers();
  const user = users.find((entry) => entry.id === match.user.id);
  if (!user) return { ok: false, error: "This reset link is invalid or has already been used." };

  const salt = createSalt();
  user.salt = salt;
  user.passwordHash = await hashPassword(trimmedPassword, salt);
  user.resetTokenHash = null;
  user.resetTokenExpiresAt = null;
  user.passwordCustomized = true;
  user.updatedAt = new Date().toISOString();
  saveUsers(users);
  clearSession();
  return { ok: true, user: publicUser(user) };
}

function logoutUser() {
  clearSession();
}

function listUsers() {
  return getUsers()
    .map(publicUser)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function getUserStats() {
  const users = listUsers();
  return {
    total: users.length,
    patients: users.filter((u) => u.role === AUTH_ROLES.patient).length,
    therapists: users.filter((u) => u.role === AUTH_ROLES.therapist).length,
    admins: users.filter((u) => u.role === AUTH_ROLES.admin).length,
    pending: users.filter((u) => u.status === AUTH_STATUS.pending).length,
    active: users.filter((u) => u.status === AUTH_STATUS.active).length,
    disabled: users.filter((u) => u.status === AUTH_STATUS.disabled).length,
  };
}

function updateUserById(userId, patch) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return { ok: false, error: "User not found." };

  const current = getCurrentUser();
  const target = users[index];

  if (patch.role && !Object.values(AUTH_ROLES).includes(patch.role)) {
    return { ok: false, error: "Invalid role." };
  }
  if (patch.status && !Object.values(AUTH_STATUS).includes(patch.status)) {
    return { ok: false, error: "Invalid status." };
  }

  // Keep at least one active admin.
  if (
    target.role === AUTH_ROLES.admin &&
    ((patch.role && patch.role !== AUTH_ROLES.admin) ||
      (patch.status && patch.status !== AUTH_STATUS.active))
  ) {
    const otherAdmins = users.filter(
      (u) => u.id !== userId && u.role === AUTH_ROLES.admin && u.status === AUTH_STATUS.active
    );
    if (otherAdmins.length === 0) {
      return { ok: false, error: "You must keep at least one active admin account." };
    }
  }

  if (typeof patch.name === "string") target.name = patch.name.trim() || target.name;
  if (typeof patch.firstName === "string") target.firstName = patch.firstName.trim();
  if (typeof patch.surname === "string") target.surname = patch.surname.trim();
  if (typeof patch.phone === "string") target.phone = patch.phone.trim();
  if (typeof patch.age === "string" || typeof patch.age === "number") {
    target.age = String(patch.age).trim();
  }
  if (typeof patch.notes === "string") target.notes = patch.notes.trim();
  if (typeof patch.reasonForReferral === "string") {
    target.reasonForReferral = patch.reasonForReferral.trim();
  }
  if (typeof patch.questionnaireType === "string") {
    target.questionnaireType = patch.questionnaireType.trim();
  }
  if (typeof patch.lifeContext === "string") target.lifeContext = patch.lifeContext.trim();
  if (typeof patch.assessmentId === "string") target.assessmentId = patch.assessmentId;
  if (patch.role) target.role = patch.role;
  if (patch.status) target.status = patch.status;
  target.updatedAt = new Date().toISOString();

  saveUsers(users);

  if (current?.id === userId && target.status === AUTH_STATUS.disabled) {
    clearSession();
  }

  return { ok: true, user: publicUser(target) };
}

function deleteUserById(userId) {
  const users = getUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return { ok: false, error: "User not found." };

  if (target.role === AUTH_ROLES.admin) {
    const otherAdmins = users.filter(
      (u) => u.id !== userId && u.role === AUTH_ROLES.admin && u.status === AUTH_STATUS.active
    );
    if (otherAdmins.length === 0) {
      return { ok: false, error: "You cannot delete the last admin account." };
    }
  }

  const next = users.filter((u) => u.id !== userId);
  saveUsers(next);

  const current = getCurrentUser();
  if (current?.id === userId) clearSession();

  return { ok: true };
}

function roleLabel(role) {
  if (role === AUTH_ROLES.admin) return "Admin";
  if (role === AUTH_ROLES.therapist) return "Therapist";
  return "Patient";
}

function statusLabel(status) {
  if (status === AUTH_STATUS.pending) return "Pending";
  if (status === AUTH_STATUS.disabled) return "Disabled";
  return "Active";
}

function formatAuthDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (_) {
    return "—";
  }
}

const Auth = {
  ROLES: AUTH_ROLES,
  STATUS: AUTH_STATUS,
  ensureAdminSeed,
  getSettings,
  saveSettings,
  getCurrentUser,
  isLoggedIn,
  hasRole,
  canAccessClinicianTools,
  registerUser,
  createPatientAccount,
  resetPatientPassword,
  setPatientAssessmentId,
  findUserByInviteToken,
  isPatientAssignmentExpired,
  loginUser,
  logoutUser,
  requestPasswordReset,
  peekPasswordReset,
  completePasswordReset,
  listUsers,
  getUserStats,
  updateUserById,
  deleteUserById,
  roleLabel,
  statusLabel,
  formatAuthDate,
  publicUser,
};
