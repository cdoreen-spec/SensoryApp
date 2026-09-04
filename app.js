const state = {
  step: 0,
  view: "home", // home | sensory | pain | pain-category | pain-summary | questionnaire | clinician | dashboard | login | signup | settings | account
  sensoryArea: null, // home | work | school | relationships
  painCategory: null,
  painSelected: [], // ordered category ids chosen on the map
  painAnswers: {},
  language: "en",
  /** Shown once at the start of a fresh questionnaire (adult, teen, parent, or couple). */
  showIntroModal: false,
  respondent: null,
  lifeContext: null, // work | home | school | homeSchool
  /** Couple dual-questionnaire session (shared code + partner a|b). */
  coupleId: null,
  couplePartner: null, // "a" | "b" while one partner is filling
  coupleShowMerge: false,
  coupleHubNotice: null,
  coupleImportText: "",
  consent: [],
  sharingConsent: { parents: false, school: false, treatingTeam: false },
  demographics: { name: "", age: "", email: "", occupation: "", parentName: "", partnerName: "" },
  /** ISO timestamp set when results are first shown — used on the print cover. */
  completedAt: null,
  answers: Object.fromEntries(SENSORY_DOMAIN_IDS.map((id) => [id, []])),
  /** Free-text closing reflection (ideal Saturday). */
  idealSaturday: "",
  /** Couple-only work & lifestyle section (after sensory questions). */
  coupleWork: null,
  contactPreference: null,
  showSensoryDiet: false,
  showWorkReport: false,
  workReportDeclined: false,
  workReport: { name: "", jobTitle: "", reasonForReferral: "", additionalNotes: "" },
  schoolReportVisual: "balance", // balance | dials | cards
  schoolReportNotesEnabled: false,
  /** Which built-in sections appear in the work/school letter (per session). */
  settingReportSections: null,
  /** Extra therapist-authored heading blocks for the work/school letter. */
  settingReportCustomSections: [],
  error: null,
  /** Patient invite session: results emailed to clinician; on-screen report only if therapist granted it. */
  inviteMode: false,
  /** none | basic | full — set by therapist on the invite link. Default: no patient report access. */
  patientResultsAccess: "none",
  submissionStatus: null, // null | pending | sent | error
  submissionError: null,
  submissionErrorCode: null, // e.g. formsubmit-activation
  submissionAttempted: false,
  clinicianUnlocked: false,
  clinicianPinInput: "",
  clinicianPinError: null,
  /** Clinician invite draft: none | basic | full — defaults to no patient access */
  clinicianDraftResultsAccess: "none",
  /** Invite visibility: none | summary | short | full */
  clinicianDraftVisibility: "none",
  /** Invite/patient report kind: none | summary | short | full */
  patientReportKind: null,
  /** Dashboard reopen length: summary | short | full */
  reportLengthMode: null,
  clinicianCopyStatus: null, // null | copied
  /** Therapist dashboard: viewing a saved assessment report (skip re-email). */
  viewingArchivedId: null,
  /** Assessment id for the questionnaire currently in progress (incomplete until results). */
  inProgressAssessmentId: null,
  archiveReadOnly: false,
  /** When reopening from the dashboard: "full" | "basic" (short patient report). */
  reportViewMode: null,
  /** Dev/admin: viewing generated sample answers (not a real patient). */
  sampleReportPreview: false,
  dashboardSearch: "",
  dashboardNotice: null,
  dashboardTab: "register", // register | preferences | create
  prefsNotice: null,
  patientForm: {
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    age: "",
    questionnaireType: "adult-home",
    reasonForReferral: "",
  },
  patientFormError: null,
  patientFormBusy: false,
  createdPatient: null,
  patientSendStatus: null, // null | sending | sent | error
  patientSendError: null,
  assignedRespondent: null,
  assignedLifeContext: null,
  pendingInviteToken: null,
  authMode: "login", // login | signup
  authError: null,
  authNotice: null,
  authBusy: false,
  authForm: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "patient",
  },
  resetToken: null,
  settingsTab: "overview", // overview | users | settings
  settingsFilter: "all", // all | patient | therapist | admin | pending
  settingsSearch: "",
  settingsNotice: null,
  settingsError: null,
  editingUserId: null,
};

const SENSORY_AREAS = [
  {
    id: "home",
    name: "Home",
    desc: "Living spaces, routines, light, sound and the textures of daily comfort.",
    detail: "How rest, cooking, chores and downtime feel when your surroundings match your sensory needs.",
  },
  {
    id: "work",
    name: "Work",
    desc: "Focus, energy and ease in the environments where you work and create.",
    detail: "Open-plan noise, lighting, screen time and breaks can either support or drain your concentration.",
  },
  {
    id: "school",
    name: "School",
    desc: "Learning spaces, attention, seating and the pace of busy classrooms.",
    detail: "Assemblies, transitions, uniforms and noise levels all shape how easily you settle and learn.",
  },
  {
    id: "relationships",
    name: "Relationships",
    desc: "Connection, proximity, touch and shared social environments.",
    detail: "Personal space, physical affection and busy gatherings can feel nourishing or overwhelming.",
  },
];

const STEPS = [
  { type: "welcome" },
  { type: "respondent" },
  { type: "coupleHub" },
  { type: "context" },
  { type: "consent" },
  { type: "demographics" },
  ...SENSORY_DOMAIN_IDS.map((domainId) => ({ type: "domain", domainId })),
  { type: "idealSaturday" },
  { type: "coupleWork" },
  { type: "results" },
];

const WHATSAPP_URL =
  "https://wa.me/27689014209?text=" +
  encodeURIComponent("Hi Cayley, I'd like to ask a question or book a session with Soulful Sensory OT.");

const WHATSAPP_FEEDBACK_URL =
  "https://wa.me/27689014209?text=" +
  encodeURIComponent(
    "Hi Cayley, I've completed the sensory screening and would like to book an online or in-person feedback session for my sensory trail profile."
  );

const CLINICIAN_PIN =
  (typeof APP_CONFIG !== "undefined" && APP_CONFIG.clinicianPin) || "soulfulot";
const DELIVERY_PROVIDER =
  (typeof APP_CONFIG !== "undefined" && APP_CONFIG.deliveryProvider) || "formsubmit";
const WEB3FORMS_KEY =
  (typeof APP_CONFIG !== "undefined" && APP_CONFIG.web3formsAccessKey) || "";

function getLiveSettings() {
  if (typeof Auth !== "undefined" && Auth.getSettings) return Auth.getSettings();
  return {
    clinicianEmail:
      (typeof APP_CONFIG !== "undefined" && APP_CONFIG.clinicianEmail) || "soulfulsensoryot@gmail.com",
    showPainPathway: typeof APP_CONFIG !== "undefined" && APP_CONFIG.showPainPathway === true,
    allowPatientSignup: true,
    allowTherapistSignup: true,
    requireTherapistApproval: true,
    practiceName: "Soulful Sensory OT",
  };
}

function getClinicianEmail() {
  return getLiveSettings().clinicianEmail || "soulfulsensoryot@gmail.com";
}

function isPainPathwayEnabled() {
  return getLiveSettings().showPainPathway === true;
}

/** Prefer getClinicianEmail() / isPainPathwayEnabled() so admin settings apply live. */

const CLINICIAN_SESSION_KEY = "ssot-clinician-unlocked";
const CLINICIAN_PREF_KEY = "ssot-invite-show-results";
const THERAPIST_PREFS_KEY = "ssot-therapist-prefs-v1";
const SHORT_REPORT_PREF_KEY = "ssot-short-report-sections";
/** Optional extras on the patient short report. Core copy always asks them to book a follow-up. */
const DEFAULT_SHORT_REPORT_SECTIONS = {
  overallPattern: false,
  domainGlance: false,
  trailCharacter: false,
};
/** Built-in sections for the adult workplace letter (all on by default). */
const DEFAULT_WORK_REPORT_SECTIONS = {
  details: true,
  about: true,
  referral: true,
  scores: true,
  challenges: true,
  recommendations: true,
  generalRecs: true,
  closing: true,
};
/** Built-in sections for the teen school letter (all on by default). */
const DEFAULT_SCHOOL_REPORT_SECTIONS = {
  details: true,
  about: true,
  overload: true,
  referral: true,
  scores: true,
  visual: true,
  recommendations: true,
  notes: true,
  closing: true,
};
const SENSORY_DRAFT_KEY = "ssot-sensory-draft";
const SENSORY_DRAFT_VERSION = 1;
const ASSESSMENTS_KEY = "ssot-assessments-v1";
const ASSESSMENTS_VERSION = 1;
const ASSESSMENT_ARCHIVE_LIMIT = 200;
const PAYMENTS_KEY = "ssot-payments-v1";
const PAYMENTS_VERSION = 1;
const LOCAL_STORAGE_BUDGET_BYTES = 5 * 1024 * 1024;
const COUPLE_SESSIONS_KEY = "ssot-couple-sessions-v1";
const COUPLE_SESSIONS_VERSION = 1;
const COUPLE_PARTNERS = ["a", "b"];
const QUESTIONNAIRE_EXPIRY_DAYS = Math.max(
  1,
  Number((typeof APP_CONFIG !== "undefined" && APP_CONFIG.questionnaireExpiryDays) || 14)
);
const QUESTIONNAIRE_EXPIRY_WARNING_DAYS = Math.max(
  0,
  Number((typeof APP_CONFIG !== "undefined" && APP_CONFIG.questionnaireExpiryWarningDays) || 3)
);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Patient on-screen results after an invite: none | basic | full */
const RESULTS_ACCESS = {
  none: "none",
  basic: "basic",
  full: "full",
};

const REPORT_LENGTH = {
  summary: "summary",
  short: "short",
  full: "full",
};

const REPORT_VISIBILITY = {
  none: "none",
  summary: "summary",
  short: "short",
  full: "full",
};

const app = document.getElementById("app");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isPatientInvite() {
  return Boolean(state.inviteMode);
}

/** Invite links require a signed-in account before the screening can start. */
function inviteNeedsAccount() {
  return isPatientInvite() && !currentAuthUser();
}

/** After login/signup during an invite session, continue into the screening. */
function routeAfterAuth(user) {
  if (user?.role === "admin" || user?.role === "therapist") {
    initTherapistPrefs();
    state.clinicianUnlocked = true;
    if (isSampleReportPreviewEnabled()) {
      try {
        const raw = sessionStorage.getItem("ssot-sample-preview");
        if (raw) {
          sessionStorage.removeItem("ssot-sample-preview");
          const options = JSON.parse(raw);
          openSampleReportPreview(options || {});
          return;
        }
      } catch {
        sessionStorage.removeItem("ssot-sample-preview");
      }
    }
    if (user.role === "admin") {
      state.view = "settings";
      state.settingsTab = "overview";
      return;
    }
    state.view = "dashboard";
    state.dashboardTab = "register";
    return;
  }
  if (user?.role === "patient" && (isPatientInvite() || user.questionnaireType)) {
    applyPatientAssignment(user);
    if (isAssignedQuestionnaireExpired(user) && !patientHasCompletedAssignment(user)) {
      state.view = "account";
      state.authNotice =
        "This questionnaire invitation has expired. Please contact your therapist for a new link.";
      return;
    }
    continueInviteSession();
    return;
  }
  state.view = "account";
}

function canAccessTherapistDashboard() {
  if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) return true;
  return Boolean(state.clinicianUnlocked);
}

function emptyPatientForm() {
  return {
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    age: "",
    questionnaireType: "adult-home",
    reasonForReferral: "",
  };
}

function resetPatientForm() {
  state.patientForm = emptyPatientForm();
  state.patientFormError = null;
  state.patientFormBusy = false;
}

const QUESTIONNAIRE_ASSIGNMENTS = [
  {
    id: "adult-home",
    respondent: "adult",
    lifeContext: "home",
    title: "Adult · home",
    hint: "Adult self-report focused on home life. Expires after 14 days.",
  },
  {
    id: "adult-work",
    respondent: "adult",
    lifeContext: "work",
    title: "Adult · work",
    hint: "Adult self-report focused on work. Expires after 14 days.",
  },
  {
    id: "teen-home",
    respondent: "teen",
    lifeContext: "home",
    title: "Teen · home",
    hint: "Teen self-report focused on home. Expires after 14 days.",
  },
  {
    id: "teen-school",
    respondent: "teen",
    lifeContext: "school",
    title: "Teen · school",
    hint: "Teen self-report focused on school. Expires after 14 days.",
  },
  {
    id: "parent",
    respondent: "parent",
    lifeContext: "",
    title: "Parent (child)",
    hint: "Parent completes about their child. Expires after 14 days.",
  },
  {
    id: "couple",
    respondent: "couple",
    lifeContext: "",
    title: "Couple",
    hint: "Two partners complete separately, then combine. Expires after 14 days.",
  },
];

function parseQuestionnaireAssignment(type, lifeContext = "") {
  const raw = String(type || "").trim();
  const context = String(lifeContext || "").trim();
  const byId = QUESTIONNAIRE_ASSIGNMENTS.find((entry) => entry.id === raw);
  if (byId) return byId;
  if (raw === "adult") {
    const match = QUESTIONNAIRE_ASSIGNMENTS.find(
      (entry) => entry.respondent === "adult" && entry.lifeContext === (context === "work" ? "work" : "home")
    );
    return match || QUESTIONNAIRE_ASSIGNMENTS.find((entry) => entry.id === "adult-home");
  }
  if (raw === "teen") {
    if (context === "home" || context === "school") {
      return QUESTIONNAIRE_ASSIGNMENTS.find(
        (entry) => entry.respondent === "teen" && entry.lifeContext === context
      );
    }
    return {
      id: "teen",
      respondent: "teen",
      lifeContext: "homeSchool",
      title: "Teen",
      hint: "",
    };
  }
  return QUESTIONNAIRE_ASSIGNMENTS.find((entry) => entry.respondent === raw) || null;
}

function questionnaireTypeLabel(type, lifeContext = "") {
  const assignment = parseQuestionnaireAssignment(type, lifeContext);
  return assignment?.title || respondentLabel(type);
}

function hasLockedLifeContext() {
  return Boolean(state.assignedLifeContext);
}

function assignedPatientFullName(user) {
  if (!user) return "";
  return (
    [user.firstName, user.surname].filter(Boolean).join(" ").trim() ||
    String(user.name || "").trim()
  );
}

function lookupAssignedPatientByToken(token) {
  if (!token || typeof Auth === "undefined" || !Auth.findUserByInviteToken) return null;
  const raw = Auth.findUserByInviteToken(token);
  return raw && Auth.publicUser ? Auth.publicUser(raw) : raw;
}

function currentAssignedPatient() {
  const user = currentAuthUser();
  if (user?.role === "patient" && user.questionnaireType) return user;
  return lookupAssignedPatientByToken(state.pendingInviteToken);
}

function hasLockedRespondent() {
  return Boolean(state.assignedRespondent && RESPONDENT_TYPES.includes(state.assignedRespondent));
}

function isAssignedQuestionnaireExpired(user = currentAssignedPatient()) {
  if (!user) return false;
  if (typeof Auth !== "undefined" && Auth.isPatientAssignmentExpired) {
    return Auth.isPatientAssignmentExpired(user);
  }
  if (!user.expiresAt) return false;
  const expires = Date.parse(user.expiresAt);
  return Number.isFinite(expires) && expires < Date.now();
}

function patientHasCompletedAssignment(user) {
  if (!user?.id) return false;
  return readAssessments().some(
    (item) => item.patientUserId === user.id && assessmentStatus(item) === "complete"
  );
}

function applyPatientAssignment(user) {
  if (!user || user.role === "admin" || user.role === "therapist") return false;
  const assignment = parseQuestionnaireAssignment(user.questionnaireType, user.lifeContext);
  const type = assignment?.respondent || (RESPONDENT_TYPES.includes(user.questionnaireType) ? user.questionnaireType : null);
  if (!type && !user.inviteToken) return false;
  state.inviteMode = true;
  if (user.inviteToken) state.pendingInviteToken = user.inviteToken;
  if (type) {
    state.assignedRespondent = type;
    state.respondent = type;
  }
  if (assignment?.lifeContext) {
    state.assignedLifeContext = assignment.lifeContext;
    state.lifeContext = assignment.lifeContext;
  } else if (type === "parent" || type === "couple") {
    state.assignedLifeContext = null;
    state.lifeContext = null;
  }
  const fullName = assignedPatientFullName(user);
  state.demographics = {
    name: fullName || state.demographics?.name || "",
    age: user.age || state.demographics?.age || "",
    email: user.email || state.demographics?.email || "",
    occupation: state.demographics?.occupation || "",
    parentName: state.demographics?.parentName || "",
    partnerName: state.demographics?.partnerName || "",
  };
  if (user.reportVisibility) {
    const visibility = draftVisibilityFromStored(user.reportVisibility);
    state.patientReportKind = visibility;
    state.patientResultsAccess = visibilityToResultsAccess(visibility);
  }
  if (user.reasonForReferral) {
    state.workReport = {
      ...(state.workReport || {}),
      name: state.workReport?.name || fullName,
      reasonForReferral: user.reasonForReferral,
    };
  }
  if (user.assessmentId) state.inProgressAssessmentId = user.assessmentId;
  return true;
}

function createAssignedAssessment(user) {
  if (!user) return null;
  const fullName = assignedPatientFullName(user);
  const { firstName, surname } = splitPersonName(fullName);
  const visibility = draftVisibilityFromStored(
    user.reportVisibility || readTherapistPrefs().reportVisibility
  );
  const assignment = parseQuestionnaireAssignment(user.questionnaireType, user.lifeContext);
  const id = user.assessmentId || createAssessmentId();
  const now = user.createdAt || new Date().toISOString();
  const record = {
    id,
    version: ASSESSMENTS_VERSION,
    status: "assigned",
    completedAt: null,
    savedAt: now,
    startedAt: now,
    expiresAt: user.expiresAt || addDaysIso(now, QUESTIONNAIRE_EXPIRY_DAYS),
    expiryNotifiedAt: null,
    respondent: assignment?.respondent || user.questionnaireType || null,
    language: "en",
    lifeContext: assignment?.lifeContext || null,
    coupleId: null,
    couplePartner: null,
    demographics: {
      name: fullName,
      age: user.age || "",
      email: user.email || "",
      occupation: "",
      parentName: "",
      partnerName: "",
      phone: user.phone || "",
    },
    reasonForReferral: user.reasonForReferral || "",
    answers: emptyAnswers(),
    idealSaturday: "",
    coupleWork: emptyCoupleWork(),
    sharingConsent: {},
    contactPreference: null,
    inviteMode: true,
    patientResultsAccess: visibilityToResultsAccess(visibility),
    patientUserId: user.id,
    step: 1,
    summary: {
      patientName: fullName,
      firstName: user.firstName || firstName,
      surname: user.surname || surname,
      parentName: "",
      partnerName: "",
      coupleId: null,
      couplePartner: null,
      completerName: fullName,
      email: user.email || "",
      age: user.age || "",
      phone: user.phone || "",
      reasonForReferral: user.reasonForReferral || "",
      overallProfile: "",
      overallLabel: "",
      leanHeadline: "",
      sensitive: 0,
      seeking: 0,
      neutral: 0,
      scored: 0,
      domainProfiles: [],
      progressLabel: "Not started",
    },
    draft: null,
  };
  const items = readAssessments().filter((item) => item.id !== id);
  items.unshift(record);
  writeAssessments(items.slice(0, ASSESSMENT_ARCHIVE_LIMIT));
  if (typeof Auth !== "undefined" && Auth.setPatientAssessmentId) {
    Auth.setPatientAssessmentId(user.id, id);
  }
  return record;
}

function markAssignedAssessmentStarted(assessmentId) {
  if (!assessmentId) return;
  const items = readAssessments();
  const item = items.find((entry) => entry.id === assessmentId);
  if (!item || item.status === "complete") return;
  if (item.status === "assigned") item.status = "incomplete";
  item.savedAt = new Date().toISOString();
  writeAssessments(items);
}

function buildAssignedPatientInviteUrl(user, access) {
  const url = new URL(getClinicianBaseUrl());
  url.searchParams.set("invite", "1");
  if (user?.inviteToken) url.searchParams.set("patient", user.inviteToken);
  const visibility = draftVisibilityFromStored(
    access || user?.reportVisibility || readTherapistPrefs().reportVisibility
  );
  if (visibility === REPORT_VISIBILITY.full) {
    url.searchParams.set("results", "full");
  } else if (visibility === REPORT_VISIBILITY.short) {
    url.searchParams.set("results", "short");
  } else if (visibility === REPORT_VISIBILITY.summary) {
    url.searchParams.set("results", "summary");
  } else {
    url.searchParams.set("results", "0");
  }
  return url.toString();
}

function patientCredentialsPayload(user, password, inviteUrl) {
  const expires = user?.expiresAt
    ? formatQuestionnaireDate(user.expiresAt, "en")
    : `${QUESTIONNAIRE_EXPIRY_DAYS} days`;
  return {
    name: assignedPatientFullName(user),
    email: user?.email || "",
    password: password || user?.temporaryPassword || "",
    inviteUrl: inviteUrl || (user ? buildAssignedPatientInviteUrl(user) : ""),
    questionnaireType: questionnaireTypeLabel(user?.questionnaireType, user?.lifeContext),
    expiresAt: expires,
    phone: user?.phone || "",
    age: user?.age || "",
    reasonForReferral: user?.reasonForReferral || "",
    userId: user?.id || "",
  };
}

function patientCredentialsText(details) {
  return [
    `Patient: ${details.name}`,
    `Email: ${details.email}`,
    details.password ? `Password: ${details.password}` : null,
    `Contact: ${details.phone}`,
    `Questionnaire: ${details.questionnaireType}`,
    `Expires: ${details.expiresAt}`,
    details.inviteUrl ? `Link: ${details.inviteUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function patientInviteMessage(details) {
  const firstName = String(details.name || "there").trim().split(/\s+/)[0] || "there";
  return [
    `Hello ${firstName},`,
    "",
    "Your occupational therapist at Soulful Sensory OT has created an account for you to complete a sensory questionnaire.",
    "",
    `Questionnaire: ${details.questionnaireType || "Sensory screening"}`,
    details.expiresAt ? `This invitation expires on ${details.expiresAt}.` : `This invitation expires after ${QUESTIONNAIRE_EXPIRY_DAYS} days.`,
    "",
    "Sign in with:",
    `Email: ${details.email}`,
    details.password ? `Password: ${details.password}` : "Use the password your therapist sent you.",
    "",
    "Open this link, sign in, then start the questionnaire:",
    details.inviteUrl || "",
    "",
    "If the link does not work, go to the Soulful Sensory OT website and sign in with the email and password above.",
    "",
    "Soulful Sensory OT",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

function patientInviteEmailSubject(details) {
  return "Your Soulful Sensory OT questionnaire";
}

function whatsappPhoneDigits(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 10) digits = `27${digits.slice(1)}`;
  return digits;
}

function patientInviteWhatsAppUrl(details) {
  const digits = whatsappPhoneDigits(details?.phone);
  if (!digits) return "";
  const firstName = String(details.name || "").trim().split(/\s+/)[0] || "there";
  const lines = [
    `Hi ${firstName}, your Soulful Sensory OT questionnaire is ready.`,
    details.questionnaireType ? `Type: ${details.questionnaireType}.` : "",
    details.expiresAt ? `It expires on ${details.expiresAt}.` : "",
    `Sign in with ${details.email}${details.password ? ` / ${details.password}` : ""}.`,
    details.inviteUrl || "",
  ].filter(Boolean);
  return `https://wa.me/${digits}?text=${encodeURIComponent(lines.join(" "))}`;
}

function patientInviteMailtoUrl(details) {
  const subject = encodeURIComponent(patientInviteEmailSubject(details));
  const body = encodeURIComponent(patientInviteMessage(details));
  return `mailto:${encodeURIComponent(details.email || "")}?subject=${subject}&body=${body}`;
}

async function sendPatientInviteEmail(details) {
  assertEmailDeliveryContext();
  const toEmail = String(details?.email || "").trim();
  if (!toEmail) throw new Error("This patient does not have an email address.");
  const displayName = String(details.name || "").trim() || "there";
  const subject = patientInviteEmailSubject(details);
  const message = patientInviteMessage(details);

  if (DELIVERY_PROVIDER === "web3forms") {
    if (!WEB3FORMS_KEY) {
      throw new Error("Web3Forms access key is not configured in config.js");
    }
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject,
        name: displayName,
        email: toEmail,
        to: toEmail,
        from_name: "Soulful Sensory OT",
        message,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || !isDeliverySuccessFlag(data.success)) {
      throw new Error((data && data.message) || "Web3Forms could not send the email");
    }
    return { provider: "web3forms" };
  }

  if (DELIVERY_PROVIDER === "formsubmit") {
    const formSubmitPayload = {
      _subject: subject,
      _template: "box",
      _captcha: "false",
      _honey: "",
      name: displayName,
      email: toEmail,
      message,
    };
    try {
      return await postFormSubmitJson(formSubmitPayload, toEmail);
    } catch (jsonErr) {
      if (jsonErr?.code === "formsubmit-activation") throw jsonErr;
      try {
        return await postFormSubmitFormData(formSubmitPayload, toEmail);
      } catch (formDataErr) {
        if (formDataErr?.code === "formsubmit-activation") throw formDataErr;
        return await postFormSubmitViaHiddenForm(formSubmitPayload, toEmail);
      }
    }
  }

  throw new Error("Email delivery is disabled in config.js");
}

function detailsFromAssessmentRecord(record) {
  if (!record) return null;
  const patient =
    typeof Auth !== "undefined"
      ? Auth.listUsers().find(
          (u) =>
            u.id === record.patientUserId ||
            (u.email && u.email === (record.summary?.email || record.demographics?.email))
        )
      : null;
  if (!patient) return null;
  return patientCredentialsPayload(
    patient,
    patient.temporaryPassword,
    buildAssignedPatientInviteUrl(patient)
  );
}

async function deliverPatientInviteEmail(details, { noticePrefix = "" } = {}) {
  if (!details?.email) {
    state.patientSendStatus = "error";
    state.patientSendError = "This patient does not have an email address.";
    render();
    return false;
  }
  state.patientSendStatus = "sending";
  state.patientSendError = null;
  render();
  try {
    await sendPatientInviteEmail(details);
    state.patientSendStatus = "sent";
    state.patientSendError = null;
    state.dashboardNotice = `${noticePrefix}Email sent to ${details.email}.`.trim();
    return true;
  } catch (err) {
    const classified = classifyDeliveryError(err, "Could not send the email");
    state.patientSendStatus = "error";
    if (classified.code === "formsubmit-activation") {
      state.patientSendError =
        "The first email to this address needs a one-time FormSubmit confirmation. Check that inbox (and Spam), click Confirm, then tap Send again.";
    } else if (classified.code === "file-protocol") {
      state.patientSendError = fileProtocolEmailMessage();
    } else {
      state.patientSendError = classified.message;
    }
    return false;
  } finally {
    render();
  }
}

function resolvePatientInviteDetails(source) {
  const assessmentId =
    source?.dataset?.assessmentId || source?.getAttribute?.("data-assessment-id") || "";
  if (assessmentId) {
    return detailsFromAssessmentRecord(getAssessmentById(assessmentId));
  }
  return state.createdPatient;
}

async function handleSendPatientInviteEmail(details, { fromDashboard = false } = {}) {
  if (!details) {
    state.dashboardNotice = "This patient account is not on this device.";
    render();
    return;
  }
  if (!fromDashboard) {
    state.createdPatient = details;
    state.dashboardTab = "create";
  }
  const ok = await deliverPatientInviteEmail(details);
  if (!ok) {
    state.createdPatient = details;
    state.dashboardTab = "create";
    render({ scrollToTop: true });
  }
}

function openCreatePatientView() {
  if (typeof Auth === "undefined" || !Auth.canAccessClinicianTools()) {
    state.authError = "Sign in as a therapist to create a patient account.";
    state.view = "login";
    resetAuthForm("therapist");
    return;
  }
  state.view = "dashboard";
  state.dashboardTab = "create";
  state.dashboardNotice = null;
  state.createdPatient = null;
  state.patientFormError = null;
  state.patientSendStatus = null;
  state.patientSendError = null;
  if (!state.patientForm) state.patientForm = emptyPatientForm();
}

function startAssignedQuestionnaire() {
  const user = currentAssignedPatient();
  if (!user) {
    beginInviteAccountGate();
    return false;
  }
  if (isAssignedQuestionnaireExpired(user) && !patientHasCompletedAssignment(user)) {
    state.view = "account";
    state.authNotice =
      "This questionnaire invitation has expired. Please contact your therapist for a new link.";
    return false;
  }
  applyPatientAssignment(user);
  const existing = user.assessmentId
    ? readAssessments().find((item) => item.id === user.assessmentId)
    : readAssessments().find((item) => item.patientUserId === user.id);
  if (existing && assessmentStatus(existing) === "incomplete" && existing.draft) {
    applyIncompleteAssessmentRecord(existing);
    return true;
  }
  resetSensoryQuestionnaireProgress();
  applyPatientAssignment(user);
  if (existing?.id) state.inProgressAssessmentId = existing.id;
  markAssignedAssessmentStarted(state.inProgressAssessmentId);
  state.view = "questionnaire";
  state.step = 1;
  state.showIntroModal = true;
  return true;
}

function createAssessmentId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `assess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function splitPersonName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return { firstName: "", surname: "" };
  if (parts.length === 1) return { firstName: parts[0], surname: "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    surname: parts[parts.length - 1],
  };
}

function readAssessments() {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== ASSESSMENTS_VERSION || !Array.isArray(parsed.items)) {
      return [];
    }
    return parsed.items;
  } catch (_) {
    return [];
  }
}

function writeAssessments(items) {
  try {
    localStorage.setItem(
      ASSESSMENTS_KEY,
      JSON.stringify({ version: ASSESSMENTS_VERSION, items })
    );
  } catch (_) {
    /* Private mode / full storage — ignore */
  }
}

function emptyPaymentsStore() {
  const currency =
    (typeof APP_CONFIG !== "undefined" && APP_CONFIG.paymentCurrency) || "ZAR";
  return { version: PAYMENTS_VERSION, currency, items: [] };
}

function readPayments() {
  try {
    const raw = localStorage.getItem(PAYMENTS_KEY);
    if (!raw) return emptyPaymentsStore();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== PAYMENTS_VERSION || !Array.isArray(parsed.items)) {
      return emptyPaymentsStore();
    }
    return {
      version: PAYMENTS_VERSION,
      currency: parsed.currency || emptyPaymentsStore().currency,
      items: parsed.items,
    };
  } catch (_) {
    return emptyPaymentsStore();
  }
}

function writePayments(store) {
  try {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(store));
  } catch (_) {
    /* Private mode / full storage — ignore */
  }
}

/** Record a successful online payment so the admin overview can total revenue. */
function recordPayment(entry) {
  const store = readPayments();
  const amount = Number(entry?.amount);
  if (!Number.isFinite(amount) || amount < 0) return { ok: false, error: "Invalid amount." };
  const item = {
    id: entry?.id || createAssessmentId(),
    amount,
    currency: entry?.currency || store.currency,
    status: entry?.status || "paid",
    createdAt: entry?.createdAt || new Date().toISOString(),
    description: String(entry?.description || "").trim(),
    patientUserId: entry?.patientUserId || null,
  };
  store.items.unshift(item);
  writePayments(store);
  return { ok: true, item };
}

function isOnlinePaymentsEnabled() {
  return typeof APP_CONFIG !== "undefined" && APP_CONFIG.onlinePaymentsEnabled === true;
}

function getRevenueTotals() {
  const store = readPayments();
  const paid = store.items.filter((item) => item.status === "paid" || item.status === "succeeded");
  return {
    enabled: isOnlinePaymentsEnabled() || paid.length > 0,
    currency: store.currency,
    count: paid.length,
    amount: paid.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
  };
}

function formatMoney(amount, currency = "ZAR") {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(value);
  } catch (_) {
    return `R${value.toFixed(2)}`;
  }
}

function formatStorageBytes(bytes) {
  const value = Math.max(0, Number(bytes) || 0);
  if (value < 1024) return `${Math.round(value)} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function measureLocalStorageUsage() {
  let bytes = 0;
  let keys = 0;
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key) || "";
      bytes += (key.length + value.length) * 2;
      keys += 1;
    }
  } catch (_) {
    return { bytes: 0, keys: 0, readable: false };
  }
  return { bytes, keys, readable: true };
}

function canWriteLocalStorage() {
  const probe = "ssot-health-probe";
  try {
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    return true;
  } catch (_) {
    return false;
  }
}

let cachedStorageEstimate = null;
let storageEstimateRequested = false;

function requestStorageEstimate() {
  if (storageEstimateRequested) return;
  storageEstimateRequested = true;
  if (!navigator.storage?.estimate) return;
  navigator.storage.estimate()
    .then((estimate) => {
      cachedStorageEstimate = {
        usage: Number(estimate?.usage) || 0,
        quota: Number(estimate?.quota) || 0,
      };
      if (state.view === "settings" && state.settingsTab === "overview") render();
    })
    .catch(() => {
      cachedStorageEstimate = null;
    });
}

function getAdminOverviewStats() {
  const userStats =
    typeof Auth !== "undefined" && Auth.getUserStats
      ? Auth.getUserStats()
      : { patients: 0, therapists: 0, total: 0, pending: 0, active: 0 };
  const items = readAssessments();
  const complete = items.filter((item) => assessmentStatus(item) === "complete");
  const assigned = items.filter((item) => assessmentStatus(item) === "assigned");
  const incomplete = items.filter((item) => assessmentStatus(item) === "incomplete");
  const open = [...assigned, ...incomplete];
  const expired = open.filter((item) => {
    const days = questionnaireDaysUntilExpiry(item);
    return days != null && days < 0;
  });
  const active = open.filter((item) => {
    const days = questionnaireDaysUntilExpiry(item);
    return !(days != null && days < 0);
  });
  const reports = complete.filter((item) => item.reportGeneratedAt || item.summary || item.completedAt);
  const completedDates = complete
    .map((item) => item.completedAt)
    .filter(Boolean)
    .sort();
  const lastCompleted = completedDates.length ? completedDates[completedDates.length - 1] : null;
  const local = measureLocalStorageUsage();
  const writable = canWriteLocalStorage();
  const originQuota = cachedStorageEstimate?.quota || 0;
  const originUsage = cachedStorageEstimate?.usage || 0;
  const quota =
    originQuota > 0 && originQuota <= 50 * 1024 * 1024 ? originQuota : LOCAL_STORAGE_BUDGET_BYTES;
  const usage = local.readable ? local.bytes : originUsage;
  const usageRatio = quota > 0 ? usage / quota : 0;
  const archiveCount = items.length;
  const archiveRatio = archiveCount / ASSESSMENT_ARCHIVE_LIMIT;
  let health = "healthy";
  let healthLabel = "Healthy";
  let healthNote = "Accounts, assessments, and reports are storing on this browser as expected.";
  if (!writable || !local.readable) {
    health = "critical";
    healthLabel = "Storage blocked";
    healthNote = "This browser is blocking saved data. Check private browsing or storage permissions.";
  } else if (archiveCount >= ASSESSMENT_ARCHIVE_LIMIT || usageRatio >= 0.95) {
    health = "critical";
    healthLabel = "Storage full";
    healthNote =
      archiveCount >= ASSESSMENT_ARCHIVE_LIMIT
        ? `The assessment archive has reached its ${ASSESSMENT_ARCHIVE_LIMIT} record limit.`
        : "Browser storage is nearly full. Older records may stop saving.";
  } else if (archiveRatio >= 0.9 || usageRatio >= 0.8) {
    health = "attention";
    healthLabel = "Needs attention";
    healthNote =
      archiveRatio >= 0.9
        ? "The assessment archive is close to its limit."
        : "Browser storage is getting full.";
  }
  const delivery =
    DELIVERY_PROVIDER === "none"
      ? "Off"
      : DELIVERY_PROVIDER === "web3forms"
        ? "Web3Forms"
        : "FormSubmit";
  return {
    totalPatients: userStats.patients,
    therapists: userStats.therapists,
    totalUsers: userStats.total,
    activeAssessments: active.length,
    assignedCount: assigned.length,
    inProgressCount: incomplete.length,
    expiredCount: expired.length,
    completedQuestionnaires: complete.length,
    reportsGenerated: reports.length,
    revenue: getRevenueTotals(),
    archiveCount,
    archiveLimit: ASSESSMENT_ARCHIVE_LIMIT,
    lastCompleted,
    local,
    writable,
    usage,
    quota,
    usageRatio,
    health,
    healthLabel,
    healthNote,
    delivery,
    clinicianEmail: getClinicianEmail(),
    quotaIsEstimate: quota === LOCAL_STORAGE_BUDGET_BYTES,
  };
}

function assessmentStatus(item) {
  if (!item) return "incomplete";
  if (item.status === "assigned") return "assigned";
  if (item.status === "incomplete") return "incomplete";
  if (item.status === "complete") return "complete";
  return item.completedAt && item.summary ? "complete" : "incomplete";
}

function isIncompleteAssessment(item) {
  return assessmentStatus(item) === "incomplete";
}

function addDaysIso(iso, days) {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  date.setTime(date.getTime() + days * MS_PER_DAY);
  return date.toISOString();
}

function questionnaireStartedAt(item) {
  return item?.startedAt || item?.savedAt || item?.completedAt || null;
}

function questionnaireExpiresAt(item) {
  if (!item || assessmentStatus(item) === "complete") return null;
  if (item.expiresAt) return item.expiresAt;
  return addDaysIso(questionnaireStartedAt(item), QUESTIONNAIRE_EXPIRY_DAYS);
}

function questionnaireDaysUntilExpiry(item) {
  const expires = questionnaireExpiresAt(item);
  if (!expires) return null;
  const end = new Date(expires).getTime();
  if (Number.isNaN(end)) return null;
  return Math.ceil((end - Date.now()) / MS_PER_DAY);
}

function questionnaireExpiryNote(item) {
  const daysLeft = questionnaireDaysUntilExpiry(item);
  if (daysLeft == null) return "";
  if (daysLeft < 0) return "Expired";
  if (daysLeft === 0) return "Expires today";
  if (daysLeft === 1) return "Expires tomorrow";
  if (daysLeft <= QUESTIONNAIRE_EXPIRY_WARNING_DAYS) return `Expires in ${daysLeft} days`;
  return `Expires ${formatQuestionnaireDate(questionnaireExpiresAt(item), "en")}`;
}

function createCoupleId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  }
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function emptyCouplePartnerSlot(label = "") {
  return {
    label: String(label || "").trim(),
    status: "not_started",
    assessmentId: null,
    completedAt: null,
    demographics: null,
    answers: null,
    idealSaturday: "",
    language: "en",
    summary: null,
  };
}

function createCoupleSession(partial = {}) {
  return {
    id: partial.id || createCoupleId(),
    version: COUPLE_SESSIONS_VERSION,
    createdAt: partial.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    combinedSubmission: {
      status: null,
      submittedAt: null,
      submittedBy: null,
      error: null,
      errorCode: null,
    },
    partners: {
      a: emptyCouplePartnerSlot(partial.partnerAName || partial.aName || ""),
      b: emptyCouplePartnerSlot(partial.partnerBName || partial.bName || ""),
    },
  };
}

function readCoupleSessionsMap() {
  try {
    const raw = localStorage.getItem(COUPLE_SESSIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== COUPLE_SESSIONS_VERSION || typeof parsed.sessions !== "object") {
      return {};
    }
    return parsed.sessions || {};
  } catch (_) {
    return {};
  }
}

function writeCoupleSessionsMap(sessions) {
  try {
    localStorage.setItem(
      COUPLE_SESSIONS_KEY,
      JSON.stringify({ version: COUPLE_SESSIONS_VERSION, sessions })
    );
  } catch (_) {
    /* ignore */
  }
}

function getCoupleSession(id) {
  if (!id) return null;
  const sessions = readCoupleSessionsMap();
  return sessions[id] || null;
}

function saveCoupleSession(session) {
  if (!session?.id) return null;
  session.updatedAt = new Date().toISOString();
  const sessions = readCoupleSessionsMap();
  sessions[session.id] = session;
  writeCoupleSessionsMap(sessions);
  return session;
}

function ensureCoupleSession(id = state.coupleId) {
  let session = id ? getCoupleSession(id) : null;
  if (!session) {
    session = createCoupleSession({ id: id || undefined });
    saveCoupleSession(session);
  } else {
    ensureCoupleCombinedSubmissionShape(session);
  }
  state.coupleId = session.id;
  return session;
}

function couplePartnerLabel(partner, session = null) {
  const copy = currentUi();
  const sess = session || (state.coupleId ? getCoupleSession(state.coupleId) : null);
  const slot = sess?.partners?.[partner];
  const custom = String(slot?.label || "").trim();
  if (custom) return custom;
  return partner === "b" ? copy.couplePartnerB : copy.couplePartnerA;
}

function isCouplePathway() {
  return state.respondent === "couple";
}

function needsCoupleHub(respondent = state.respondent) {
  return respondent === "couple";
}

function bothCouplePartnersComplete(session = null) {
  const sess = session || (state.coupleId ? getCoupleSession(state.coupleId) : null);
  if (!sess) return false;
  return COUPLE_PARTNERS.every((p) => sess.partners?.[p]?.status === "complete" && sess.partners[p].answers);
}

function buildCouplePartnerUrl(coupleId, partner) {
  const url = new URL(getClinicianBaseUrl());
  url.searchParams.set("couple", coupleId);
  url.searchParams.set("partner", partner);
  const session = getCoupleSession(coupleId);
  const aName = session?.partners?.a?.label;
  const bName = session?.partners?.b?.label;
  if (aName) url.searchParams.set("aName", aName);
  if (bName) url.searchParams.set("bName", bName);
  return url.toString();
}

function encodeCoupleCompletionPackage(coupleId, partner) {
  const session = getCoupleSession(coupleId);
  const slot = session?.partners?.[partner];
  if (!slot || slot.status !== "complete" || !slot.answers) return "";
  const payload = {
    v: 1,
    coupleId,
    partner,
    label: slot.label || "",
    completedAt: slot.completedAt,
    language: slot.language || "en",
    demographics: slot.demographics,
    answers: slot.answers,
    idealSaturday: slot.idealSaturday || "",
    coupleWork: slot.coupleWork || null,
    summary: slot.summary || null,
  };
  try {
    return `SSOTC1.${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`;
  } catch (_) {
    return "";
  }
}

function decodeCoupleCompletionPackage(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;
  try {
    const body = text.startsWith("SSOTC1.") ? text.slice(7) : text;
    const json = decodeURIComponent(escape(atob(body)));
    const payload = JSON.parse(json);
    if (!payload || payload.v !== 1 || !payload.coupleId || !COUPLE_PARTNERS.includes(payload.partner)) {
      return null;
    }
    if (!payload.answers || typeof payload.answers !== "object") return null;
    return payload;
  } catch (_) {
    return null;
  }
}

function applyCoupleCompletionPackage(payload, { allowForeignSession = false } = {}) {
  if (!payload) return { ok: false, reason: "bad" };
  if (state.coupleId && payload.coupleId !== state.coupleId && !allowForeignSession) {
    return { ok: false, reason: "mismatch" };
  }
  const session = ensureCoupleSession(payload.coupleId);
  const partner = payload.partner;
  session.partners[partner] = {
    ...emptyCouplePartnerSlot(payload.label || session.partners[partner]?.label || ""),
    label: String(payload.label || session.partners[partner]?.label || "").trim(),
    status: "complete",
    assessmentId: session.partners[partner]?.assessmentId || null,
    completedAt: payload.completedAt || new Date().toISOString(),
    demographics: payload.demographics || null,
    answers: cloneAnswers(payload.answers),
    idealSaturday: payload.idealSaturday || "",
    language: LANGUAGES.includes(payload.language) ? payload.language : "en",
    summary: payload.summary || null,
    coupleWork: normalizeCoupleWork(payload.coupleWork),
  };
  saveCoupleSession(session);
  state.coupleId = session.id;
  return { ok: true, session, partner };
}

function persistCurrentPartnerToCoupleSession(assessmentId = null) {
  if (!isCouplePathway() || !state.coupleId || !COUPLE_PARTNERS.includes(state.couplePartner)) {
    return null;
  }
  const session = ensureCoupleSession(state.coupleId);
  const partner = state.couplePartner;
  const scores = scoreAllDomains(
    state.answers,
    currentDomains(),
    state.language,
    "couple"
  );
  const metrics = getProfileMetrics(scores);
  const name = String(state.demographics?.name || "").trim();
  session.partners[partner] = {
    ...session.partners[partner],
    label: name || session.partners[partner].label || "",
    status: "complete",
    assessmentId: assessmentId || session.partners[partner].assessmentId || null,
    completedAt: state.completedAt || new Date().toISOString(),
    demographics: {
      name: state.demographics?.name || "",
      age: state.demographics?.age || "",
      email: state.demographics?.email || "",
      occupation: state.demographics?.occupation || "",
      parentName: state.demographics?.parentName || "",
      partnerName: state.demographics?.partnerName || "",
    },
    answers: cloneAnswers(state.answers),
    idealSaturday: state.idealSaturday || "",
    language: state.language,
    summary: {
      overallLabel: profileLabelPlain(metrics?.meta) || "",
      lean: metrics?.lean || "",
      balance: typeof metrics?.balance === "number" ? metrics.balance : null,
      leanHeadline: metrics?.leanHeadline || "",
      domainProfiles: getScoreRows(scores).map((row) => ({
        id: row.id,
        title: row.title,
        short: row.profileShort || row.thresholdLabel || "",
      })),
    },
    coupleWork: normalizeCoupleWork(state.coupleWork),
  };
  // Mirror the other partner's display name into demographics.partnerName when known.
  const other = partner === "a" ? "b" : "a";
  const otherName = String(session.partners[other]?.label || session.partners[other]?.demographics?.name || "").trim();
  if (otherName && session.partners[partner].demographics) {
    session.partners[partner].demographics.partnerName = otherName;
  }
  saveCoupleSession(session);
  return session;
}

function markCouplePartnerInProgress(partner) {
  const session = ensureCoupleSession();
  if (!COUPLE_PARTNERS.includes(partner)) return session;
  if (session.partners[partner].status !== "complete") {
    session.partners[partner].status = "in_progress";
    saveCoupleSession(session);
  }
  return session;
}

function findStepIndex(type) {
  return STEPS.findIndex((step) => step.type === type);
}

function startCouplePartnerQuestionnaire(partner) {
  if (!COUPLE_PARTNERS.includes(partner)) return;
  const session = ensureCoupleSession();
  const slot = session.partners[partner];

  if (slot.status === "complete" && slot.answers) {
    state.respondent = "couple";
    state.couplePartner = partner;
    state.coupleShowMerge = false;
    state.lifeContext = null;
    state.error = null;
    state.coupleHubNotice = null;
    state.view = "questionnaire";
    state.sampleReportPreview = false;
    state.showWorkReport = false;
    state.workReportDeclined = false;
    state.submissionStatus = null;
    state.submissionError = null;
    state.submissionErrorCode = null;
    state.submissionAttempted = false;
    state.inProgressAssessmentId = null;
    state.demographics = {
      name: slot.demographics?.name || slot.label || "",
      age: slot.demographics?.age || "",
      email: slot.demographics?.email || "",
      occupation: slot.demographics?.occupation || "",
      parentName: slot.demographics?.parentName || "",
      partnerName: slot.demographics?.partnerName || "",
    };
    state.answers = cloneAnswers(slot.answers);
    state.idealSaturday = slot.idealSaturday || "";
    state.coupleWork = normalizeCoupleWork(slot.coupleWork);
    state.language = LANGUAGES.includes(slot.language) ? slot.language : state.language;
    document.documentElement.lang = state.language;
    state.completedAt = slot.completedAt || new Date().toISOString();
    state.consent = getConsentItems(state.language, "couple").map(() => true);
    state.sharingConsent = createEmptySharingConsent(state.language, "couple", null);
    state.viewingArchivedId = slot.assessmentId || `couple-${session.id}-${partner}`;
    state.archiveReadOnly = true;
    state.step = findStepIndex("results");
    state.showIntroModal = false;
    state.showSensoryDiet = true;
    return;
  }

  if (slot.status === "in_progress") {
    const incomplete = readAssessments().find(
      (item) =>
        isIncompleteAssessment(item) &&
        item.coupleId === session.id &&
        item.couplePartner === partner
    );
    if (incomplete && applyIncompleteAssessmentRecord(incomplete)) {
      markCouplePartnerInProgress(partner);
      return;
    }
    state.respondent = "couple";
    state.couplePartner = partner;
    const draft = readSensoryDraft();
    if (draft && (draft.coupleId || null) === session.id && draft.couplePartner === partner) {
      applySensoryDraft(draft);
      markCouplePartnerInProgress(partner);
      return;
    }
  }

  state.respondent = "couple";
  state.couplePartner = partner;
  state.coupleShowMerge = false;
  state.lifeContext = null;
  state.error = null;
  state.coupleHubNotice = null;
  state.view = "questionnaire";
  state.showIntroModal = true;
  state.archiveReadOnly = false;
  state.viewingArchivedId = null;
  state.inProgressAssessmentId = null;
  state.sampleReportPreview = false;
  state.completedAt = null;
  state.showSensoryDiet = false;
  state.showWorkReport = false;
  state.workReportDeclined = false;
  state.submissionStatus = null;
  state.submissionError = null;
  state.submissionErrorCode = null;
  state.submissionAttempted = false;

  markCouplePartnerInProgress(partner);
  state.consent = getConsentItems(state.language, "couple").map(() => false);
  state.sharingConsent = createEmptySharingConsent(state.language, "couple", null);
  state.demographics = {
    name: slot.label || "",
    age: "",
    email: "",
    occupation: "",
    parentName: "",
    partnerName: couplePartnerLabel(partner === "a" ? "b" : "a", session),
  };
  state.answers = emptyAnswers();
  state.idealSaturday = "";
  state.coupleWork = emptyCoupleWork();
  state.contactPreference = null;
  state.step = findStepIndex("consent");
}

function needsCoupleWork(respondent = state.respondent) {
  return respondent === "couple";
}

/** Couples answer a recharging-Saturday question in the work section instead. */
function needsIdealSaturday(respondent = state.respondent) {
  return respondent !== "couple";
}

function emptyCoupleWork() {
  return {
    employment: null, // "works" | "doesNotWork"
    workLocation: null, // office | home | both | other
    workLocationOther: "",
    workWith: null, // people | alone | screens | screensAndPeople | other
    workWithOther: "",
    workingHours: "",
    endOfDay: [], // multi: getOut | sitRelax | withPeople | alone
    rechargeAfterWork: [], // multi: activeOutdoors | relaxHome | othersHome | othersOutside | other
    rechargeAfterWorkOther: "",
    rechargingSaturday: "",
    isParent: null, // "yes" | "no"
  };
}

function ensureCoupleWorkState() {
  if (!state.coupleWork || typeof state.coupleWork !== "object") {
    state.coupleWork = emptyCoupleWork();
  } else {
    state.coupleWork = normalizeCoupleWork(state.coupleWork);
  }
  return state.coupleWork;
}

function normalizeCoupleWorkEndOfDay(raw) {
  const allowed = ["getOut", "sitRelax", "withPeople", "alone"];
  if (Array.isArray(raw)) {
    return raw.filter((value) => allowed.includes(value));
  }
  if (allowed.includes(raw)) return [raw];
  return [];
}

function normalizeCoupleWorkRecharge(raw) {
  const allowed = ["activeOutdoors", "relaxHome", "othersHome", "othersOutside", "other"];
  if (Array.isArray(raw)) {
    return raw.filter((value) => allowed.includes(value));
  }
  if (allowed.includes(raw)) return [raw];
  return [];
}

function normalizeCoupleWork(raw) {
  const base = emptyCoupleWork();
  if (!raw || typeof raw !== "object") return base;
  return {
    ...base,
    employment: raw.employment === "works" || raw.employment === "doesNotWork" ? raw.employment : null,
    workLocation: ["office", "home", "both", "other"].includes(raw.workLocation) ? raw.workLocation : null,
    workLocationOther: String(raw.workLocationOther || ""),
    workWith: ["people", "alone", "screens", "screensAndPeople", "other"].includes(raw.workWith)
      ? raw.workWith
      : null,
    workWithOther: String(raw.workWithOther || ""),
    workingHours: String(raw.workingHours || ""),
    endOfDay: normalizeCoupleWorkEndOfDay(raw.endOfDay),
    rechargeAfterWork: normalizeCoupleWorkRecharge(raw.rechargeAfterWork),
    rechargeAfterWorkOther: String(raw.rechargeAfterWorkOther || ""),
    rechargingSaturday: String(raw.rechargingSaturday || ""),
    isParent: raw.isParent === "yes" || raw.isParent === "no" ? raw.isParent : null,
  };
}

function coupleWorkChoiceButton(group, value, label, selected) {
  return `
    <button
      type="button"
      class="couple-work-option ${selected ? "is-selected" : ""}"
      data-couple-work-field="${group}"
      data-couple-work-value="${value}"
      aria-pressed="${selected}"
    >${escapeHtml(label)}</button>
  `;
}

function renderCoupleWork() {
  const copy = currentUi();
  const work = ensureCoupleWorkState();
  const skipsWorkQs = work.employment === "doesNotWork";

  const employmentOptions = [
    coupleWorkChoiceButton("employment", "works", copy.coupleWorkEmploymentYes, work.employment === "works"),
    coupleWorkChoiceButton(
      "employment",
      "doesNotWork",
      copy.coupleWorkEmploymentNo,
      work.employment === "doesNotWork"
    ),
  ].join("");

  let workFields = "";
  if (work.employment === "works") {
    workFields = `
      <fieldset class="couple-work-fieldset">
        <legend>${escapeHtml(copy.coupleWorkLocationLabel)}</legend>
        <div class="couple-work-options">
          ${coupleWorkChoiceButton("workLocation", "office", copy.coupleWorkLocationOffice, work.workLocation === "office")}
          ${coupleWorkChoiceButton("workLocation", "home", copy.coupleWorkLocationHome, work.workLocation === "home")}
          ${coupleWorkChoiceButton("workLocation", "both", copy.coupleWorkLocationBoth, work.workLocation === "both")}
          ${coupleWorkChoiceButton("workLocation", "other", copy.coupleWorkLocationOther, work.workLocation === "other")}
        </div>
        ${
          work.workLocation === "other"
            ? `<input type="text" class="couple-work-other" data-couple-work-text="workLocationOther" value="${escapeHtml(work.workLocationOther)}" placeholder="${escapeHtml(copy.coupleWorkLocationOtherPlaceholder)}" />`
            : ""
        }
      </fieldset>

      <fieldset class="couple-work-fieldset">
        <legend>${escapeHtml(copy.coupleWorkWithLabel)}</legend>
        <div class="couple-work-options">
          ${coupleWorkChoiceButton("workWith", "people", copy.coupleWorkWithPeople, work.workWith === "people")}
          ${coupleWorkChoiceButton("workWith", "alone", copy.coupleWorkWithAlone, work.workWith === "alone")}
          ${coupleWorkChoiceButton("workWith", "screens", copy.coupleWorkWithScreens, work.workWith === "screens")}
          ${coupleWorkChoiceButton("workWith", "screensAndPeople", copy.coupleWorkWithScreensPeople, work.workWith === "screensAndPeople")}
          ${coupleWorkChoiceButton("workWith", "other", copy.coupleWorkWithOther, work.workWith === "other")}
        </div>
        ${
          work.workWith === "other"
            ? `<input type="text" class="couple-work-other" data-couple-work-text="workWithOther" value="${escapeHtml(work.workWithOther)}" placeholder="${escapeHtml(copy.coupleWorkWithOtherPlaceholder)}" />`
            : ""
        }
      </fieldset>

      <div class="field couple-work-field">
        <label for="couple-work-hours">${escapeHtml(copy.coupleWorkHoursLabel)}</label>
        <input id="couple-work-hours" type="text" data-couple-work-text="workingHours" value="${escapeHtml(work.workingHours)}" placeholder="${escapeHtml(copy.coupleWorkHoursPlaceholder)}" />
      </div>

      <fieldset class="couple-work-fieldset">
        <legend>${escapeHtml(copy.coupleWorkEndOfDayLabel)}</legend>
        <p class="couple-work-multi-hint">${escapeHtml(copy.coupleWorkEndOfDayHint)}</p>
        <div class="couple-work-options">
          ${coupleWorkChoiceButton("endOfDay", "getOut", copy.coupleWorkEndGetOut, work.endOfDay.includes("getOut"))}
          ${coupleWorkChoiceButton("endOfDay", "sitRelax", copy.coupleWorkEndSitRelax, work.endOfDay.includes("sitRelax"))}
          ${coupleWorkChoiceButton("endOfDay", "withPeople", copy.coupleWorkEndWithPeople, work.endOfDay.includes("withPeople"))}
          ${coupleWorkChoiceButton("endOfDay", "alone", copy.coupleWorkEndAlone, work.endOfDay.includes("alone"))}
        </div>
      </fieldset>

      <fieldset class="couple-work-fieldset">
        <legend>${escapeHtml(copy.coupleWorkRechargeLabel)}</legend>
        <p class="couple-work-multi-hint">${escapeHtml(copy.coupleWorkRechargeHint)}</p>
        <div class="couple-work-options">
          ${coupleWorkChoiceButton("rechargeAfterWork", "activeOutdoors", copy.coupleWorkRechargeActive, work.rechargeAfterWork.includes("activeOutdoors"))}
          ${coupleWorkChoiceButton("rechargeAfterWork", "relaxHome", copy.coupleWorkRechargeHome, work.rechargeAfterWork.includes("relaxHome"))}
          ${coupleWorkChoiceButton("rechargeAfterWork", "othersHome", copy.coupleWorkRechargeOthersHome, work.rechargeAfterWork.includes("othersHome"))}
          ${coupleWorkChoiceButton("rechargeAfterWork", "othersOutside", copy.coupleWorkRechargeOthersOut, work.rechargeAfterWork.includes("othersOutside"))}
          ${coupleWorkChoiceButton("rechargeAfterWork", "other", copy.coupleWorkRechargeOther, work.rechargeAfterWork.includes("other"))}
        </div>
        ${
          work.rechargeAfterWork.includes("other")
            ? `<input type="text" class="couple-work-other" data-couple-work-text="rechargeAfterWorkOther" value="${escapeHtml(work.rechargeAfterWorkOther)}" placeholder="${escapeHtml(copy.coupleWorkRechargeOtherPlaceholder)}" />`
            : ""
        }
      </fieldset>

      <div class="field couple-work-field">
        <label for="couple-work-saturday">${escapeHtml(copy.coupleWorkSaturdayLabel)}</label>
        <textarea id="couple-work-saturday" class="couple-work-textarea" data-couple-work-text="rechargingSaturday" rows="5" placeholder="${escapeHtml(copy.coupleWorkSaturdayPlaceholder)}">${escapeHtml(work.rechargingSaturday)}</textarea>
      </div>
    `;
  } else if (skipsWorkQs) {
    workFields = `<p class="couple-work-skip-note">${escapeHtml(copy.coupleWorkSkipNote)}</p>`;
  }

  return renderShell(
    `
      ${state.error ? `<div class="error-banner">${escapeHtml(state.error)}</div>` : ""}
      <span class="section-tag">${escapeHtml(copy.coupleWorkTag)}</span>
      <h2 class="step-title">${escapeHtml(copy.coupleWorkTitle)}</h2>
      <img src="mountain-divider.svg" alt="" class="botanical-divider mountain-divider" width="600" height="44" />
      <p class="step-desc">${escapeHtml(copy.coupleWorkDesc)}</p>

      <fieldset class="couple-work-fieldset">
        <legend>${escapeHtml(copy.coupleWorkEmploymentLabel)}</legend>
        <div class="couple-work-options couple-work-options--stack">${employmentOptions}</div>
      </fieldset>

      ${workFields}

      <fieldset class="couple-work-fieldset">
        <legend>${escapeHtml(copy.coupleWorkParentLabel)}</legend>
        <div class="couple-work-options">
          ${coupleWorkChoiceButton("isParent", "yes", copy.coupleWorkParentYes, work.isParent === "yes")}
          ${coupleWorkChoiceButton("isParent", "no", copy.coupleWorkParentNo, work.isParent === "no")}
        </div>
      </fieldset>

      <div class="actions">
        <button type="button" class="btn btn-secondary" data-action="back">${escapeHtml(copy.back)}</button>
        <button type="button" class="btn btn-primary" data-action="next">${escapeHtml(copy.seeResults || copy.continue)}</button>
      </div>
    `,
    renderProgress(),
    { stepType: "coupleWork" }
  );
}

function coupleWorkLabel(copy, field, value, otherText = "") {
  const maps = {
    employment: {
      works: copy.coupleWorkEmploymentYes,
      doesNotWork: copy.coupleWorkEmploymentNo,
    },
    workLocation: {
      office: copy.coupleWorkLocationOffice,
      home: copy.coupleWorkLocationHome,
      both: copy.coupleWorkLocationBoth,
      other: otherText || copy.coupleWorkLocationOther,
    },
    workWith: {
      people: copy.coupleWorkWithPeople,
      alone: copy.coupleWorkWithAlone,
      screens: copy.coupleWorkWithScreens,
      screensAndPeople: copy.coupleWorkWithScreensPeople,
      other: otherText || copy.coupleWorkWithOther,
    },
    endOfDay: {
      getOut: copy.coupleWorkEndGetOut,
      sitRelax: copy.coupleWorkEndSitRelax,
      withPeople: copy.coupleWorkEndWithPeople,
      alone: copy.coupleWorkEndAlone,
    },
    rechargeAfterWork: {
      activeOutdoors: copy.coupleWorkRechargeActive,
      relaxHome: copy.coupleWorkRechargeHome,
      othersHome: copy.coupleWorkRechargeOthersHome,
      othersOutside: copy.coupleWorkRechargeOthersOut,
      other: otherText || copy.coupleWorkRechargeOther,
    },
    isParent: {
      yes: copy.coupleWorkParentYes,
      no: copy.coupleWorkParentNo,
    },
  };
  return maps[field]?.[value] || value || "—";
}

function formatCoupleWorkEndOfDay(work, copy = currentUi()) {
  const selected = normalizeCoupleWorkEndOfDay(work?.endOfDay);
  if (!selected.length) return "—";
  return selected.map((value) => coupleWorkLabel(copy, "endOfDay", value)).join("; ");
}

function formatCoupleWorkRecharge(work, copy = currentUi()) {
  const selected = normalizeCoupleWorkRecharge(work?.rechargeAfterWork);
  if (!selected.length) return "—";
  return selected
    .map((value) =>
      coupleWorkLabel(
        copy,
        "rechargeAfterWork",
        value,
        value === "other" ? work.rechargeAfterWorkOther : ""
      )
    )
    .join("; ");
}

function formatCoupleWorkSummary(work, copy = currentUi()) {
  if (!work?.employment) return "";
  const lines = [];
  lines.push(`${copy.coupleWorkEmploymentLabel} ${coupleWorkLabel(copy, "employment", work.employment)}`);
  if (work.employment === "works") {
    lines.push(
      `${copy.coupleWorkLocationLabel} ${coupleWorkLabel(copy, "workLocation", work.workLocation, work.workLocationOther)}`
    );
    lines.push(
      `${copy.coupleWorkWithLabel} ${coupleWorkLabel(copy, "workWith", work.workWith, work.workWithOther)}`
    );
    if (work.workingHours?.trim()) lines.push(`${copy.coupleWorkHoursLabel} ${work.workingHours.trim()}`);
    lines.push(`${copy.coupleWorkEndOfDayLabel} ${formatCoupleWorkEndOfDay(work, copy)}`);
    lines.push(`${copy.coupleWorkRechargeLabel} ${formatCoupleWorkRecharge(work, copy)}`);
    if (work.rechargingSaturday?.trim()) {
      lines.push(`${copy.coupleWorkSaturdayLabel} ${work.rechargingSaturday.trim()}`);
    }
  }
  if (work.isParent) {
    lines.push(`${copy.coupleWorkParentLabel}: ${coupleWorkLabel(copy, "isParent", work.isParent)}`);
  }
  return lines.join("\n");
}

function renderCoupleWorkResults() {
  if (!isCouplePathway()) return "";
  const work = normalizeCoupleWork(state.coupleWork);
  if (!work.employment) return "";
  const copy = currentUi();
  const summary = formatCoupleWorkSummary(work, copy);
  if (!summary) return "";
  const paragraphs = summary
    .split("\n")
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
  return `
    <section class="report-block couple-work-results no-break">
      <p class="profile-kicker">${escapeHtml(copy.coupleWorkTag)}</p>
      <h3>${escapeHtml(copy.coupleWorkResultsTitle)}</h3>
      <div class="couple-work-results__body">${paragraphs}</div>
    </section>
  `;
}

function openCoupleHub(options = {}) {
  state.respondent = "couple";
  state.couplePartner = null;
  state.coupleShowMerge = Boolean(options.showMerge);
  state.lifeContext = null;
  state.view = "questionnaire";
  state.step = findStepIndex("coupleHub");
  state.showIntroModal = false;
  state.error = null;
  if (options.coupleId) state.coupleId = options.coupleId;
  ensureCoupleSession(state.coupleId);
}

function getAssessmentById(id) {
  if (!id) return null;
  return readAssessments().find((item) => item.id === id) || null;
}

function buildAssessmentSummary(scores, metrics) {
  const demo = state.demographics || {};
  const patientName = String(demo.name || "").trim();
  const { firstName, surname } = splitPersonName(patientName);
  const rows = getScoreRows(scores);
  return {
    patientName,
    firstName,
    surname,
    parentName: String(demo.parentName || "").trim(),
    partnerName: String(demo.partnerName || "").trim(),
    coupleId: state.coupleId || null,
    couplePartner: state.couplePartner || null,
    completerName: assessmentCompleterName(),
    email: String(demo.email || "").trim(),
    age: String(demo.age || "").trim(),
    overallProfile: metrics?.profile || "",
    overallLabel: profileLabelPlain(metrics?.meta) || "",
    leanHeadline: metrics?.leanHeadline || "",
    sensitive: metrics?.sensitive ?? 0,
    seeking: metrics?.seeking ?? 0,
    neutral: metrics?.neutral ?? 0,
    scored: metrics?.scored ?? 0,
    domainProfiles: rows.map((row) => ({
      id: row.id,
      title: row.title,
      short: row.profileShort || row.thresholdLabel || "",
    })),
  };
}

function buildAssessmentRecord() {
  const scores = scoreAllDomains(
    state.answers,
    currentDomains(),
    state.language,
    state.respondent || "adult"
  );
  const metrics = getProfileMetrics(scores);
  const user = currentAuthUser();
  return {
    id: state.viewingArchivedId || state.inProgressAssessmentId || createAssessmentId(),
    version: ASSESSMENTS_VERSION,
    status: "complete",
    completedAt: state.completedAt || new Date().toISOString(),
    reportGeneratedAt: state.completedAt || new Date().toISOString(),
    savedAt: new Date().toISOString(),
    respondent: state.respondent,
    language: state.language,
    lifeContext: state.lifeContext,
    coupleId: state.coupleId || null,
    couplePartner: state.couplePartner || null,
    demographics: {
      name: state.demographics?.name || "",
      age: state.demographics?.age || "",
      email: state.demographics?.email || "",
      occupation: state.demographics?.occupation || "",
      parentName: state.demographics?.parentName || "",
      partnerName: state.demographics?.partnerName || "",
    },
    reasonForReferral: state.workReport?.reasonForReferral || "",
    answers: cloneAnswers(state.answers),
    idealSaturday: state.idealSaturday || "",
    coupleWork: normalizeCoupleWork(state.coupleWork),
    sharingConsent: { ...(state.sharingConsent || {}) },
    contactPreference: state.contactPreference,
    inviteMode: Boolean(state.inviteMode),
    patientResultsAccess: normalizeResultsAccess(state.patientResultsAccess),
    patientUserId: user?.role === "patient" ? user.id : null,
    summary: buildAssessmentSummary(scores, metrics),
  };
}

/** Persist a completed screening so therapists can reopen & print later (this browser). */
function ensureAssessmentArchived() {
  if (state.sampleReportPreview) return null;
  if (!state.respondent || !RESPONDENT_TYPES.includes(state.respondent)) return null;
  if (state.archiveReadOnly && state.viewingArchivedId) return state.viewingArchivedId;

  if (!state.completedAt) {
    state.completedAt = new Date().toISOString();
  }

  const record = buildAssessmentRecord();
  const items = readAssessments().filter((item) => item.id !== record.id);
  items.unshift(record);
  writeAssessments(items.slice(0, ASSESSMENT_ARCHIVE_LIMIT));
  state.viewingArchivedId = record.id;
  state.inProgressAssessmentId = null;
  persistCurrentPartnerToCoupleSession(record.id);
  return record.id;
}

function questionnaireProgressLabel(step) {
  const questionnaireSteps = STEPS.length - 1;
  const current = Math.min(Math.max(Number(step) || 1, 1), questionnaireSteps);
  return `Step ${current} of ${questionnaireSteps}`;
}

function draftLooksStarted(draft) {
  if (!draft) return false;
  const name = String(draft.demographics?.name || "").trim();
  const parentName = String(draft.demographics?.parentName || "").trim();
  const stepType = STEPS[draft.step]?.type;
  const reachedQuestions =
    stepType === "domain" || stepType === "idealSaturday" || stepType === "coupleWork";
  const answeredSomething = SENSORY_DOMAIN_IDS.some((id) =>
    (draft.answers?.[id] || []).some((value) => typeof value === "boolean")
  );
  return Boolean(name || parentName || reachedQuestions || answeredSomething);
}

function shouldPersistIncompleteProgress() {
  if (state.sampleReportPreview || state.archiveReadOnly) return false;
  if (!isSensoryDraftEligible()) return false;
  if (!state.respondent || !RESPONDENT_TYPES.includes(state.respondent)) return false;
  return draftLooksStarted({
    step: state.step,
    demographics: state.demographics,
    answers: state.answers,
  });
}

function resolveInProgressAssessmentId() {
  if (state.inProgressAssessmentId) return state.inProgressAssessmentId;
  if (isCouplePathway() && state.coupleId && state.couplePartner) {
    const existing = readAssessments().find(
      (item) =>
        isIncompleteAssessment(item) &&
        item.coupleId === state.coupleId &&
        item.couplePartner === state.couplePartner
    );
    if (existing) return existing.id;
  }
  return createAssessmentId();
}

function incompleteRecordFromDraft(draft, id, existing = null) {
  const demo = draft.demographics || {};
  const patientName = String(demo.name || "").trim();
  const { firstName, surname } = splitPersonName(patientName);
  const user = currentAuthUser();
  const respondent = RESPONDENT_TYPES.includes(draft.respondent) ? draft.respondent : null;
  const couplePartner = COUPLE_PARTNERS.includes(draft.couplePartner) ? draft.couplePartner : null;
  return {
    id,
    version: ASSESSMENTS_VERSION,
    status: "incomplete",
    completedAt: null,
    savedAt: draft.savedAt || new Date().toISOString(),
    startedAt: existing?.startedAt || existing?.savedAt || draft.savedAt || new Date().toISOString(),
    expiresAt:
      existing?.expiresAt ||
      addDaysIso(
        existing?.startedAt || existing?.savedAt || draft.savedAt || new Date().toISOString(),
        QUESTIONNAIRE_EXPIRY_DAYS
      ),
    expiryNotifiedAt: existing?.expiryNotifiedAt || null,
    respondent,
    language: LANGUAGES.includes(draft.language) ? draft.language : "en",
    lifeContext: draft.lifeContext || null,
    coupleId: draft.coupleId || null,
    couplePartner,
    demographics: {
      name: demo.name || "",
      age: demo.age || "",
      email: demo.email || "",
      occupation: demo.occupation || "",
      parentName: demo.parentName || "",
      partnerName: demo.partnerName || "",
    },
    reasonForReferral: existing?.reasonForReferral || "",
    answers: cloneAnswers(draft.answers),
    idealSaturday: draft.idealSaturday || "",
    coupleWork: normalizeCoupleWork(draft.coupleWork),
    sharingConsent: { ...(draft.sharingConsent || {}) },
    contactPreference: draft.contactPreference || null,
    inviteMode: Boolean(draft.inviteMode),
    patientResultsAccess: normalizeResultsAccess(draft.patientResultsAccess),
    patientUserId: user?.role === "patient" ? user.id : existing?.patientUserId || null,
    step: draft.step,
    summary: {
      patientName,
      firstName,
      surname,
      parentName: String(demo.parentName || "").trim(),
      partnerName: String(demo.partnerName || "").trim(),
      coupleId: draft.coupleId || null,
      couplePartner,
      completerName: patientName || String(demo.parentName || "").trim(),
      email: String(demo.email || "").trim(),
      age: String(demo.age || "").trim(),
      overallProfile: "",
      overallLabel: "",
      leanHeadline: "",
      sensitive: 0,
      seeking: 0,
      neutral: 0,
      scored: 0,
      domainProfiles: [],
      progressLabel: questionnaireProgressLabel(draft.step),
    },
    draft: { ...draft, assessmentId: id },
  };
}

function persistIncompleteAssessmentFromDraft(draft) {
  if (!draft || !draftLooksStarted(draft)) return null;
  const id = resolveInProgressAssessmentId();
  state.inProgressAssessmentId = id;
  const items = readAssessments();
  const existing = items.find((item) => item.id === id);
  if (existing && assessmentStatus(existing) === "complete") return existing.id;
  const isNewIncomplete = !existing;
  const record = incompleteRecordFromDraft(draft, id, existing);
  const next = items.filter((item) => item.id !== id);
  next.unshift(record);
  writeAssessments(next.slice(0, ASSESSMENT_ARCHIVE_LIMIT));
  if (isNewIncomplete) notifyIncompleteQuestionnaire(record);
  return id;
}

function parseStoredSensoryDraft(raw) {
  try {
    const draft = JSON.parse(raw);
    if (!draft || draft.version !== SENSORY_DRAFT_VERSION) return null;
    if (typeof draft.step !== "number" || draft.step < 1 || draft.step >= STEPS.length - 1) {
      return null;
    }
    if (draft.respondent && !RESPONDENT_TYPES.includes(draft.respondent)) return null;
    if (draft.language && !LANGUAGES.includes(draft.language)) return null;
    return draft;
  } catch (_) {
    return null;
  }
}

function listSensoryDraftEntries() {
  const entries = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(SENSORY_DRAFT_KEY)) continue;
      const draft = parseStoredSensoryDraft(localStorage.getItem(key));
      if (draft) entries.push({ key, draft });
    }
  } catch (_) {
    /* ignore */
  }
  return entries;
}

function mirrorOpenDraftsToAssessments() {
  const items = readAssessments();
  let changed = false;
  listSensoryDraftEntries().forEach(({ key, draft }) => {
    if (!draftLooksStarted(draft)) return;
    const match =
      (draft.assessmentId && items.find((item) => item.id === draft.assessmentId)) ||
      items.find(
        (item) =>
          isIncompleteAssessment(item) &&
          item.respondent === draft.respondent &&
          (item.coupleId || null) === (draft.coupleId || null) &&
          (item.couplePartner || null) === (draft.couplePartner || null) &&
          String(item.demographics?.name || item.summary?.patientName || "").trim() ===
            String(draft.demographics?.name || "").trim()
      );
    if (match && assessmentStatus(match) === "complete") return;
    if (match) {
      const draftTime = new Date(draft.savedAt || 0).getTime();
      const matchTime = new Date(match.savedAt || 0).getTime();
      if (!Number.isNaN(draftTime) && !Number.isNaN(matchTime) && draftTime <= matchTime) {
        return;
      }
      const updated = incompleteRecordFromDraft(draft, match.id, match);
      const index = items.findIndex((item) => item.id === match.id);
      if (index >= 0) {
        items[index] = updated;
        changed = true;
      }
      return;
    }
    const id = draft.assessmentId || createAssessmentId();
    items.unshift(incompleteRecordFromDraft(draft, id, null));
    changed = true;
    if (!draft.assessmentId) {
      try {
        localStorage.setItem(key, JSON.stringify({ ...draft, assessmentId: id }));
      } catch (_) {
        /* ignore */
      }
    }
  });
  if (changed) writeAssessments(items.slice(0, ASSESSMENT_ARCHIVE_LIMIT));
}

function collectCoupleIncompleteEntries(existingItems) {
  const extras = [];
  const sessions = readCoupleSessionsMap();
  Object.values(sessions).forEach((session) => {
    if (!session?.id) return;
    COUPLE_PARTNERS.forEach((partner) => {
      const slot = session.partners?.[partner];
      if (!slot || slot.status !== "in_progress") return;
      const alreadyListed = existingItems.some(
        (item) =>
          isIncompleteAssessment(item) &&
          item.coupleId === session.id &&
          item.couplePartner === partner
      );
      if (alreadyListed) return;
      const name = String(slot.label || slot.demographics?.name || "").trim();
      const other = partner === "a" ? "b" : "a";
      const partnerName = String(
        session.partners?.[other]?.label || session.partners?.[other]?.demographics?.name || ""
      ).trim();
      extras.push({
        id: `couple-progress-${session.id}-${partner}`,
        status: "incomplete",
        source: "couple-session",
        savedAt: session.updatedAt || session.createdAt || new Date().toISOString(),
        completedAt: null,
        respondent: "couple",
        coupleId: session.id,
        couplePartner: partner,
        demographics: {
          name,
          age: slot.demographics?.age || "",
          email: slot.demographics?.email || "",
          occupation: slot.demographics?.occupation || "",
          parentName: "",
          partnerName,
        },
        summary: {
          patientName: name,
          firstName: name,
          surname: "",
          parentName: "",
          partnerName,
          coupleId: session.id,
          couplePartner: partner,
          completerName: name,
          email: slot.demographics?.email || "",
          age: slot.demographics?.age || "",
          overallLabel: "",
          domainProfiles: [],
          progressLabel: "In progress",
        },
      });
    });
  });
  return extras;
}

function getDashboardQuestionnaireItems() {
  mirrorOpenDraftsToAssessments();
  const items = readAssessments().map((item) => ({
    ...item,
    status: assessmentStatus(item),
  }));
  const all = collectCoupleIncompleteEntries(items).concat(items);
  all.sort((a, b) => {
    const rank = (item) => {
      const status = assessmentStatus(item);
      if (status === "assigned") return 0;
      if (status === "incomplete") return 1;
      return 2;
    };
    const statusOrder = rank(a) - rank(b);
    if (statusOrder !== 0) return statusOrder;
    const timeA = new Date(a.savedAt || a.completedAt || 0).getTime();
    const timeB = new Date(b.savedAt || b.completedAt || 0).getTime();
    return timeB - timeA;
  });
  return all;
}

function applyIncompleteAssessmentRecord(record) {
  if (!record || assessmentStatus(record) !== "incomplete") return false;
  const draft = record.draft || {
    version: SENSORY_DRAFT_VERSION,
    savedAt: record.savedAt,
    inviteMode: Boolean(record.inviteMode),
    patientResultsAccess: record.patientResultsAccess,
    step: typeof record.step === "number" ? record.step : findStepIndex("demographics"),
    language: record.language,
    respondent: record.respondent,
    lifeContext: record.lifeContext,
    coupleId: record.coupleId,
    couplePartner: record.couplePartner,
    consent: [],
    sharingConsent: record.sharingConsent,
    demographics: record.demographics,
    answers: record.answers,
    idealSaturday: record.idealSaturday,
    coupleWork: record.coupleWork,
    contactPreference: record.contactPreference,
    assessmentId: record.id,
  };
  applySensoryDraft(draft);
  state.inProgressAssessmentId = record.id;
  state.viewingArchivedId = null;
  state.archiveReadOnly = false;
  state.sampleReportPreview = false;
  return true;
}

function clearDraftsForAssessment(record) {
  if (!record?.id) return;
  listSensoryDraftEntries().forEach(({ key, draft }) => {
    const sameId = draft.assessmentId === record.id;
    const sameCouple =
      record.coupleId &&
      draft.coupleId === record.coupleId &&
      draft.couplePartner === record.couplePartner;
    if (!sameId && !sameCouple) return;
    try {
      localStorage.removeItem(key);
    } catch (_) {
      /* ignore */
    }
  });
}

function deleteCoupleProgressEntry(id) {
  const match = String(id || "").match(/^couple-progress-(.+)-([ab])$/);
  if (!match) return false;
  const session = getCoupleSession(match[1]);
  const partner = match[2];
  if (!session || !session.partners?.[partner]) return false;
  if (session.partners[partner].status === "in_progress") {
    session.partners[partner] = {
      ...emptyCouplePartnerSlot(session.partners[partner].label || ""),
    };
    saveCoupleSession(session);
  }
  return true;
}

function deleteAssessmentById(id) {
  if (!id) return false;
  const items = readAssessments();
  const record = items.find((item) => item.id === id) || null;
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  writeAssessments(next);
  clearDraftsForAssessment(record);
  if (state.viewingArchivedId === id) state.viewingArchivedId = null;
  if (state.inProgressAssessmentId === id) state.inProgressAssessmentId = null;
  return true;
}

function applyAssessmentRecord(record, options = {}) {
  if (!record) return false;
  const reportLength = normalizeReportLength(
    options.reportLength ||
      (options.viewMode === RESULTS_ACCESS.basic ? REPORT_LENGTH.summary : REPORT_LENGTH.full)
  );
  const viewMode = reportLength === REPORT_LENGTH.full ? RESULTS_ACCESS.full : RESULTS_ACCESS.basic;
  state.viewingArchivedId = record.id;
  state.inProgressAssessmentId = null;
  state.archiveReadOnly = true;
  state.reportViewMode = viewMode;
  state.reportLengthMode = reportLength;
  if (viewMode === RESULTS_ACCESS.basic) {
    applyPreferredShortReportExtras(reportLength);
  }
  state.sampleReportPreview = Boolean(record.isSample);
  state.completedAt = record.completedAt || null;
  state.language = LANGUAGES.includes(record.language) ? record.language : "en";
  document.documentElement.lang = state.language;
  state.respondent = RESPONDENT_TYPES.includes(record.respondent) ? record.respondent : "adult";
  state.lifeContext = normalizeRespondentLifeContext(state.respondent, record.lifeContext || null);
  state.demographics = {
    name: record.demographics?.name || "",
    age: record.demographics?.age || "",
    email: record.demographics?.email || "",
    occupation: record.demographics?.occupation || "",
    parentName: record.demographics?.parentName || "",
    partnerName: record.demographics?.partnerName || "",
  };
  state.answers = cloneAnswers(record.answers);
  state.idealSaturday = record.idealSaturday || "";
  state.coupleWork = normalizeCoupleWork(record.coupleWork);
  state.sharingConsent = { ...(record.sharingConsent || {}) };
  state.contactPreference = record.contactPreference || null;
  state.inviteMode = false;
  state.patientResultsAccess = viewMode;
  state.submissionStatus = null;
  state.submissionError = null;
  state.submissionErrorCode = null;
  state.submissionAttempted = true;
  state.showSensoryDiet = true;
  state.showWorkReport = Boolean(record.isSample) && canOfferSettingReportFor(record.respondent, record.lifeContext);
  state.workReportDeclined = false;
  state.schoolReportVisual = "balance";
  state.schoolReportNotesEnabled = false;
  resetSettingReportComposer();
  if (record.isSample && record.workReport) {
    state.workReport = { ...state.workReport, ...record.workReport };
  }
  state.error = null;
  state.view = "questionnaire";
  state.step = STEPS.length - 1;
  state.showIntroModal = false;
  return true;
}

function exitArchivedReport() {
  state.viewingArchivedId = null;
  state.archiveReadOnly = false;
  state.reportViewMode = null;
  state.reportLengthMode = null;
  state.sampleReportPreview = false;
  state.view = "dashboard";
  state.step = 0;
  state.respondent = null;
  state.lifeContext = null;
  state.consent = [];
  state.sharingConsent = { parents: false, school: false, treatingTeam: false };
  state.demographics = { name: "", age: "", email: "", occupation: "", parentName: "", partnerName: "" };
  state.completedAt = null;
  state.answers = emptyAnswers();
  state.idealSaturday = "";
  state.coupleWork = emptyCoupleWork();
  state.contactPreference = null;
  state.showSensoryDiet = false;
  state.showWorkReport = false;
  state.workReportDeclined = false;
  state.patientResultsAccess = RESULTS_ACCESS.none;
  state.submissionStatus = null;
  state.submissionError = null;
  state.submissionErrorCode = null;
  state.submissionAttempted = false;
  resetSettingReportComposer();
  state.error = null;
}

function isSampleReportPreviewEnabled() {
  return Boolean(typeof APP_CONFIG !== "undefined" && APP_CONFIG.devAllowSampleReport);
}

function canOfferSettingReportFor(respondent, lifeContext) {
  return (
    (respondent === "adult" && lifeContext === "work") ||
    (respondent === "teen" && (lifeContext === "school" || lifeContext === "homeSchool"))
  );
}

/** Teens always use a combined home + school setting. */
function normalizeRespondentLifeContext(respondent, lifeContext) {
  if (respondent === "parent" || respondent === "couple") return null;
  if (respondent === "teen") {
    if (lifeContext === "home" || lifeContext === "school" || lifeContext === "homeSchool") {
      return lifeContext;
    }
    return "homeSchool";
  }
  if (respondent === "adult") {
    return lifeContext === "work" || lifeContext === "home" ? lifeContext : null;
  }
  return lifeContext || null;
}

/**
 * Deterministic sample yes/no answers so admins can preview the full report
 * without filling the questionnaire while building the app.
 */
function buildSampleAnswers(respondent = "adult", biasOverrides = null) {
  const domains = getSensoryDomains("en", respondent);
  /** Bias each sense so the printed profile shows a mix of patterns. */
  const biasByDomain = {
    auditory: "sensitive",
    tactile: "mixed",
    movement: "seeking",
    visual: "sensitive",
    smellTaste: "seeking",
    everyday: "sensitive",
    ...(biasOverrides && typeof biasOverrides === "object" ? biasOverrides : {}),
  };

  return Object.fromEntries(
    domains.map((domain) => {
      const bias = biasByDomain[domain.id] || "mixed";
      const answers = domain.questions.map((q, index) => {
        if (bias === "sensitive") {
          if (q.type === "sensitive") return index % 5 !== 4;
          if (q.type === "seeking") return index % 3 === 0;
          return index % 2 === 0;
        }
        if (bias === "seeking") {
          if (q.type === "seeking") return index % 5 !== 4;
          if (q.type === "sensitive") return index % 3 === 0;
          return index % 2 === 1;
        }
        // mixed
        if (q.type === "sensitive") return index % 2 === 0;
        if (q.type === "seeking") return index % 2 === 1;
        return true;
      });
      return [domain.id, answers];
    })
  );
}

function normalizeSamplePreviewOptions(options = {}) {
  const respondent = RESPONDENT_TYPES.includes(options.respondent)
    ? options.respondent
    : "adult";
  let lifeContext = options.lifeContext || null;
  if (respondent === "adult") {
    lifeContext = ["work", "home", "school"].includes(lifeContext) ? lifeContext : "work";
  } else if (respondent === "teen") {
    lifeContext = "homeSchool";
  } else {
    lifeContext = null;
  }
  return { respondent, lifeContext };
}

function buildSampleAssessmentRecord(options = {}) {
  const { respondent, lifeContext } = normalizeSamplePreviewOptions(options);
  const answers = buildSampleAnswers(respondent);
  const demographics =
    respondent === "parent"
      ? {
          name: "Sam Alberts",
          age: "9",
          email: "parent.sample@example.com",
          occupation: "Grade 3",
          parentName: "Jordan Alberts",
          partnerName: "",
        }
      : respondent === "couple"
        ? {
            name: "Taylor Ndlovu",
            age: "34",
            email: "couple.sample@example.com",
            occupation: "",
            parentName: "",
            partnerName: "Jordan Ndlovu",
          }
      : respondent === "teen"
        ? {
            name: "Alex Molefe",
            age: "15",
            email: "teen.sample@example.com",
            occupation: "Grade 10",
            parentName: "",
            partnerName: "",
          }
        : {
            name: "Taylor Ndlovu",
            age: "34",
            email: "adult.sample@example.com",
            occupation: lifeContext === "work" ? "Project coordinator" : "Adult",
            parentName: "",
            partnerName: "",
          };

  const sharingConsent = createEmptySharingConsent("en", respondent, lifeContext);
  Object.keys(sharingConsent).forEach((key, index) => {
    sharingConsent[key] = index === 0;
  });

  const scores = scoreAllDomains(answers, getSensoryDomains("en", respondent), "en", respondent);
  const metrics = getProfileMetrics(scores);
  const workReport =
    respondent === "adult" && lifeContext === "work"
      ? {
          name: demographics.name,
          jobTitle: demographics.occupation,
          reasonForReferral: "Difficulty concentrating in an open-plan office; fatigue after meetings",
          additionalNotes: "Sample preview data for layout and print checks.",
        }
      : respondent === "teen" && (lifeContext === "school" || lifeContext === "homeSchool")
        ? {
            name: demographics.name,
            jobTitle: demographics.occupation,
            reasonForReferral: "Overwhelm after noisy break times; difficulty focusing in class",
            additionalNotes: "Sample preview data for school report layout.",
          }
        : { name: "", jobTitle: "", reasonForReferral: "", additionalNotes: "" };

  return {
    id: `sample-preview-${respondent}-${lifeContext || "home"}`,
    version: ASSESSMENTS_VERSION,
    isSample: true,
    completedAt: new Date().toISOString(),
    savedAt: new Date().toISOString(),
    respondent,
    language: "en",
    lifeContext,
    demographics,
    answers,
    idealSaturday:
      respondent === "teen"
        ? "Sleep in, then mountain biking with friends, loud music in the afternoon, and a chill evening with a series and snacks — no rush, just what feels good."
        : respondent === "parent"
          ? "A slow morning at home, then the park and playground, a favourite lunch, swimming or messy play, and a calm evening routine with soft lights and familiar stories."
          : "A slow coffee outdoors, a long trail walk, cooking something fragrant, an afternoon of focused creative work with music, and an unhurried evening with people I enjoy.",
    sharingConsent,
    contactPreference: "yes",
    inviteMode: false,
    patientResultsAccess: RESULTS_ACCESS.full,
    patientUserId: null,
    workReport,
    summary: buildAssessmentSummary(scores, metrics),
  };
}

/** Open a full sample results report (no email, not saved to the patient register). */
function openSampleReportPreview(options = {}) {
  if (!isSampleReportPreviewEnabled()) return false;
  if (options.coupleMerge || options.respondent === "couple-merge") {
    return openSampleCoupleMergePreview();
  }
  const record = buildSampleAssessmentRecord(options);
  applyAssessmentRecord(record);
  // Ensure work/school letter section is ready for print checks.
  if (canOfferSettingReport()) {
    state.showWorkReport = true;
    state.workReportDeclined = false;
    ensureWorkReportDefaults();
  }
  return true;
}

function buildSampleCouplePartnerSlot(partner, profile) {
  const answers = buildSampleAnswers("couple", profile.biasOverrides);
  const scores = scoreAllDomains(answers, getSensoryDomains("en", "couple"), "en", "couple");
  const metrics = getProfileMetrics(scores);
  const name = profile.name;
  const partnerName = profile.partnerName;
  return {
    ...emptyCouplePartnerSlot(name),
    label: name,
    status: "complete",
    assessmentId: `sample-couple-${partner}`,
    completedAt: new Date().toISOString(),
    demographics: {
      name,
      age: profile.age,
      email: profile.email,
      occupation: profile.occupation || "",
      parentName: "",
      partnerName,
    },
    answers,
    idealSaturday: "",
    language: "en",
    summary: {
      overallLabel: profileLabelPlain(metrics?.meta) || "",
      lean: metrics?.lean || "",
      balance: typeof metrics?.balance === "number" ? metrics.balance : null,
      leanHeadline: metrics?.leanHeadline || "",
      domainProfiles: getScoreRows(scores).map((row) => ({
        id: row.id,
        title: row.title,
        short: row.profileShort || row.thresholdLabel || "",
      })),
    },
    coupleWork: normalizeCoupleWork(profile.coupleWork),
  };
}

/** Build a throwaway couple session with both partners complete (for merge layout edits). */
function buildSampleCoupleMergeSession() {
  const nameA = "Taylor Ndlovu";
  const nameB = "Jordan Ndlovu";
  const session = createCoupleSession({
    id: "sample-couple-merge",
    partnerAName: nameA,
    partnerBName: nameB,
  });
  session.partners.a = buildSampleCouplePartnerSlot("a", {
    name: nameA,
    partnerName: nameB,
    age: "34",
    email: "taylor.sample@example.com",
    occupation: "Project coordinator",
    biasOverrides: {
      auditory: "sensitive",
      tactile: "sensitive",
      movement: "seeking",
      visual: "sensitive",
      smellTaste: "mixed",
      everyday: "sensitive",
    },
    coupleWork: {
      employment: "works",
      workLocation: "office",
      workWith: "people",
      workingHours: "08:00–16:30",
      endOfDay: ["sitRelax", "alone"],
      rechargeAfterWork: ["relaxHome"],
      rechargingSaturday: "A slow coffee, a quiet walk, then cooking together without rushing.",
      isParent: "yes",
    },
  });
  session.partners.b = buildSampleCouplePartnerSlot("b", {
    name: nameB,
    partnerName: nameA,
    age: "36",
    email: "jordan.sample@example.com",
    occupation: "Teacher",
    biasOverrides: {
      auditory: "seeking",
      tactile: "seeking",
      movement: "sensitive",
      visual: "seeking",
      smellTaste: "seeking",
      everyday: "mixed",
    },
    coupleWork: {
      employment: "works",
      workLocation: "both",
      workWith: "screensAndPeople",
      workingHours: "07:30–15:00",
      endOfDay: ["getOut", "withPeople"],
      rechargeAfterWork: ["activeOutdoors", "othersOutside"],
      rechargingSaturday: "Gym, then friends outdoors, loud music and a late dinner.",
      isParent: "yes",
    },
  });
  return session;
}

/** Open the combined couple profile with sample partners (not saved to the patient register). */
function openSampleCoupleMergePreview() {
  if (!isSampleReportPreviewEnabled()) return false;
  // Couple merge preview is local layout/copy work — allow without clinician unlock
  // while sample reports are enabled, so edits do not require signing in first.
  const session = buildSampleCoupleMergeSession();
  saveCoupleSession(session);
  state.sampleReportPreview = true;
  state.archiveReadOnly = true;
  state.viewingArchivedId = null;
  state.coupleHubNotice = null;
  openCoupleHub({ coupleId: session.id, showMerge: true });
  return true;
}

function renderSampleReportPreviewControls() {
  if (!isSampleReportPreviewEnabled()) return "";
  return `
    <div class="sample-preview-controls" role="group" aria-label="Sample report preview">
      <p class="sample-preview-controls__label">Skip questionnaire · sample report</p>
      <div class="sample-preview-controls__actions">
        <button type="button" class="btn btn-secondary btn--compact" data-action="preview-sample-report" data-sample-respondent="adult" data-sample-context="work">Adult · work</button>
        <button type="button" class="btn btn-secondary btn--compact" data-action="preview-sample-report" data-sample-respondent="adult" data-sample-context="home">Adult · home</button>
        <button type="button" class="btn btn-secondary btn--compact" data-action="preview-sample-report" data-sample-respondent="teen" data-sample-context="homeSchool">Teen · home &amp; school</button>
        <button type="button" class="btn btn-secondary btn--compact" data-action="preview-sample-report" data-sample-respondent="parent">Parent / child</button>
        <button type="button" class="btn btn-secondary btn--compact" data-action="preview-sample-report" data-sample-respondent="couple">Couple · one partner</button>
        <button type="button" class="btn btn-secondary btn--compact" data-action="preview-sample-report" data-sample-respondent="couple-merge">Couple · combined</button>
      </div>
    </div>
  `;
}

function renderSampleReportBanner() {
  if (!state.sampleReportPreview) return "";
  return `
    <div class="sample-preview-banner no-print" role="status">
      <strong>Sample preview</strong>
      <span>Generated answers for layout checks — not a real patient assessment, and nothing is emailed.</span>
      <button type="button" class="btn btn-secondary btn--compact" data-action="back-dashboard">Back to dashboard</button>
    </div>
  `;
}

/**
 * After invite auth: open the homepage so patients can read the practice info
 * first, then start from the bottom. Resume a saved draft into the questionnaire.
 */
function continueInviteSession() {
  state.error = null;
  state.authNotice = null;
  const assigned = currentAssignedPatient();
  if (assigned) applyPatientAssignment(assigned);
  const draft = readSensoryDraft();
  if (draft) {
    applySensoryDraft(draft);
    return;
  }
  if (assigned?.assessmentId) {
    const existing = readAssessments().find((item) => item.id === assigned.assessmentId);
    if (existing && assessmentStatus(existing) === "incomplete" && existing.draft) {
      applyIncompleteAssessmentRecord(existing);
      return;
    }
  }
  state.sensoryArea = null;
  state.view = "home";
  state.step = 0;
  state.showIntroModal = false;
}

function handleLogout() {
  if (typeof Auth !== "undefined") Auth.logoutUser();
  state.clinicianUnlocked = false;
  state.viewingArchivedId = null;
  state.archiveReadOnly = false;
  state.reportViewMode = null;
  state.sampleReportPreview = false;
  sessionStorage.removeItem(CLINICIAN_SESSION_KEY);
  state.step = 0;
  state.settingsNotice = null;
  state.dashboardNotice = null;
  state.assignedRespondent = null;
  state.assignedLifeContext = null;
  state.pendingInviteToken = isPatientInvite() ? state.pendingInviteToken : null;
  if (isPatientInvite()) {
    beginInviteAccountGate();
    state.authNotice = "Sign in with the account your therapist created to continue.";
  } else {
    state.view = "home";
    state.authNotice = "Signed out.";
  }
}

function beginInviteAccountGate() {
  resetAuthForm("patient");
  const assigned = lookupAssignedPatientByToken(state.pendingInviteToken);
  if (assigned) {
    state.authForm.email = assigned.email || "";
    state.authForm.name = assignedPatientFullName(assigned);
  }
  state.view = "login";
  state.authMode = "login";
  state.authError = null;
  if (!state.authNotice) {
    state.authNotice = assigned
      ? "Your therapist created an account for you. Sign in with the email and password they sent."
      : "Sign in with the account your therapist created to begin your sensory screening.";
  }
}

function normalizeResultsAccess(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw === "0" || raw === "none" || raw === "false" || raw === "email") {
    return RESULTS_ACCESS.none;
  }
  if (raw === "summary" || raw === "basic" || raw === "partial" || raw === "short" || raw === "short-report") {
    return RESULTS_ACCESS.basic;
  }
  if (raw === "1" || raw === "full" || raw === "true" || raw === "all") {
    return RESULTS_ACCESS.full;
  }
  return RESULTS_ACCESS.none;
}

function getPatientResultsAccess() {
  // Dashboard reopen: therapist chooses full packet or patient short-report preview.
  if (state.archiveReadOnly) {
    if (state.reportViewMode === RESULTS_ACCESS.basic) {
      return RESULTS_ACCESS.basic;
    }
    return RESULTS_ACCESS.full;
  }
  // Invite links carry the clinician-chosen access level in ?results=
  if (isPatientInvite()) {
    return normalizeResultsAccess(state.patientResultsAccess);
  }
  // Full on-screen report (including printable work/school letters) is for
  // therapists previewing via clinician tools.
  if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
    return RESULTS_ACCESS.full;
  }
  if (state.clinicianUnlocked) {
    return RESULTS_ACCESS.full;
  }
  return RESULTS_ACCESS.none;
}

function readShortReportSections() {
  if (isPatientInvite()) {
    if (state.patientReportKind === REPORT_VISIBILITY.short) {
      return { overallPattern: true, domainGlance: true, trailCharacter: true };
    }
    return { overallPattern: false, domainGlance: false, trailCharacter: false };
  }
  try {
    const raw = localStorage.getItem(SHORT_REPORT_PREF_KEY);
    if (!raw) {
      return shortReportExtrasForLength(readTherapistPrefs().reportLength);
    }
    const parsed = JSON.parse(raw);
    return {
      overallPattern: Boolean(parsed?.overallPattern),
      domainGlance: Boolean(parsed?.domainGlance),
      trailCharacter: Boolean(parsed?.trailCharacter),
    };
  } catch {
    return { ...DEFAULT_SHORT_REPORT_SECTIONS };
  }
}

function writeShortReportSections(sections) {
  const next = {
    overallPattern: Boolean(sections?.overallPattern),
    domainGlance: Boolean(sections?.domainGlance),
    trailCharacter: Boolean(sections?.trailCharacter),
  };
  try {
    localStorage.setItem(SHORT_REPORT_PREF_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
  return next;
}

function defaultTherapistPrefs() {
  return {
    reportLength: REPORT_LENGTH.full,
    reportVisibility: REPORT_VISIBILITY.none,
    notifications: {
      completed: true,
      incomplete: true,
      expiring: true,
      downloaded: true,
      followUp: true,
    },
  };
}

function therapistPrefsStorageKey() {
  const user = currentAuthUser();
  return user?.id ? `${THERAPIST_PREFS_KEY}:${user.id}` : THERAPIST_PREFS_KEY;
}

function normalizeReportLength(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "summary" || raw === "basic" || raw === "short-summary") return REPORT_LENGTH.summary;
  if (raw === "short" || raw === "short-report") return REPORT_LENGTH.short;
  return REPORT_LENGTH.full;
}

function normalizeReportVisibility(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "summary" || raw === "basic") return REPORT_VISIBILITY.summary;
  if (raw === "short" || raw === "short-report") return REPORT_VISIBILITY.short;
  if (raw === "full" || raw === "1" || raw === "true") return REPORT_VISIBILITY.full;
  return REPORT_VISIBILITY.none;
}

function visibilityToResultsAccess(visibility) {
  if (visibility === REPORT_VISIBILITY.full) return RESULTS_ACCESS.full;
  if (visibility === REPORT_VISIBILITY.summary || visibility === REPORT_VISIBILITY.short) {
    return RESULTS_ACCESS.basic;
  }
  return RESULTS_ACCESS.none;
}

function shortReportExtrasForLength(length) {
  if (length === REPORT_LENGTH.short || length === REPORT_VISIBILITY.short) {
    return { overallPattern: true, domainGlance: true, trailCharacter: true };
  }
  return { overallPattern: false, domainGlance: false, trailCharacter: false };
}

function readTherapistPrefs() {
  const defaults = defaultTherapistPrefs();
  try {
    const raw = localStorage.getItem(therapistPrefsStorageKey());
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      reportLength: normalizeReportLength(parsed.reportLength || defaults.reportLength),
      reportVisibility: normalizeReportVisibility(
        parsed.reportVisibility ?? defaults.reportVisibility
      ),
      notifications: { ...defaults.notifications, ...(parsed.notifications || {}) },
    };
  } catch (_) {
    return defaults;
  }
}

function writeTherapistPrefs(partial) {
  const current = readTherapistPrefs();
  const next = {
    ...current,
    ...partial,
    notifications: { ...current.notifications, ...(partial.notifications || {}) },
  };
  next.reportLength = normalizeReportLength(next.reportLength);
  next.reportVisibility = normalizeReportVisibility(next.reportVisibility);
  try {
    localStorage.setItem(therapistPrefsStorageKey(), JSON.stringify(next));
  } catch (_) {
    /* ignore */
  }
  if (Object.prototype.hasOwnProperty.call(partial, "reportVisibility")) {
    syncInviteDraftFromVisibility(next.reportVisibility);
  }
  if (Object.prototype.hasOwnProperty.call(partial, "reportLength")) {
    applyPreferredShortReportExtras(next.reportLength);
  }
  return next;
}

function wantsNotification(type) {
  return readTherapistPrefs().notifications?.[type] !== false;
}

function draftVisibilityFromStored(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "basic" || raw === "partial") return REPORT_VISIBILITY.summary;
  return normalizeReportVisibility(raw);
}

function syncInviteDraftFromVisibility(visibility) {
  state.clinicianDraftVisibility = normalizeReportVisibility(visibility);
  state.clinicianDraftResultsAccess = visibilityToResultsAccess(state.clinicianDraftVisibility);
  try {
    sessionStorage.setItem(CLINICIAN_PREF_KEY, state.clinicianDraftVisibility);
  } catch (_) {
    /* ignore */
  }
}

function initTherapistPrefs() {
  const prefs = readTherapistPrefs();
  let saved = null;
  try {
    saved = sessionStorage.getItem(CLINICIAN_PREF_KEY);
  } catch (_) {
    saved = null;
  }
  syncInviteDraftFromVisibility(saved ? draftVisibilityFromStored(saved) : prefs.reportVisibility);
}

function applyPreferredShortReportExtras(kind) {
  writeShortReportSections(shortReportExtrasForLength(kind));
}

function isShortReportDashboardPreview() {
  return (
    Boolean(state.archiveReadOnly) &&
    state.reportViewMode === RESULTS_ACCESS.basic &&
    canAccessTherapistDashboard()
  );
}

function shouldShowResultsToPatient() {
  return getPatientResultsAccess() !== RESULTS_ACCESS.none;
}

function canViewFullResults() {
  return getPatientResultsAccess() === RESULTS_ACCESS.full;
}

function resultsAccessLabel(access = getPatientResultsAccess()) {
  if (access === RESULTS_ACCESS.full) return "full report";
  if (access === RESULTS_ACCESS.basic) return "brief report only";
  return "none (thank-you only)";
}

function inviteBannerText(copy = currentUi()) {
  const access = getPatientResultsAccess();
  if (access === RESULTS_ACCESS.full) {
    return copy.inviteBannerFull || copy.inviteBanner;
  }
  if (access === RESULTS_ACCESS.basic) {
    return copy.inviteBannerBasic || copy.inviteBanner;
  }
  return copy.inviteBanner;
}

function shouldEmailResultsToClinician() {
  if (state.archiveReadOnly) return false;
  if (state.sampleReportPreview) return false;
  if (DELIVERY_PROVIDER === "none") return false;
  if (!wantsNotification("completed")) return false;
  // Couple pathway emails once via the combined-report submit (last partner).
  if (state.respondent === "couple") return false;
  // Email the detailed sensory report for every finished adult / teen / parent screening
  // (invite link or public home path). Pain pathway is separate and not emailed here.
  return Boolean(state.respondent) && RESPONDENT_TYPES.includes(state.respondent);
}

/** Name of the person who completed the screening (parent name for parent pathway). */
function assessmentCompleterName() {
  const demo = state.demographics || {};
  if (state.respondent === "parent") {
    return String(demo.parentName || demo.name || "").trim() || "Patient";
  }
  return String(demo.name || "").trim() || "Patient";
}

function clearInviteSession() {
  state.inviteMode = false;
  state.patientResultsAccess = RESULTS_ACCESS.none;
  state.patientReportKind = null;
  state.submissionStatus = null;
  state.submissionError = null;
  state.submissionErrorCode = null;
  state.submissionAttempted = false;
  const user = currentAuthUser();
  if (user?.role === "patient" && user.questionnaireType) {
    applyPatientAssignment(user);
    return;
  }
  state.assignedRespondent = null;
  state.assignedLifeContext = null;
  state.pendingInviteToken = null;
}

function getClinicianBaseUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "") || window.location.href.split("?")[0];
}

function buildPatientInviteUrl(access) {
  const url = new URL(getClinicianBaseUrl());
  url.searchParams.set("invite", "1");
  const visibility = draftVisibilityFromStored(
    access || state.clinicianDraftVisibility || state.clinicianDraftResultsAccess
  );
  if (visibility === REPORT_VISIBILITY.full) {
    url.searchParams.set("results", "full");
  } else if (visibility === REPORT_VISIBILITY.short) {
    url.searchParams.set("results", "short");
  } else if (visibility === REPORT_VISIBILITY.summary) {
    url.searchParams.set("results", "summary");
  } else {
    url.searchParams.set("results", "0");
  }
  return url.toString();
}

function readInviteFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("settings") === "1" || params.get("admin") === "1") {
    state.view = "settings";
    return;
  }
  if (params.get("preview") === "report" || params.get("sample") === "report" || params.get("preview") === "couple-merge") {
    state.view = "dashboard";
    state.clinicianUnlocked = sessionStorage.getItem(CLINICIAN_SESSION_KEY) === "1";
    if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
      state.clinicianUnlocked = true;
    }
    if (params.get("preview") === "couple-merge") {
      state._openSamplePreviewOnBoot = { coupleMerge: true };
    } else {
      state._openSamplePreviewOnBoot = {
        respondent: params.get("respondent") || params.get("pathway") || "adult",
        lifeContext: params.get("context") || params.get("lifeContext") || null,
      };
    }
    return;
  }
  if (params.get("dashboard") === "1" || params.get("patients") === "1") {
    state.view = "dashboard";
    state.clinicianUnlocked = sessionStorage.getItem(CLINICIAN_SESSION_KEY) === "1";
    if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
      state.clinicianUnlocked = true;
    }
    return;
  }
  if (params.get("login") === "1") {
    state.view = "login";
    return;
  }
  if (params.get("forgot") === "1") {
    state.view = "forgot";
    return;
  }
  if (params.get("reset")) {
    state.view = "reset";
    state.resetToken = String(params.get("reset") || "").trim();
    return;
  }
  if (params.get("signup") === "1") {
    state.view = "signup";
    return;
  }
  if (params.get("clinician") === "1" || params.get("share") === "1") {
    state.view = "clinician";
    state.clinicianUnlocked = sessionStorage.getItem(CLINICIAN_SESSION_KEY) === "1";
    if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
      state.clinicianUnlocked = true;
    }
    const savedPref = sessionStorage.getItem(CLINICIAN_PREF_KEY);
    if (savedPref) {
      syncInviteDraftFromVisibility(draftVisibilityFromStored(savedPref));
    } else {
      initTherapistPrefs();
    }
    return;
  }

  if (params.get("invite") === "1") {
    state.inviteMode = true;
    const patientToken = String(params.get("patient") || "").trim();
    if (patientToken) state.pendingInviteToken = patientToken;
    // Therapist must opt the patient into a report. Missing/unknown → no access.
    const rawResults = params.has("results") ? params.get("results") : "none";
    const visibility = draftVisibilityFromStored(rawResults);
    state.patientReportKind = visibility;
    state.patientResultsAccess = visibilityToResultsAccess(visibility);
    const assigned = lookupAssignedPatientByToken(state.pendingInviteToken);
    if (assigned) applyPatientAssignment(assigned);
    if (inviteNeedsAccount()) {
      beginInviteAccountGate();
    } else {
      continueInviteSession();
    }
    return;
  }

  const coupleId = params.get("couple");
  if (coupleId) {
    const partner = String(params.get("partner") || "").toLowerCase();
    const aName = params.get("aName") || "";
    const bName = params.get("bName") || "";
    let session = getCoupleSession(coupleId);
    if (!session) {
      session = createCoupleSession({ id: coupleId, partnerAName: aName, partnerBName: bName });
    } else {
      if (aName && !session.partners.a.label) session.partners.a.label = aName;
      if (bName && !session.partners.b.label) session.partners.b.label = bName;
    }
    saveCoupleSession(session);
    state.coupleId = coupleId;
    state.respondent = "couple";
    state.view = "questionnaire";
    if (COUPLE_PARTNERS.includes(partner)) {
      startCouplePartnerQuestionnaire(partner);
    } else {
      openCoupleHub({ coupleId });
    }
  }
}

function sensoryDraftStorageKey() {
  if (isCouplePathway() && state.coupleId && state.couplePartner) {
    return `${SENSORY_DRAFT_KEY}-couple-${state.coupleId}-${state.couplePartner}`;
  }
  return isPatientInvite() ? `${SENSORY_DRAFT_KEY}-invite` : SENSORY_DRAFT_KEY;
}

function isSensoryDraftEligible() {
  return (
    state.view === "questionnaire" &&
    state.step >= 1 &&
    state.step < STEPS.length - 1 &&
    STEPS[state.step]?.type !== "results"
  );
}

function emptyAnswers() {
  return Object.fromEntries(SENSORY_DOMAIN_IDS.map((id) => [id, []]));
}

function cloneAnswers(source) {
  return Object.fromEntries(
    SENSORY_DOMAIN_IDS.map((id) => {
      const incoming = Array.isArray(source?.[id]) ? source[id] : [];
      const restored = [];
      incoming.forEach((value, index) => {
        if (typeof value === "boolean") restored[index] = value;
      });
      return [id, restored];
    })
  );
}

function buildSensoryDraft() {
  return {
    version: SENSORY_DRAFT_VERSION,
    savedAt: new Date().toISOString(),
    assessmentId: state.inProgressAssessmentId || null,
    inviteMode: Boolean(state.inviteMode),
    patientResultsAccess: normalizeResultsAccess(state.patientResultsAccess),
    step: state.step,
    language: state.language,
    respondent: state.respondent,
    lifeContext: state.lifeContext,
    coupleId: state.coupleId || null,
    couplePartner: state.couplePartner || null,
    consent: Array.isArray(state.consent) ? state.consent.map(Boolean) : [],
    sharingConsent: { ...(state.sharingConsent || {}) },
    demographics: {
      name: state.demographics?.name || "",
      age: state.demographics?.age || "",
      email: state.demographics?.email || "",
      occupation: state.demographics?.occupation || "",
      parentName: state.demographics?.parentName || "",
      partnerName: state.demographics?.partnerName || "",
    },
    answers: cloneAnswers(state.answers),
    idealSaturday: state.idealSaturday || "",
    coupleWork: normalizeCoupleWork(state.coupleWork),
    sensoryArea: state.sensoryArea,
    contactPreference: state.contactPreference,
  };
}

function saveSensoryDraft() {
  if (!isSensoryDraftEligible()) return;
  if (shouldPersistIncompleteProgress()) {
    state.inProgressAssessmentId = resolveInProgressAssessmentId();
  }
  const draft = buildSensoryDraft();
  try {
    localStorage.setItem(sensoryDraftStorageKey(), JSON.stringify(draft));
  } catch (_) {
    /* Private mode / full storage — ignore */
  }
  if (shouldPersistIncompleteProgress()) {
    persistIncompleteAssessmentFromDraft(draft);
  }
}

function clearSensoryDraft() {
  try {
    localStorage.removeItem(sensoryDraftStorageKey());
  } catch (_) {
    /* ignore */
  }
}

function readSensoryDraft() {
  try {
    const raw = localStorage.getItem(sensoryDraftStorageKey());
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft || draft.version !== SENSORY_DRAFT_VERSION) return null;
    if (Boolean(draft.inviteMode) !== isPatientInvite()) return null;
    if (typeof draft.step !== "number" || draft.step < 1 || draft.step >= STEPS.length - 1) {
      return null;
    }
    if (draft.respondent && !RESPONDENT_TYPES.includes(draft.respondent)) return null;
    if (draft.language && !LANGUAGES.includes(draft.language)) return null;
    return draft;
  } catch (_) {
    return null;
  }
}

function hasSensoryDraft() {
  return Boolean(readSensoryDraft());
}

function formatDraftSavedAt(iso, language = "en") {
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(language === "af" ? "af-ZA" : "en-ZA", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch (_) {
    return "";
  }
}

function applySensoryDraft(draft) {
  state.view = "questionnaire";
  state.step = draft.step;
  state.showIntroModal = false;
  state.language = LANGUAGES.includes(draft.language) ? draft.language : "en";
  document.documentElement.lang = state.language;
  state.respondent = RESPONDENT_TYPES.includes(draft.respondent) ? draft.respondent : null;
  state.lifeContext = hasLockedLifeContext()
    ? state.assignedLifeContext
    : normalizeRespondentLifeContext(state.respondent, draft.lifeContext || null);
  state.coupleId = draft.coupleId || null;
  state.couplePartner = COUPLE_PARTNERS.includes(draft.couplePartner) ? draft.couplePartner : null;
  // Teens no longer use the home/school choice step — skip it if a draft landed there.
  if (state.respondent === "teen" && STEPS[state.step]?.type === "context") {
    state.step += 1;
  }
  if (state.respondent === "couple" && STEPS[state.step]?.type === "coupleHub" && state.couplePartner) {
    state.step = findStepIndex("consent");
  }
  state.consent = Array.isArray(draft.consent) ? draft.consent.map(Boolean) : [];
  if (state.respondent) {
    const emptySharing = createEmptySharingConsent(
      state.language,
      state.respondent,
      state.lifeContext
    );
    state.sharingConsent = Object.fromEntries(
      Object.keys(emptySharing).map((id) => [id, Boolean(draft.sharingConsent?.[id])])
    );
  } else {
    state.sharingConsent = {
      parents: Boolean(draft.sharingConsent?.parents),
      school: Boolean(draft.sharingConsent?.school),
      treatingTeam: Boolean(draft.sharingConsent?.treatingTeam),
    };
  }
  state.demographics = {
    name: draft.demographics?.name || "",
    age: draft.demographics?.age || "",
    email: draft.demographics?.email || "",
    occupation: draft.demographics?.occupation || "",
    parentName: draft.demographics?.parentName || "",
    partnerName: draft.demographics?.partnerName || "",
  };
  state.answers = cloneAnswers(draft.answers);
  state.idealSaturday = draft.idealSaturday || "";
  state.coupleWork = normalizeCoupleWork(draft.coupleWork);
  state.sensoryArea = draft.sensoryArea || null;
  state.contactPreference = draft.contactPreference || null;
  state.inProgressAssessmentId = draft.assessmentId || state.inProgressAssessmentId || null;
  if (isPatientInvite() && draft.patientResultsAccess) {
    state.patientResultsAccess = normalizeResultsAccess(draft.patientResultsAccess);
  }
  state.completedAt = null;
  state.showSensoryDiet = false;
  state.showWorkReport = false;
  state.workReportDeclined = false;
  state.workReport = {
    name: "",
    jobTitle: "",
    reasonForReferral: state.workReport?.reasonForReferral || "",
    additionalNotes: "",
  };
  state.schoolReportVisual = "balance";
  state.schoolReportNotesEnabled = false;
  resetSettingReportComposer();
  state.submissionStatus = null;
  state.submissionError = null;
  state.submissionErrorCode = null;
  state.submissionAttempted = false;
  state.error = null;
}

function resetSensoryQuestionnaireProgress() {
  state.view = "questionnaire";
  state.step = 1;
  state.showIntroModal = true;
  state.respondent = null;
  state.lifeContext = null;
  state.coupleId = null;
  state.couplePartner = null;
  state.coupleShowMerge = false;
  state.coupleHubNotice = null;
  state.coupleImportText = "";
  state.consent = [];
  state.sharingConsent = { parents: false, school: false, treatingTeam: false };
  state.demographics = { name: "", age: "", email: "", occupation: "", parentName: "", partnerName: "" };
  state.completedAt = null;
  state.answers = emptyAnswers();
  state.idealSaturday = "";
  state.coupleWork = emptyCoupleWork();
  state.contactPreference = null;
  state.showSensoryDiet = false;
  state.showWorkReport = false;
  state.workReportDeclined = false;
  state.workReport = { name: "", jobTitle: "", reasonForReferral: "", additionalNotes: "" };
  state.schoolReportVisual = "balance";
  state.schoolReportNotesEnabled = false;
  resetSettingReportComposer();
  state.submissionStatus = null;
  state.submissionError = null;
  state.submissionErrorCode = null;
  state.submissionAttempted = false;
  state.viewingArchivedId = null;
  state.inProgressAssessmentId = null;
  state.archiveReadOnly = false;
  state.reportViewMode = null;
  state.error = null;
}

function renderSensoryResumePanel() {
  const draft = readSensoryDraft();
  if (!draft) return "";
  const lang = draft.language === "af" ? "af" : "en";
  const copy = QUESTIONNAIRE_UI[lang];
  const savedAt = formatDraftSavedAt(draft.savedAt, lang);
  const savedLine = savedAt
    ? copy.draftSavedAt.replace("{when}", savedAt)
    : copy.draftSavedGeneric;

  return `
    <div class="sensory-resume" role="status">
      <p class="sensory-resume__title">${escapeHtml(copy.draftResumeTitle)}</p>
      <p class="sensory-resume__note">${escapeHtml(savedLine)}</p>
      <div class="sensory-resume__actions">
        <button type="button" class="btn btn-primary sensory-flow__cta-btn" data-action="resume-questionnaire">
          ${escapeHtml(copy.draftContinue)}
        </button>
        <button type="button" class="btn btn-secondary" data-action="start-questionnaire">
          ${escapeHtml(copy.draftStartOver)}
        </button>
      </div>
      <p class="sensory-resume__device">${escapeHtml(copy.draftDeviceNote)}</p>
    </div>
  `;
}

function profileLabelPlain(meta) {
  if (!meta) return "";
  return meta.label || meta.short || String(meta);
}

function buildResultsReport() {
  const scores = scoreAllDomains(
    state.answers,
    currentDomains(),
    state.language,
    state.respondent || "adult"
  );
  const metrics = getProfileMetrics(scores);
  const demo = state.demographics;
  const completerName = assessmentCompleterName();
  const context = lifeContextLabel() || "—";
  const respondent =
    state.respondent === "parent"
      ? "Parent (about child)"
      : state.respondent === "teen"
        ? "Teen"
        : state.respondent === "couple"
          ? `Couple · ${state.couplePartner === "b" ? "Partner 2" : "Partner 1"}`
          : "Adult";

  const detailRows = getScoreRows(scores);
  const domainDetailLines = detailRows
    .map((row) => {
      const score = scores.find((s) => s.id === row.id);
      const counts = score
        ? ` (sensitive/avoiding ${score.sensitive}, neutral ${score.neutral ?? 0}, seeking ${score.seeking}, of ${score.scored})`
        : "";
      return [
        `${row.title}: ${row.profileShort || row.thresholdLabel}${counts}`,
        row.thresholdFull ? `  Threshold: ${row.thresholdFull}` : null,
        row.implication ? `  Implication: ${row.implication}` : null,
        row.recommendation ? `  Recommendation: ${row.recommendation}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const sharingItems = getSharingConsentItems(
    state.language,
    state.respondent || "adult",
    state.lifeContext
  );
  const sharingLines = sharingItems.map((item) => {
    const allowed = Boolean(state.sharingConsent?.[item.id]);
    const party = item.shortLabel || item.id;
    return `  ${party}: ${allowed ? "MAY SHARE" : "permission NOT given"}`;
  });

  const lines = [
    "Soulful Sensory OT — Detailed sensory screening report",
    `Submitted: ${new Date().toLocaleString()}`,
    `Completed by: ${completerName}`,
    `Patient results access in app: ${resultsAccessLabel()}`,
    `Source: ${isPatientInvite() ? "Patient invite link" : "Public home pathway"}`,
    "",
    "— Details —",
    state.respondent === "parent"
      ? `Child’s name: ${demo.name || "—"}`
      : `Name: ${demo.name || "—"}`,
    demo.parentName ? `Parent / guardian (completed assessment): ${demo.parentName}` : null,
    demo.partnerName ? `Partner: ${demo.partnerName}` : null,
    `Age: ${demo.age || "—"}`,
    `Email: ${demo.email || "—"}`,
    demo.occupation ? `Occupation / school: ${demo.occupation}` : null,
    `Respondent: ${respondent}`,
    state.coupleId ? `Couple session: ${state.coupleId}` : null,
    state.couplePartner
      ? `Couple partner: ${state.couplePartner === "b" ? "Partner 2" : "Partner 1"}`
      : null,
    `Language: ${state.language === "af" ? "Afrikaans" : "English"}`,
    `Life context: ${context}`,
    state.contactPreference ? `Contact preference: ${state.contactPreference}` : null,
    "",
    "— Sharing permissions (what you may / may not share) —",
    ...(sharingLines.length ? sharingLines : ["  (no sharing options recorded)"]),
    "",
    "— Overall pattern —",
    `Profile: ${profileLabelPlain(metrics.meta)}`,
    metrics.leanHeadline,
    ...(shouldShowTrailProfile()
      ? (() => {
          const copy = currentUi();
          const isParent = state.respondent === "parent";
          const roster = getTeenCrewRoster(copy);
          const you = roster.find((m) => m.id === getTeenCrewId(metrics.lean));
          const youAre = isParent ? copy.teenCrewYouAreParent : copy.teenCrewYouAre;
          return you
            ? [
                "",
                "— Sensory Trail Character —",
                `${youAre}: ${you.name}`,
                you.tag,
                you.summary,
                "",
                copy.teenCrewCrewTitle,
                ...roster.map((m) => `• ${m.name} (${m.tag}): ${m.summary}`),
              ]
            : [];
        })()
      : []),
    ...(getTrailSettingKeys(state.respondent, state.lifeContext)
      .map((settingKey) => {
        const guide = getTrailSettingGuide(settingKey, metrics.lean, state.language);
        if (!guide) return [];
        return [
          "",
          `— ${guide.title || guide.kicker} —`,
          guide.needsLabel + ":",
          guide.needs,
          guide.supportLabel + ":",
          ...(guide.support || []).map((item) => `• ${item}`),
        ];
      })
      .flat()),
    ...(state.idealSaturday?.trim() && !isCouplePathway()
      ? ["", "— Best Saturday —", state.idealSaturday.trim()]
      : []),
    ...(isCouplePathway() && state.coupleWork?.employment
      ? ["", "— Work & home life —", formatCoupleWorkSummary(normalizeCoupleWork(state.coupleWork))]
      : []),
    `Sensitive / avoiding: ${metrics.sensitive}`,
    `Sensory neutral: ${metrics.neutral ?? 0}`,
    `Sensory seeking: ${metrics.seeking}`,
    "",
    "— Detailed report by sensory system —",
    domainDetailLines || "(no domain scores)",
  ].filter((line) => line !== null);

  const profileBit = profileLabelPlain(metrics.meta);
  const subjectCore =
    state.respondent === "parent" && demo.name
      ? `${completerName} — Sensory screening (about ${demo.name})${profileBit ? ` — ${profileBit}` : ""}`
      : state.respondent === "couple"
        ? `${completerName} — Couple screening (${state.couplePartner === "b" ? "Partner 2" : "Partner 1"}${state.coupleId ? ` · ${state.coupleId}` : ""})${profileBit ? ` — ${profileBit}` : ""}`
      : `${completerName} — Sensory screening${profileBit ? ` — ${profileBit}` : ""}`;

  return {
    scores,
    metrics,
    text: lines.join("\n"),
    subject: `Completed: ${subjectCore}`,
  };
}

function isDeliverySuccessFlag(value) {
  return value === true || value === "true";
}

function isFormSubmitActivationMessage(message) {
  return /activat/i.test(String(message || ""));
}

function isFileProtocol() {
  return typeof window !== "undefined" && window.location.protocol === "file:";
}

function localHostedAppUrl() {
  return "http://127.0.0.1:8080";
}

function fileProtocolEmailMessage() {
  const url = localHostedAppUrl();
  return `This page was opened as a saved file, so email cannot send. Open ${url} in your browser instead of double-clicking the HTML file.`;
}

function renderFileProtocolBanner() {
  if (!isFileProtocol()) return "";
  const url = localHostedAppUrl();
  return `
    <div class="error-banner file-protocol-banner" role="alert">
      Email cannot send from a saved file. Open
      <a href="${escapeHtml(url)}">${escapeHtml(url)}</a>
      in your browser — do not double-click <code>index.html</code>.
    </div>
  `;
}

function assertEmailDeliveryContext() {
  if (!isFileProtocol()) return;
  const err = new Error(fileProtocolEmailMessage());
  err.code = "file-protocol";
  throw err;
}

function classifyDeliveryError(err, fallbackMessage) {
  const message = String(err?.message || fallbackMessage || "Send failed");
  if (err?.code) return { message, code: err.code };
  if (isFormSubmitActivationMessage(message)) {
    return { message, code: "formsubmit-activation" };
  }
  if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) {
    return {
      message:
        "The browser blocked the email request (often an ad blocker, privacy extension, or offline connection). Turn the blocker off for this site, or try another browser, then tap Send again.",
      code: "network-blocked",
    };
  }
  return { message, code: null };
}

async function postFormSubmitJson(payload, toEmail = getClinicianEmail()) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || !isDeliverySuccessFlag(data.success)) {
    const detail = (data && data.message) || "";
    const err = new Error(detail || "FormSubmit could not send the email");
    if (isFormSubmitActivationMessage(detail)) err.code = "formsubmit-activation";
    throw err;
  }
  if (isFormSubmitActivationMessage(data.message)) {
    const err = new Error(data.message);
    err.code = "formsubmit-activation";
    throw err;
  }
  return { provider: "formsubmit-json" };
}

async function postFormSubmitFormData(payload, toEmail = getClinicianEmail()) {
  const body = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value == null) return;
    body.append(key, String(value));
  });
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || !isDeliverySuccessFlag(data.success)) {
    const detail = (data && data.message) || "";
    const err = new Error(detail || "FormSubmit could not send the email");
    if (isFormSubmitActivationMessage(detail)) err.code = "formsubmit-activation";
    throw err;
  }
  if (isFormSubmitActivationMessage(data.message)) {
    const err = new Error(data.message);
    err.code = "formsubmit-activation";
    throw err;
  }
  return { provider: "formsubmit-formdata" };
}

/** Last-resort delivery when fetch/AJAX is blocked (ad blockers, etc.). */
function postFormSubmitViaHiddenForm(payload, toEmail = getClinicianEmail()) {
  return new Promise((resolve, reject) => {
    const iframeName = `ssot-mail-${Date.now()}`;
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.title = "Email delivery";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `https://formsubmit.co/${encodeURIComponent(toEmail)}`;
    form.target = iframeName;
    form.style.display = "none";

    Object.entries(payload).forEach(([key, value]) => {
      if (value == null) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);

    let settled = false;
    const cleanup = () => {
      window.setTimeout(() => {
        form.remove();
        iframe.remove();
      }, 1500);
    };
    const finishOk = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ provider: "formsubmit-form" });
    };
    const finishErr = (message) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(message || "FormSubmit form fallback failed"));
    };

    iframe.addEventListener("load", () => finishOk());
    form.submit();
    // FormSubmit redirects inside the iframe; treat load as success.
    // If nothing loads (blocked), time out.
    window.setTimeout(() => {
      if (!settled) finishErr("Email fallback timed out. Check for an ad blocker, then try Send again.");
    }, 8000);
  });
}

async function sendResultsEmail(report) {
  assertEmailDeliveryContext();

  const demo = state.demographics;
  const completerName = assessmentCompleterName();
  const payloadBase = {
    subject: report.subject,
    name: completerName,
    email: demo.email || getClinicianEmail(),
    respondent: state.respondent || "",
    lifeContext: state.lifeContext || "",
    language: state.language,
    overallProfile: report.metrics.profile,
    patientResultsAccess: resultsAccessLabel(),
    message: report.text,
  };

  if (DELIVERY_PROVIDER === "web3forms") {
    if (!WEB3FORMS_KEY) {
      throw new Error("Web3Forms access key is not configured in config.js");
    }
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        ...payloadBase,
        from_name: "Soulful Sensory Screening",
        to: getClinicianEmail(),
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || !isDeliverySuccessFlag(data.success)) {
      throw new Error((data && data.message) || "Web3Forms could not send the email");
    }
    return { provider: "web3forms" };
  }

  if (DELIVERY_PROVIDER === "formsubmit") {
    const formSubmitPayload = {
      _subject: report.subject,
      _template: "table",
      _captcha: "false",
      _honey: "",
      _url: typeof window !== "undefined" ? window.location.href.split("#")[0] : "",
      name: payloadBase.name,
      email: payloadBase.email,
      respondent: payloadBase.respondent,
      lifeContext: payloadBase.lifeContext,
      language: payloadBase.language,
      overallProfile: payloadBase.overallProfile,
      patientResultsAccess: payloadBase.patientResultsAccess,
      message: payloadBase.message,
    };

    try {
      return await postFormSubmitJson(formSubmitPayload);
    } catch (jsonErr) {
      if (jsonErr?.code === "formsubmit-activation") throw jsonErr;
      console.warn("FormSubmit JSON send failed, trying FormData…", jsonErr);
      try {
        return await postFormSubmitFormData(formSubmitPayload);
      } catch (formDataErr) {
        if (formDataErr?.code === "formsubmit-activation") throw formDataErr;
        console.warn("FormSubmit FormData send failed, trying hidden form…", formDataErr);
        return await postFormSubmitViaHiddenForm(formSubmitPayload);
      }
    }
  }

  throw new Error("Email delivery is disabled in config.js");
}

function canSendClinicianMail() {
  if (DELIVERY_PROVIDER === "none") return false;
  if (state.sampleReportPreview) return false;
  if (isFileProtocol()) return false;
  return true;
}

async function sendClinicianNotification({ subject, message, name, fields = {} }) {
  assertEmailDeliveryContext();
  const payloadBase = {
    subject,
    name: name || "Soulful Sensory screening",
    email: getClinicianEmail(),
    message,
    ...fields,
  };

  if (DELIVERY_PROVIDER === "web3forms") {
    if (!WEB3FORMS_KEY) {
      throw new Error("Web3Forms access key is not configured in config.js");
    }
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        ...payloadBase,
        from_name: "Soulful Sensory Screening",
        to: getClinicianEmail(),
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || !isDeliverySuccessFlag(data.success)) {
      throw new Error((data && data.message) || "Web3Forms could not send the email");
    }
    return { provider: "web3forms" };
  }

  if (DELIVERY_PROVIDER === "formsubmit") {
    const formSubmitPayload = {
      _subject: subject,
      _template: "table",
      _captcha: "false",
      _honey: "",
      _url: typeof window !== "undefined" ? window.location.href.split("#")[0] : "",
      name: payloadBase.name,
      email: payloadBase.email,
      message: payloadBase.message,
      ...fields,
    };
    try {
      return await postFormSubmitJson(formSubmitPayload);
    } catch (jsonErr) {
      if (jsonErr?.code === "formsubmit-activation") throw jsonErr;
      try {
        return await postFormSubmitFormData(formSubmitPayload);
      } catch (formDataErr) {
        if (formDataErr?.code === "formsubmit-activation") throw formDataErr;
        return await postFormSubmitViaHiddenForm(formSubmitPayload);
      }
    }
  }

  throw new Error("Email delivery is disabled in config.js");
}

function buildPasswordResetUrl(token) {
  const url = new URL(getClinicianBaseUrl());
  url.searchParams.set("reset", token);
  return url.toString();
}

async function sendPasswordResetEmail({ email, name, token }) {
  assertEmailDeliveryContext();
  const toEmail = String(email || "").trim();
  if (!toEmail) throw new Error("No email address was provided.");
  const displayName = String(name || "").trim() || "there";
  const resetUrl = buildPasswordResetUrl(token);
  const subject = "Reset your Soulful Sensory OT password";
  const message = [
    `Hello ${displayName},`,
    "",
    "We received a request to reset the password for this Soulful Sensory OT account.",
    "",
    "Open this link in the same browser you use to sign in, then choose a new password:",
    resetUrl,
    "",
    "This link expires in 24 hours. If you did not ask to reset your password, you can ignore this email.",
  ].join("\n");

  if (DELIVERY_PROVIDER === "web3forms") {
    if (!WEB3FORMS_KEY) {
      throw new Error("Web3Forms access key is not configured in config.js");
    }
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject,
        name: displayName,
        email: toEmail,
        to: toEmail,
        from_name: "Soulful Sensory OT",
        message,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || !isDeliverySuccessFlag(data.success)) {
      throw new Error((data && data.message) || "Web3Forms could not send the email");
    }
    return { provider: "web3forms" };
  }

  if (DELIVERY_PROVIDER === "formsubmit") {
    const formSubmitPayload = {
      _subject: subject,
      _template: "box",
      _captcha: "false",
      _honey: "",
      name: displayName,
      email: toEmail,
      message,
    };
    try {
      return await postFormSubmitJson(formSubmitPayload, toEmail);
    } catch (jsonErr) {
      if (jsonErr?.code === "formsubmit-activation") throw jsonErr;
      try {
        return await postFormSubmitFormData(formSubmitPayload, toEmail);
      } catch (formDataErr) {
        if (formDataErr?.code === "formsubmit-activation") throw formDataErr;
        return await postFormSubmitViaHiddenForm(formSubmitPayload, toEmail);
      }
    }
  }

  throw new Error("Email delivery is disabled in config.js");
}

function queueClinicianNotification(options) {
  if (!canSendClinicianMail()) return;
  const type = options?.type;
  if (type && !wantsNotification(type)) return;
  sendClinicianNotification(options).catch((err) => {
    console.warn("Clinician notification failed:", err);
  });
}

function notifyIncompleteQuestionnaire(record) {
  if (!record || !wantsNotification("incomplete")) return;
  const name = dashboardPatientName(record);
  const pathway = respondentLabel(record.respondent);
  queueClinicianNotification({
    type: "incomplete",
    subject: `Incomplete: ${name} — ${pathway} questionnaire started`,
    name,
    fields: {
      notification: "questionnaire-incomplete",
      respondent: record.respondent || "",
      lifeContext: record.lifeContext || "",
    },
    message: [
      "A sensory questionnaire was started and is still incomplete.",
      "",
      `Patient: ${name}`,
      record.summary?.email || record.demographics?.email
        ? `Patient email: ${record.summary?.email || record.demographics?.email}`
        : null,
      `Pathway: ${pathway}${record.lifeContext ? ` · ${lifeContextDisplay(record.lifeContext)}` : ""}`,
      record.summary?.progressLabel ? `Progress: ${record.summary.progressLabel}` : null,
      record.savedAt ? `Last saved: ${formatQuestionnaireDate(record.savedAt, "en")}` : null,
      "",
      "Open the patient register on this device to continue or follow up.",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

function notifyFollowUpRequested() {
  if (state.archiveReadOnly || state.sampleReportPreview) return;
  if (!wantsNotification("followUp")) return;
  const name = assessmentCompleterName();
  const pathway = respondentLabel(state.respondent);
  const context = lifeContextDisplay(state.lifeContext);
  queueClinicianNotification({
    type: "followUp",
    subject: `Follow-up: ${name} would like to discuss their report`,
    name,
    fields: {
      notification: "follow-up-requested",
      respondent: state.respondent || "",
      lifeContext: state.lifeContext || "",
    },
    message: [
      "A patient asked to book a follow-up discussion about their sensory report.",
      "",
      `Patient: ${name}`,
      `Pathway: ${pathway}${context ? ` · ${context}` : ""}`,
      state.demographics?.email ? `Patient email: ${state.demographics.email}` : null,
      `When: ${new Date().toLocaleString("en-ZA")}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

function persistContactPreferenceToArchive() {
  const id = state.viewingArchivedId;
  if (!id || state.sampleReportPreview) return;
  const items = readAssessments();
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  item.contactPreference = state.contactPreference;
  writeAssessments(items);
}

function notifyReportDownloaded() {
  if (!wantsNotification("downloaded")) return;
  if (!canSendClinicianMail()) return;
  const name = assessmentCompleterName();
  const pathway = respondentLabel(state.respondent);
  const context = lifeContextDisplay(state.lifeContext);
  const id = state.viewingArchivedId || state.inProgressAssessmentId || name;
  const now = Date.now();
  if (state._lastDownloadNotify && state._lastDownloadNotify.id === id && now - state._lastDownloadNotify.at < 20000) {
    return;
  }
  state._lastDownloadNotify = { id, at: now };
  queueClinicianNotification({
    type: "downloaded",
    subject: `Downloaded: ${name} — ${pathway} report`,
    name,
    fields: {
      notification: "report-downloaded",
      respondent: state.respondent || "",
      lifeContext: state.lifeContext || "",
    },
    message: [
      "A sensory report was downloaded or printed.",
      "",
      `Patient: ${name}`,
      `Pathway: ${pathway}${context ? ` · ${context}` : ""}`,
      state.demographics?.email ? `Patient email: ${state.demographics.email}` : null,
      `When: ${new Date().toLocaleString("en-ZA")}`,
      state.archiveReadOnly ? "Source: Therapist dashboard" : "Source: On-screen report",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

function notifyExpiringQuestionnaires() {
  if (!canSendClinicianMail()) return;
  if (!wantsNotification("expiring")) return;
  const items = readAssessments();
  let changed = false;
  items.forEach((item) => {
    if (assessmentStatus(item) !== "incomplete") return;
    if (item.expiryNotifiedAt) return;
    const daysLeft = questionnaireDaysUntilExpiry(item);
    if (daysLeft == null || daysLeft > QUESTIONNAIRE_EXPIRY_WARNING_DAYS) return;
    const name = dashboardPatientName(item);
    const expires = questionnaireExpiresAt(item);
    const pathway = respondentLabel(item.respondent);
    const expired = daysLeft < 0;
    queueClinicianNotification({
      type: "expiring",
      subject: expired
        ? `Expired: ${name} — incomplete ${pathway} questionnaire`
        : `Expiring: ${name} — incomplete ${pathway} questionnaire`,
      name,
      fields: {
        notification: expired ? "questionnaire-expired" : "questionnaire-expiring",
        respondent: item.respondent || "",
        lifeContext: item.lifeContext || "",
      },
      message: [
        expired
          ? "An incomplete sensory questionnaire has reached its expiry window."
          : "An incomplete sensory questionnaire is about to expire.",
        "",
        `Patient: ${name}`,
        item.summary?.email || item.demographics?.email
          ? `Patient email: ${item.summary?.email || item.demographics?.email}`
          : null,
        `Pathway: ${pathway}${item.lifeContext ? ` · ${lifeContextDisplay(item.lifeContext)}` : ""}`,
        item.summary?.progressLabel ? `Progress: ${item.summary.progressLabel}` : null,
        questionnaireStartedAt(item)
          ? `Started: ${formatQuestionnaireDate(questionnaireStartedAt(item), "en")}`
          : null,
        item.savedAt ? `Last saved: ${formatQuestionnaireDate(item.savedAt, "en")}` : null,
        expires ? `Expires: ${formatQuestionnaireDate(expires, "en")}` : null,
        expired ? `Days overdue: ${Math.abs(daysLeft)}` : `Days remaining: ${daysLeft}`,
        "",
        `Incomplete screenings expire ${QUESTIONNAIRE_EXPIRY_DAYS} days after they are started. Open the patient register on this device to continue or remove it.`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    item.expiryNotifiedAt = new Date().toISOString();
    if (!item.expiresAt && expires) item.expiresAt = expires;
    changed = true;
  });
  if (changed) writeAssessments(items);
}

function maybeNotifyExpiringQuestionnaires() {
  const now = Date.now();
  if (state._lastExpiryCheck && now - state._lastExpiryCheck < 10 * 60 * 1000) return;
  state._lastExpiryCheck = now;
  try {
    notifyExpiringQuestionnaires();
  } catch (err) {
    console.warn("Expiry notification check failed:", err);
  }
}

function updateSubmissionStatusUi() {
  const copy = currentUi();
  const status = app.querySelector("[data-submission-status]");
  if (status) {
    const kind = state.submissionStatus || "pending";
    status.className = `submission-status submission-status--${kind}`;
    status.textContent = submissionStatusMessage(copy);
  }
  const detail = app.querySelector("[data-submission-error-detail]");
  if (detail) {
    const show = state.submissionStatus === "error" && state.submissionError;
    detail.hidden = !show;
    detail.textContent = show ? state.submissionError : "";
  }
  const retry = app.querySelector("[data-action='retry-submit']");
  if (retry) {
    retry.hidden = state.submissionStatus !== "error";
  }
}

function ensureResultsSubmitted({ force = false } = {}) {
  if (!shouldEmailResultsToClinician()) return;
  if (!force && state.submissionAttempted && state.submissionStatus === "sent") return;
  if (!force && state.submissionStatus === "pending") return;

  state.submissionAttempted = true;
  state.submissionStatus = "pending";
  state.submissionError = null;
  state.submissionErrorCode = null;
  updateSubmissionStatusUi();

  let report;
  try {
    report = buildResultsReport();
  } catch (err) {
    console.error("Could not build results email:", err);
    const classified = classifyDeliveryError(err, "Could not build report");
    state.submissionStatus = "error";
    state.submissionError = classified.message;
    state.submissionErrorCode = classified.code;
    updateSubmissionStatusUi();
    return;
  }

  sendResultsEmail(report)
    .then(() => {
      state.submissionStatus = "sent";
      state.submissionError = null;
      state.submissionErrorCode = null;
      updateSubmissionStatusUi();
    })
    .catch((err) => {
      console.error("Results email failed:", err);
      const classified = classifyDeliveryError(err, "Send failed");
      state.submissionStatus = "error";
      state.submissionError = classified.message;
      state.submissionErrorCode = classified.code;
      updateSubmissionStatusUi();
    });
}

function ensureCoupleCombinedSubmissionShape(session) {
  if (!session || typeof session !== "object") return session;
  if (!session.combinedSubmission || typeof session.combinedSubmission !== "object") {
    session.combinedSubmission = {
      status: null,
      submittedAt: null,
      submittedBy: null,
      error: null,
      errorCode: null,
    };
  }
  return session;
}

function canOfferCoupleCombinedSubmit(session = null) {
  if (!wantsNotification("completed")) return false;
  if (state.archiveReadOnly || state.sampleReportPreview) return false;
  if (DELIVERY_PROVIDER === "none") return false;
  const sess = session || (state.coupleId ? getCoupleSession(state.coupleId) : null);
  return bothCouplePartnersComplete(sess);
}

function coupleCombinedSubmissionStatusMessage(copy = currentUi(), session = null) {
  const sess = ensureCoupleCombinedSubmissionShape(
    session || (state.coupleId ? getCoupleSession(state.coupleId) : null)
  );
  const status = sess?.combinedSubmission?.status;
  if (status === "sent") return copy.coupleCombinedSent;
  if (status === "error") {
    if (sess.combinedSubmission.errorCode === "formsubmit-activation") {
      return copy.thankYouActivation;
    }
    if (sess.combinedSubmission.errorCode === "file-protocol") {
      return copy.thankYouFileProtocol;
    }
    if (sess.combinedSubmission.errorCode === "network-blocked") {
      return copy.thankYouNetworkBlocked;
    }
    return copy.coupleCombinedError;
  }
  if (status === "pending") return copy.coupleCombinedSending;
  return copy.coupleCombinedLead;
}

function buildCouplePartnerEmailBlock(partner, slot, copy) {
  const name =
    String(slot?.label || slot?.demographics?.name || "").trim() ||
    (partner === "b" ? copy.couplePartnerB : copy.couplePartnerA);
  const demo = slot?.demographics || {};
  const summary = slot?.summary || {};
  const domains = Array.isArray(summary.domainProfiles)
    ? summary.domainProfiles
        .map((d) => `  • ${d.title || d.id}: ${d.short || "—"}`)
        .join("\n")
    : "  (no domain summary)";
  const workSummary = formatCoupleWorkSummary(normalizeCoupleWork(slot?.coupleWork), copy);
  return [
    `— ${name} (${partner === "b" ? "Partner 2" : "Partner 1"}) —`,
    `Name: ${name}`,
    demo.age ? `Age: ${demo.age}` : null,
    demo.email ? `Email: ${demo.email}` : null,
    demo.occupation ? `Occupation: ${demo.occupation}` : null,
    demo.partnerName ? `Partner: ${demo.partnerName}` : null,
    `Overall: ${summary.overallLabel || "—"}`,
    summary.leanHeadline || null,
    "Domains:",
    domains,
    workSummary ? ["", "Work & home life:", workSummary].join("\n") : null,
  ]
    .filter((line) => line !== null && line !== "")
    .join("\n");
}

function buildCoupleCombinedResultsReport(session = null) {
  const copy = currentUi();
  const sess = ensureCoupleCombinedSubmissionShape(
    session || ensureCoupleSession()
  );
  if (!bothCouplePartnersComplete(sess)) {
    throw new Error("Both partners must complete before submitting the combined report.");
  }

  const nameA = couplePartnerLabel("a", sess);
  const nameB = couplePartnerLabel("b", sess);
  const language = state.language === "af" ? "Afrikaans" : "English";
  const comparison =
    typeof buildCoupleComparisonReport === "function"
      ? buildCoupleComparisonReport(sess, state.language)
      : null;
  const workComparison =
    typeof buildCoupleWorkComparison === "function"
      ? buildCoupleWorkComparison(sess, state.language)
      : null;
  const conflictSummary =
    typeof buildCoupleConflictAreas === "function"
      ? buildCoupleConflictAreas(sess, state.language)
      : null;
  const thriveSummary =
    typeof buildCoupleThriveSummary === "function"
      ? buildCoupleThriveSummary(sess, state.language)
      : null;
  const parentingComparison =
    typeof buildCoupleParentingComparison === "function"
      ? buildCoupleParentingComparison(sess, state.language)
      : null;

  const sectionLines = [];
  if (comparison?.sections?.length) {
    sectionLines.push("", `— ${copy.coupleCompareTitle} —`, copy.coupleCompareIntro || "");
    comparison.sections.forEach((section) => {
      const title = copy[section.titleKey] || section.titleKey;
      sectionLines.push("", title);
      (section.partnerLines || []).forEach((line) => {
        if (line?.text) sectionLines.push(`  ${line.text}`);
      });
      (section.together || []).filter(Boolean).forEach((text) => {
        sectionLines.push(`  Together: ${text}`);
      });
    });
  }

  if (workComparison) {
    sectionLines.push(
      "",
      `— ${copy[workComparison.titleKey] || copy.coupleWorkResultsTitle} —`,
      copy[workComparison.introKey] || ""
    );
    (workComparison.partners || []).forEach((card) => {
      sectionLines.push("", card.name);
      (card.rows || []).forEach((row) => {
        sectionLines.push(`  ${row.label}: ${row.value}`);
      });
      if (card.note) sectionLines.push(`  ${card.note}`);
    });
    (workComparison.together || []).filter(Boolean).forEach((text) => {
      sectionLines.push(`  Together: ${text}`);
    });
  }

  if (conflictSummary) {
    sectionLines.push(
      "",
      `— ${copy[conflictSummary.titleKey] || copy.coupleCompareConflictTitle} —`,
      copy[conflictSummary.introKey] || copy.coupleCompareConflictIntro || ""
    );
    if ((conflictSummary.areas || []).length) {
      conflictSummary.areas.forEach((area) => {
        sectionLines.push("", area.title, area.text);
        (area.tips || []).filter(Boolean).forEach((tip) => {
          sectionLines.push(`  • ${tip}`);
        });
      });
    } else if (conflictSummary.emptyNote) {
      sectionLines.push(conflictSummary.emptyNote);
    }
  }

  if (thriveSummary) {
    sectionLines.push(
      "",
      `— ${copy[thriveSummary.titleKey] || copy.coupleCompareThriveTitle} —`,
      copy[thriveSummary.introKey] || ""
    );
    (thriveSummary.partners || []).forEach((card) => {
      sectionLines.push("", card.name);
      (card.needs || []).forEach((need) => sectionLines.push(`  • ${need}`));
    });
  }

  if (parentingComparison) {
    sectionLines.push(
      "",
      `— ${copy[parentingComparison.titleKey] || copy.coupleCompareParentingTitle} —`,
      copy[parentingComparison.introKey] || ""
    );
    (parentingComparison.partnerLines || []).forEach((line) => {
      if (line?.text) sectionLines.push(`  ${line.text}`);
    });
    (parentingComparison.together || []).filter(Boolean).forEach((text) => {
      sectionLines.push(`  Together: ${text}`);
    });
  }

  const lines = [
    "Soulful Sensory OT — Combined couple sensory report",
    `Submitted: ${new Date().toLocaleString()}`,
    `Submitted by: ${assessmentCompleterName()}${
      state.couplePartner === "a" || state.couplePartner === "b"
        ? ` (${state.couplePartner === "b" ? "Partner 2" : "Partner 1"})`
        : ""
    }`,
    `Couple session: ${sess.id}`,
    `Partners: ${nameA} & ${nameB}`,
    `Language: ${language}`,
    `Source: Couple pathway (combined submit)`,
    "",
    buildCouplePartnerEmailBlock("a", sess.partners.a, copy),
    "",
    buildCouplePartnerEmailBlock("b", sess.partners.b, copy),
    ...sectionLines,
    "",
    "— Closing —",
    copy.coupleClosingQuote || "",
  ].filter((line) => line !== null);

  return {
    subject: `Completed: ${nameA} & ${nameB} — Combined couple sensory report`,
    text: lines.join("\n"),
    metrics: { profile: "Combined couple profile" },
    nameA,
    nameB,
  };
}

async function sendCoupleCombinedEmail(report) {
  assertEmailDeliveryContext();

  const demo = state.demographics || {};
  const payloadBase = {
    subject: report.subject,
    name: `${report.nameA} & ${report.nameB}`,
    email: demo.email || getClinicianEmail(),
    respondent: "couple-combined",
    lifeContext: "",
    language: state.language,
    overallProfile: report.metrics.profile,
    patientResultsAccess: "combined couple report",
    coupleId: state.coupleId || "",
    submittedBy: state.couplePartner || "",
    message: report.text,
  };

  if (DELIVERY_PROVIDER === "web3forms") {
    if (!WEB3FORMS_KEY) {
      throw new Error("Web3Forms access key is not configured in config.js");
    }
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        ...payloadBase,
        from_name: "Soulful Sensory Screening",
        to: getClinicianEmail(),
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || !isDeliverySuccessFlag(data.success)) {
      throw new Error((data && data.message) || "Web3Forms could not send the email");
    }
    return { provider: "web3forms" };
  }

  if (DELIVERY_PROVIDER === "formsubmit") {
    const formSubmitPayload = {
      _subject: report.subject,
      _template: "table",
      _captcha: "false",
      _honey: "",
      _url: typeof window !== "undefined" ? window.location.href.split("#")[0] : "",
      name: payloadBase.name,
      email: payloadBase.email,
      respondent: payloadBase.respondent,
      lifeContext: payloadBase.lifeContext,
      language: payloadBase.language,
      overallProfile: payloadBase.overallProfile,
      patientResultsAccess: payloadBase.patientResultsAccess,
      coupleId: payloadBase.coupleId,
      submittedBy: payloadBase.submittedBy,
      message: payloadBase.message,
    };

    try {
      return await postFormSubmitJson(formSubmitPayload);
    } catch (jsonErr) {
      if (jsonErr?.code === "formsubmit-activation") throw jsonErr;
      console.warn("FormSubmit JSON send failed, trying FormData…", jsonErr);
      try {
        return await postFormSubmitFormData(formSubmitPayload);
      } catch (formDataErr) {
        if (formDataErr?.code === "formsubmit-activation") throw formDataErr;
        console.warn("FormSubmit FormData send failed, trying hidden form…", formDataErr);
        return await postFormSubmitViaHiddenForm(formSubmitPayload);
      }
    }
  }

  throw new Error("Email delivery is disabled in config.js");
}

function updateCoupleCombinedSubmissionUi() {
  const session = state.coupleId ? getCoupleSession(state.coupleId) : null;
  if (!session) return;
  ensureCoupleCombinedSubmissionShape(session);
  const copy = currentUi();
  const status = app.querySelector("[data-couple-combined-status]");
  if (status) {
    const kind = session.combinedSubmission.status || "ready";
    status.className = `submission-status submission-status--${kind === "ready" ? "pending" : kind}`;
    status.textContent = coupleCombinedSubmissionStatusMessage(copy, session);
  }
  const detail = app.querySelector("[data-couple-combined-error]");
  if (detail) {
    const show = session.combinedSubmission.status === "error" && session.combinedSubmission.error;
    detail.hidden = !show;
    detail.textContent = show ? session.combinedSubmission.error : "";
  }
  const submitBtn = app.querySelector("[data-action='couple-submit-combined']");
  if (submitBtn) {
    const busy = session.combinedSubmission.status === "pending";
    const done = session.combinedSubmission.status === "sent";
    submitBtn.hidden = done;
    submitBtn.disabled = busy;
  }
  const retryBtn = app.querySelector("[data-action='couple-retry-combined']");
  if (retryBtn) {
    retryBtn.hidden = session.combinedSubmission.status !== "error";
  }
}

function ensureCoupleCombinedSubmitted({ force = false } = {}) {
  if (!wantsNotification("completed")) return;
  if (!canOfferCoupleCombinedSubmit()) return;
  const session = ensureCoupleCombinedSubmissionShape(ensureCoupleSession());
  const sub = session.combinedSubmission;
  if (!force && sub.status === "sent") return;
  if (!force && sub.status === "pending") return;

  sub.status = "pending";
  sub.error = null;
  sub.errorCode = null;
  sub.submittedBy = state.couplePartner || sub.submittedBy || null;
  saveCoupleSession(session);
  updateCoupleCombinedSubmissionUi();

  let report;
  try {
    report = buildCoupleCombinedResultsReport(session);
  } catch (err) {
    console.error("Could not build combined couple email:", err);
    const classified = classifyDeliveryError(err, "Could not build report");
    sub.status = "error";
    sub.error = classified.message;
    sub.errorCode = classified.code;
    saveCoupleSession(session);
    updateCoupleCombinedSubmissionUi();
    return;
  }

  sendCoupleCombinedEmail(report)
    .then(() => {
      const latest = ensureCoupleCombinedSubmissionShape(getCoupleSession(session.id) || session);
      latest.combinedSubmission.status = "sent";
      latest.combinedSubmission.submittedAt = new Date().toISOString();
      latest.combinedSubmission.submittedBy = state.couplePartner || latest.combinedSubmission.submittedBy;
      latest.combinedSubmission.error = null;
      latest.combinedSubmission.errorCode = null;
      saveCoupleSession(latest);
      updateCoupleCombinedSubmissionUi();
    })
    .catch((err) => {
      console.error("Combined couple email failed:", err);
      const classified = classifyDeliveryError(err, "Send failed");
      const latest = ensureCoupleCombinedSubmissionShape(getCoupleSession(session.id) || session);
      latest.combinedSubmission.status = "error";
      latest.combinedSubmission.error = classified.message;
      latest.combinedSubmission.errorCode = classified.code;
      saveCoupleSession(latest);
      updateCoupleCombinedSubmissionUi();
    });
}

function renderCoupleCombinedSubmitPanel(session = null) {
  if (!canOfferCoupleCombinedSubmit(session)) return "";
  const sess = ensureCoupleCombinedSubmissionShape(
    session || ensureCoupleSession()
  );
  const copy = currentUi();
  const status = sess.combinedSubmission.status;
  const statusKind = status || "ready";
  const showRetry = status === "error";
  const showSubmit = status !== "sent";
  const busy = status === "pending";
  const errorDetail =
    status === "error" && sess.combinedSubmission.error
      ? `<p class="submission-status__detail" data-couple-combined-error role="alert">${escapeHtml(
          sess.combinedSubmission.error
        )}</p>`
      : `<p class="submission-status__detail" data-couple-combined-error hidden></p>`;

  return `
    <section class="couple-combined-submit no-print" aria-labelledby="couple-combined-title">
      <h3 id="couple-combined-title" class="couple-combined-submit__title">${escapeHtml(
        copy.coupleCombinedTitle
      )}</h3>
      <p class="couple-combined-submit__lead">${escapeHtml(copy.coupleCombinedLead)}</p>
      <p class="submission-status submission-status--${escapeHtml(
        statusKind === "ready" ? "pending" : statusKind
      )}" data-couple-combined-status role="status">${escapeHtml(
        coupleCombinedSubmissionStatusMessage(copy, sess)
      )}</p>
      ${errorDetail}
      <div class="couple-combined-submit__actions">
        ${
          showSubmit
            ? `<button type="button" class="btn btn-primary" data-action="couple-submit-combined" ${
                busy ? "disabled" : ""
              }>${escapeHtml(copy.coupleCombinedSubmit)}</button>`
            : ""
        }
        ${
          showRetry
            ? `<button type="button" class="btn btn-secondary" data-action="couple-retry-combined">${escapeHtml(
                copy.thankYouRetry
              )}</button>`
            : ""
        }
      </div>
    </section>
  `;
}

function renderClinicianGate() {
  return `
    <div class="clinician">
      <section class="clinician__panel" aria-labelledby="clinician-heading">
        <p class="clinician__eyebrow">Clinician access</p>
        <h1 id="clinician-heading" class="clinician__title">Share with a patient</h1>
        <p class="clinician__lead">
          Enter your PIN to create a patient link. Completed screenings are emailed to
          <strong>${escapeHtml(getClinicianEmail())}</strong>.
        </p>
        ${
          state.clinicianPinError
            ? `<p class="error-banner" role="alert">${escapeHtml(state.clinicianPinError)}</p>`
            : ""
        }
        <label class="clinician__field">
          <span>PIN</span>
          <input
            type="password"
            name="clinician-pin"
            data-clinician-pin
            autocomplete="current-password"
            value="${escapeHtml(state.clinicianPinInput)}"
            placeholder="Enter clinician PIN"
          />
        </label>
        <div class="clinician__actions">
          <button type="button" class="btn btn-primary" data-action="clinician-unlock">Unlock</button>
          <button type="button" class="btn btn-secondary" data-action="back-home">Back to home</button>
        </div>
        <p class="clinician__hint">
          Prefer accounts?
          <button type="button" class="auth__text-btn" data-action="open-login">Sign in as therapist/admin</button>
          — or use the PIN from <code>config.js</code> (<code>clinicianPin</code>).
        </p>
      </section>
    </div>
  `;
}

function renderClinicianShare() {
  if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
    return `
    <div class="clinician">
      <section class="clinician__panel" aria-labelledby="clinician-heading">
        <p class="clinician__eyebrow">Clinician tools</p>
        <h1 id="clinician-heading" class="clinician__title">Create a patient account</h1>
        <p class="clinician__lead">
          Patients no longer create their own accounts. Add their name, questionnaire type, contact details and reason for referral, then send them the sign-in details. Every questionnaire expires after ${QUESTIONNAIRE_EXPIRY_DAYS} days.
        </p>
        <div class="clinician__actions">
          <button type="button" class="btn btn-primary" data-action="open-create-patient">Add patient</button>
          <button type="button" class="btn btn-secondary" data-action="open-dashboard">Patient dashboard</button>
          <button type="button" class="btn btn-secondary" data-action="back-home">Back to home</button>
        </div>
        ${renderSampleReportPreviewControls()}
      </section>
    </div>
    `;
  }

  return `
    <div class="clinician">
      <section class="clinician__panel" aria-labelledby="clinician-heading">
        <p class="clinician__eyebrow">Clinician tools</p>
        <h1 id="clinician-heading" class="clinician__title">Therapist sign-in needed</h1>
        <p class="clinician__lead">
          To create a patient account, sign in as a therapist or admin. The clinician PIN still unlocks the patient register on this device.
        </p>
        <div class="clinician__actions">
          <button type="button" class="btn btn-primary" data-action="open-login">Sign in as therapist</button>
          <button type="button" class="btn btn-secondary" data-action="open-dashboard">Patient dashboard</button>
          <button type="button" class="btn btn-secondary" data-action="back-home">Back to home</button>
        </div>
      </section>
    </div>
  `;
}

function renderClinician() {
  if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
    return renderClinicianShare();
  }
  return state.clinicianUnlocked ? renderClinicianShare() : renderClinicianGate();
}

function respondentLabel(respondent) {
  if (respondent === "parent") return "Parent (child)";
  if (respondent === "teen") return "Teen";
  if (respondent === "adult") return "Adult";
  if (respondent === "couple") return "Couple";
  return "—";
}

function lifeContextDisplay(context) {
  const map = { work: "Work", home: "Home", school: "School", homeSchool: "Home & school" };
  return map[context] || (context ? String(context) : "");
}

function dashboardInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "SS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

function getDashboardStats(items) {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  return {
    total: items.length,
    complete: items.filter((i) => assessmentStatus(i) === "complete").length,
    incomplete: items.filter((i) => {
      const status = assessmentStatus(i);
      return status === "incomplete" || status === "assigned";
    }).length,
    adults: items.filter((i) => i.respondent === "adult").length,
    teens: items.filter((i) => i.respondent === "teen").length,
    parents: items.filter((i) => i.respondent === "parent").length,
    couples: items.filter((i) => i.respondent === "couple").length,
    recent: items.filter((i) => {
      if (assessmentStatus(i) !== "complete") return false;
      const t = new Date(i.completedAt).getTime();
      return !Number.isNaN(t) && now - t <= weekMs;
    }).length,
  };
}

function filteredDashboardAssessments() {
  const query = String(state.dashboardSearch || "")
    .trim()
    .toLowerCase();
  const items = getDashboardQuestionnaireItems();
  if (!query) return items;
  return items.filter((item) => {
    const s = item.summary || {};
    const status = assessmentStatus(item);
    const haystack = [
      s.patientName,
      s.firstName,
      s.surname,
      s.parentName,
      s.partnerName,
      s.completerName,
      s.email,
      s.phone,
      s.reasonForReferral,
      item.reasonForReferral,
      item.lifeContext,
      item.lifeContext,
      respondentLabel(item.respondent),
      status,
      status === "complete" ? "complete finished" : status === "assigned" ? "assigned not started" : "incomplete in progress",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

function dashboardPatientName(item) {
  const summary = item.summary || {};
  const demo = item.demographics || {};
  return (
    summary.patientName ||
    [summary.firstName, summary.surname].filter(Boolean).join(" ") ||
    summary.completerName ||
    demo.name ||
    demo.parentName ||
    "Unnamed"
  );
}

function renderDashboardRowActionSelect(rowId, options) {
  const optionMarkup = options
    .map((opt) => `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`)
    .join("");
  return `
    <label class="dash-row__menu">
      <span class="visually-hidden">Choose an action</span>
      <select class="dash-row__select" data-dash-row-action data-assessment-id="${rowId}">
        <option value="">Choose…</option>
        ${optionMarkup}
      </select>
    </label>
  `;
}

function renderDashboardAssessmentRow(item) {
  const summary = item.summary || {};
  const name = dashboardPatientName(item);
  const status = assessmentStatus(item);
  const incomplete = status === "incomplete";
  const assigned = status === "assigned";
  const dateLabel = formatQuestionnaireDate(item.savedAt || item.completedAt || item.startedAt, "en");
  const profile = assigned
    ? "Not started"
    : incomplete
      ? "In progress"
      : summary.overallLabel || "—";
  const progressLine = assigned
    ? summary.reasonForReferral || item.reasonForReferral || "Waiting for the patient to sign in"
    : incomplete
      ? summary.progressLabel || questionnaireProgressLabel(item.step)
      : "";
  const context = lifeContextDisplay(item.lifeContext);
  const email = summary.email || item.demographics?.email || "";
  const domains = Array.isArray(summary.domainProfiles) ? summary.domainProfiles : [];
  const domainLine = assigned || incomplete
    ? progressLine
    : domains
        .slice(0, 4)
        .map((d) => escapeHtml(d.short || d.title))
        .filter(Boolean)
        .join(" · ");
  const rowId = escapeHtml(item.id);
  const expiryNote = assigned || incomplete ? questionnaireExpiryNote(item) : "";
  const expirySoon =
    (assigned || incomplete) &&
    (questionnaireDaysUntilExpiry(item) ?? 99) <= QUESTIONNAIRE_EXPIRY_WARNING_DAYS;
  const preferredLength = readTherapistPrefs().reportLength;
  const statusLabel = assigned ? "Not started" : incomplete ? "Incomplete" : "Complete";

  return `
    <article class="dash-row${incomplete || assigned ? " dash-row--incomplete" : ""}" data-assessment-id="${rowId}">
      <div class="dash-row__patient">
        <span class="dash-row__avatar" aria-hidden="true">${escapeHtml(dashboardInitials(name))}</span>
        <div class="dash-row__identity">
          <h2 class="dash-row__name">${escapeHtml(name)}</h2>
          <p class="dash-row__sub">
            ${
              item.respondent === "parent" && summary.parentName
                ? `<span>By ${escapeHtml(summary.parentName)}</span>`
                : item.respondent === "couple"
                  ? `<span>${escapeHtml(
                      summary.couplePartner === "b"
                        ? "Partner 2"
                        : summary.couplePartner === "a"
                          ? "Partner 1"
                          : "Couple"
                    )}${summary.partnerName ? ` · with ${escapeHtml(summary.partnerName)}` : ""}</span>`
                : email
                  ? `<span>${escapeHtml(email)}</span>`
                  : `<span>${escapeHtml(respondentLabel(item.respondent))}</span>`
            }
          </p>
        </div>
      </div>
      <div class="dash-row__status-col">
        <span class="dash-row__col-label">Status</span>
        <span class="dash-row__status dash-row__status--${status}">${statusLabel}</span>
      </div>
      <div class="dash-row__date">
        <span class="dash-row__col-label">${assigned ? "Created" : incomplete ? "Last saved" : "Assessed"}</span>
        <strong>${escapeHtml(dateLabel || "—")}</strong>
        ${
          expiryNote
            ? `<span class="dash-row__expiry${expirySoon ? " dash-row__expiry--soon" : ""}">${escapeHtml(expiryNote)}</span>`
            : ""
        }
      </div>
      <div class="dash-row__pathway">
        <span class="dash-row__col-label">Pathway</span>
        <span class="dash-row__badge">${escapeHtml(respondentLabel(item.respondent))}</span>
        ${context ? `<span class="dash-row__context">${escapeHtml(context)}</span>` : ""}
      </div>
      <div class="dash-row__pattern">
        <span class="dash-row__col-label">${assigned ? "Referral" : incomplete ? "Progress" : "Overall pattern"}</span>
        <strong class="dash-row__pattern-value">${escapeHtml(profile)}</strong>
        ${domainLine ? `<p class="dash-row__domains">${escapeHtml(domainLine)}</p>` : ""}
      </div>
      <div class="dash-row__actions">
        <span class="dash-row__col-label">${assigned || incomplete ? "Actions" : "Report"}</span>
        ${
          assigned
            ? renderDashboardRowActionSelect(rowId, [
                { value: "send-patient-email", label: "Email" },
                ...(whatsappPhoneDigits(summary.phone || item.demographics?.phone || "")
                  ? [{ value: "send-patient-whatsapp", label: "WhatsApp" }]
                  : []),
                { value: "copy-patient-invite", label: "Copy link" },
                { value: "send-patient-email-again", label: "Send again" },
                { value: "delete-assessment", label: "Remove" },
              ])
            : incomplete
            ? `<button type="button" class="btn btn-primary btn--compact" data-action="continue-assessment" data-assessment-id="${rowId}">Continue</button>
        <button type="button" class="dash-row__remove" data-action="delete-assessment" data-assessment-id="${rowId}" title="Remove from this device">Remove</button>`
            : `<div class="dash-report-switch" role="group" aria-label="Open report">
          <button type="button" class="dash-report-switch__btn${preferredLength === REPORT_LENGTH.summary ? " is-preferred" : ""}" data-action="open-assessment-summary" data-assessment-id="${rowId}">Summary</button>
          <button type="button" class="dash-report-switch__btn${preferredLength === REPORT_LENGTH.short ? " is-preferred" : ""}" data-action="open-assessment-short" data-assessment-id="${rowId}">Short</button>
          <button type="button" class="dash-report-switch__btn${preferredLength === REPORT_LENGTH.full ? " is-preferred" : ""}" data-action="open-assessment" data-assessment-id="${rowId}">Full</button>
        </div>
        <button type="button" class="dash-row__tool" data-action="download-assessment" data-assessment-id="${rowId}">Download</button>
        <button type="button" class="dash-row__remove" data-action="delete-assessment" data-assessment-id="${rowId}" title="Remove from this device">Remove</button>`
        }
      </div>
    </article>
  `;
}

function renderDashboardGate() {
  const adminEmail =
    (typeof APP_CONFIG !== "undefined" && APP_CONFIG.adminEmail) || getClinicianEmail();
  return `
    <div class="clinician">
      <section class="clinician__panel" aria-labelledby="dashboard-gate-heading">
        <p class="clinician__eyebrow">Therapist access</p>
        <h1 id="dashboard-gate-heading" class="clinician__title">Patient dashboard</h1>
        <p class="clinician__lead">
          Unlock with your clinician PIN, or sign in as admin / therapist to see complete and incomplete screenings.
        </p>
        ${
          state.clinicianPinError
            ? `<p class="error-banner" role="alert">${escapeHtml(state.clinicianPinError)}</p>`
            : ""
        }
        <label class="clinician__field">
          <span>Clinician PIN</span>
          <input
            type="password"
            name="clinician-pin"
            data-clinician-pin
            autocomplete="current-password"
            value="${escapeHtml(state.clinicianPinInput)}"
            placeholder="Enter clinician PIN"
          />
        </label>
        <div class="clinician__actions">
          <button type="button" class="btn btn-primary" data-action="clinician-unlock">Unlock dashboard</button>
          <button type="button" class="btn btn-secondary" data-action="open-login">Sign in</button>
          <button type="button" class="btn btn-secondary" data-action="back-home">Back to home</button>
        </div>
        <p class="clinician__hint">
          Admin sign-in: <strong>${escapeHtml(adminEmail)}</strong> (password in <code>config.js</code>).
          PIN is <code>clinicianPin</code> in the same file.
          New therapist accounts need approval in Settings before they can sign in.
        </p>
      </section>
    </div>
  `;
}

function prefsChoice(name, value, checked, title, hint) {
  return `
    <label class="prefs-choice">
      <input type="radio" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${checked ? "checked" : ""} />
      <span>
        <strong>${escapeHtml(title)}</strong>
        <em>${escapeHtml(hint)}</em>
      </span>
    </label>
  `;
}

function prefsCheck(key, checked, title, hint) {
  return `
    <label class="prefs-choice">
      <input type="checkbox" data-pref-notify="${escapeHtml(key)}" ${checked ? "checked" : ""} />
      <span>
        <strong>${escapeHtml(title)}</strong>
        <em>${escapeHtml(hint)}</em>
      </span>
    </label>
  `;
}

function renderCreatedPatientSuccess(details) {
  const sending = state.patientSendStatus === "sending";
  const sent = state.patientSendStatus === "sent";
  const failed = state.patientSendStatus === "error";
  const whatsappUrl = patientInviteWhatsAppUrl(details);
  const emailLabel = sending ? "Sending email…" : "Send email";
  return `
    <section class="dashboard__panel patient-create" aria-labelledby="patient-created-heading">
      <h2 id="patient-created-heading" class="dashboard__panel-title">Patient account created</h2>
      <p class="prefs-lead">
        Email is the default way to send their sign-in link. You can also send it on WhatsApp. Their ${escapeHtml(details.questionnaireType || "questionnaire")} expires after ${QUESTIONNAIRE_EXPIRY_DAYS} days (${escapeHtml(details.expiresAt || "")}).
      </p>
      ${
        sending
          ? `<p class="auth__notice dashboard__notice" role="status">Sending email to ${escapeHtml(details.email)}…</p>`
          : sent
            ? `<p class="auth__notice dashboard__notice" role="status">Email sent to ${escapeHtml(details.email)}.</p>`
            : ""
      }
      ${
        failed && state.patientSendError
          ? `<p class="error-banner" role="alert">${escapeHtml(state.patientSendError)}</p>`
          : ""
      }
      <dl class="patient-create__details">
        <div><dt>Name</dt><dd>${escapeHtml(details.name)}</dd></div>
        <div><dt>Email</dt><dd>${escapeHtml(details.email)}</dd></div>
        <div><dt>Password</dt><dd><code>${escapeHtml(details.password || "Already used — create a new password if needed")}</code></dd></div>
        <div><dt>Contact number</dt><dd>${escapeHtml(details.phone || "—")}</dd></div>
        <div><dt>Age</dt><dd>${escapeHtml(details.age || "—")}</dd></div>
        <div><dt>Questionnaire</dt><dd>${escapeHtml(details.questionnaireType || "—")}</dd></div>
        <div><dt>Reason for referral</dt><dd>${escapeHtml(details.reasonForReferral || "—")}</dd></div>
      </dl>
      <div class="patient-send">
        <div class="patient-send__main">
          <button type="button" class="btn btn-primary" data-action="send-patient-email" ${sending ? "disabled" : ""} aria-busy="${sending ? "true" : "false"}">
            ${emailLabel}
          </button>
          ${
            whatsappUrl
              ? `<a class="btn btn-secondary" data-action="send-patient-whatsapp" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`
              : `<button type="button" class="btn btn-secondary" disabled title="Add a contact number to send on WhatsApp">WhatsApp</button>`
          }
        </div>
        <div class="patient-send__side">
          <button type="button" class="patient-send__backup" data-action="copy-created-patient-link">
            ${state.clinicianCopyStatus === "copied" ? "Link copied" : "Copy link"}
          </button>
          <button type="button" class="patient-send__backup" data-action="send-patient-email-again" ${sending ? "disabled" : ""}>
            Send again
          </button>
        </div>
      </div>
      <p class="prefs-hint">Copy link is a backup if email or WhatsApp does not go through. Send again if something went wrong.</p>
      <div class="clinician__actions">
        ${
          details.userId
            ? `<button type="button" class="btn btn-secondary" data-action="reset-patient-password" data-user-id="${escapeHtml(details.userId)}">New password</button>`
            : ""
        }
        <button type="button" class="btn btn-secondary" data-action="create-another-patient">Add another patient</button>
        <button type="button" class="btn btn-secondary" data-action="dashboard-tab" data-tab="register">Back to register</button>
      </div>
    </section>
  `;
}

function renderCreatePatientForm() {
  const form = state.patientForm || emptyPatientForm();
  const type = form.questionnaireType || "adult-home";
  const assignment = parseQuestionnaireAssignment(type);
  const isParent = assignment?.respondent === "parent";
  return `
    <section class="dashboard__panel patient-create" aria-labelledby="create-patient-heading">
      <h2 id="create-patient-heading" class="dashboard__panel-title">Create a patient account</h2>
      <p class="prefs-lead">
        The therapist creates the patient’s account and chooses the questionnaire. Every questionnaire type expires after ${QUESTIONNAIRE_EXPIRY_DAYS} days.
      </p>
      ${
        state.patientFormError
          ? `<p class="error-banner" role="alert">${escapeHtml(state.patientFormError)}</p>`
          : ""
      }
      <form class="patient-create__form" data-patient-form>
        <div class="patient-create__grid">
          <label class="auth__field">
            <span>${isParent ? "Child’s name" : "Name"}</span>
            <input type="text" name="firstName" data-patient-field="firstName" autocomplete="given-name" required value="${escapeHtml(form.firstName)}" />
          </label>
          <label class="auth__field">
            <span>${isParent ? "Child’s surname" : "Surname"}</span>
            <input type="text" name="surname" data-patient-field="surname" autocomplete="family-name" required value="${escapeHtml(form.surname)}" />
          </label>
          <label class="auth__field">
            <span>Email address</span>
            <input type="email" name="email" data-patient-field="email" autocomplete="email" required value="${escapeHtml(form.email)}" />
          </label>
          <label class="auth__field">
            <span>Contact number</span>
            <input type="tel" name="phone" data-patient-field="phone" autocomplete="tel" required value="${escapeHtml(form.phone)}" />
          </label>
          <label class="auth__field">
            <span>${isParent ? "Child’s age" : "Age"}</span>
            <input type="number" name="age" data-patient-field="age" min="0" max="120" inputmode="numeric" required value="${escapeHtml(form.age)}" />
          </label>
        </div>

        <fieldset class="prefs-section">
          <legend>Questionnaire type</legend>
          <p class="prefs-hint">The patient will complete this pathway. They cannot change it.</p>
          ${QUESTIONNAIRE_ASSIGNMENTS.map((option) =>
            prefsChoice(
              "patient-questionnaire-type",
              option.id,
              type === option.id,
              option.title,
              option.hint
            )
          ).join("")}
        </fieldset>

        <label class="auth__field">
          <span>Reason for referral</span>
          <textarea name="reasonForReferral" data-patient-field="reasonForReferral" rows="4" required>${escapeHtml(form.reasonForReferral)}</textarea>
        </label>
        <p class="prefs-hint">All questionnaires expire 14 days after you create this account.</p>
        <div class="clinician__actions">
          <button type="submit" class="btn btn-primary" ${state.patientFormBusy ? "disabled" : ""}>
            ${state.patientFormBusy ? "Creating…" : "Create patient account"}
          </button>
          <button type="button" class="btn btn-secondary" data-action="dashboard-tab" data-tab="register">Cancel</button>
        </div>
      </form>
    </section>
  `;
}

function renderTherapistPreferences() {
  const prefs = readTherapistPrefs();
  const notes = prefs.notifications || {};
  return `
    <section class="dashboard__panel prefs-panel" aria-labelledby="prefs-heading">
      <h2 id="prefs-heading" class="dashboard__panel-title">Report defaults &amp; notifications</h2>
      <p class="prefs-lead">
        These choices apply on this device for your therapist account. Invite links still let you override report visibility per patient.
      </p>
      ${
        state.prefsNotice
          ? `<p class="auth__notice dashboard__notice" role="status">${escapeHtml(state.prefsNotice)}</p>`
          : ""
      }

      <fieldset class="prefs-section">
        <legend>Default report length</legend>
        <p class="prefs-hint">Used when you open a completed screening from the patient register. You can still switch between views on each report.</p>
        ${prefsChoice("pref-report-length", REPORT_LENGTH.summary, prefs.reportLength === REPORT_LENGTH.summary, "Short summary", "A brief completion note that asks the patient to book a follow-up.")}
        ${prefsChoice("pref-report-length", REPORT_LENGTH.short, prefs.reportLength === REPORT_LENGTH.short, "Short report", "The short note plus overall pattern, domain glance, and trail character.")}
        ${prefsChoice("pref-report-length", REPORT_LENGTH.full, prefs.reportLength === REPORT_LENGTH.full, "Full report", "The complete sensory trail profile, including printable setting letters.")}
      </fieldset>

      <fieldset class="prefs-section">
        <legend>Default report visibility</legend>
        <p class="prefs-hint">What a new patient invite shows after they finish, until you change it on the invite page.</p>
        ${prefsChoice("pref-report-visibility", REPORT_VISIBILITY.none, prefs.reportVisibility === REPORT_VISIBILITY.none, "No report access", "Thank-you screen only. You share feedback in session.")}
        ${prefsChoice("pref-report-visibility", REPORT_VISIBILITY.summary, prefs.reportVisibility === REPORT_VISIBILITY.summary, "Short summary", "They see the brief completion note. You keep the detailed report.")}
        ${prefsChoice("pref-report-visibility", REPORT_VISIBILITY.short, prefs.reportVisibility === REPORT_VISIBILITY.short, "Short report", "They see the short report extras. You keep the detailed report.")}
        ${prefsChoice("pref-report-visibility", REPORT_VISIBILITY.full, prefs.reportVisibility === REPORT_VISIBILITY.full, "Full report", "They can open the complete sensory trail profile in the app.")}
      </fieldset>

      <fieldset class="prefs-section">
        <legend>Notification preferences</legend>
        <p class="prefs-hint">
          Emails go to <strong>${escapeHtml(getClinicianEmail())}</strong> while this app is open on a hosted address.
        </p>
        ${prefsCheck("completed", notes.completed !== false, "Completed questionnaire", "Send the detailed report when an adult, teen, parent, or combined couple screening is finished.")}
        ${prefsCheck("incomplete", notes.incomplete !== false, "Incomplete questionnaire", "Notify when someone starts a screening and it is saved as in progress.")}
        ${prefsCheck("expiring", notes.expiring !== false, "Expiring or expired questionnaire", "Remind you in the last three days before an incomplete screening expires, and if it has already expired.")}
        ${prefsCheck("downloaded", notes.downloaded !== false, "Report downloaded or printed", "Notify when a sensory report is printed or downloaded.")}
        ${prefsCheck("followUp", notes.followUp !== false, "Follow-up discussion requested", "Notify when a patient says they would like to discuss their report with you.")}
      </fieldset>
    </section>
  `;
}

function renderDashboard() {
  if (!canAccessTherapistDashboard()) {
    return renderDashboardGate();
  }

  maybeNotifyExpiringQuestionnaires();
  const prefsTab = state.dashboardTab === "preferences";
  const createTab = state.dashboardTab === "create";
  const allItems = getDashboardQuestionnaireItems();
  const items = filteredDashboardAssessments();
  const stats = getDashboardStats(allItems);
  const user = currentAuthUser();
  const rows = items.map(renderDashboardAssessmentRow).join("");
  const heading = createTab
    ? "Add patient"
    : prefsTab
      ? "My Preferences"
      : "Patient register";
  const lead = createTab
    ? "Create the patient’s account, choose their questionnaire, and send them the sign-in details. Every type expires after 14 days."
    : prefsTab
      ? "Set your default report length, what patients can see, and which emails you would like to receive."
      : "Create a patient account to assign a questionnaire, then see which screenings are complete or still in progress.";

  return `
    <div class="dashboard">
      <section class="dashboard__masthead" aria-labelledby="dashboard-heading">
        <div class="dashboard__masthead-media" aria-hidden="true">
          <img src="assets/outeniqua-trail-hero.png" alt="" class="dashboard__masthead-image" width="1536" height="1024" />
        </div>
        <div class="dashboard__masthead-veil" aria-hidden="true"></div>
        <div class="dashboard__masthead-inner">
          <div class="dashboard__masthead-copy">
            <p class="dashboard__eyebrow">Therapist</p>
            <h1 id="dashboard-heading" class="dashboard__title">${heading}</h1>
            <p class="dashboard__lead">${lead}</p>
          </div>
          <div class="dashboard__header-actions">
            <button type="button" class="btn btn-primary" data-action="open-create-patient">Add patient</button>
            ${
              user?.role === "admin"
                ? `<button type="button" class="btn btn-secondary" data-action="open-settings">Admin</button>`
                : ""
            }
            <button type="button" class="btn btn-secondary" data-action="back-home">Home</button>
          </div>
        </div>
        <div class="dashboard-tabs" role="tablist" aria-label="Therapist dashboard">
          <button type="button" class="dashboard-tab ${!prefsTab && !createTab ? "is-active" : ""}" role="tab" aria-selected="${!prefsTab && !createTab}" data-action="dashboard-tab" data-tab="register">Patient register</button>
          <button type="button" class="dashboard-tab ${createTab ? "is-active" : ""}" role="tab" aria-selected="${createTab}" data-action="dashboard-tab" data-tab="create">Add patient</button>
          <button type="button" class="dashboard-tab ${prefsTab ? "is-active" : ""}" role="tab" aria-selected="${prefsTab}" data-action="dashboard-tab" data-tab="preferences">My Preferences</button>
        </div>
      </section>

      ${
        isSampleReportPreviewEnabled()
          ? `<section class="dashboard__sample-strip" aria-label="Sample report preview">
              ${renderSampleReportPreviewControls()}
            </section>`
          : ""
      }

      ${
        state.dashboardNotice
          ? `<p class="auth__notice dashboard__notice" role="status">${escapeHtml(state.dashboardNotice)}</p>`
          : ""
      }

      ${
        prefsTab
          ? renderTherapistPreferences()
          : createTab
            ? typeof Auth !== "undefined" && Auth.canAccessClinicianTools()
              ? state.createdPatient
                ? renderCreatedPatientSuccess(state.createdPatient)
                : renderCreatePatientForm()
              : `<section class="dashboard__panel patient-create">
                  <h2 class="dashboard__panel-title">Sign in to add a patient</h2>
                  <p class="prefs-lead">Patient accounts can only be created by a signed-in therapist or admin.</p>
                  <div class="clinician__actions">
                    <button type="button" class="btn btn-primary" data-action="open-login">Sign in as therapist</button>
                  </div>
                </section>`
            : `
      <div class="dashboard__stats" role="list">
        <div class="dashboard__stat" role="listitem">
          <span class="dashboard__stat-value">${stats.complete}</span>
          <span class="dashboard__stat-label">Complete</span>
        </div>
        <div class="dashboard__stat" role="listitem">
          <span class="dashboard__stat-value">${stats.incomplete}</span>
          <span class="dashboard__stat-label">Incomplete</span>
        </div>
        <div class="dashboard__stat" role="listitem">
          <span class="dashboard__stat-value">${stats.recent}</span>
          <span class="dashboard__stat-label">Last 7 days</span>
        </div>
        <div class="dashboard__stat" role="listitem">
          <span class="dashboard__stat-value">${stats.adults}</span>
          <span class="dashboard__stat-label">Adult</span>
        </div>
        <div class="dashboard__stat" role="listitem">
          <span class="dashboard__stat-value">${stats.teens}</span>
          <span class="dashboard__stat-label">Teen</span>
        </div>
        <div class="dashboard__stat" role="listitem">
          <span class="dashboard__stat-value">${stats.parents}</span>
          <span class="dashboard__stat-label">Parent / child</span>
        </div>
        <div class="dashboard__stat" role="listitem">
          <span class="dashboard__stat-value">${stats.couples}</span>
          <span class="dashboard__stat-label">Couple</span>
        </div>
      </div>

      <section class="dashboard__panel" aria-labelledby="dashboard-list-heading">
        <div class="dashboard__toolbar">
          <div>
            <h2 id="dashboard-list-heading" class="dashboard__panel-title">Questionnaires</h2>
            <p class="dashboard__count">
              ${
                items.length === allItems.length
                  ? `${items.length} on this device`
                  : `${items.length} of ${allItems.length} shown`
              }
            </p>
          </div>
          <label class="dashboard__search">
            <span class="visually-hidden">Search patients</span>
            <input
              type="search"
              data-dashboard-search
              placeholder="Search name, email, or status…"
              value="${escapeHtml(state.dashboardSearch || "")}"
            />
          </label>
        </div>

        ${
          allItems.length === 0
            ? `<div class="dashboard__empty">
                <img src="assets/logo.png" alt="" class="dashboard__empty-logo" width="72" height="72" />
                <p class="dashboard__empty-title">No screenings yet</p>
                <p>Create a patient account first. When they start or finish the questionnaire, it appears here as complete or incomplete.</p>
                <div class="dashboard__empty-actions">
                  <button type="button" class="btn btn-primary" data-action="open-create-patient">Add a patient</button>
                </div>
                ${
                  isSampleReportPreviewEnabled()
                    ? `<p class="dashboard__empty-hint">Or use <strong>Skip questionnaire · sample report</strong> above to open a full report while you build the app.</p>`
                    : ""
                }
              </div>`
            : items.length === 0
              ? `<div class="dashboard__empty dashboard__empty--compact">
                  <p class="dashboard__empty-title">No matches</p>
                  <p>Try another name, or clear the search.</p>
                </div>`
              : `<div class="dashboard__list" role="list">
                  <div class="dash-row dash-row--head" aria-hidden="true">
                    <span class="dash-row__patient">Patient</span>
                    <span class="dash-row__status-col">Status</span>
                    <span class="dash-row__date">Date</span>
                    <span class="dash-row__pathway">Pathway</span>
                    <span class="dash-row__pattern">Results</span>
                    <span class="dash-row__actions">Actions</span>
                  </div>
                  ${rows}
                </div>`
        }
      </section>

      <p class="dashboard__footnote">
        Stored on this browser only · Completion, download, and expiry notes are emailed to
        <strong>${escapeHtml(getClinicianEmail())}</strong>
        unless you turn them off in My Preferences.
      </p>
          `
      }
    </div>
  `;
}

function currentAuthUser() {
  return typeof Auth !== "undefined" ? Auth.getCurrentUser() : null;
}

function resetAuthForm(role = "patient") {
  state.authForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role,
  };
  state.authError = null;
  state.authNotice = null;
  state.authBusy = false;
}

function clearAuthResetParams() {
  state.resetToken = null;
  if (!window.history?.replaceState) return;
  const clean = new URL(window.location.href);
  clean.searchParams.delete("reset");
  clean.searchParams.delete("forgot");
  window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
}

function renderHomeAccountLinks() {
  const user = currentAuthUser();
  if (user) {
    const tools =
      user.role === "admin"
        ? `<button type="button" class="btn btn-secondary" data-action="open-settings">Admin</button>
           <button type="button" class="btn btn-secondary" data-action="open-dashboard">Patients</button>
           <button type="button" class="btn btn-secondary" data-action="open-preferences">My Preferences</button>`
        : user.role === "therapist"
          ? `<button type="button" class="btn btn-secondary" data-action="open-dashboard">Dashboard</button>
             <button type="button" class="btn btn-secondary" data-action="open-preferences">My Preferences</button>
             <button type="button" class="btn btn-secondary" data-action="open-create-patient">Add patient</button>`
          : "";
    return `
      <p class="home-account-links__signed">Signed in as <strong>${escapeHtml(user.name)}</strong> · ${escapeHtml(Auth.roleLabel(user.role))}</p>
      <div class="home-account-links__actions">
        <button type="button" class="btn btn-secondary" data-action="open-account">My account</button>
        ${tools}
        <button type="button" class="btn btn-secondary" data-action="logout">Sign out</button>
      </div>
    `;
  }

  return `
    <p class="home-account-links__lead">Your therapist creates your account. Sign in with the email and password they sent you.</p>
    <div class="home-account-links__actions">
      <button type="button" class="btn btn-primary" data-action="open-login">Sign in</button>
      ${
        getLiveSettings().allowPatientSignup !== false
          ? `<button type="button" class="btn btn-secondary" data-action="open-signup">Create account &amp; sign in</button>`
          : ""
      }
      <button type="button" class="btn btn-secondary" data-action="open-dashboard">Therapist dashboard</button>
    </div>
  `;
}

function syncAccountChrome() {
  const mount = document.getElementById("account-chrome");
  if (!mount) return;
  const user = currentAuthUser();
  const onAuthView =
    state.view === "login" ||
    state.view === "signup" ||
    state.view === "forgot" ||
    state.view === "reset";

  if (onAuthView) {
    if (isPatientInvite()) {
      mount.innerHTML = "";
      return;
    }
    mount.innerHTML = `
      <button type="button" class="account-chrome__link" data-action="open-dashboard">Dashboard</button>
      <button type="button" class="account-chrome__link" data-action="back-home">Home</button>
    `;
    return;
  }

  if (!user) {
    mount.innerHTML = `
      <button type="button" class="account-chrome__link" data-action="open-dashboard">Dashboard</button>
      ${
        getLiveSettings().allowPatientSignup !== false
          ? `<button type="button" class="account-chrome__btn" data-action="open-signup">Create account</button>`
          : ""
      }
      <button type="button" class="account-chrome__link" data-action="open-login">Sign in</button>
    `;
    return;
  }

  const isClinician = user.role === "admin" || user.role === "therapist";
  const dashLink = user.role === "admin"
    ? `<button type="button" class="account-chrome__link" data-action="open-dashboard">Patients</button>`
    : isClinician
      ? `<button type="button" class="account-chrome__link" data-action="open-dashboard">Dashboard</button>`
      : `<button type="button" class="account-chrome__link" data-action="open-dashboard">Therapist</button>`;
  const settingsLink =
    user.role === "admin"
      ? `<button type="button" class="account-chrome__link" data-action="open-settings">Admin</button>
         <button type="button" class="account-chrome__link" data-action="open-preferences">Preferences</button>`
      : user.role === "therapist"
        ? `<button type="button" class="account-chrome__link" data-action="open-create-patient">Add patient</button>
           <button type="button" class="account-chrome__link" data-action="open-preferences">Preferences</button>`
        : "";

  mount.innerHTML = `
    <button type="button" class="account-chrome__link" data-action="open-account">${escapeHtml(user.name.split(" ")[0] || "Account")}</button>
    ${dashLink}
    ${settingsLink}
    <button type="button" class="account-chrome__link" data-action="logout">Sign out</button>
  `;
}

function renderAuthShell({ eyebrow, title, lead, body, footer = "" }) {
  return `
    <div class="auth">
      <section class="auth__panel" aria-labelledby="auth-heading">
        <p class="auth__eyebrow">${escapeHtml(eyebrow)}</p>
        <h1 id="auth-heading" class="auth__title">${escapeHtml(title)}</h1>
        <p class="auth__lead">${lead}</p>
        ${
          state.authError
            ? `<p class="error-banner" role="alert">${escapeHtml(state.authError)}</p>`
            : ""
        }
        ${
          state.authNotice
            ? `<p class="auth__notice" role="status">${escapeHtml(state.authNotice)}</p>`
            : ""
        }
        ${body}
        ${footer}
      </section>
    </div>
  `;
}

function renderLogin() {
  const form = state.authForm;
  const invite = isPatientInvite();
  return renderAuthShell({
    eyebrow: invite ? "Patient invite" : "Account",
    title: "Sign in",
    lead: invite
      ? "Sign in with the email and password your therapist sent you."
      : "Already have a password? Sign in to access your profile.",
    body: `
      <form class="auth__form" data-auth-form="login">
        <label class="auth__field">
          <span>Email</span>
          <input type="email" name="email" data-auth-field="email" autocomplete="email" required value="${escapeHtml(form.email)}" />
        </label>
        <label class="auth__field">
          <span>Password</span>
          <input type="password" name="password" data-auth-field="password" autocomplete="current-password" required value="${escapeHtml(form.password)}" />
        </label>
        <div class="auth__actions">
          <button type="submit" class="btn btn-primary" ${state.authBusy ? "disabled" : ""}>
            ${state.authBusy ? "Signing in…" : "Sign in"}
          </button>
          ${
            invite
              ? ""
              : `<button type="button" class="btn btn-secondary" data-action="back-home">Back to home</button>`
          }
        </div>
      </form>
    `,
    footer: invite
      ? `<p class="auth__switch">Your therapist creates your account. If you do not have a password yet, ask them to send your sign-in details.</p>`
      : `
      <p class="auth__switch">
        <button type="button" class="auth__text-btn" data-action="open-forgot">Forgot your password?</button>
      </p>
      ${
        getLiveSettings().allowTherapistSignup !== false
          ? `<p class="auth__switch">
        Therapist or admin?
        <button type="button" class="auth__text-btn" data-action="open-signup">Create a therapist account</button>
      </p>`
          : ""
      }
    `,
  });
}

function renderForgotPassword() {
  const form = state.authForm;
  return renderAuthShell({
    eyebrow: "Account",
    title: "Forgot password",
    lead: "Enter the email on your therapist or admin account. If it matches, we will send a link to create a new password.",
    body: `
      <form class="auth__form" data-auth-form="forgot">
        <label class="auth__field">
          <span>Email</span>
          <input type="email" name="email" data-auth-field="email" autocomplete="email" required value="${escapeHtml(form.email)}" />
        </label>
        <div class="auth__actions">
          <button type="submit" class="btn btn-primary" ${state.authBusy ? "disabled" : ""}>
            ${state.authBusy ? "Sending…" : "Email reset link"}
          </button>
          <button type="button" class="btn btn-secondary" data-action="open-login">Back to sign in</button>
        </div>
      </form>
    `,
    footer: `
      <p class="auth__hint">Open the link in the same browser you use to sign in. The first email to a new address may ask you to confirm FormSubmit once.</p>
    `,
  });
}

function renderResetPassword() {
  const form = state.authForm;
  return renderAuthShell({
    eyebrow: "Account",
    title: "Choose a new password",
    lead: "Enter a new password for your therapist account, then sign in with it.",
    body: `
      <form class="auth__form" data-auth-form="reset">
        <label class="auth__field">
          <span>New password</span>
          <input type="password" name="password" data-auth-field="password" autocomplete="new-password" required minlength="8" value="${escapeHtml(form.password)}" />
        </label>
        <label class="auth__field">
          <span>Confirm new password</span>
          <input type="password" name="confirmPassword" data-auth-field="confirmPassword" autocomplete="new-password" required minlength="8" value="${escapeHtml(form.confirmPassword)}" />
        </label>
        <div class="auth__actions">
          <button type="submit" class="btn btn-primary" ${state.authBusy ? "disabled" : ""}>
            ${state.authBusy ? "Saving…" : "Save new password"}
          </button>
          <button type="button" class="btn btn-secondary" data-action="open-forgot">Request a new link</button>
        </div>
      </form>
    `,
  });
}

function renderSignup() {
  const form = state.authForm;
  const settings = getLiveSettings();
  const invite = isPatientInvite();
  const patientOk = settings.allowPatientSignup !== false;
  const therapistOk = !invite && settings.allowTherapistSignup !== false;

  if (!patientOk && !therapistOk) {
    return renderAuthShell({
      eyebrow: invite ? "Patient invite" : "Account",
      title: "Registration closed",
      lead: "New accounts are not being accepted right now. Please contact the practice.",
      body: `
        <div class="auth__actions">
          <button type="button" class="btn btn-primary" data-action="open-login">Sign in</button>
          ${
            invite
              ? ""
              : `<button type="button" class="btn btn-secondary" data-action="back-home">Back to home</button>`
          }
        </div>
      `,
    });
  }

  if (invite && !patientOk) {
    return renderAuthShell({
      eyebrow: "Patient invite",
      title: "Account required",
      lead: "Please sign in with an existing account to continue your screening.",
      body: `
        <div class="auth__actions">
          <button type="button" class="btn btn-primary" data-action="open-login">Sign in</button>
        </div>
      `,
    });
  }

  const role = form.role === "therapist" && therapistOk ? "therapist" : "patient";

  return renderAuthShell({
    eyebrow: invite ? "Patient invite" : "Account",
    title: "Create account & sign in",
    lead: invite
      ? "Your therapist invited you to complete a sensory screening. Create an account &amp; sign in to get started."
      : "Patients can save their journey. Therapists can create invite links after approval.",
    body: `
      <form class="auth__form" data-auth-form="signup">
        ${
          invite
            ? `<input type="hidden" name="auth-role" value="patient" />`
            : `<fieldset class="auth__role">
          <legend>Account type</legend>
          ${
            patientOk
              ? `<label class="auth__choice">
            <input type="radio" name="auth-role" value="patient" data-auth-field="role" ${role === "patient" ? "checked" : ""} />
            <span><strong>Patient</strong><em>Complete screenings and keep an account on this device</em></span>
          </label>`
              : ""
          }
          ${
            therapistOk
              ? `<label class="auth__choice">
            <input type="radio" name="auth-role" value="therapist" data-auth-field="role" ${role === "therapist" ? "checked" : ""} />
            <span><strong>Therapist</strong><em>${settings.requireTherapistApproval ? "Requires admin approval before sign-in" : "Create patient invite links"}</em></span>
          </label>`
              : ""
          }
        </fieldset>`
        }
        <label class="auth__field">
          <span>Full name</span>
          <input type="text" name="name" data-auth-field="name" autocomplete="name" required value="${escapeHtml(form.name)}" />
        </label>
        <label class="auth__field">
          <span>Email</span>
          <input type="email" name="email" data-auth-field="email" autocomplete="email" required value="${escapeHtml(form.email)}" />
        </label>
        <label class="auth__field">
          <span>Phone <em>(optional)</em></span>
          <input type="tel" name="phone" data-auth-field="phone" autocomplete="tel" value="${escapeHtml(form.phone)}" />
        </label>
        <label class="auth__field">
          <span>Password</span>
          <input type="password" name="password" data-auth-field="password" autocomplete="new-password" required minlength="8" value="${escapeHtml(form.password)}" />
        </label>
        <label class="auth__field">
          <span>Confirm password</span>
          <input type="password" name="confirmPassword" data-auth-field="confirmPassword" autocomplete="new-password" required minlength="8" value="${escapeHtml(form.confirmPassword)}" />
        </label>
        <div class="auth__actions">
          <button type="submit" class="btn btn-primary" ${state.authBusy ? "disabled" : ""}>
            ${state.authBusy ? "Creating…" : "Create account & sign in"}
          </button>
          ${
            invite
              ? ""
              : `<button type="button" class="btn btn-secondary" data-action="back-home">Back to home</button>`
          }
        </div>
      </form>
    `,
    footer: invite
      ? `<p class="auth__switch">Already have a password? Open the home page and sign in to access your profile.</p>`
      : `
      <p class="auth__switch">
        Already have a password?
        <button type="button" class="auth__text-btn" data-action="open-login">Sign in</button>
      </p>
    `,
  });
}

function renderAccount() {
  const user = currentAuthUser();
  if (!user) {
    resetAuthForm();
    state.view = "login";
    return renderLogin();
  }

  const tools =
    user.role === "admin"
      ? `<button type="button" class="btn btn-primary" data-action="open-settings">Open admin overview</button>
         <button type="button" class="btn btn-secondary" data-action="open-dashboard">Patient dashboard</button>
         <button type="button" class="btn btn-secondary" data-action="open-preferences">My Preferences</button>`
      : user.role === "therapist"
        ? `<button type="button" class="btn btn-primary" data-action="open-dashboard">Open patient dashboard</button>
           <button type="button" class="btn btn-secondary" data-action="open-preferences">My Preferences</button>
           <button type="button" class="btn btn-secondary" data-action="open-create-patient">Add patient</button>`
        : user.questionnaireType
          ? `<button type="button" class="btn btn-primary" data-action="start-assigned-questionnaire">Start ${escapeHtml(questionnaireTypeLabel(user.questionnaireType, user.lifeContext))} questionnaire</button>`
          : `<button type="button" class="btn btn-primary" data-action="start-sensory">Continue sensory pathway</button>`;

  return `
    <div class="auth">
      <section class="auth__panel" aria-labelledby="account-heading">
        <p class="auth__eyebrow">Your account</p>
        <h1 id="account-heading" class="auth__title">${escapeHtml(user.name)}</h1>
        <p class="auth__lead">${escapeHtml(Auth.roleLabel(user.role))} · ${escapeHtml(Auth.statusLabel(user.status))}</p>
        <dl class="account-meta">
          <div><dt>Email</dt><dd>${escapeHtml(user.email)}</dd></div>
          <div><dt>Phone</dt><dd>${escapeHtml(user.phone || "—")}</dd></div>
          ${
            user.questionnaireType
              ? `<div><dt>Questionnaire</dt><dd>${escapeHtml(questionnaireTypeLabel(user.questionnaireType, user.lifeContext))}</dd></div>
          <div><dt>Age</dt><dd>${escapeHtml(user.age || "—")}</dd></div>
          <div><dt>Expires</dt><dd>${escapeHtml(user.expiresAt ? Auth.formatAuthDate(user.expiresAt) : `After ${QUESTIONNAIRE_EXPIRY_DAYS} days`)}</dd></div>
          <div><dt>Reason for referral</dt><dd>${escapeHtml(user.reasonForReferral || "—")}</dd></div>`
              : ""
          }
          <div><dt>Created</dt><dd>${escapeHtml(Auth.formatAuthDate(user.createdAt))}</dd></div>
          <div><dt>Last sign-in</dt><dd>${escapeHtml(Auth.formatAuthDate(user.lastLoginAt))}</dd></div>
        </dl>
        <div class="auth__actions">
          ${tools}
          <button type="button" class="btn btn-secondary" data-action="logout">Sign out</button>
          <button type="button" class="btn btn-secondary" data-action="back-home">Back to home</button>
        </div>
      </section>
    </div>
  `;
}

function filteredSettingsUsers() {
  const query = state.settingsSearch.trim().toLowerCase();
  return Auth.listUsers().filter((user) => {
    if (state.settingsFilter === "pending" && user.status !== "pending") return false;
    if (
      state.settingsFilter !== "all" &&
      state.settingsFilter !== "pending" &&
      user.role !== state.settingsFilter
    ) {
      return false;
    }
    if (!query) return true;
    const haystack = `${user.name} ${user.email} ${user.phone} ${user.notes}`.toLowerCase();
    return haystack.includes(query);
  });
}

function renderSettingsUserRow(user) {
  const isEditing = state.editingUserId === user.id;
  const current = currentAuthUser();
  const isSelf = current?.id === user.id;

  if (!isEditing) {
    return `
      <tr>
        <td>
          <div class="settings-user__name">${escapeHtml(user.name)}</div>
          <div class="settings-user__email">${escapeHtml(user.email)}</div>
        </td>
        <td><span class="settings-pill settings-pill--role">${escapeHtml(Auth.roleLabel(user.role))}</span></td>
        <td><span class="settings-pill settings-pill--${escapeHtml(user.status)}">${escapeHtml(Auth.statusLabel(user.status))}</span></td>
        <td>${escapeHtml(Auth.formatAuthDate(user.createdAt))}</td>
        <td>${escapeHtml(Auth.formatAuthDate(user.lastLoginAt))}</td>
        <td>
          <div class="settings-row-actions">
            ${
              user.status === "pending"
                ? `<button type="button" class="btn btn-primary btn--compact" data-action="approve-user" data-user-id="${escapeHtml(user.id)}">Approve</button>`
                : ""
            }
            <button type="button" class="btn btn-secondary btn--compact" data-action="edit-user" data-user-id="${escapeHtml(user.id)}">Edit</button>
            ${
              !isSelf
                ? `<button type="button" class="btn btn-secondary btn--compact" data-action="delete-user" data-user-id="${escapeHtml(user.id)}">Delete</button>`
                : ""
            }
          </div>
        </td>
      </tr>
    `;
  }

  return `
    <tr class="settings-user--editing">
      <td colspan="6">
        <form class="settings-edit" data-edit-user="${escapeHtml(user.id)}">
          <div class="settings-edit__grid">
            <label class="auth__field">
              <span>Name</span>
              <input type="text" name="name" value="${escapeHtml(user.name)}" required />
            </label>
            <label class="auth__field">
              <span>Phone</span>
              <input type="tel" name="phone" value="${escapeHtml(user.phone || "")}" />
            </label>
            <label class="auth__field">
              <span>Role</span>
              <select name="role">
                <option value="patient" ${user.role === "patient" ? "selected" : ""}>Patient</option>
                <option value="therapist" ${user.role === "therapist" ? "selected" : ""}>Therapist</option>
                <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
              </select>
            </label>
            <label class="auth__field">
              <span>Status</span>
              <select name="status">
                <option value="active" ${user.status === "active" ? "selected" : ""}>Active</option>
                <option value="pending" ${user.status === "pending" ? "selected" : ""}>Pending</option>
                <option value="disabled" ${user.status === "disabled" ? "selected" : ""}>Disabled</option>
              </select>
            </label>
            <label class="auth__field settings-edit__notes">
              <span>Notes</span>
              <textarea name="notes" rows="2">${escapeHtml(user.notes || "")}</textarea>
            </label>
          </div>
          <div class="settings-row-actions">
            <button type="submit" class="btn btn-primary btn--compact">Save</button>
            <button type="button" class="btn btn-secondary btn--compact" data-action="cancel-edit-user">Cancel</button>
          </div>
        </form>
      </td>
    </tr>
  `;
}

function renderSettingsUsersPanel() {
  const users = filteredSettingsUsers();
  const rows = users.map(renderSettingsUserRow).join("") || `
    <tr>
      <td colspan="6" class="settings-empty">No users match this filter.</td>
    </tr>
  `;

  return `
    <div class="settings-toolbar">
      <label class="settings-search">
        <span class="visually-hidden">Search users</span>
        <input type="search" placeholder="Search name, email, phone…" data-settings-search value="${escapeHtml(state.settingsSearch)}" />
      </label>
      <div class="settings-filters" role="group" aria-label="Filter users">
        ${["all", "patient", "therapist", "admin", "pending"]
          .map(
            (filter) => `
          <button
            type="button"
            class="settings-filter ${state.settingsFilter === filter ? "is-active" : ""}"
            data-action="settings-filter"
            data-filter="${filter}"
          >${filter === "all" ? "All" : filter === "pending" ? "Pending" : Auth.roleLabel(filter)}</button>
        `
          )
          .join("")}
      </div>
    </div>
    <div class="settings-table-wrap">
      <table class="settings-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Last sign-in</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderSettingsAppPanel() {
  const settings = getLiveSettings();
  return `
    <form class="settings-app" data-settings-form>
      <label class="auth__field">
        <span>Practice name</span>
        <input type="text" name="practiceName" value="${escapeHtml(settings.practiceName || "")}" />
      </label>
      <label class="auth__field">
        <span>Clinician results email</span>
        <input type="email" name="clinicianEmail" value="${escapeHtml(settings.clinicianEmail || "")}" required />
      </label>
      <label class="auth__check">
        <input type="checkbox" name="showPainPathway" ${settings.showPainPathway ? "checked" : ""} />
        <span>Show Pain pathway on the home screen</span>
      </label>
      <label class="auth__check">
        <input type="checkbox" name="allowPatientSignup" ${settings.allowPatientSignup !== false ? "checked" : ""} />
        <span>Allow public patient self-signup (off by default — therapists create patient accounts)</span>
      </label>
      <label class="auth__check">
        <input type="checkbox" name="allowTherapistSignup" ${settings.allowTherapistSignup !== false ? "checked" : ""} />
        <span>Allow therapist account registration</span>
      </label>
      <label class="auth__check">
        <input type="checkbox" name="requireTherapistApproval" ${settings.requireTherapistApproval !== false ? "checked" : ""} />
        <span>Require admin approval for new therapists</span>
      </label>
      <p class="auth__hint">Accounts are stored in this browser. Change your admin password in <code>config.js</code> before sharing this device, then clear site data only if you intentionally want a fresh seed.</p>
      <div class="auth__actions">
        <button type="submit" class="btn btn-primary">Save settings</button>
      </div>
    </form>
  `;
}

function renderSettingsUserStats() {
  const stats = Auth.getUserStats();
  return `
    <div class="settings-stats" role="list">
      <div class="settings-stat" role="listitem"><span class="settings-stat__value">${stats.total}</span><span class="settings-stat__label">Total users</span></div>
      <div class="settings-stat" role="listitem"><span class="settings-stat__value">${stats.patients}</span><span class="settings-stat__label">Patients</span></div>
      <div class="settings-stat" role="listitem"><span class="settings-stat__value">${stats.therapists}</span><span class="settings-stat__label">Therapists</span></div>
      <div class="settings-stat" role="listitem"><span class="settings-stat__value">${stats.pending}</span><span class="settings-stat__label">Pending</span></div>
      <div class="settings-stat" role="listitem"><span class="settings-stat__value">${stats.active}</span><span class="settings-stat__label">Active</span></div>
    </div>
  `;
}

function renderSettingsOverviewPanel() {
  requestStorageEstimate();
  const overview = getAdminOverviewStats();
  const usagePercent = overview.quota
    ? Math.min(100, Math.round(overview.usageRatio * 100))
    : overview.archiveLimit
      ? Math.min(100, Math.round((overview.archiveCount / overview.archiveLimit) * 100))
      : 0;
  const activeHint = [
    overview.assignedCount ? `${overview.assignedCount} assigned` : "",
    overview.inProgressCount ? `${overview.inProgressCount} in progress` : "",
    overview.expiredCount ? `${overview.expiredCount} expired` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const lastCompletedLabel = overview.lastCompleted
    ? formatQuestionnaireDate(overview.lastCompleted, "en")
    : "None yet";
  const revenueHint = overview.revenue.enabled
    ? `${overview.revenue.count} paid ${overview.revenue.count === 1 ? "payment" : "payments"} recorded`
    : "Online payments are not connected yet";
  const storageUsedLabel = overview.quota
    ? `${formatStorageBytes(overview.usage)} of ${overview.quotaIsEstimate ? "~" : ""}${formatStorageBytes(overview.quota)}`
    : formatStorageBytes(overview.local.bytes);
  const healthClass =
    overview.health === "critical"
      ? "settings-health--critical"
      : overview.health === "attention"
        ? "settings-health--attention"
        : "settings-health--healthy";

  return `
    <div class="settings-overview">
      <div class="settings-stats settings-stats--overview" role="list">
        <div class="settings-stat" role="listitem">
          <span class="settings-stat__value">${overview.totalPatients}</span>
          <span class="settings-stat__label">Total patients</span>
          <span class="settings-stat__hint">Patient accounts on this device</span>
        </div>
        <div class="settings-stat" role="listitem">
          <span class="settings-stat__value">${overview.activeAssessments}</span>
          <span class="settings-stat__label">Active assessments</span>
          <span class="settings-stat__hint">${escapeHtml(activeHint || "Assigned or in progress")}</span>
        </div>
        <div class="settings-stat" role="listitem">
          <span class="settings-stat__value">${overview.completedQuestionnaires}</span>
          <span class="settings-stat__label">Completed questionnaires</span>
          <span class="settings-stat__hint">Finished screenings archived here</span>
        </div>
        <div class="settings-stat" role="listitem">
          <span class="settings-stat__value">${overview.reportsGenerated}</span>
          <span class="settings-stat__label">Reports generated</span>
          <span class="settings-stat__hint">Sensory trail reports from completed screenings</span>
        </div>
        <div class="settings-stat ${overview.revenue.enabled ? "" : "settings-stat--muted"}" role="listitem">
          <span class="settings-stat__value">${escapeHtml(formatMoney(overview.revenue.amount, overview.revenue.currency))}</span>
          <span class="settings-stat__label">Revenue</span>
          <span class="settings-stat__hint">${escapeHtml(revenueHint)}</span>
        </div>
      </div>

      <section class="settings-health ${healthClass}" aria-labelledby="admin-health-heading">
        <div class="settings-health__header">
          <div>
            <h2 id="admin-health-heading" class="settings-health__title">System health and storage</h2>
            <p class="settings-health__note">${escapeHtml(overview.healthNote)}</p>
          </div>
          <span class="settings-health__status">${escapeHtml(overview.healthLabel)}</span>
        </div>
        <div class="settings-storage-bar" role="progressbar" aria-label="Storage used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${usagePercent}">
          <span class="settings-storage-bar__fill" style="width: ${usagePercent}%"></span>
        </div>
        <dl class="settings-health__grid">
          <div>
            <dt>Storage used</dt>
            <dd>${escapeHtml(storageUsedLabel)}${overview.quota ? ` · ${usagePercent}%` : ""}</dd>
          </div>
          <div>
            <dt>Assessments archived</dt>
            <dd>${overview.archiveCount} / ${overview.archiveLimit}</dd>
          </div>
          <div>
            <dt>Accounts</dt>
            <dd>${overview.totalUsers} users · ${overview.therapists} therapists</dd>
          </div>
          <div>
            <dt>Email delivery</dt>
            <dd>${escapeHtml(overview.delivery)} · ${escapeHtml(overview.clinicianEmail)}</dd>
          </div>
          <div>
            <dt>Last completed report</dt>
            <dd>${escapeHtml(lastCompletedLabel)}</dd>
          </div>
          <div>
            <dt>Browser store</dt>
            <dd>${overview.writable ? `${overview.local.keys} saved items` : "Not writable"}</dd>
          </div>
        </dl>
        <p class="settings-overview__footnote">Totals are recorded on this browser only. Revenue will total here if online payments are connected later.</p>
      </section>
    </div>
  `;
}

function renderSettings() {
  const user = currentAuthUser();
  if (!user || user.role !== "admin") {
    state.authError = "Admin access required.";
    state.view = "login";
    return renderLogin();
  }

  const tab = state.settingsTab === "users" || state.settingsTab === "settings" ? state.settingsTab : "overview";
  const title =
    tab === "users" ? "Users" : tab === "settings" ? "App settings" : "Practice overview";
  const lead =
    tab === "users"
      ? "Approve therapists, edit roles, and manage accounts for Soulful Sensory OT."
      : tab === "settings"
        ? "Practice name, clinician email, and who can create accounts."
        : "Live totals for patients, assessments, questionnaires, reports, revenue, and this browser’s storage.";

  return `
    <div class="settings">
      <header class="settings__header">
        <div>
          <p class="auth__eyebrow">Admin</p>
          <h1 class="settings__title">${title}</h1>
          <p class="settings__lead">${lead}</p>
        </div>
        <div class="settings__header-actions">
          <button type="button" class="btn btn-secondary" data-action="open-dashboard">Patient dashboard</button>
          <button type="button" class="btn btn-secondary" data-action="open-clinician">Invite tools</button>
          <button type="button" class="btn btn-secondary" data-action="back-home">Home</button>
        </div>
      </header>

      ${
        state.settingsError
          ? `<p class="error-banner" role="alert">${escapeHtml(state.settingsError)}</p>`
          : ""
      }
      ${
        state.settingsNotice
          ? `<p class="auth__notice" role="status">${escapeHtml(state.settingsNotice)}</p>`
          : ""
      }

      <div class="settings-tabs" role="tablist" aria-label="Admin sections">
        <button type="button" class="settings-tab ${tab === "overview" ? "is-active" : ""}" role="tab" aria-selected="${tab === "overview"}" data-action="settings-tab" data-tab="overview">Overview</button>
        <button type="button" class="settings-tab ${tab === "users" ? "is-active" : ""}" role="tab" aria-selected="${tab === "users"}" data-action="settings-tab" data-tab="users">Users</button>
        <button type="button" class="settings-tab ${tab === "settings" ? "is-active" : ""}" role="tab" aria-selected="${tab === "settings"}" data-action="settings-tab" data-tab="settings">App settings</button>
      </div>

      ${tab === "users" ? renderSettingsUserStats() : ""}

      <section class="settings__panel ${tab === "overview" ? "settings__panel--overview" : ""}">
        ${
          tab === "settings"
            ? renderSettingsAppPanel()
            : tab === "users"
              ? renderSettingsUsersPanel()
              : renderSettingsOverviewPanel()
        }
      </section>
    </div>
  `;
}


function renderSharingPermissionsSummary() {
  const copy = currentUi();
  const sharingItems = getSharingConsentItems(
    state.language,
    state.respondent || "adult",
    state.lifeContext
  );
  if (!sharingItems.length) return "";

  const rows = sharingItems
    .map((item) => {
      const allowed = Boolean(state.sharingConsent?.[item.id]);
      const statusLabel = allowed ? copy.sharingSummaryAllowed : copy.sharingSummaryNotGiven;
      const party = item.shortLabel || item.label;
      return `
        <li class="sharing-summary__row sharing-summary__row--${allowed ? "allowed" : "denied"}">
          <span class="sharing-summary__party">${escapeHtml(party)}</span>
          <span class="sharing-summary__status">${escapeHtml(statusLabel)}</span>
        </li>
      `;
    })
    .join("");

  return `
    <section class="sharing-summary" aria-labelledby="sharing-summary-heading">
      <h3 id="sharing-summary-heading">${escapeHtml(copy.sharingSummaryTitle)}</h3>
      <p class="sharing-summary__intro">${escapeHtml(copy.sharingSummaryIntro)}</p>
      <ul class="sharing-summary__list">${rows}</ul>
      <p class="sharing-summary__note">${escapeHtml(copy.sharingSummaryClinicianNote)}</p>
    </section>
  `;
}

function hasAllRequiredConsent() {
  const consentItems = getConsentItems(state.language, state.respondent || "adult");
  const requiredSharing = getSharingConsentItems(
    state.language,
    state.respondent || "adult",
    state.lifeContext
  ).filter((item) => item.required);
  return (
    consentItems.every((_, i) => Boolean(state.consent[i])) &&
    requiredSharing.every((item) => Boolean(state.sharingConsent?.[item.id]))
  );
}

function submissionStatusMessage(copy = currentUi()) {
  if (state.submissionStatus === "sent") return copy.thankYouSent;
  if (state.submissionStatus === "error") {
    if (state.submissionErrorCode === "formsubmit-activation") {
      return copy.thankYouActivation || copy.thankYouError;
    }
    if (state.submissionErrorCode === "file-protocol") {
      return copy.thankYouFileProtocol || copy.thankYouError;
    }
    if (state.submissionErrorCode === "network-blocked") {
      return copy.thankYouNetworkBlocked || copy.thankYouError;
    }
    return copy.thankYouError;
  }
  return copy.thankYouSending;
}

function renderSubmissionErrorDetail() {
  if (state.submissionStatus !== "error" || !state.submissionError) return "";
  return `<p class="submission-status__detail" data-submission-error-detail role="status">${escapeHtml(
    state.submissionError
  )}</p>`;
}

function renderSubmissionThankYou() {
  clearSensoryDraft();
  if (!state.completedAt) {
    state.completedAt = new Date().toISOString();
  }
  ensureAssessmentArchived();
  const copy = currentUi();
  const willEmail = shouldEmailResultsToClinician();
  let statusHtml = "";
  let showRetry = false;

  if (willEmail) {
    let statusClass = "submission-status";
    if (state.submissionStatus === "sent") {
      statusClass += " submission-status--sent";
    } else if (state.submissionStatus === "error") {
      statusClass += " submission-status--error";
      showRetry = true;
    } else {
      statusClass += " submission-status--pending";
    }
    statusHtml = `
      <p class="${statusClass}" data-submission-status role="status">${escapeHtml(submissionStatusMessage(copy))}</p>
      ${renderSubmissionErrorDetail()}
    `;
  }

  return renderShell(
    `
      <div class="thank-you">
        <h2>${escapeHtml(copy.thankYouTitle)}</h2>
        <p class="step-desc">${escapeHtml(copy.thankYouBody)}</p>
        ${statusHtml}
        <div class="actions">
          <button
            type="button"
            class="btn btn-secondary"
            data-action="retry-submit"
            ${showRetry ? "" : "hidden"}
          >${escapeHtml(copy.thankYouRetry)}</button>
          <button type="button" class="btn btn-secondary" data-action="back-home">${escapeHtml(copy.thankYouHome)}</button>
        </div>
      </div>
    `,
    renderProgress(),
    { stepType: "results" }
  );
}

function currentUi() {
  return getQuestionnaireUi(state.language);
}

function currentDomains() {
  return getSensoryDomains(state.language, state.respondent || "adult");
}

function currentDomain(domainId) {
  return currentDomains().find((domain) => domain.id === domainId);
}

function journeyPhases() {
  const copy = currentUi();
  const lastLabel =
    getPatientResultsAccess() === RESULTS_ACCESS.none
      ? state.language === "af"
        ? "Klaar"
        : "Done"
      : copy.viewpoint;
  return [
    { id: "consent", label: copy.trailhead, icon: "○" },
    { id: "details", label: copy.details, icon: "◇" },
    { id: "screening", label: copy.screening, icon: "△" },
    { id: "results", label: lastLabel, icon: "✦" },
  ];
}

function getJourneyPhaseIndex(stepIndex) {
  if (stepIndex <= 3) return 0;
  if (stepIndex === 4) return 1;
  if (stepIndex >= STEPS.length - 1) return 3;
  return 2;
}

function needsLifeContext(respondent = state.respondent) {
  if (hasLockedLifeContext()) return false;
  return respondent === "adult";
}

function canOfferWorkReport() {
  return state.respondent === "adult" && state.lifeContext === "work";
}

function canOfferSchoolReport() {
  return state.respondent === "teen" && (state.lifeContext === "school" || state.lifeContext === "homeSchool");
}

function canOfferSettingReport() {
  return canOfferWorkReport() || canOfferSchoolReport();
}

function isSchoolReport() {
  return canOfferSchoolReport();
}

function getSettingReportCopy() {
  const copy = currentUi();
  if (isSchoolReport()) {
    return {
      kicker: copy.schoolReportKicker,
      askTitle: copy.schoolReportAskTitle,
      subtitle: copy.schoolReportSubtitle,
      askYes: copy.schoolReportAskYes,
      askNo: copy.schoolReportAskNo,
      intro: copy.schoolReportIntro,
      name: copy.schoolReportName,
      roleLabel: copy.schoolReportSchoolGrade,
      reason: copy.schoolReportReason,
      reasonPlaceholder: copy.schoolReportReasonPlaceholder,
      preview: copy.schoolReportPreview,
      print: copy.schoolReportPrint,
      docTitle: copy.schoolReportDocTitle,
      preparedBy: copy.schoolReportPreparedBy,
      sectionAbout: copy.schoolReportSectionAbout,
      aboutBody: copy.schoolReportAboutBody,
      sectionOverload: copy.schoolReportSectionOverload,
      overloadBody: copy.schoolReportOverloadBody,
      sectionReferral: copy.schoolReportSectionReferral,
      referralBody: copy.schoolReportReferralBody,
      sectionDetails: copy.schoolReportSectionDetails,
      labelName: copy.schoolReportLabelName,
      labelRole: copy.schoolReportLabelSchool,
      labelReason: copy.schoolReportLabelReason,
      notProvided: copy.schoolReportNotProvided,
      sectionScores: copy.schoolReportSectionScores,
      sectionVisual: copy.schoolReportSectionVisual,
      visualAsk: copy.schoolReportVisualAsk,
      visualHint: copy.schoolReportVisualHint,
      visualBalance: copy.schoolReportVisualBalance,
      visualBalanceDesc: copy.schoolReportVisualBalanceDesc,
      visualDials: copy.schoolReportVisualDials,
      visualDialsDesc: copy.schoolReportVisualDialsDesc,
      visualCards: copy.schoolReportVisualCards,
      visualCardsDesc: copy.schoolReportVisualCardsDesc,
      visualLegendSensitive: copy.schoolReportVisualLegendSensitive,
      visualLegendNeutral: copy.schoolReportVisualLegendNeutral,
      visualLegendSeeking: copy.schoolReportVisualLegendSeeking,
      visualAxisLeft: copy.schoolReportVisualAxisLeft,
      visualAxisRight: copy.schoolReportVisualAxisRight,
      sectionChallenges: null,
      sectionRecs: copy.schoolReportSectionRecs,
      sectionGeneralRecs: null,
      sectionNotes: copy.schoolReportSectionNotes,
      notesAsk: copy.schoolReportNotesAsk,
      notesAskYes: copy.schoolReportNotesAskYes,
      notesAskNo: copy.schoolReportNotesAskNo,
      notesLabel: copy.schoolReportNotesLabel,
      notesPlaceholder: copy.schoolReportNotesPlaceholder,
      notesEmpty: copy.schoolReportNotesEmpty,
      closing: copy.schoolReportClosing,
      clinic: copy.schoolReportClinic,
    };
  }
  return {
    kicker: copy.workReportKicker,
    askTitle: copy.workReportAskTitle,
    subtitle: copy.workReportSubtitle,
    askYes: copy.workReportAskYes,
    askNo: copy.workReportAskNo,
    intro: copy.workReportIntro,
    name: copy.workReportName,
    roleLabel: copy.workReportJobTitle,
    reason: copy.workReportReason,
    reasonPlaceholder: copy.workReportReasonPlaceholder,
    preview: copy.workReportPreview,
    print: copy.workReportPrint,
    docTitle: copy.workReportDocTitle,
    preparedBy: copy.workReportPreparedBy,
    sectionAbout: copy.workReportSectionAbout,
    aboutBody: copy.workReportAboutBody,
    sectionOverload: null,
    overloadBody: null,
    sectionReferral: copy.workReportSectionReferral,
    referralBody: copy.workReportReferralBody,
    sectionDetails: copy.workReportSectionDetails,
    labelName: copy.workReportLabelName,
    labelRole: copy.workReportLabelJob,
    labelReason: copy.workReportLabelReason,
    notProvided: copy.workReportNotProvided,
    sectionScores: copy.workReportSectionScores,
    scaleIntro: copy.workReportScaleIntro,
    scaleLow: copy.workReportScaleLow,
    scaleMid: copy.workReportScaleMid,
    scaleHigh: copy.workReportScaleHigh,
    scaleLowHint: copy.workReportScaleLowHint,
    scaleMidHint: copy.workReportScaleMidHint,
    scaleHighHint: copy.workReportScaleHighHint,
    scaleStatusLow: copy.workReportScaleStatusLow,
    scaleStatusMid: copy.workReportScaleStatusMid,
    scaleStatusHigh: copy.workReportScaleStatusHigh,
    presentationLabel: copy.workReportPresentationLabel,
    phasePrepare: copy.workReportPhasePrepare,
    phaseDuring: copy.workReportPhaseDuring,
    phaseRecover: copy.workReportPhaseRecover,
    sectionVisual: null,
    visualAsk: null,
    visualHint: null,
    visualBalance: null,
    visualBalanceDesc: null,
    visualDials: null,
    visualDialsDesc: null,
    visualCards: null,
    visualCardsDesc: null,
    visualLegendSensitive: null,
    visualLegendNeutral: null,
    visualLegendSeeking: null,
    visualAxisLeft: null,
    visualAxisRight: null,
    sectionChallenges: copy.workReportSectionChallenges,
    sectionRecs: copy.workReportSectionRecs,
    sectionGeneralRecs: copy.workReportGeneralRecs,
    sectionNotes: null,
    notesAsk: null,
    notesAskYes: null,
    notesAskNo: null,
    notesLabel: null,
    notesPlaceholder: null,
    notesEmpty: null,
    closing: copy.workReportClosing,
    clinic: copy.workReportClinic,
  };
}

function fillReportTemplate(template, name) {
  return String(template || "").split("{name}").join(name);
}

function defaultSettingReportSections() {
  return isSchoolReport()
    ? { ...DEFAULT_SCHOOL_REPORT_SECTIONS }
    : { ...DEFAULT_WORK_REPORT_SECTIONS };
}

function normalizeSettingReportSections(raw) {
  const defaults = defaultSettingReportSections();
  const next = { ...defaults };
  if (!raw || typeof raw !== "object") return next;
  Object.keys(defaults).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      next[key] = Boolean(raw[key]);
    }
  });
  return next;
}

function getSettingReportSections() {
  return normalizeSettingReportSections(state.settingReportSections);
}

function createSettingReportCustomId() {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeSettingReportCustomSections(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      id: String(item?.id || createSettingReportCustomId()),
      heading: String(item?.heading || ""),
      body: String(item?.body || ""),
    }))
    .slice(0, 12);
}

function ensureSettingReportComposerDefaults() {
  if (!state.settingReportSections) {
    state.settingReportSections = defaultSettingReportSections();
  } else {
    state.settingReportSections = normalizeSettingReportSections(state.settingReportSections);
  }
  state.settingReportCustomSections = normalizeSettingReportCustomSections(
    state.settingReportCustomSections
  );
  if (isSchoolReport() && state.settingReportSections.notes === false) {
    state.schoolReportNotesEnabled = false;
  }
}

function resetSettingReportComposer() {
  state.settingReportSections = null;
  state.settingReportCustomSections = [];
}

function settingReportSectionEnabled(key) {
  return Boolean(getSettingReportSections()[key]);
}

function renderSettingReportSectionEditor(reportCopy) {
  const copy = currentUi();
  const sections = getSettingReportSections();
  const forSchool = isSchoolReport();
  const choices = forSchool
    ? [
        ["details", reportCopy.sectionDetails, copy.settingReportEditorDetailsHint],
        ["about", reportCopy.sectionAbout, copy.settingReportEditorAboutHint],
        ["overload", reportCopy.sectionOverload, copy.settingReportEditorOverloadHint],
        ["referral", reportCopy.sectionReferral, copy.settingReportEditorReferralHint],
        ["scores", reportCopy.sectionScores, copy.settingReportEditorScoresHint],
        ["visual", reportCopy.sectionVisual, copy.settingReportEditorVisualHint],
        ["recommendations", reportCopy.sectionRecs, copy.settingReportEditorRecsHint],
        ["notes", reportCopy.sectionNotes, copy.settingReportEditorNotesHint],
        ["closing", copy.settingReportEditorClosingLabel, copy.settingReportEditorClosingHint],
      ]
    : [
        ["details", reportCopy.sectionDetails, copy.settingReportEditorDetailsHint],
        ["about", reportCopy.sectionAbout, copy.settingReportEditorAboutHint],
        ["referral", reportCopy.sectionReferral, copy.settingReportEditorReferralHint],
        ["scores", reportCopy.sectionScores, copy.settingReportEditorScoresHint],
        ["challenges", reportCopy.sectionChallenges, copy.settingReportEditorChallengesHint],
        ["recommendations", reportCopy.sectionRecs, copy.settingReportEditorRecsHint],
        ["generalRecs", reportCopy.sectionGeneralRecs, copy.settingReportEditorGeneralRecsHint],
        ["closing", copy.settingReportEditorClosingLabel, copy.settingReportEditorClosingHint],
      ];

  const choiceHtml = choices
    .filter(([, label]) => Boolean(label))
    .map(
      ([key, label, hint]) => `
      <label class="setting-report-editor__choice">
        <input type="checkbox" data-setting-section="${escapeHtml(key)}"${sections[key] ? " checked" : ""} />
        <span>
          <strong>${escapeHtml(label)}</strong>
          <em>${escapeHtml(hint)}</em>
        </span>
      </label>`
    )
    .join("");

  const customBlocks = (state.settingReportCustomSections || [])
    .map(
      (item, index) => `
      <div class="setting-report-custom" data-custom-section-id="${escapeHtml(item.id)}">
        <div class="setting-report-custom__head">
          <p class="setting-report-custom__label">${escapeHtml(copy.settingReportCustomHeadingLabel)} ${index + 1}</p>
          <button type="button" class="setting-report-custom__remove" data-action="remove-setting-heading" data-custom-section-id="${escapeHtml(item.id)}">${escapeHtml(copy.settingReportCustomRemove)}</button>
        </div>
        <label class="work-report__field work-report__field--full">
          <span>${escapeHtml(copy.settingReportCustomHeading)}</span>
          <input type="text" data-setting-custom="heading" data-custom-section-id="${escapeHtml(item.id)}" value="${escapeHtml(item.heading)}" placeholder="${escapeHtml(copy.settingReportCustomHeadingPlaceholder)}" />
        </label>
        <label class="work-report__field work-report__field--full">
          <span>${escapeHtml(copy.settingReportCustomBody)}</span>
          <textarea data-setting-custom="body" data-custom-section-id="${escapeHtml(item.id)}" rows="4" placeholder="${escapeHtml(copy.settingReportCustomBodyPlaceholder)}">${escapeHtml(item.body)}</textarea>
        </label>
      </div>`
    )
    .join("");

  return `
    <aside class="setting-report-editor work-report__field--full no-print" aria-labelledby="setting-report-editor-title">
      <div class="setting-report-editor__head">
        <p class="setting-report-editor__eyebrow">${escapeHtml(copy.settingReportEditorEyebrow)}</p>
        <h4 id="setting-report-editor-title">${escapeHtml(copy.settingReportEditorTitle)}</h4>
        <p>${escapeHtml(copy.settingReportEditorLead)}</p>
      </div>
      <fieldset class="setting-report-editor__fields">
        <legend class="visually-hidden">${escapeHtml(copy.settingReportEditorLegend)}</legend>
        ${choiceHtml}
      </fieldset>

      <div class="setting-report-custom-list">
        <div class="setting-report-custom-list__head">
          <h4>${escapeHtml(copy.settingReportCustomTitle)}</h4>
          <p>${escapeHtml(copy.settingReportCustomLead)}</p>
        </div>
        ${customBlocks || `<p class="setting-report-custom-list__empty">${escapeHtml(copy.settingReportCustomEmpty)}</p>`}
        <button type="button" class="btn btn-secondary btn--compact" data-action="add-setting-heading">${escapeHtml(copy.settingReportCustomAdd)}</button>
      </div>
    </aside>
  `;
}

function renderSettingReportCustomSectionsHtml() {
  const items = normalizeSettingReportCustomSections(state.settingReportCustomSections).filter(
    (item) => item.heading.trim() || item.body.trim()
  );
  if (!items.length) return "";
  return items
    .map(
      (item) => `
            <section class="work-report-doc__custom" data-custom-section-id="${escapeHtml(item.id)}">
              <h5 data-setting-custom-text="heading">${escapeHtml(item.heading.trim() || "—")}</h5>
              <p data-setting-custom-text="body"${item.body.trim() ? "" : ' class="is-empty"'}>${
                item.body.trim() ? escapeHtml(item.body.trim()) : ""
              }</p>
            </section>`
    )
    .join("");
}

function getSchoolVisualStyle() {
  const style = state.schoolReportVisual;
  if (style === "dials" || style === "cards" || style === "balance") return style;
  return "balance";
}

function schoolVisualProfileLabel(profile, reportCopy) {
  if (profile === "sensitive") return reportCopy.visualLegendSensitive;
  if (profile === "seeking") return reportCopy.visualLegendSeeking;
  return reportCopy.visualLegendNeutral;
}

function schoolVisualMarkerPercent(profile) {
  if (profile === "sensitive") return 12;
  if (profile === "seeking") return 88;
  return 50;
}

function schoolVisualDialRotation(profile) {
  if (profile === "sensitive") return -70;
  if (profile === "seeking") return 70;
  return 0;
}

function renderSchoolReportVisual(rows, reportCopy) {
  const style = getSchoolVisualStyle();
  const legend = `
    <ul class="school-visual__legend" aria-label="${escapeHtml(reportCopy.sectionVisual)}">
      <li class="school-visual__legend-item school-visual__legend-item--sensitive">
        <span class="school-visual__swatch" aria-hidden="true"></span>
        ${escapeHtml(reportCopy.visualLegendSensitive)}
      </li>
      <li class="school-visual__legend-item school-visual__legend-item--neutral">
        <span class="school-visual__swatch" aria-hidden="true"></span>
        ${escapeHtml(reportCopy.visualLegendNeutral)}
      </li>
      <li class="school-visual__legend-item school-visual__legend-item--seeking">
        <span class="school-visual__swatch" aria-hidden="true"></span>
        ${escapeHtml(reportCopy.visualLegendSeeking)}
      </li>
    </ul>`;

  if (style === "dials") {
    const dials = rows
      .map((row) => {
        const rotation = schoolVisualDialRotation(row.profile);
        return `
        <li class="school-visual__dial" data-profile="${row.profile}" style="--domain-color:${row.color}">
          <div class="school-visual__dial-face" aria-hidden="true">
            <svg viewBox="0 0 100 64" class="school-visual__dial-svg" focusable="false">
              <path d="M12 52 A38 38 0 0 1 88 52" fill="none" stroke="rgba(60,78,70,0.12)" stroke-width="10" stroke-linecap="round"/>
              <path d="M12 52 A38 38 0 0 1 88 52" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" opacity="0.28"/>
              <g transform="rotate(${rotation} 50 52)">
                <line x1="50" y1="52" x2="50" y2="22" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
                <circle cx="50" cy="52" r="4.5" fill="currentColor"/>
              </g>
            </svg>
          </div>
          <span class="school-visual__dial-icon" aria-hidden="true">${row.icon}</span>
          <strong class="school-visual__dial-title">${escapeHtml(row.shortTitle)}</strong>
          <span class="school-visual__dial-status">${escapeHtml(schoolVisualProfileLabel(row.profile, reportCopy))}</span>
        </li>`;
      })
      .join("");

    return `
      <div class="school-visual school-visual--dials">
        ${legend}
        <ul class="school-visual__dials">${dials}</ul>
      </div>`;
  }

  if (style === "cards") {
    const cards = rows
      .map(
        (row) => `
        <li class="school-visual__card" data-profile="${row.profile}" style="--domain-color:${row.color}">
          <span class="school-visual__card-icon" aria-hidden="true">${row.icon}</span>
          <strong class="school-visual__card-title">${escapeHtml(row.shortTitle)}</strong>
          ${row.blurb ? `<p class="school-visual__card-blurb">${escapeHtml(row.blurb)}</p>` : ""}
          <span class="school-visual__card-pill">${escapeHtml(schoolVisualProfileLabel(row.profile, reportCopy))}</span>
          <span class="school-visual__card-threshold">${escapeHtml(row.thresholdLabel)}</span>
        </li>`
      )
      .join("");

    return `
      <div class="school-visual school-visual--cards">
        ${legend}
        <ul class="school-visual__cards">${cards}</ul>
      </div>`;
  }

  const bars = rows
    .map((row) => {
      const percent = schoolVisualMarkerPercent(row.profile);
      return `
      <li class="school-visual__bar-row" data-profile="${row.profile}" style="--domain-color:${row.color}; --marker:${percent}%">
        <div class="school-visual__bar-label">
          <span class="school-visual__bar-icon" aria-hidden="true">${row.icon}</span>
          <strong>${escapeHtml(row.shortTitle)}</strong>
        </div>
        <div class="school-visual__bar-track" role="img" aria-label="${escapeHtml(row.shortTitle)}: ${escapeHtml(schoolVisualProfileLabel(row.profile, reportCopy))}">
          <span class="school-visual__bar-fill" aria-hidden="true"></span>
          <span class="school-visual__bar-marker" aria-hidden="true"></span>
        </div>
        <span class="school-visual__bar-status">${escapeHtml(schoolVisualProfileLabel(row.profile, reportCopy))}</span>
      </li>`;
    })
    .join("");

  return `
    <div class="school-visual school-visual--balance">
      ${legend}
      <div class="school-visual__axis school-visual__axis--triple" aria-hidden="true">
        <span>${escapeHtml(reportCopy.visualLegendSensitive)}</span>
        <span>${escapeHtml(reportCopy.visualLegendNeutral)}</span>
        <span>${escapeHtml(reportCopy.visualLegendSeeking)}</span>
      </div>
      <ul class="school-visual__bars">${bars}</ul>
    </div>`;
}

function renderSchoolVisualPicker(reportCopy) {
  const selected = getSchoolVisualStyle();
  const options = [
    { id: "balance", label: reportCopy.visualBalance, desc: reportCopy.visualBalanceDesc },
    { id: "dials", label: reportCopy.visualDials, desc: reportCopy.visualDialsDesc },
    { id: "cards", label: reportCopy.visualCards, desc: reportCopy.visualCardsDesc },
  ]
    .map(
      (option) => `
      <label class="school-visual-picker__option${selected === option.id ? " is-selected" : ""}">
        <input type="radio" name="school-report-visual" value="${option.id}" ${selected === option.id ? "checked" : ""} />
        <span class="school-visual-picker__copy">
          <strong>${escapeHtml(option.label)}</strong>
          <span>${escapeHtml(option.desc)}</span>
        </span>
      </label>`
    )
    .join("");

  return `
    <div class="school-visual-picker work-report__field--full">
      <p class="school-visual-picker__ask">${escapeHtml(reportCopy.visualAsk)}</p>
      <p class="school-visual-picker__hint">${escapeHtml(reportCopy.visualHint)}</p>
      <div class="school-visual-picker__options" role="radiogroup" aria-label="${escapeHtml(reportCopy.visualAsk)}">
        ${options}
      </div>
    </div>`;
}

function getLifeContextOptions() {
  const copy = currentUi();
  if (state.respondent === "adult") {
    return [
      { id: "work", label: copy.contextWork, desc: copy.contextWorkDesc },
      { id: "home", label: copy.contextHome, desc: copy.contextHomeDesc },
    ];
  }
  return [];
}

function lifeContextLabel() {
  const copy = currentUi();
  if (state.lifeContext === "work") return copy.contextWork;
  if (state.lifeContext === "school") return copy.contextSchool;
  if (state.lifeContext === "home") return copy.contextHome;
  if (state.lifeContext === "homeSchool") return copy.contextHomeSchool;
  return "";
}

function moveStep(delta) {
  let next = state.step + delta;
  while (next > 0 && next < STEPS.length) {
    const type = STEPS[next]?.type;
    if (type === "respondent" && hasLockedRespondent()) {
      state.respondent = state.assignedRespondent;
      if (hasLockedLifeContext()) state.lifeContext = state.assignedLifeContext;
      next += delta;
      continue;
    }
    if (type === "coupleHub" && !needsCoupleHub()) {
      next += delta;
      continue;
    }
    if (type === "coupleWork" && !needsCoupleWork()) {
      next += delta;
      continue;
    }
    if (type === "idealSaturday" && !needsIdealSaturday()) {
      next += delta;
      continue;
    }
    if (type === "context" && !needsLifeContext()) {
      next += delta;
      continue;
    }
    break;
  }
  state.step = Math.min(Math.max(next, 0), STEPS.length - 1);
}

function renderShell(content, progress, { stepType = "welcome", domainId = null } = {}) {
  const copy = currentUi();
  const domainAttr = domainId ? ` data-domain="${domainId}"` : "";
  const inviteBanner = isPatientInvite()
    ? `<p class="invite-banner" role="status">${escapeHtml(inviteBannerText(copy))}</p>`
    : "";
  return `
    <article class="card card--${stepType}"${domainAttr}>
      <div class="questionnaire-toolbar" aria-label="${escapeHtml(copy.language)}">
        <span>${escapeHtml(copy.language)}</span>
        <button type="button" data-language="en" class="${state.language === "en" ? "is-active" : ""}" aria-pressed="${state.language === "en"}">${escapeHtml(copy.english)}</button>
        <button type="button" data-language="af" class="${state.language === "af" ? "is-active" : ""}" aria-pressed="${state.language === "af"}">${escapeHtml(copy.afrikaans)}</button>
      </div>
      ${inviteBanner}
      <div class="hero">
        <h1>${escapeHtml(copy.shellTitle)}</h1>
        <p>${escapeHtml(copy.shellSubtitle)}</p>
      </div>
      <div class="card-body">
        ${progress}
        <div class="step-content">${content}</div>
      </div>
    </article>
  `;
}

function renderProgress({ questionProgressHtml = "" } = {}) {
  const copy = currentUi();
  const questionnaireSteps = STEPS.length - 1;
  const current = Math.min(Math.max(state.step, 1), questionnaireSteps);
  const pct = Math.round(((current - 1) / (questionnaireSteps - 1 || 1)) * 100);
  const phaseIndex = getJourneyPhaseIndex(state.step);
  const label =
    state.step >= STEPS.length - 1
      ? shouldShowResultsToPatient()
        ? copy.results
        : copy.thankYouTitle
      : `${copy.step} ${current} ${copy.of} ${questionnaireSteps}`;
  const draftHint =
    state.step >= 1 && state.step < STEPS.length - 1
      ? `<p class="draft-hint">${escapeHtml(copy.draftAutoSaveHint)}</p>`
      : "";

  const journey = journeyPhases().map((phase, i) => {
    const status =
      i < phaseIndex ? "complete" : i === phaseIndex ? "active" : "upcoming";
    return `
      <li class="journey-step journey-step--${status}" aria-current="${status === "active" ? "step" : "false"}">
        <span class="journey-step__dot" aria-hidden="true">${phase.icon}</span>
        <span class="journey-step__label">${phase.label}</span>
      </li>
    `;
  }).join("");

  return `
    <div class="progress-sticky">
      <div class="progress-wrap">
        <ol class="journey-track" aria-label="${escapeHtml(copy.progressAria)}">${journey}</ol>
        <div class="progress-meta">
          <span>${label}</span>
          <span>${pct}%</span>
        </div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-fill" style="width: ${pct}%">
            <span class="progress-leaf" aria-hidden="true">▲</span>
          </div>
        </div>
      </div>
      ${questionProgressHtml}
      ${draftHint}
    </div>
  `;
}

function renderHome() {
  const copy = currentUi();
  const invite = isPatientInvite();

  const pathwaysInner = invite
    ? `
          <div class="home-pathways__header">
            <p class="home-section__eyebrow home-section__eyebrow--on-forest">Your screening</p>
            <h2 id="pathways-heading" class="home-section__title home-section__title--pathways">A gentle next step</h2>
            <p class="home-section__lead home-pathways__intro">
              Take your time with the page. When you’re ready, the start button is waiting at the bottom.
            </p>
          </div>
        `
    : `
          <div class="home-pathways__header">
            <p class="home-section__eyebrow home-section__eyebrow--on-forest">Your next step</p>
            <h2 id="pathways-heading" class="home-section__title home-section__title--pathways">Choose a pathway</h2>
            <p class="home-section__lead home-pathways__intro">
              ${
                isPainPathwayEnabled()
                  ? "Explore two different trails: one focused on how your senses shape daily life, and another on how pain shows up in your body."
                  : "Your sensory journey starts here."
              }
            </p>
          </div>

          <div class="trail-map" role="list" aria-label="Screening pathways">
            <button type="button" class="trail-row trail-row--sensory" data-action="start-sensory" role="listitem">
              <span class="trail-row__text">
                <span class="trail-row__cue">Click here</span>
                <span class="trail-row__top">
                  <span class="trail-row__name">Sensory questionnaire</span>
                  <span class="trail-row__meta">${hasSensoryDraft() ? "Saved progress" : "10–15 min"}</span>
                </span>
                <span class="trail-row__desc">${
                  hasSensoryDraft()
                    ? "Continue where you left off — your progress is saved on this device."
                    : "Explore how sound, touch, movement, light, smell and taste shape your everyday life."
                }</span>
              </span>
              <span class="trail-row__arrow" aria-hidden="true">→</span>
            </button>

            ${
              isPainPathwayEnabled()
                ? `<button type="button" class="trail-row trail-row--pain" data-action="start-pain" role="listitem">
              <span class="trail-row__text">
                <span class="trail-row__top">
                  <span class="trail-row__name">Pain</span>
                  <span class="trail-row__meta">Short screens</span>
                </span>
                <span class="trail-row__desc">Explore how pain may affect everyday life, work, mood, sleep and more — tap an area to begin.</span>
              </span>
              <span class="trail-row__arrow" aria-hidden="true">→</span>
            </button>`
                : ""
            }
          </div>
        `;

  const inviteStart = invite
    ? `
      <section class="home-section home-invite-start" id="start-screening" aria-labelledby="invite-start-heading">
        <p class="home-section__eyebrow">Your questionnaire</p>
        <h2 id="invite-start-heading" class="home-section__title">${escapeHtml(copy.inviteHomeStartTitle)}</h2>
        <img src="mountain-divider.svg" alt="" class="botanical-divider mountain-divider" width="600" height="44" />
        <p class="home-section__lead">${escapeHtml(copy.inviteHomeStartLead)}</p>
        ${
          hasSensoryDraft()
            ? renderSensoryResumePanel()
            : `<div class="home-invite-start__cta">
          <button type="button" class="btn btn-primary home-invite-start__btn" data-action="start-questionnaire">${escapeHtml(copy.inviteHomeStartCta)}</button>
          <p class="home-invite-start__note">${escapeHtml(copy.inviteHomeStartNote)}</p>
        </div>`
        }
      </section>
    `
    : "";

  const signedIn = !!currentAuthUser();
  const accountSection = invite
    ? ""
    : `
      <section class="home-section home-account" aria-labelledby="account-heading">
        <p class="home-section__eyebrow">${signedIn ? "Your account" : "Get started"}</p>
        <h2 id="account-heading" class="home-section__title">${signedIn ? "Welcome back" : "Sign in"}</h2>
        <img src="mountain-divider.svg" alt="" class="botanical-divider mountain-divider" width="600" height="44" />
        <div class="home-account-links">
          ${renderHomeAccountLinks()}
        </div>
      </section>
    `;

  return `
    <div class="home${invite ? " home--invite" : ""}">
      <section class="home-hero" aria-labelledby="home-brand">
        <div class="home-hero__atmosphere" aria-hidden="true">
          <div class="home-hero__sunwash"></div>
          <div class="home-hero__ridge home-hero__ridge--far"></div>
          <div class="home-hero__ridge home-hero__ridge--near"></div>
        </div>
        <div class="home-hero__content">
          <img src="assets/logo.png" alt="Soulful Sensory OT logo" class="home-hero__logo" width="120" height="120" />
          <p class="home-hero__eyebrow">Occupational Therapy Services</p>
          <h1 id="home-brand" class="home-hero__brand">Soulful Sensory OT</h1>
          ${
            invite
              ? `<p class="invite-banner invite-banner--hero" role="status">${escapeHtml(inviteBannerText(copy))}</p>
          <p class="home-hero__tagline">${escapeHtml(copy.inviteHomeScroll)}</p>
          <a class="home-hero__scroll" href="#start-screening">Scroll to begin</a>`
              : `<p class="home-hero__tagline">${
                  isPainPathwayEnabled()
                    ? "Gentle pathways into sensory understanding, and into living more fully with pain."
                    : "Exploring and understanding your sensory world."
                }</p>
          <a class="home-hero__scroll" href="#pathways">Choose a pathway</a>`
          }
        </div>
      </section>

      ${accountSection}

      ${
        !invite && isSampleReportPreviewEnabled()
          ? `<section class="home-section home-sample-preview" aria-label="Sample report preview">
              ${renderSampleReportPreviewControls()}
            </section>`
          : ""
      }

      <section class="home-section home-ot" aria-labelledby="ot-heading">
        <p class="home-section__eyebrow">About the practice</p>
        <h2 id="ot-heading" class="home-section__title">Occupational therapy</h2>
        <img src="mountain-divider.svg" alt="" class="botanical-divider mountain-divider" width="600" height="44" />
        <p class="home-section__lead">
          Occupational therapy looks at how your sensory systems affect the way you experience and respond to the world around you. For adults and adolescents, this can help make sense of things like feeling overwhelmed, struggling to focus, needing movement, becoming drained by certain environments, or finding everyday life more difficult than it seems. By understanding your unique sensory patterns, OT can help you find practical ways to feel more regulated, comfortable and able to engage in the things that matter to you.
        </p>
      </section>

      <section class="home-helps" aria-labelledby="helps-heading">
        <div class="home-helps__atmosphere" aria-hidden="true">
          <div class="home-helps__ridge home-helps__ridge--far"></div>
          <div class="home-helps__ridge home-helps__ridge--mid"></div>
          <div class="home-helps__ridge home-helps__ridge--near"></div>
          <div class="home-helps__contours"></div>
        </div>
        <header class="home-helps__banner">
          <div class="home-helps__banner-media" aria-hidden="true">
            <img
              src="assets/home-helps-banner.png"
              alt=""
              class="home-helps__banner-image"
              width="1024"
              height="639"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="home-helps__banner-veil" aria-hidden="true"></div>
          <div class="home-helps__banner-content">
            <p class="home-section__eyebrow home-helps__banner-eyebrow">The sensory questionnaire</p>
            <h2 id="helps-heading" class="home-section__title home-helps__banner-title">How this can help you:</h2>
          </div>
        </header>
        <div class="home-helps__inner">
          <img src="mountain-divider.svg" alt="" class="botanical-divider mountain-divider" width="600" height="44" />
          <p class="home-section__lead home-helps__lead">
            One main path — seven side trails into the places sensory understanding can take you.
          </p>

          <div class="home-helps__map" role="list" aria-label="Side trails from the sensory questionnaire">
            <svg class="home-helps__routes" viewBox="0 0 640 920" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
              <defs>
                <linearGradient id="helpsTrailFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#52775c" stop-opacity="0.15" />
                  <stop offset="8%" stop-color="#365b46" stop-opacity="0.85" />
                  <stop offset="92%" stop-color="#365b46" stop-opacity="0.85" />
                  <stop offset="100%" stop-color="#52775c" stop-opacity="0.15" />
                </linearGradient>
                <symbol id="helpsMiniPeak" viewBox="0 0 36 18">
                  <path d="M2 16 L10 5 L15 11 L22 2 L34 16 Z" fill="currentColor" />
                </symbol>
              </defs>

              <!-- Main hiking trail (winding) -->
              <path
                class="home-helps__main-path"
                d="M320 30
                   C335 72, 300 98, 324 128
                   C348 168, 295 198, 318 238
                   C342 282, 298 312, 322 352
                   C348 396, 292 426, 316 468
                   C342 512, 296 542, 320 584
                   C346 628, 290 658, 318 700
                   C344 744, 298 774, 320 816
                   C332 858, 312 882, 320 908"
              />

              <!-- Curvy side trails — stop short of the wording -->
              <path class="home-helps__branch home-helps__branch--1" d="M324 128 C295 82, 255 175, 242 138 C236 122, 230 112, 232 118" />
              <path class="home-helps__branch home-helps__branch--2" d="M318 238 C352 188, 395 295, 410 252 C416 234, 424 222, 422 230" />
              <path class="home-helps__branch home-helps__branch--3" d="M322 352 C288 308, 250 405, 240 368 C234 352, 228 338, 230 344" />
              <path class="home-helps__branch home-helps__branch--4" d="M316 468 C355 418, 398 530, 414 490 C420 472, 428 452, 426 460" />
              <path class="home-helps__branch home-helps__branch--5" d="M320 584 C285 536, 248 640, 238 600 C232 584, 226 568, 228 574" />
              <path class="home-helps__branch home-helps__branch--6" d="M318 700 C358 648, 402 765, 418 722 C424 704, 432 686, 430 694" />
              <path class="home-helps__branch home-helps__branch--7" d="M320 816 C286 770, 252 872, 240 834 C234 818, 228 802, 230 808" />

              <!-- Branch end peaks (sit between trail and text) -->
              <g class="home-helps__end-peaks" fill="#365b46">
                <use href="#helpsMiniPeak" x="214" y="108" width="28" height="14" opacity="0.55" />
                <use href="#helpsMiniPeak" x="410" y="220" width="28" height="14" opacity="0.55" />
                <use href="#helpsMiniPeak" x="212" y="334" width="28" height="14" opacity="0.55" />
                <use href="#helpsMiniPeak" x="414" y="450" width="28" height="14" opacity="0.55" />
                <use href="#helpsMiniPeak" x="210" y="564" width="28" height="14" opacity="0.55" />
                <use href="#helpsMiniPeak" x="418" y="684" width="28" height="14" opacity="0.55" />
                <use href="#helpsMiniPeak" x="212" y="798" width="28" height="14" opacity="0.55" />
              </g>

              <!-- Junction cairns on the main trail -->
              <circle class="home-helps__junction" cx="324" cy="128" r="5.5" />
              <circle class="home-helps__junction" cx="318" cy="238" r="5.5" />
              <circle class="home-helps__junction" cx="322" cy="352" r="5.5" />
              <circle class="home-helps__junction" cx="316" cy="468" r="5.5" />
              <circle class="home-helps__junction" cx="320" cy="584" r="5.5" />
              <circle class="home-helps__junction" cx="318" cy="700" r="5.5" />
              <circle class="home-helps__junction" cx="320" cy="816" r="5.5" />

              <circle class="home-helps__trailhead" cx="320" cy="30" r="7" />
              <circle class="home-helps__trailend" cx="320" cy="908" r="4.5" />
            </svg>

            <p class="home-helps__trailhead-label" aria-hidden="true">Trailhead</p>

            <article class="home-helps__dest home-helps__dest--1" role="listitem" style="--i:1">
              <div class="home-helps__sign">
                <span class="home-helps__peaks" aria-hidden="true">
                  <svg viewBox="0 0 52 22" width="44" height="18" fill="none">
                    <path d="M4 20 L14 6 L20 14 L28 2 L40 16 L46 10 L50 20 Z" fill="currentColor" opacity="0.28"/>
                    <path d="M8 20 L18 7 L24 15 L32 3 L48 20 Z" fill="currentColor" opacity="0.55"/>
                  </svg>
                </span>
                <h3 class="home-helps__title">Understand yourself</h3>
                <p class="home-helps__text">Your sensory patterns and how they shape everyday life.</p>
              </div>
            </article>
            <article class="home-helps__dest home-helps__dest--2" role="listitem" style="--i:2">
              <div class="home-helps__sign">
                <span class="home-helps__peaks" aria-hidden="true">
                  <svg viewBox="0 0 52 22" width="44" height="18" fill="none">
                    <path d="M4 20 L14 6 L20 14 L28 2 L40 16 L46 10 L50 20 Z" fill="currentColor" opacity="0.28"/>
                    <path d="M8 20 L18 7 L24 15 L32 3 L48 20 Z" fill="currentColor" opacity="0.55"/>
                  </svg>
                </span>
                <h3 class="home-helps__title">Relationships &amp; conflict</h3>
                <p class="home-helps__text">How different needs show up in communication and conflict.</p>
              </div>
            </article>
            <article class="home-helps__dest home-helps__dest--3" role="listitem" style="--i:3">
              <div class="home-helps__sign">
                <span class="home-helps__peaks" aria-hidden="true">
                  <svg viewBox="0 0 52 22" width="44" height="18" fill="none">
                    <path d="M4 20 L14 6 L20 14 L28 2 L40 16 L46 10 L50 20 Z" fill="currentColor" opacity="0.28"/>
                    <path d="M8 20 L18 7 L24 15 L32 3 L48 20 Z" fill="currentColor" opacity="0.55"/>
                  </svg>
                </span>
                <h3 class="home-helps__title">Work &amp; burnout</h3>
                <p class="home-helps__text">Energy, stress, and a work setup that fits you better.</p>
              </div>
            </article>
            <article class="home-helps__dest home-helps__dest--4" role="listitem" style="--i:4">
              <div class="home-helps__sign">
                <span class="home-helps__peaks" aria-hidden="true">
                  <svg viewBox="0 0 52 22" width="44" height="18" fill="none">
                    <path d="M4 20 L14 6 L20 14 L28 2 L40 16 L46 10 L50 20 Z" fill="currentColor" opacity="0.28"/>
                    <path d="M8 20 L18 7 L24 15 L32 3 L48 20 Z" fill="currentColor" opacity="0.55"/>
                  </svg>
                </span>
                <h3 class="home-helps__title">School &amp; studying</h3>
                <p class="home-helps__text">What helps you feel regulated and ready to learn.</p>
              </div>
            </article>
            <article class="home-helps__dest home-helps__dest--5" role="listitem" style="--i:5">
              <div class="home-helps__sign">
                <span class="home-helps__peaks" aria-hidden="true">
                  <svg viewBox="0 0 52 22" width="44" height="18" fill="none">
                    <path d="M4 20 L14 6 L20 14 L28 2 L40 16 L46 10 L50 20 Z" fill="currentColor" opacity="0.28"/>
                    <path d="M8 20 L18 7 L24 15 L32 3 L48 20 Z" fill="currentColor" opacity="0.55"/>
                  </svg>
                </span>
                <h3 class="home-helps__title">Attention &amp; focus</h3>
                <p class="home-helps__text">What supports concentration — and what gets in the way.</p>
              </div>
            </article>
            <article class="home-helps__dest home-helps__dest--6" role="listitem" style="--i:6">
              <div class="home-helps__sign">
                <span class="home-helps__peaks" aria-hidden="true">
                  <svg viewBox="0 0 52 22" width="44" height="18" fill="none">
                    <path d="M4 20 L14 6 L20 14 L28 2 L40 16 L46 10 L50 20 Z" fill="currentColor" opacity="0.28"/>
                    <path d="M8 20 L18 7 L24 15 L32 3 L48 20 Z" fill="currentColor" opacity="0.55"/>
                  </svg>
                </span>
                <h3 class="home-helps__title">Stress &amp; anxiety</h3>
                <p class="home-helps__text">Sensory factors behind overwhelm, and ways to settle.</p>
              </div>
            </article>
            <article class="home-helps__dest home-helps__dest--7" role="listitem" style="--i:7">
              <div class="home-helps__sign">
                <span class="home-helps__peaks" aria-hidden="true">
                  <svg viewBox="0 0 52 22" width="44" height="18" fill="none">
                    <path d="M4 20 L14 6 L20 14 L28 2 L40 16 L46 10 L50 20 Z" fill="currentColor" opacity="0.28"/>
                    <path d="M8 20 L18 7 L24 15 L32 3 L48 20 Z" fill="currentColor" opacity="0.55"/>
                  </svg>
                </span>
                <h3 class="home-helps__title">Sensory overload</h3>
                <p class="home-helps__text">What tips you over — and how to recover.</p>
              </div>
            </article>

            <p class="home-helps__trailend-label" aria-hidden="true">Keep walking</p>
          </div>
        </div>
      </section>

      <section class="home-pathways" id="pathways" aria-labelledby="pathways-heading">
        <div class="home-pathways__visual" aria-hidden="true">
          <img src="assets/outeniqua-pathways.png" alt="" class="home-pathways__canopy" width="1536" height="1024" />
        </div>

        <div class="home-pathways__inner">
          ${pathwaysInner}
        </div>
      </section>

      <section class="home-section home-contact" aria-labelledby="contact-heading">
        <img src="assets/logo.png" alt="Soulful Sensory OT logo" class="home-contact__logo" width="120" height="120" />
        <p class="home-section__eyebrow">Contact</p>
        <h2 id="contact-heading" class="home-section__title">Get in touch</h2>
        <p class="home-contact__name">Cayley Alberts</p>
        <p class="home-contact__role">Occupational Therapist · Soulful Sensory OT</p>
        <div class="home-contact__links">
          <a
            class="home-contact__whatsapp"
            href="${WHATSAPP_URL}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg class="home-contact__whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
              <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span class="home-contact__whatsapp-text">
              <span class="home-contact__whatsapp-label">WhatsApp</span>
              <span class="home-contact__whatsapp-number">068 901 4209</span>
            </span>
          </a>
          <a class="home-contact__email" href="mailto:soulfulsensoryot@gmail.com">soulfulsensoryot@gmail.com</a>
        </div>
        <p class="home-contact__hint">Questions or bookings — message anytime on WhatsApp.</p>
      </section>

      ${inviteStart}

      <a
        class="whatsapp-fab"
        href="${WHATSAPP_URL}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Soulful Sensory OT on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" width="28" height="28">
          <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  `;
}

function renderSensoryLanding() {
  const places = SENSORY_AREAS.map(
    (area, i) => `
      <li class="sensory-flow__place sensory-flow__place--${escapeHtml(area.id)}" style="--i:${i}">
        <span class="sensory-flow__marker" aria-hidden="true">
          <span class="sensory-flow__marker-dot"></span>
        </span>
        <div class="sensory-flow__stop">
          <span class="sensory-flow__mile">Stop ${i + 1}</span>
          <span class="sensory-flow__place-name">${escapeHtml(area.name)}</span>
          <span class="sensory-flow__place-desc">${escapeHtml(area.desc)}</span>
          <span class="sensory-flow__place-detail">${escapeHtml(area.detail)}</span>
        </div>
      </li>
    `
  ).join("");

  return `
    <div class="home home--sensory">
      <section class="sensory-flow" aria-labelledby="sensory-heading">
        <div class="sensory-flow__atmosphere" aria-hidden="true">
          <div class="sensory-flow__mist sensory-flow__mist--1"></div>
          <div class="sensory-flow__mist sensory-flow__mist--2"></div>
        </div>

        <header class="sensory-flow__intro">
          ${
            isPatientInvite()
              ? ""
              : `<button type="button" class="sensory-flow__back" data-action="back-home">← Back to home</button>`
          }
          <p class="sensory-flow__eyebrow">${isPatientInvite() ? "Patient screening" : "Pathway"}</p>
          <h1 id="sensory-heading" class="sensory-flow__brand">Sensory questionnaire</h1>
          ${
            isPatientInvite()
              ? `<p class="invite-banner invite-banner--hero" role="status">${escapeHtml(inviteBannerText())}</p>`
              : ""
          }
          <p class="sensory-flow__lead">
            Sensory systems shape how you move through everyday life — at home, at work, at school, and in relationship with others.
          </p>
          ${
            hasSensoryDraft()
              ? renderSensoryResumePanel()
              : `<div class="sensory-flow__cta">
            <button type="button" class="btn btn-primary sensory-flow__cta-btn" data-action="start-questionnaire">Start the sensory screening</button>
            <p class="sensory-flow__cta-note">Takes about 10–15 minutes · Progress saves on this device · or read more below first</p>
          </div>`
          }
        </header>

        <div class="sensory-flow__places" aria-labelledby="places-heading">
          <div class="sensory-flow__places-scene" aria-hidden="true">
            <img
              src="assets/heading-forest-trail.png"
              alt=""
              class="sensory-flow__places-photo"
              width="682"
              height="1024"
              loading="lazy"
              decoding="async"
            />
            <div class="sensory-flow__places-veil"></div>
            <div class="sensory-flow__places-mist sensory-flow__places-mist--1"></div>
            <div class="sensory-flow__places-mist sensory-flow__places-mist--2"></div>
            <svg class="sensory-flow__places-path" viewBox="0 0 960 120" preserveAspectRatio="none">
              <path d="M40 88 C160 40 260 108 380 62 C500 16 580 98 700 54 C800 20 880 78 920 48" />
            </svg>
          </div>
          <div class="sensory-flow__places-heading">
            <p class="sensory-flow__label">Along the trail</p>
            <h2 id="places-heading" class="sensory-flow__title">Places your senses shape</h2>
            <img src="hero-vine-rule.svg" alt="" class="sensory-flow__places-rule" width="180" height="12" />
          </div>
          <ol class="sensory-flow__trail" aria-label="Places and spaces">
            ${places}
          </ol>
        </div>

        <img src="mountain-divider.svg" alt="" class="sensory-flow__divider mountain-divider" width="600" height="44" />

        <div class="sensory-flow__needs" aria-labelledby="needs-heading">
          <p class="sensory-flow__label">Understanding your</p>
          <h2 id="needs-heading" class="sensory-flow__title">Sensory needs</h2>
          <div class="sensory-flow__copy">
            <p>
              Sensory preferences work a bit like taste in music. One person may love rock, another classical,
              and someone else hip-hop — none better or worse, just different.
            </p>
            <p>
              People's sensory needs work the same way. Some need quieter, calmer spaces to feel okay.
              Others do better with more sound, light or movement around them. Some prefer still, seated
              activities; others need to move, stretch or be physically active. This questionnaire helps you
              notice what your senses need — and how to support that in everyday life.
            </p>
          </div>

          <div class="sensory-fit" aria-labelledby="fit-heading">
            <h3 id="fit-heading" class="sensory-fit__heading">Match vs mismatch</h3>
            <p class="sensory-fit__intro">
              How well your environment — such as school or work — fits your sensory needs makes a real difference to how you feel and function.
            </p>

            <div class="sensory-fit__ridge" aria-hidden="true">
              <svg class="sensory-fit__mountains" viewBox="0 0 640 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="sensory-fit__peak sensory-fit__peak--far" d="M0 160 L95 72 L150 108 L230 38 L310 95 L390 55 L470 100 L545 48 L640 120 L640 160 Z" />
                <path class="sensory-fit__peak sensory-fit__peak--mid" d="M0 160 L70 105 L140 130 L220 70 L300 118 L380 82 L470 125 L550 88 L640 140 L640 160 Z" />
                <path class="sensory-fit__peak sensory-fit__peak--near" d="M0 160 L110 118 L180 138 L260 98 L340 132 L430 108 L520 142 L600 120 L640 148 L640 160 Z" />
              </svg>
            </div>

            <ol class="sensory-fit__path">
              <li class="sensory-fit__stop">
                <span class="sensory-fit__name">Mismatch</span>
                <p class="sensory-fit__text">
                  When an environment does not support your sensory needs, it can lead to possible overwhelm,
                  frustration and anxiety — as well as boredom.
                </p>
                <p class="sensory-fit__words">Overwhelm · Frustration · Anxiety · Boredom</p>
              </li>
              <li class="sensory-fit__stop">
                <span class="sensory-fit__name">Match</span>
                <p class="sensory-fit__text">
                  When an environment does support your sensory needs, it allows for more regulated emotions
                  and a greater quality of life, engagement and focus.
                </p>
                <p class="sensory-fit__words">Regulated emotions · Quality of life · Engagement · Focus</p>
              </li>
            </ol>
          </div>

          <div class="sensory-flow__cta sensory-flow__cta--end">
            <p class="sensory-flow__cta-lead">Ready when you are</p>
            ${
              hasSensoryDraft()
                ? renderSensoryResumePanel()
                : `<button type="button" class="btn btn-primary sensory-flow__cta-btn" data-action="start-questionnaire">Start the sensory screening</button>`
            }
          </div>
        </div>
      </section>
    </div>
  `;
}

const PAIN_SCALE = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "A little" },
  { value: 2, label: "Moderately" },
  { value: 3, label: "A lot" },
  { value: 4, label: "Extremely" },
];

const PAIN_IMPACT_NODES = [
  {
    id: "everyday",
    color: "#7b9e72",
    lines: ["Everyday", "activities"],
    title: "Everyday activities",
    description:
      "These questions explore how pain affects the ordinary tasks that make up your day — from self-care to household routines.",
    questions: [
      "Pain makes everyday tasks harder for me (for example cooking, dressing, bathing or household chores).",
      "I avoid or put off daily activities because of pain.",
      "Pain limits how independently I can manage my day-to-day routines.",
      "I need more time, rests or help to get through ordinary tasks because of pain.",
      "Pain makes it difficult to keep up with cooking, cleaning or shopping.",
      "I have to plan my day around what my pain will allow.",
      "I use more effort than I would like to complete basic tasks.",
      "Pain affects my ability to care for myself in the way I want to.",
      "I have had to change how I do familiar everyday activities.",
      "I feel frustrated by the effect pain has on my daily routine.",
    ],
  },
  {
    id: "social",
    color: "#6a9e8f",
    lines: ["Social life", "& connection"],
    title: "Social life & connection",
    description:
      "These questions explore how pain shapes time with others — friendships, family, gatherings and feeling connected.",
    questions: [
      "Pain makes it harder for me to join social plans or spend time with others.",
      "I cancel or limit social plans because of pain.",
      "Pain affects how present or connected I feel in conversations and relationships.",
      "I feel more isolated or withdrawn because of pain.",
      "I worry that others do not understand what living with pain is like.",
      "Pain makes it difficult to be spontaneous with friends or family.",
      "I leave social events earlier than I would like because of pain.",
      "Pain affects closeness or intimacy in my relationships.",
      "I feel guilty when pain changes plans involving other people.",
      "I participate less in my community or social groups because of pain.",
    ],
  },
  {
    id: "work",
    color: "#52775c",
    lines: ["Work", "& school"],
    title: "Work & school",
    description:
      "These questions explore how pain affects focus, productivity and taking part in work or learning.",
    questions: [
      "Pain makes it harder to concentrate or stay productive at work or school.",
      "I miss days, leave early, or reduce my load because of pain.",
      "Pain affects how well I keep up with deadlines, studying or workplace demands.",
      "I worry that pain is holding me back in my work or studies.",
      "I need more breaks than I would like while working or studying.",
      "Pain makes sitting, standing or using equipment difficult.",
      "I find it harder to remember or process information when pain is high.",
      "I avoid certain work or learning tasks because they may increase my pain.",
      "Pain affects my confidence in my work or academic abilities.",
      "I have had to change my role, hours or study routine because of pain.",
    ],
  },
  {
    id: "sport",
    color: "#8faf7a",
    lines: ["Sport", "& exercise"],
    title: "Sport & exercise",
    description:
      "These questions explore how pain affects movement, sport, exercise and physical activities you value.",
    questions: [
      "Pain limits the sport, exercise or physical activity I can take part in.",
      "I have reduced or stopped activities I enjoy because of pain.",
      "I feel frustrated or discouraged about moving my body because of pain.",
      "Pain makes it harder to stay as active as I would like.",
      "I worry that movement or exercise may make my pain worse.",
      "I avoid particular movements because they feel unsafe or uncomfortable.",
      "I need longer to recover after physical activity.",
      "Pain has changed the type or intensity of exercise I choose.",
      "I miss the enjoyment, confidence or connection that sport gave me.",
      "I find it difficult to balance staying active with managing pain.",
    ],
  },
  {
    id: "sleep",
    color: "#5f8269",
    lines: ["Sleep", "& rest"],
    title: "Sleep & rest",
    description:
      "These questions explore how pain affects falling asleep, staying asleep and feeling rested.",
    questions: [
      "Pain makes it harder to fall asleep or stay asleep.",
      "I wake feeling tired or unrefreshed because of pain.",
      "Pain interrupts my rest during the day or night.",
      "Poor sleep related to pain affects how I cope the next day.",
      "I struggle to find a comfortable sleeping position because of pain.",
      "Pain wakes me earlier than I would like.",
      "I need to rest during the day because pain has disrupted my sleep.",
      "Worry about pain keeps my mind active at bedtime.",
      "My sleep routine has changed because of pain.",
      "Even after resting, I do not feel restored.",
    ],
  },
  {
    id: "energy",
    color: "#7a9e9e",
    lines: ["Energy", "& fatigue"],
    title: "Energy & fatigue",
    description:
      "These questions explore how pain relates to tiredness, stamina and having enough energy for the day.",
    questions: [
      "Pain leaves me feeling drained or low in energy.",
      "I tire more quickly during the day because of pain.",
      "Fatigue linked to pain limits what I can manage.",
      "I need more recovery time after activity because of pain.",
      "I have to carefully ration my energy across the day.",
      "My energy changes unpredictably because of pain.",
      "I run out of energy before completing the things I planned.",
      "Managing pain itself takes a lot of my energy.",
      "I choose between important activities because I cannot manage them all.",
      "Low energy makes it harder to maintain routines that matter to me.",
    ],
  },
  {
    id: "mood",
    color: "#8a6f66",
    lines: ["Mood", "& emotions"],
    title: "Mood & emotions",
    description:
      "These questions explore how pain interacts with mood, stress, worry and emotional wellbeing.",
    questions: [
      "Pain affects my mood (for example feeling low, irritable or flat).",
      "Living with pain increases my stress or worry.",
      "Pain makes it harder to enjoy things I usually care about.",
      "My emotions feel harder to manage when pain is present.",
      "I feel frustrated or angry about the limits pain places on me.",
      "I worry about when pain may worsen or flare.",
      "I feel less hopeful when pain has been difficult for a long time.",
      "Pain makes me feel emotionally exhausted.",
      "I find it harder to relax when I am in pain.",
      "Changes in my mood affect how I cope with pain.",
    ],
  },
  {
    id: "esteem",
    color: "#38596b",
    lines: ["Self-esteem", "& confidence"],
    title: "Self-esteem & confidence",
    description:
      "These questions explore how pain may shape confidence, self-worth and how you see yourself.",
    questions: [
      "Pain affects how confident I feel in myself.",
      "I feel less capable or independent because of pain.",
      "Pain has changed how I see myself or my abilities.",
      "I feel discouraged about my future or goals because of pain.",
      "I compare what I can do now with what I could do before pain.",
      "I feel self-conscious about needing help, breaks or adjustments.",
      "Pain makes me doubt whether I can follow through on plans.",
      "I feel that pain has changed important parts of my identity.",
      "I am less willing to try new or challenging activities because of pain.",
      "It is difficult to recognise my strengths while coping with pain.",
    ],
  },
];

function ensurePainAnswers() {
  PAIN_IMPACT_NODES.forEach((node) => {
    if (!Array.isArray(state.painAnswers[node.id])) {
      state.painAnswers[node.id] = [];
    }
  });
}

function getPainCategory(id) {
  return PAIN_IMPACT_NODES.find((node) => node.id === id) || null;
}

function getSelectedPainCategories() {
  return (state.painSelected || [])
    .map((id) => getPainCategory(id))
    .filter(Boolean);
}

function painSelectionIndex(id) {
  return (state.painSelected || []).indexOf(id);
}

function isPainCategoryDone(id) {
  const score = scorePainCategory(id);
  return Boolean(score && score.answered > 0);
}

function togglePainSelection(id) {
  if (!getPainCategory(id)) return;
  const selected = state.painSelected || [];
  const index = selected.indexOf(id);
  if (index === -1) {
    state.painSelected = [...selected, id];
  } else {
    state.painSelected = selected.filter((item) => item !== id);
  }
  persistPainSelection();
}

const PAIN_SELECTION_KEY = "soulfulPainSelected";

function persistPainSelection() {
  try {
    sessionStorage.setItem(PAIN_SELECTION_KEY, JSON.stringify(state.painSelected || []));
  } catch (_) {
    /* ignore storage errors */
  }
}

function restorePainSelection() {
  if (Array.isArray(state.painSelected) && state.painSelected.length) return;
  try {
    const raw = sessionStorage.getItem(PAIN_SELECTION_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    state.painSelected = parsed.filter((id) => Boolean(getPainCategory(id)));
  } catch (_) {
    /* ignore storage errors */
  }
}

function clearPainSelection() {
  state.painSelected = [];
  try {
    sessionStorage.removeItem(PAIN_SELECTION_KEY);
  } catch (_) {
    /* ignore storage errors */
  }
}

function updatePainMapSelectionUI() {
  const selected = state.painSelected || [];
  const map = app.querySelector(".pain-map");
  if (!map) {
    render();
    return;
  }

  map.querySelectorAll(".pain-map__node").forEach((node) => {
    const id = node.getAttribute("data-pain-category");
    const category = getPainCategory(id);
    if (!category) return;

    const index = selected.indexOf(id);
    const isSelected = index !== -1;
    node.classList.toggle("pain-map__node--selected", isSelected);
    node.setAttribute("aria-pressed", String(isSelected));
    node.setAttribute(
      "aria-label",
      isSelected ? `Deselect ${category.title}` : `Select ${category.title}`
    );

    const ring = node.querySelector(".pain-map__node-ring");
    if (ring) {
      ring.setAttribute("fill", isSelected ? "#dff0e1" : "#f4f7f2");
      ring.setAttribute("stroke-width", isSelected ? "4" : "2.6");
    }

    node.querySelectorAll(".pain-map__badge, .pain-map__badge-num").forEach((el) => el.remove());

    if (isSelected) {
      const cx = Number(ring?.getAttribute("cx") || 0);
      const cy = Number(ring?.getAttribute("cy") || 0);
      const r = Number(ring?.getAttribute("r") || 42);
      const badge = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      badge.setAttribute("class", "pain-map__badge");
      badge.setAttribute("cx", String(cx + r - 2));
      badge.setAttribute("cy", String(cy - r + 4));
      badge.setAttribute("r", "14");
      badge.setAttribute("fill", category.color);

      const num = document.createElementNS("http://www.w3.org/2000/svg", "text");
      num.setAttribute("class", "pain-map__badge-num");
      num.setAttribute("x", String(cx + r - 2));
      num.setAttribute("y", String(cy - r + 4));
      num.setAttribute("text-anchor", "middle");
      num.setAttribute("dominant-baseline", "central");
      num.textContent = String(index + 1);

      node.appendChild(badge);
      node.appendChild(num);
    }
  });

  const ctaHost = app.querySelector(".pain-impact__cta-slot");
  if (ctaHost) {
    const count = selected.length;
    ctaHost.innerHTML =
      count > 0
        ? `<div class="pain-impact__cta">
            <p class="pain-impact__cta-note">
              ${count} ${count === 1 ? "area" : "areas"} selected
              · tap again to deselect
            </p>
            <button type="button" class="btn btn-primary pain-impact__summary-btn" data-action="start-pain-questionnaires">
              Continue to questionnaires →
            </button>
          </div>`
        : `<p class="pain-impact__cta-note pain-impact__cta-note--empty">Tap the areas you’d like to explore, then continue.</p>`;
  }
}

const PAIN_AREA_SUMMARIES = {
  everyday: {
    little:
      "Your responses suggest everyday tasks are still largely manageable. You may notice occasional slowing or extra effort, without major disruption to your routine.",
    mild:
      "Pain appears to be making some daily tasks harder — for example chores, self-care or keeping a steady rhythm. Small adaptations and pacing may already help protect energy.",
    moderate:
      "Pain seems to be meaningfully limiting independence in day-to-day life. Planning, rest breaks and simplified routines are likely needed more often than you would like.",
    significant:
      "Everyday activities appear heavily affected. Getting through cooking, dressing, cleaning or basic routines may take substantial effort, time or support — a strong focus for occupational therapy.",
    otFocus:
      "OT can help with pacing, task simplification, energy-conserving strategies and redesigning routines so daily life feels more doable.",
  },
  social: {
    little:
      "Connection with others still seems fairly available to you. Pain may occasionally influence plans, without strongly shaping your social life overall.",
    mild:
      "Pain may be making social plans harder to keep, or reducing how present you feel with others. Early awareness can help you protect valued relationships kindly.",
    moderate:
      "Pain appears to be limiting gatherings, intimacy or community involvement. Cancelling, leaving early or withdrawing may be becoming more common.",
    significant:
      "Social life and connection seem strongly affected. Isolation, guilt and reduced participation can become part of the pain cycle — support here can make a real difference.",
    otFocus:
      "OT can support graded social re-engagement, communication around needs, and finding ways to stay connected without overloading your system.",
  },
  work: {
    little:
      "Work or study still seems broadly manageable. You may notice mild concentration or stamina dips without major disruption to roles.",
    mild:
      "Pain may be affecting focus, deadlines or stamina at work or school. Breaks and environmental adjustments could reduce strain.",
    moderate:
      "Pain appears to be interfering with productivity, attendance or confidence in learning/work roles. Load, seating, pacing and expectations may need review.",
    significant:
      "Work or school participation seems heavily limited. Missing days, reducing hours or struggling to keep up may be shaping your sense of capability and future plans.",
    otFocus:
      "OT can explore workplace/school accommodations, attention strategies, graded return and sustainable routines around valued roles.",
  },
  sport: {
    little:
      "Movement and activity still seem fairly accessible. You may be making small adjustments without losing the benefits of being active.",
    mild:
      "Pain may be reducing enjoyment or confidence in sport and exercise. Fear of flares can start to shape what you choose to do.",
    moderate:
      "Physical activity appears meaningfully limited. You may have stopped or reduced valued movement, or need long recovery after activity.",
    significant:
      "Sport and exercise seem strongly restricted. Loss of movement, fitness or identity linked to activity can deepen frustration and deconditioning — careful rebuilding matters.",
    otFocus:
      "OT can support graded activity, confidence with movement, and finding forms of exercise that fit your nervous system and goals.",
  },
  sleep: {
    little:
      "Rest still seems mostly protective. Occasional disrupted nights may happen without dominating your days.",
    mild:
      "Pain may be affecting sleep onset, comfort or next-day freshness. Protecting a calm wind-down routine can help.",
    moderate:
      "Sleep and rest appear meaningfully disrupted. Night waking, poor restoration and daytime fatigue may be reinforcing each other.",
    significant:
      "Sleep seems heavily affected by pain. Ongoing exhaustion can amplify pain sensitivity, mood changes and coping capacity — a priority area for support.",
    otFocus:
      "OT can help with sleep hygiene, evening routines, positioning ideas and daytime pacing that supports better recovery.",
  },
  energy: {
    little:
      "Energy levels still seem broadly workable. You may notice mild tiredness after busier days without major rationing of activity.",
    mild:
      "Pain-related fatigue may be asking you to plan more carefully. Protecting peaks and troughs in energy can prevent boom-bust cycles.",
    moderate:
      "Fatigue linked to pain appears to limit what you can manage. Choosing between activities and needing longer recovery may feel familiar.",
    significant:
      "Energy seems strongly depleted by pain. Constant rationing, unpredictability and exhaustion can shrink daily life — pacing and prioritising become essential tools.",
    otFocus:
      "OT can teach activity pacing, energy budgeting and realistic weekly planning so valued activities stay possible.",
  },
  mood: {
    little:
      "Mood still seems relatively steady alongside pain. Occasional frustration or worry may appear without taking centre stage.",
    mild:
      "Pain may be colouring mood — irritability, flatness or worry — especially on harder days. Naming this early can reduce self-blame.",
    moderate:
      "Emotional wellbeing appears meaningfully affected. Stress, low mood or reduced enjoyment may be feeding into how pain is experienced.",
    significant:
      "Mood and emotions seem strongly intertwined with pain. Feeling overwhelmed, hopeless or emotionally exhausted can intensify the nervous system’s threat response.",
    otFocus:
      "OT can support regulation strategies, meaningful activity for mood, and compassionate routines that reduce emotional load.",
  },
  esteem: {
    little:
      "Sense of self still seems largely intact. You may notice small confidence dips without a major shift in identity.",
    mild:
      "Pain may be nudging self-doubt or comparisons with ‘before’. Gentle recognition of strengths can protect confidence.",
    moderate:
      "Self-esteem and confidence appear meaningfully affected. Feeling less capable or independent can shape willingness to try and plan ahead.",
    significant:
      "Identity and confidence seem strongly impacted. Pain may have changed how you see yourself, your abilities and your future — rebuilding a valued sense of self is part of recovery.",
    otFocus:
      "OT can help reconnect you with roles, strengths and achievable goals that restore confidence and belonging.",
  },
};

function scorePainCategory(categoryId) {
  const category = getPainCategory(categoryId);
  const answers = state.painAnswers[categoryId] || [];
  if (!category) return null;

  const values = category.questions
    .map((_, i) => answers[i])
    .filter((v) => typeof v === "number");

  if (values.length === 0) {
    return {
      average: 0,
      percent: 0,
      level: "none",
      label: "Not yet screened",
      description: "",
      detail: "",
      otFocus: "",
      answered: 0,
      total: category.questions.length,
    };
  }

  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  const percent = Math.round((average / 4) * 100);

  let level = "little";
  let label = "Little impact";

  if (percent >= 75) {
    level = "significant";
    label = "Significant struggle";
  } else if (percent >= 50) {
    level = "moderate";
    label = "Moderate struggle";
  } else if (percent >= 25) {
    level = "mild";
    label = "Mild struggle";
  }

  const areaCopy = PAIN_AREA_SUMMARIES[categoryId] || {};
  const detail =
    areaCopy[level] ||
    "Your answers suggest pain is touching this part of life in ways worth noticing with care.";
  const otFocus =
    areaCopy.otFocus ||
    "Occupational therapy can help you understand this pattern and find practical ways to take part more fully.";

  return {
    average,
    percent,
    level,
    label,
    description: detail,
    detail,
    otFocus,
    answered: values.length,
    total: category.questions.length,
  };
}

function painMapIcon(id, color) {
  const s = `fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"`;
  const f = `fill="rgba(244, 247, 242, 0.95)" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"`;

  const icons = {
    everyday: `
      <path ${f} d="M-14 4 L0 -12 L14 4 V16 H-14 Z" />
      <path ${s} d="M-4 16 V8 H4 V16" />`,
    social: `
      <circle cx="-8" cy="-7" r="5.5" ${f} />
      <path ${s} d="M-17 14 C-17 5.5, 1 5.5, 1 14" />
      <circle cx="9" cy="-5" r="4.8" ${f} />
      <path ${s} d="M1 14 C1 7, 17 7, 17 14" />`,
    work: `
      <rect x="-12" y="-2" width="24" height="18" rx="4" ${f} />
      <path ${s} d="M-6 -2 V-8 C-6 -13, 6 -13, 6 -8 V-2" />
      <path ${s} d="M-12 5 H12" />
      <path ${s} d="M-3 10 H3" />`,
    sport: `
      <path ${f} d="M-18 14 L-7 -6 L0 6 L8 -10 L18 14 Z" />
      <path ${s} d="M-7 -6 L-3 2" />
      <path ${s} d="M8 -10 L4 0" />
      <circle cx="8" cy="-14" r="2.4" fill="${color}" stroke="none" />`,
    sleep: `
      <path ${f} d="M7 -13 C-1 -13, -12 -4, -12 5 C-12 14, -2 18, 8 15 C1 16, -3 9, -3 2 C-3 -5, 1 -12, 7 -13 Z" />
      <circle cx="12" cy="-6" r="1.8" fill="${color}" stroke="none" />
      <circle cx="15" cy="2" r="1.2" fill="${color}" stroke="none" opacity="0.7" />`,
    energy: `
      <circle cx="0" cy="0" r="7.5" ${f} />
      <path ${s} d="M0 -16 V-12 M0 12 V16 M-16 0 H-12 M12 0 H16
        M-11.3 -11.3 L-8.5 -8.5 M8.5 8.5 L11.3 11.3
        M11.3 -11.3 L8.5 -8.5 M-8.5 8.5 L-11.3 11.3" />`,
    mood: `
      <path ${f} d="M-15 2 C-15 -5, -8 -9, -2 -7 C0 -13, 11 -12, 13 -5 C18 -5, 18 5, 12 7 H-11 C-16 7, -18 3, -15 2 Z" />
      <path ${s} d="M-5 12 V16 M0 11 V17 M5 12 V16" />`,
    esteem: `
      <path ${f} d="M-16 14 L0 -8 L16 14 Z" />
      <path ${s} d="M0 -8 V-16" />
      <path d="M0 -16 L12 -12 L0 -8 Z" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" />`,
  };

  return `<g class="pain-map__glyph">${icons[id] || ""}</g>`;
}

function painMapHiker() {
  return `
    <g class="pain-map__hiker">
      <!-- walking stick -->
      <path d="M18 -8 L8 28" fill="none" stroke="rgba(250,252,248,0.55)" stroke-width="2.2" stroke-linecap="round" />
      <!-- backpack -->
      <rect x="-16" y="-6" width="11" height="14" rx="2.5" fill="rgba(250,252,248,0.28)" stroke="rgba(250,252,248,0.95)" stroke-width="2.2" />
      <!-- legs -->
      <path d="M-2 10 L-10 30" fill="none" stroke="rgba(250,252,248,0.96)" stroke-width="3.2" stroke-linecap="round" />
      <path d="M2 10 L11 30" fill="none" stroke="rgba(250,252,248,0.96)" stroke-width="3.2" stroke-linecap="round" />
      <!-- body -->
      <path d="M-7 -8 L7 -8 L5 12 H-5 Z" fill="rgba(250,252,248,0.92)" stroke="rgba(250,252,248,0.96)" stroke-width="1.5" stroke-linejoin="round" />
      <!-- arm holding stick -->
      <path d="M6 -4 L16 -2" fill="none" stroke="rgba(250,252,248,0.96)" stroke-width="3" stroke-linecap="round" />
      <!-- free arm -->
      <path d="M-6 -4 L-14 6" fill="none" stroke="rgba(250,252,248,0.96)" stroke-width="3" stroke-linecap="round" />
      <!-- head -->
      <circle cx="0" cy="-18" r="8" fill="rgba(250,252,248,0.95)" stroke="rgba(237,242,235,0.35)" stroke-width="1" />
      <!-- trail underfoot -->
      <path d="M-22 34 C-8 28, 10 30, 24 24" fill="none" stroke="rgba(250,252,248,0.45)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 7" />
    </g>`;
}

function renderPainImpact() {
  const cx = 560;
  const cy = 520;
  const radius = 268;
  const nodeR = 42;
  const labelGap = 88;

  const placed = PAIN_IMPACT_NODES.map((n, i) => {
    const angleDeg = -90 + i * (360 / PAIN_IMPACT_NODES.length);
    const angle = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = cx + radius * cos;
    const y = cy + radius * sin;

    // Push labels well clear of their own node, with extra outward bias
    // so diagonal text cannot drift into neighbouring icons.
    const labelR = radius + nodeR + labelGap;
    let lx = cx + labelR * cos;
    let ly = cy + labelR * sin;

    // Extra horizontal clearance for side / diagonal labels
    lx += cos * 18;
    // Extra vertical clearance for top / bottom labels
    ly += sin * 14;

    let anchor = "middle";
    if (cos > 0.35) anchor = "start";
    else if (cos < -0.35) anchor = "end";

    return { ...n, x, y, lx, ly, anchor, cos, sin };
  });

  const connectors = placed
    .map(
      (n, i) =>
        `<line class="pain-map__trail" x1="${cx}" y1="${cy}" x2="${n.x}" y2="${n.y}" style="animation-delay:${0.12 + i * 0.07}s" />`
    )
    .join("");

  const nodes = placed
    .map((n, i) => {
      const lineH = 22;
      // Keep the whole label block outside the node: for top labels, start above;
      // for bottom, hang below; for sides, centre on the ray.
      let labelStartY;
      if (n.sin < -0.5) {
        // top — place block above the anchor so it grows upward away from icon
        labelStartY = n.ly - lineH;
      } else if (n.sin > 0.5) {
        // bottom — first line at anchor, second below
        labelStartY = n.ly;
      } else {
        labelStartY = n.ly - ((n.lines.length - 1) * lineH) / 2;
      }

      const label = n.lines
        .map(
          (line, li) =>
            `<tspan x="${n.lx}" y="${labelStartY + li * lineH}">${line}</tspan>`
        )
        .join("");
      const selectionIndex = painSelectionIndex(n.id);
      const selected = selectionIndex !== -1;
      const number = selected ? selectionIndex + 1 : "";
      return `
      <g class="pain-map__node${selected ? " pain-map__node--selected" : ""}"
         style="animation-delay:${0.28 + i * 0.08}s"
         data-action="toggle-pain-area"
         data-pain-category="${n.id}"
         tabindex="0"
         role="button"
         aria-pressed="${selected}"
         aria-label="${selected ? `Deselect ${n.title}` : `Select ${n.title}`}">
        <circle class="pain-map__hit" cx="${n.x}" cy="${n.y}" r="${nodeR + 14}" fill="#ffffff" fill-opacity="0" pointer-events="all" />
        <circle class="pain-map__node-ring" cx="${n.x}" cy="${n.y}" r="${nodeR}" fill="${selected ? "#dff0e1" : "#f4f7f2"}" stroke="${n.color}" stroke-width="${selected ? 4 : 2.6}" pointer-events="none" />
        <g class="pain-map__glyph-wrap" transform="translate(${n.x}, ${n.y}) scale(1.08)" pointer-events="none">${painMapIcon(n.id, n.color)}</g>
        <text class="pain-map__label" text-anchor="${n.anchor}" fill="${n.color}" pointer-events="all">${label}</text>
        ${
          selected
            ? `<circle class="pain-map__badge" cx="${n.x + nodeR - 2}" cy="${n.y - nodeR + 4}" r="14" fill="${n.color}" pointer-events="none" />
               <text class="pain-map__badge-num" x="${n.x + nodeR - 2}" y="${n.y - nodeR + 4}" text-anchor="middle" dominant-baseline="central" pointer-events="none">${number}</text>`
            : ""
        }
      </g>`;
    })
    .join("");

  const titleAreas = PAIN_IMPACT_NODES.map((n) => n.lines.join(" ")).join(", ");
  const selectedCount = (state.painSelected || []).length;

  return `
    <section class="pain-impact" aria-labelledby="pain-impact-heading">
      <div class="pain-impact__intro">
        <p class="home-hero__eyebrow">Why it matters</p>
        <h2 id="pain-impact-heading" class="pain-impact__title">How pain ripples through daily life</h2>
        <p class="pain-impact__lead">
          Pain rarely stays in one place. It can reach into the everyday things that make life feel
          full — work and learning, relationships, movement, rest, mood and how we see ourselves.
          First choose the areas that feel relevant. You’ll answer those questionnaires next.
        </p>
      </div>

      <ol class="pain-steps" aria-label="How to use this screening">
        <li class="pain-steps__item">
          <span class="pain-steps__num">1</span>
          <span class="pain-steps__text"><strong>Choose your areas.</strong> Tap icons on the map to select them. They will highlight and number in the order you pick.</span>
        </li>
        <li class="pain-steps__item">
          <span class="pain-steps__num">2</span>
          <span class="pain-steps__text"><strong>Continue when ready.</strong> You’ll only see questionnaires for the areas you chose — answer as many or as few items as you like.</span>
        </li>
        <li class="pain-steps__item">
          <span class="pain-steps__num">3</span>
          <span class="pain-steps__text"><strong>See your summary.</strong> Review which chosen areas are most affected and where occupational therapy could help.</span>
        </li>
      </ol>

      <div class="pain-map">
        <svg viewBox="0 0 1120 1040" role="group" aria-labelledby="pain-map-title" preserveAspectRatio="xMidYMid meet">
          <title id="pain-map-title">An explorer at the centre, with pain branching out to ${titleAreas}. Tap areas to select them.</title>
          <g class="pain-map__trails">${connectors}</g>
          <g class="pain-map__center" transform="translate(${cx}, ${cy})">
            <circle class="pain-map__center-disc" cx="0" cy="0" r="88" />
            <g transform="translate(0, -10) scale(1.05)">${painMapHiker()}</g>
            <text class="pain-map__center-label" x="0" y="48" text-anchor="middle">
              <tspan x="0" dy="0">Living</tspan>
              <tspan x="0" dy="16">with pain</tspan>
            </text>
          </g>
          ${nodes}
        </svg>
      </div>
      ${
        selectedCount > 0
          ? `<div class="pain-impact__cta-slot">
              <div class="pain-impact__cta">
                <p class="pain-impact__cta-note">
                  ${selectedCount} ${selectedCount === 1 ? "area" : "areas"} selected
                  · tap again to deselect
                </p>
                <button type="button" class="btn btn-primary pain-impact__summary-btn" data-action="start-pain-questionnaires">
                  Continue to questionnaires →
                </button>
              </div>
            </div>`
          : `<div class="pain-impact__cta-slot">
              <p class="pain-impact__cta-note pain-impact__cta-note--empty">Tap the areas you’d like to explore, then continue.</p>
            </div>`
      }
      ${state.error ? `<div class="error-banner">${escapeHtml(state.error)}</div>` : ""}
    </section>
  `;
}

function renderPainLanding() {
  ensurePainAnswers();
  restorePainSelection();
  return `
    <div class="home home--pain">
      <section class="pain-hero" aria-labelledby="pain-heading">
        <div class="pain-hero__atmosphere" aria-hidden="true"></div>
        <div class="pain-hero__content">
          <p class="home-hero__eyebrow">Pathway</p>
          <h1 id="pain-heading" class="pain-hero__title">Pain</h1>
          <p class="pain-hero__lead">
            Pain can touch every part of daily life — movement, rest, mood, work and connection.
            First choose the areas that feel relevant on the map below, then complete those short questionnaires.
          </p>
          <p class="pain-hero__note">Choose first, then screen — for guidance only, not a diagnosis.</p>
          <div class="pain-hero__actions">
            <button type="button" class="btn btn-secondary" data-action="back-home">Back to home</button>
            <a class="btn btn-primary" href="mailto:soulfulsensoryot@gmail.com?subject=Pain%20pathway%20enquiry">Get in touch</a>
          </div>
        </div>
      </section>
      ${renderPainImpact()}
    </div>
  `;
}

function renderPainCategoryScreen() {
  ensurePainAnswers();
  const selected = getSelectedPainCategories();
  if (!selected.length) {
    state.view = "pain";
    state.painCategory = null;
    return renderPainLanding();
  }

  let category = getPainCategory(state.painCategory);
  if (!category || !state.painSelected.includes(category.id)) {
    category = selected[0];
    state.painCategory = category.id;
  }

  const answers = state.painAnswers[category.id] || [];
  const answeredCount = answers.filter((v) => typeof v === "number").length;
  const questionTotal = category.questions.length;
  const categoryIndex = state.painSelected.indexOf(category.id);
  const totalSelected = selected.length;
  const isLast = categoryIndex === totalSelected - 1;
  const nextCategory = isLast ? null : selected[categoryIndex + 1];
  const doneCount = selected.filter((item) => isPainCategoryDone(item.id)).length;

  const areaProgress = selected
    .map((item, i) => {
      const done = isPainCategoryDone(item.id);
      const current = item.id === category.id;
      let status = "upcoming";
      if (current) status = "current";
      else if (done) status = "done";
      return `
        <li class="pain-area-progress__item pain-area-progress__item--${status}" title="${escapeHtml(item.title)}">
          <span class="pain-area-progress__num">${i + 1}</span>
          <span class="pain-area-progress__name">${escapeHtml(item.title)}</span>
          ${done && !current ? `<span class="pain-area-progress__check" aria-hidden="true">✓</span>` : ""}
        </li>`;
    })
    .join("");

  const questions = category.questions
    .map((text, i) => {
      const val = answers[i];
      const options = PAIN_SCALE.map(
        (opt) => `
          <button
            type="button"
            class="pain-scale__btn${val === opt.value ? " selected" : ""}"
            data-pain-cat="${category.id}"
            data-pain-q="${i}"
            data-pain-value="${opt.value}"
            aria-pressed="${val === opt.value}"
          >${escapeHtml(opt.label)}</button>`
      ).join("");
      return `
        <div class="pain-screen__question">
          <p class="pain-screen__question-text">${escapeHtml(text)}</p>
          <div class="pain-scale" role="group" aria-label="How much does this apply for question ${i + 1}">
            ${options}
          </div>
        </div>`;
    })
    .join("");

  return `
    <div class="home home--pain home--pain-screen">
      <section class="pain-screen" aria-labelledby="pain-screen-heading" style="--pain-accent:${category.color}">
        <div class="pain-screen__backdrop" aria-hidden="true"></div>
        <div class="pain-screen__panel">
          <button type="button" class="pain-screen__back" data-action="back-pain-map">← Back to area selection</button>

          <div class="pain-area-progress" aria-label="Questionnaire progress across chosen areas">
            <div class="pain-area-progress__meta">
              <span>Questionnaires</span>
              <strong>${doneCount} of ${totalSelected} started</strong>
            </div>
            <ol class="pain-area-progress__track">${areaProgress}</ol>
          </div>

          <div class="pain-screen__icon" aria-hidden="true">
            <svg viewBox="-28 -28 56 56" width="56" height="56">${painMapIcon(category.id, category.color)}</svg>
          </div>
          <p class="pain-screen__eyebrow">Questionnaire ${categoryIndex + 1} of ${totalSelected}</p>
          <h1 id="pain-screen-heading" class="pain-screen__title">${escapeHtml(category.title)}</h1>
          <p class="pain-screen__lead">${escapeHtml(category.description)}</p>
          <p class="pain-screen__hint">
            How much does each statement apply to you lately? Answer as many or as few as feel relevant.
          </p>
          <p class="question-progress pain-screen__progress" aria-live="polite">
            <span class="question-progress__fill" style="width:${Math.round((answeredCount / questionTotal) * 100)}%"></span>
            <span class="question-progress__text">${answeredCount} of ${questionTotal} answered in this area</span>
          </p>
          <div class="pain-screen__questions">${questions}</div>
          <div class="pain-screen__actions">
            <button type="button" class="btn btn-secondary" data-action="back-pain-map">Change areas</button>
            ${
              nextCategory
                ? `<button type="button" class="btn btn-primary" data-action="next-pain-category" data-pain-category="${nextCategory.id}">Next: ${escapeHtml(nextCategory.title)} →</button>`
                : `<button type="button" class="btn btn-primary" data-action="view-pain-summary">View my summary →</button>`
            }
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderPainSummaryScreen() {
  ensurePainAnswers();
  const selected = getSelectedPainCategories();
  const pool = selected.length ? selected : PAIN_IMPACT_NODES;
  const scores = pool
    .map((category) => ({
      category,
      score: scorePainCategory(category.id),
    }))
    .filter(({ score }) => score.answered > 0)
    .sort((a, b) => b.score.percent - a.score.percent);

  const cards = scores
    .map(
      ({ category, score }, index) => `
        <article class="pain-summary__card${index === 0 ? " pain-summary__card--highest" : ""}" data-level="${score.level}">
          <div class="pain-summary__card-top">
            <div class="pain-summary__card-icon" style="--summary-color:${category.color}" aria-hidden="true">
              <svg viewBox="-28 -28 56 56">${painMapIcon(category.id, category.color)}</svg>
            </div>
            <div class="pain-summary__card-intro">
              <div class="pain-summary__card-heading">
                <h2>${escapeHtml(category.title)}</h2>
                ${index === 0 ? `<span>Most impacted</span>` : ""}
              </div>
              <p class="pain-summary__meta">${escapeHtml(score.label)} · ${score.answered} of ${score.total} questions answered</p>
              <div class="pain-summary__bar" aria-label="${score.percent}% impact score">
                <span style="width:${score.percent}%"></span>
              </div>
              <strong class="pain-summary__pct">${score.percent}% impact</strong>
            </div>
          </div>
          <p class="pain-summary__detail">${escapeHtml(score.detail)}</p>
        </article>`
    )
    .join("");

  const topArea = scores[0];
  const overview = topArea
    ? `Across the areas you answered, <strong>${escapeHtml(topArea.category.title)}</strong> currently shows the strongest impact (${topArea.score.percent}%). The notes below explain what that may mean in daily life.`
    : "";

  // Priority areas for intervention: moderate/significant first, else the top answered areas.
  const priority = scores.filter(({ score }) => score.percent >= 50);
  const focusAreas = (priority.length ? priority : scores).slice(0, 3);

  const otFocusItems = focusAreas
    .map(
      ({ category, score }) => `
        <li class="pain-ot__item">
          <span class="pain-ot__dot" style="background:${category.color}" aria-hidden="true"></span>
          <div>
            <p class="pain-ot__item-title">${escapeHtml(category.title)} <span class="pain-ot__item-tag">${score.percent}%</span></p>
            <p class="pain-ot__item-text">${escapeHtml(score.otFocus)}</p>
          </div>
        </li>`
    )
    .join("");

  const otSection = scores.length
    ? `
      <section class="pain-ot" aria-labelledby="pain-ot-heading">
        <div class="pain-ot__header">
          <span class="pain-ot__badge" aria-hidden="true">
            <svg viewBox="0 0 40 36">
              <circle cx="20" cy="9" r="4.4" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="M11.5 28.5 C12.2 21.8 15.4 18 20 18 C24.6 18 27.8 21.8 28.5 28.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </span>
          <div>
            <p class="pain-ot__eyebrow">How occupational therapy can help</p>
            <h2 id="pain-ot-heading">Turning this picture into gentle, practical support</h2>
          </div>
        </div>
        <p class="pain-ot__intro">
          Occupational therapists look beyond pain itself to how it shapes your daily routines, roles,
          sleep, movement, mood and sense of self. Rather than pushing through or holding back, we work
          with pacing, activity adaptation, nervous-system regulation and gradual re-engagement so you can
          take part more fully in what matters — without dismissing your pain.
        </p>
        <p class="pain-ot__focus-title">Where support may help you most</p>
        <ul class="pain-ot__list">${otFocusItems}</ul>
        <div class="pain-ot__cta">
          <div class="pain-ot__cta-text">
            <span class="pain-ot__cta-icon" aria-hidden="true">💬</span>
            <div>
              <p class="pain-ot__cta-heading">Would you like support making sense of this?</p>
              <p class="pain-ot__cta-note">Cayley can help connect these patterns to your routines, roles and goals.</p>
            </div>
          </div>
          <a class="btn btn-primary" href="mailto:soulfulsensoryot@gmail.com?subject=Pain%20impact%20screening%20support">Talk to Cayley</a>
        </div>
      </section>`
    : "";

  return `
    <div class="home home--pain home--pain-screen">
      <section class="pain-screen pain-summary" aria-labelledby="pain-summary-heading">
        <div class="pain-screen__backdrop" aria-hidden="true"></div>
        <div class="pain-summary__inner">
          <div class="pain-screen__panel pain-summary__panel">
            <button type="button" class="pain-screen__back" data-action="back-pain-map">← Back to pain map</button>
            <p class="pain-screen__eyebrow">Your pain pathway</p>
            <h1 id="pain-summary-heading" class="pain-screen__title">Areas most affected</h1>
            <p class="pain-screen__lead">
            This summary compares only the questions you chose to answer in your selected areas.
            It is a reflection tool, not a diagnosis.
            </p>
            ${overview ? `<p class="pain-summary__overview">${overview}</p>` : ""}
            ${
              scores.length
                ? `<div class="pain-summary__list">${cards}</div>`
                : `<div class="pain-summary__empty">
                    <p>You haven’t answered any questions in your selected areas yet. Go back and complete one or more questionnaires.</p>
                    <button type="button" class="btn btn-primary" data-action="start-pain-questionnaires">Continue questionnaires</button>
                  </div>`
            }
          </div>
          ${otSection}
        </div>
      </section>
    </div>
  `;
}

function respondentNatureIcon() {
  return `
    <svg class="respondent-option__icon-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="35" cy="13" r="5" fill="#f3e6b8"/>
      <path d="M5 39 L17 21 L23 29 L31 13 L43 39Z" fill="#8aab90"/>
      <path d="M31 13 L34 19 L31.5 17.8 L29.5 20.8 L28 18.6 L25.5 22Z" fill="#f8f5ec"/>
      <path d="M3 39 L15 27 L21 33 L27 21 L37 31 L45 39Z" fill="#3f5f4a"/>
      <path d="M27 21 L29.4 25.2 L27.4 24.1 L25.9 26.3 L24.8 24.8 L22.8 27.5Z" fill="#edf2ea" opacity="0.85"/>
      <path d="M3 39 H45" stroke="#244b38" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
    </svg>
  `;
}

function renderIntroModal() {
  const copy = currentUi();
  return `
    <div class="intro-modal" role="dialog" aria-modal="true" aria-labelledby="intro-modal-title">
      <div class="intro-modal__backdrop" aria-hidden="true"></div>
      <div class="intro-modal__panel">
        <div class="intro-modal__glow" aria-hidden="true"></div>
        <img
          src="assets/logo.png"
          alt="Soulful Sensory OT logo"
          class="intro-modal__logo"
          width="88"
          height="88"
        />
        <p class="intro-modal__brand">Soulful Sensory OT</p>
        <h2 id="intro-modal-title" class="intro-modal__title">${escapeHtml(copy.introModalTitle)}</h2>
        <img src="mountain-divider.svg" alt="" class="intro-modal__divider mountain-divider" width="280" height="28" />
        <div class="intro-modal__body">
          <p>${escapeHtml(copy.introModalLead)}</p>
          <p>${escapeHtml(copy.introModalPurpose)}</p>
          <p class="intro-modal__disclaimer">${escapeHtml(copy.introModalDisclaimer)}</p>
          <p class="intro-modal__note">${escapeHtml(copy.introModalNote)}</p>
        </div>
        <button type="button" class="btn btn-primary intro-modal__cta" data-action="dismiss-intro">
          ${escapeHtml(copy.introModalCta)}
        </button>
      </div>
    </div>
  `;
}

function renderRespondent() {
  const copy = currentUi();
  const options = RESPONDENT_TYPES.map((type) => {
    const option = RESPONDENT_OPTIONS[type];
    const selected = state.respondent === type;
    return `
      <button
        type="button"
        class="respondent-option ${selected ? "is-selected" : ""}"
        data-respondent="${type}"
        aria-pressed="${selected}"
      >
        <span class="respondent-option__icon" aria-hidden="true">${respondentNatureIcon()}</span>
        <span class="respondent-option__text">
          <strong>${escapeHtml(copy[option.labelKey])}</strong>
          <span>${escapeHtml(copy[option.descKey])}</span>
        </span>
      </button>
    `;
  }).join("");

  return renderShell(
    `
      ${state.error ? `<div class="error-banner">${escapeHtml(state.error)}</div>` : ""}
      <div class="nature-accent" aria-hidden="true">
        <img src="nature-accent.svg" alt="" class="nature-accent__img" width="640" height="160" />
      </div>
      <span class="section-tag">${escapeHtml(copy.trailhead)}</span>
      <h2 class="step-title">${escapeHtml(copy.chooseRespondent)}</h2>
      <img src="mountain-divider.svg" alt="" class="botanical-divider mountain-divider" width="600" height="44" />
      <p class="step-desc step-desc--respondent">${escapeHtml(copy.chooseRespondentDesc)}</p>
      <div class="respondent-options">${options}</div>
      <div class="actions">
        <button class="btn btn-secondary" data-action="back">${escapeHtml(copy.back)}</button>
        <button class="btn btn-primary" data-action="next">${escapeHtml(copy.continue)}</button>
      </div>
    `,
    renderProgress(),
    { stepType: "respondent" }
  );
}

function coupleStatusLabel(status, copy) {
  if (status === "complete") return copy.coupleStatusComplete;
  if (status === "in_progress") return copy.coupleStatusInProgress;
  return copy.coupleStatusNotStarted;
}

function renderCouplePartnerCard(partner, session, copy) {
  const slot = session.partners[partner];
  const status = slot?.status || "not_started";
  const title = couplePartnerLabel(partner, session);
  const defaultTitle = partner === "b" ? copy.couplePartnerB : copy.couplePartnerA;
  let primaryAction = "";
  if (status === "complete") {
    primaryAction = `
      <button type="button" class="btn btn-primary" data-action="couple-start" data-partner="${partner}">
        ${escapeHtml(copy.coupleViewResults)}
      </button>
      <button type="button" class="btn btn-secondary" data-action="couple-export" data-partner="${partner}">
        ${escapeHtml(copy.coupleExport)}
      </button>`;
  } else if (status === "in_progress") {
    primaryAction = `
      <button type="button" class="btn btn-primary" data-action="couple-start" data-partner="${partner}">
        ${escapeHtml(copy.coupleContinue)}
      </button>`;
  } else {
    primaryAction = `
      <button type="button" class="btn btn-primary" data-action="couple-start" data-partner="${partner}">
        ${escapeHtml(copy.coupleStart)}
      </button>`;
  }

  return `
    <article class="couple-card" data-couple-card="${partner}">
      <div class="couple-card__header">
        <h3 class="couple-card__title">${escapeHtml(defaultTitle)}</h3>
        <span class="couple-card__status couple-card__status--${status}">${escapeHtml(coupleStatusLabel(status, copy))}</span>
      </div>
      <label class="field couple-card__name">
        <span class="visually-hidden">${escapeHtml(copy.coupleNamePlaceholder)}</span>
        <input
          type="text"
          data-couple-name="${partner}"
          value="${escapeHtml(slot?.label || "")}"
          placeholder="${escapeHtml(copy.coupleNamePlaceholder)}"
          autocomplete="nickname"
        />
      </label>
      ${title && title !== defaultTitle ? `<p class="couple-card__who">${escapeHtml(title)}</p>` : ""}
      <div class="couple-card__actions">
        ${primaryAction}
        <button type="button" class="btn btn-secondary" data-action="couple-copy-link" data-partner="${partner}">
          ${escapeHtml(copy.coupleCopyLink)}
        </button>
      </div>
    </article>
  `;
}

function renderCoupleHub() {
  const copy = currentUi();
  const session = ensureCoupleSession();
  const bothDone = bothCouplePartnersComplete(session);
  if (state.coupleShowMerge && bothDone) {
    return renderCoupleMerge(session);
  }

  const notice = state.coupleHubNotice
    ? `<div class="couple-hub__notice" role="status">${escapeHtml(state.coupleHubNotice)}</div>`
    : "";

  return renderShell(
    `
      ${state.error ? `<div class="error-banner">${escapeHtml(state.error)}</div>` : ""}
      ${notice}
      <span class="section-tag">${escapeHtml(copy.coupleHubTag)}</span>
      <h2 class="step-title">${escapeHtml(copy.coupleHubTitle)}</h2>
      <img src="mountain-divider.svg" alt="" class="botanical-divider mountain-divider" width="600" height="44" />
      <p class="step-desc">${escapeHtml(copy.coupleHubDesc)}</p>
      <p class="couple-hub__code"><span>${escapeHtml(copy.coupleSessionLabel)}</span> <strong>${escapeHtml(session.id)}</strong></p>
      <p class="step-desc couple-hub__hint">${escapeHtml(copy.coupleShareHint)}</p>
      <div class="couple-cards">
        ${renderCouplePartnerCard("a", session, copy)}
        ${renderCouplePartnerCard("b", session, copy)}
      </div>
      ${
        bothDone
          ? `<div class="couple-hub__merge">
              <p class="couple-hub__ready">${escapeHtml(copy.coupleBothReady)}</p>
              ${renderCoupleCombinedSubmitPanel(session)}
              <button type="button" class="btn ${
                session.combinedSubmission?.status === "sent" ? "btn-primary" : "btn-secondary"
              }" data-action="couple-view-merge">${escapeHtml(copy.coupleViewMerge)}</button>
              <button type="button" class="btn btn-secondary" data-action="print-couple-report">${escapeHtml(
                copy.couplePrint || copy.print
              )}</button>
            </div>`
          : `<p class="couple-hub__waiting">${escapeHtml(copy.coupleWaitingOther)}</p>`
      }
      <div class="couple-import">
        <h3 class="couple-import__title">${escapeHtml(copy.coupleImportTitle)}</h3>
        <p class="couple-import__desc">${escapeHtml(copy.coupleImportDesc)}</p>
        <textarea
          class="couple-import__input"
          data-couple-import
          rows="3"
          placeholder="${escapeHtml(copy.coupleImportPlaceholder)}"
        >${escapeHtml(state.coupleImportText || "")}</textarea>
        <button type="button" class="btn btn-secondary" data-action="couple-import">${escapeHtml(copy.coupleImportBtn)}</button>
      </div>
      <p class="couple-hub__local-note">${escapeHtml(copy.coupleSavedLocal)}</p>
      <div class="actions">
        <button class="btn btn-secondary" data-action="back">${escapeHtml(copy.back)}</button>
      </div>
    `,
    renderProgress(),
    { stepType: "coupleHub" }
  );
}

function stripLeadingCoupleName(text, name) {
  const raw = String(text || "");
  const label = String(name || "").trim();
  if (!label || !raw.startsWith(label)) return raw;
  const rest = raw.slice(label.length).replace(/^[\s,:.\-–—]+/, "").trim();
  if (!rest) return raw;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

/** Partner 1 / Partner 2 / Together layout for comparison cards. */
function renderCoupleCompareBody(partnerLines, together, copy, nameA = "", nameB = "") {
  const groups = { a: [], b: [] };
  (partnerLines || []).forEach((entry, index) => {
    const partner =
      entry && typeof entry === "object" && (entry.partner === "a" || entry.partner === "b")
        ? entry.partner
        : index % 2 === 0
          ? "a"
          : "b";
    const text =
      entry && typeof entry === "object" && typeof entry.text === "string"
        ? entry.text
        : String(entry || "");
    if (partner === "a" || partner === "b") groups[partner].push(text);
  });

  const personBlocks = [
    ["a", nameA],
    ["b", nameB],
  ]
    .map(([partner, name]) => {
      const lines = groups[partner] || [];
      if (!lines.length) return "";
      const paragraphs = lines
        .map((line) => {
          const body = stripLeadingCoupleName(line, name) || line;
          return `<p class="couple-compare__line">${escapeHtml(body)}</p>`;
        })
        .join("");
      return `
        <div class="couple-compare__person couple-partner--${partner}">
          <h5 class="couple-compare__person-heading">${escapeHtml(name)}</h5>
          ${paragraphs}
        </div>
      `;
    })
    .join("");

  const togetherParts = Array.isArray(together) ? together : together ? [together] : [];
  const togetherBlock = togetherParts.length
    ? `
      <div class="couple-compare__together-block">
        <h5 class="couple-compare__together-heading">${escapeHtml(copy.coupleCompareTogether)}</h5>
        ${togetherParts
          .map((part) => `<p class="couple-compare__together">${escapeHtml(part)}</p>`)
          .join("")}
      </div>
    `
    : "";

  return `${personBlocks}${togetherBlock}`;
}

/** Educational panel: work sensory load and the sensory bucket (adult + couples). */
function renderWorkBucketExplainParts(copy = currentUi()) {
  if (!copy?.coupleWorkBucketTitle) return { first: "", second: "" };
  const first = `
    <div class="couple-work-bucket couple-work-bucket--first work-bucket-explain">
      <header class="couple-work-bucket__header">
        <h4 class="couple-work-bucket__title">${escapeHtml(copy.coupleWorkBucketTitle)}</h4>
        <p class="couple-work-bucket__lead">${escapeHtml(copy.coupleWorkBucketLead)}</p>
      </header>
      <aside class="couple-work-bucket__insight">
        <p class="couple-work-bucket__insight-label">${escapeHtml(copy.coupleWorkBucketInsightLabel)}</p>
        <p class="couple-work-bucket__insight-text"><strong>${escapeHtml(copy.coupleWorkBucketInsight)}</strong></p>
        <p class="couple-work-bucket__insight-note">${escapeHtml(copy.coupleWorkBucketInsightNote)}</p>
      </aside>
      <p class="couple-work-bucket__bridge">
        ${escapeHtml(copy.coupleWorkBucketBridgeBefore)}
        <strong>${escapeHtml(copy.coupleWorkBucketBridgeEmphasis)}</strong>.
      </p>
    </div>`;
  const second = `
    <div class="couple-work-bucket couple-work-bucket--second work-bucket-explain">
      <div class="couple-work-bucket__contrast">
        <article class="couple-work-bucket__card couple-work-bucket__card--under">
          <p class="couple-work-bucket__card-label">${escapeHtml(copy.coupleWorkBucketUnderLabel)}</p>
          <p class="couple-work-bucket__card-text">${escapeHtml(copy.coupleWorkBucketUnderText)}</p>
        </article>
        <article class="couple-work-bucket__card couple-work-bucket__card--over">
          <p class="couple-work-bucket__card-label">${escapeHtml(copy.coupleWorkBucketOverLabel)}</p>
          <p class="couple-work-bucket__card-text">${escapeHtml(copy.coupleWorkBucketOverText)}</p>
        </article>
      </div>
      <aside class="couple-work-bucket__system">
        <p class="couple-work-bucket__system-label">${escapeHtml(copy.coupleWorkBucketSystemLabel)}</p>
        <p class="couple-work-bucket__system-text">
          ${escapeHtml(copy.coupleWorkBucketSystemBefore)}
          <strong>${escapeHtml(copy.coupleWorkBucketSystemEmphasis)}</strong>.
          ${escapeHtml(copy.coupleWorkBucketSystemAfter)}
          <strong>${escapeHtml(copy.coupleWorkBucketSystemEmphasisEnd)}</strong>.
        </p>
      </aside>
      <p class="couple-work-bucket__close">
        ${escapeHtml(copy.coupleWorkBucketCloseBefore)}
        <strong>${escapeHtml(copy.coupleWorkBucketCloseEmphasis)}</strong>.
        ${escapeHtml(copy.coupleWorkBucketCloseAfter)}
      </p>
    </div>`;
  return { first, second };
}

function renderWorkBucketExplain(copy = currentUi()) {
  const parts = renderWorkBucketExplainParts(copy);
  if (!parts.first && !parts.second) return "";
  return `<div class="couple-work-bucket-group work-bucket-explain">${parts.first}${parts.second}</div>`;
}

/** Print-only mountain scene to fill the lower half of the work continuation page. */
function renderCoupleWorkPrintScene() {
  return `
    <div class="couple-work-print-scene print-only" aria-hidden="true">
      ${printMountainRule("work")}
      <div class="couple-work-print-scene__sky"></div>
      <div class="couple-work-print-scene__ridge couple-work-print-scene__ridge--far"></div>
      <div class="couple-work-print-scene__ridge couple-work-print-scene__ridge--mid"></div>
      <div class="couple-work-print-scene__ridge couple-work-print-scene__ridge--near"></div>
      <svg class="couple-work-print-scene__line" viewBox="0 0 600 44" fill="none" focusable="false">
        <path d="M8 34h92l35-14 28 8 61-19 39 18 35-12 42 20h92l38-13 31 9 28-17 43 20h50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
        <path d="M126 34l37-19 24 11 37-17 39 18M404 34l28-20 28 15 21-12 28 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`;
}

function couplePartnerCrewProfile(slot, copy = currentUi()) {
  let lean = slot?.summary?.lean || "";
  let balance =
    typeof slot?.summary?.balance === "number" ? slot.summary.balance : null;
  let metrics = null;

  if (slot?.answers && typeof getSensoryDomains === "function") {
    const lang = LANGUAGES.includes(slot.language) ? slot.language : state.language;
    const scores = scoreAllDomains(
      slot.answers,
      getSensoryDomains(lang, "couple"),
      lang,
      "couple"
    );
    metrics = getProfileMetrics(scores);
    lean = metrics?.lean || lean;
    if (typeof metrics?.balance === "number") balance = metrics.balance;
  }

  if (balance == null) {
    balance = senseInterpretMarker(lean || "neutral");
  }

  const crewId = getTeenCrewId(lean || "neutral");
  const roster = getTeenCrewRoster(copy);
  const character = roster.find((member) => member.id === crewId) || roster[1];
  const labels = getProfileLabels(state.language, "couple");
  const meta = labels[lean] || labels.neutral;
  return { lean, balance, crewId, character, color: meta.color, metrics };
}

const COUPLE_SENSE_QUOTE_KEYS = {
  visual: { quote: "coupleSenseQuoteVisual", why: "coupleSenseWhyVisual" },
  movement: { quote: "coupleSenseQuoteMovement", why: "coupleSenseWhyMovement" },
  taste: { quote: "coupleSenseQuoteTaste", why: "coupleSenseWhyTaste" },
  touch: { quote: "coupleSenseQuoteTouch", why: "coupleSenseWhyTouch" },
  regulate: { quote: "coupleSenseQuoteRegulate", why: "coupleSenseWhyRegulate" },
};

function renderCoupleSenseQuote(sectionId, copy) {
  const keys = COUPLE_SENSE_QUOTE_KEYS[sectionId];
  if (!keys) return "";
  const quote = copy[keys.quote];
  const why = copy[keys.why];
  if (!quote && !why) return "";
  return `
    <aside class="couple-sense-quote" aria-label="${escapeHtml(copy.coupleSenseQuoteLabel || "Sensory insight")}">
      ${quote ? `<blockquote class="couple-sense-quote__text"><p>${escapeHtml(quote)}</p></blockquote>` : ""}
      ${why ? `<p class="couple-sense-quote__why"><span class="couple-sense-quote__why-label">${escapeHtml(copy.coupleSenseQuoteLabel || "Why this sense matters for couples")}</span> ${escapeHtml(why)}</p>` : ""}
    </aside>
  `;
}

function renderCoupleMergeIntro(copy) {
  const paragraphs = [
    copy.coupleMergeIntroP1,
    copy.coupleMergeIntroP2,
    copy.coupleMergeIntroP3,
    copy.coupleMergeIntroP4,
    copy.coupleMergeIntroP5,
  ].filter(Boolean);
  return `
    <section class="couple-merge-intro" aria-labelledby="couple-merge-intro-title">
      <header class="couple-merge-intro__banner">
        <figure class="couple-merge-intro__banner-media" aria-hidden="true">
          <img
            src="assets/couple-intro-trail.png"
            alt=""
            class="couple-merge-intro__banner-image"
            width="1200"
            height="800"
            loading="eager"
            decoding="async"
          />
        </figure>
        <div class="couple-merge-intro__banner-veil" aria-hidden="true"></div>
        <div class="couple-merge-intro__banner-content">
          <p class="couple-merge-intro__kicker">${escapeHtml(copy.coupleHubTag)}</p>
          <h2 id="couple-merge-intro-title" class="couple-merge-intro__title">${escapeHtml(
            copy.coupleMergeIntroTitle
          )}</h2>
          ${
            copy.coupleMergeIntroLead
              ? `<p class="couple-merge-intro__lead">${escapeHtml(copy.coupleMergeIntroLead)}</p>`
              : ""
          }
        </div>
      </header>
      <div class="couple-merge-intro__content">
        <div class="couple-merge-intro__body">
          ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderCoupleWorkMergeSummaries(sess, copy) {
  const cards = COUPLE_PARTNERS.map((partner) => {
    const slot = sess.partners[partner];
    const workSummary = formatCoupleWorkSummary(normalizeCoupleWork(slot.coupleWork), copy);
    if (!workSummary) return "";
    const name = couplePartnerLabel(partner, sess);
    return `
      <article class="couple-work-merge-card couple-partner--${partner}">
        <h4 class="couple-work-merge__name">
          <span class="couple-partner-dot" aria-hidden="true"></span>
          <span class="couple-partner-name">${escapeHtml(name)}</span>
        </h4>
        ${workSummary
          .split("\n")
          .map((line) => `<p class="couple-work-merge__line">${escapeHtml(line)}</p>`)
          .join("")}
      </article>
    `;
  }).join("");
  if (!cards.trim()) return "";
  return `
    <section class="couple-work-merge-print">
      <h3 class="couple-compare__title">${escapeHtml(copy.coupleWorkResultsTitle)}</h3>
      <p class="couple-compare__intro">${escapeHtml(
        copy.coupleCompareWorkIntro || copy.coupleWorkDesc || ""
      )}</p>
      <div class="couple-work-merge-grid">${cards}</div>
    </section>
  `;
}

function renderCoupleMerge(session = null) {
  const copy = currentUi();
  const sess = session || ensureCoupleSession();
  const nameA = couplePartnerLabel("a", sess);
  const nameB = couplePartnerLabel("b", sess);
  const cards = COUPLE_PARTNERS.map((partner) => {
    const slot = sess.partners[partner];
    const name = couplePartnerLabel(partner, sess);
    const { crewId, character, lean, balance, color } = couplePartnerCrewProfile(slot, copy);
    const domains = (slot.summary?.domainProfiles || [])
      .map(
        (d) =>
          `<li><span>${escapeHtml(d.title || d.id)}</span><strong>${escapeHtml(d.short || "—")}</strong></li>`
      )
      .join("");
    return `
      <article class="couple-merge-card couple-partner--${partner}" data-crew="${escapeHtml(crewId)}">
        <header class="couple-merge-card__header">
          <figure class="couple-merge-card__portrait" aria-hidden="true">
            ${teenCrewCharacterArt(crewId, `couple-merge-${partner}`)}
          </figure>
          <div class="couple-merge-card__identity">
            <h3 class="couple-merge-card__name">${escapeHtml(name)}</h3>
            <div class="couple-merge-card__scale">
              ${renderBalanceBar(
                {
                  profile: lean || "neutral",
                  color: color || "#5b7fa6",
                  shortTitle: name,
                },
                copy,
                {
                  showStatus: false,
                  compact: true,
                  percent: balance,
                }
              )}
            </div>
            <p class="couple-merge-card__character">${escapeHtml(character.name)}</p>
            ${
              character.tag
                ? `<p class="couple-merge-card__character-tag">${escapeHtml(character.tag)}</p>`
                : ""
            }
          </div>
        </header>
        <p class="couple-merge-card__overall">${escapeHtml(slot.summary?.overallLabel || "—")}</p>
        <p class="couple-merge-card__lean">${escapeHtml(slot.summary?.leanHeadline || "")}</p>
        <ul class="couple-merge-card__domains">${domains}</ul>
        <button type="button" class="btn btn-secondary btn--compact no-print" data-action="couple-start" data-partner="${partner}">
          ${escapeHtml(copy.coupleViewResults)}
        </button>
      </article>
    `;
  }).join("");

  const colorKey = `
    <div class="couple-color-key" aria-label="${escapeHtml(copy.coupleCompareTogether)}">
      <span class="couple-color-key__item couple-partner--a"><span class="couple-partner-dot" aria-hidden="true"></span>${escapeHtml(nameA)}</span>
      <span class="couple-color-key__item couple-partner--b"><span class="couple-partner-dot" aria-hidden="true"></span>${escapeHtml(nameB)}</span>
    </div>
  `;

  const comparison = buildCoupleComparisonReport(sess, state.language);
  const workComparison = typeof buildCoupleWorkComparison === "function"
    ? buildCoupleWorkComparison(sess, state.language)
    : null;
  const parentingComparison =
    typeof buildCoupleParentingComparison === "function"
      ? buildCoupleParentingComparison(sess, state.language)
      : null;
  const conflictSummary =
    typeof buildCoupleConflictAreas === "function"
      ? buildCoupleConflictAreas(sess, state.language)
      : null;
  const thriveSummary =
    typeof buildCoupleThriveSummary === "function"
      ? buildCoupleThriveSummary(sess, state.language)
      : null;
  const compareHtml = comparison
    ? `
      <section class="couple-compare">
        <h3 class="couple-compare__title">${escapeHtml(copy.coupleCompareTitle)}</h3>
        <p class="couple-compare__intro">${escapeHtml(copy.coupleCompareIntro)}</p>
        ${comparison.sections
          .map((section) => {
            const title = copy[section.titleKey] || section.titleKey;
            const visualVisuals =
              section.id === "visual"
                ? `
                <div class="couple-visual-visuals" aria-hidden="true">
                  <figure class="couple-visual-visuals__shot couple-visual-visuals__shot--clutter">
                    <img
                      src="assets/couple-visual-clutter.png"
                      alt=""
                      class="couple-visual-visuals__image"
                      width="1024"
                      height="682"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                  <figure class="couple-visual-visuals__shot couple-visual-visuals__shot--organised">
                    <img
                      src="assets/couple-visual-organised.png"
                      alt=""
                      class="couple-visual-visuals__image"
                      width="1024"
                      height="682"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                </div>`
                : "";
            const tasteVisuals =
              section.id === "taste"
                ? `
                <div class="couple-taste-visuals" aria-hidden="true">
                  <figure class="couple-taste-visuals__feature">
                    <img
                      src="assets/couple-taste-plates.png"
                      alt=""
                      class="couple-taste-visuals__image"
                      width="1024"
                      height="682"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                  <figure class="couple-taste-visuals__inset">
                    <img
                      src="assets/couple-taste-prep.png"
                      alt=""
                      class="couple-taste-visuals__image"
                      width="1024"
                      height="682"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                </div>`
                : "";
            const movementVisuals =
              section.id === "movement"
                ? `
                <div class="couple-movement-visuals" aria-hidden="true">
                  <figure class="couple-movement-visuals__shot couple-movement-visuals__shot--gym">
                    <img
                      src="assets/couple-movement-gym.png"
                      alt=""
                      class="couple-movement-visuals__image"
                      width="1024"
                      height="682"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                  <figure class="couple-movement-visuals__shot couple-movement-visuals__shot--walk">
                    <img
                      src="assets/couple-movement-walk.png"
                      alt=""
                      class="couple-movement-visuals__image"
                      width="1024"
                      height="682"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                  <figure class="couple-movement-visuals__shot couple-movement-visuals__shot--run">
                    <img
                      src="assets/couple-movement-run.png"
                      alt=""
                      class="couple-movement-visuals__image"
                      width="1024"
                      height="681"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                </div>`
                : "";
            const touchVisuals =
              section.id === "touch"
                ? `
                <div class="couple-touch-visuals" aria-hidden="true">
                  <figure class="couple-touch-visuals__water">
                    <img
                      src="assets/couple-touch-water.png"
                      alt=""
                      class="couple-touch-visuals__image"
                      width="1024"
                      height="682"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                  <figure class="couple-touch-visuals__grass">
                    <img
                      src="assets/couple-touch-grass.png"
                      alt=""
                      class="couple-touch-visuals__image"
                      width="682"
                      height="1024"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                </div>`
                : "";
            const regulateVisuals =
              section.id === "regulate"
                ? `
                <div class="couple-regulate-visuals" aria-hidden="true">
                  <figure class="couple-regulate-visuals__feature">
                    <img
                      src="assets/couple-regulate-tree.png"
                      alt=""
                      class="couple-regulate-visuals__image"
                      width="1023"
                      height="1024"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                  <figure class="couple-regulate-visuals__inset">
                    <img
                      src="assets/couple-regulate-coffee.png"
                      alt=""
                      class="couple-regulate-visuals__image"
                      width="768"
                      height="1024"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                </div>`
                : "";
            return `
              <article class="couple-compare__card couple-compare__card--${escapeHtml(section.id || "general")}">
                ${visualVisuals}
                <h4 class="couple-compare__card-title">${escapeHtml(title)}</h4>
                ${renderCoupleSenseQuote(section.id, copy)}
                ${tasteVisuals}
                ${movementVisuals}
                ${touchVisuals}
                ${regulateVisuals}
                ${renderCoupleCompareBody(
                  section.partnerLines,
                  section.together,
                  copy,
                  comparison.nameA || nameA,
                  comparison.nameB || nameB
                )}
              </article>
            `;
          })
          .join("")}
      </section>`
    : "";

  const workBucketParts = renderWorkBucketExplainParts(copy);
  const workCompareHtml = workComparison
    ? `
      <section class="couple-compare couple-compare--work">
        <div class="couple-work-print-page couple-work-print-page--head">
          <h3 class="couple-compare__title">${escapeHtml(copy[workComparison.titleKey] || copy.coupleWorkResultsTitle)}</h3>
          <p class="couple-compare__intro">${escapeHtml(copy[workComparison.introKey] || "")}</p>
          <div class="couple-work-visuals" aria-hidden="true">
            <figure class="couple-work-visuals__shot couple-work-visuals__shot--desk">
              <img
                src="assets/couple-work-desk.png"
                alt=""
                class="couple-work-visuals__image"
                width="1024"
                height="682"
                loading="eager"
                decoding="async"
              />
            </figure>
            <figure class="couple-work-visuals__shot couple-work-visuals__shot--people">
              <img
                src="assets/couple-work-people.png"
                alt=""
                class="couple-work-visuals__image"
                width="1024"
                height="682"
                loading="eager"
                decoding="async"
              />
            </figure>
          </div>
          ${workBucketParts.first}
        </div>
        <div class="couple-work-print-page couple-work-print-page--continued">
          ${workBucketParts.second}
          ${renderCoupleWorkPrintScene()}
        </div>
        <div class="couple-work-print-page couple-work-print-page--partners">
          <div class="couple-work-setup-grid">
            ${(workComparison.partners || [])
              .map((card) => {
                const rows = (card.rows || [])
                  .map(
                    (row) => `
                  <div class="couple-work-setup__row">
                    <span class="couple-work-setup__label">${escapeHtml(row.label)}</span>
                    <span class="couple-work-setup__value">${escapeHtml(row.value)}</span>
                  </div>`
                  )
                  .join("");
                const note = card.note
                  ? `<p class="couple-work-setup__note">${escapeHtml(card.note)}</p>`
                  : "";
                return `
                <article class="couple-work-setup-card couple-partner--${card.partner}">
                  <h4 class="couple-work-setup__name">
                    <span class="couple-partner-dot" aria-hidden="true"></span>
                    <span class="couple-partner-name">${escapeHtml(card.name)}</span>
                  </h4>
                  <div class="couple-work-setup__rows">${rows}</div>
                  ${note}
                </article>`;
              })
              .join("")}
          </div>
          ${
            (workComparison.together || []).length
              ? `<div class="couple-work-partners-together">
                  ${renderCoupleCompareBody(
                    [],
                    workComparison.together,
                    copy,
                    workComparison.nameA || nameA,
                    workComparison.nameB || nameB
                  )}
                </div>`
              : ""
          }
        </div>
      </section>`
    : "";

  const conflictCompareHtml = conflictSummary
    ? `
      <section class="couple-compare couple-compare--conflict">
        <h3 class="couple-compare__title">${escapeHtml(
          copy[conflictSummary.titleKey] || copy.coupleCompareConflictTitle
        )}</h3>
        <p class="couple-compare__intro">${escapeHtml(
          copy[conflictSummary.introKey] || copy.coupleCompareConflictIntro || ""
        )}</p>
        <div class="couple-conflict-visuals" aria-hidden="true">
          <figure class="couple-conflict-visuals__shot">
            <img
              src="assets/couple-conflict-differences.png"
              alt=""
              class="couple-conflict-visuals__image"
              width="1024"
              height="576"
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
        ${
          (conflictSummary.areas || []).length
            ? `<div class="couple-conflict-list">
                ${conflictSummary.areas
                  .map((area) => {
                    const tips = Array.isArray(area.tips) ? area.tips.filter(Boolean) : [];
                    const tipsHtml = tips.length
                      ? `
                        <div class="couple-conflict-card__tips">
                          <p class="couple-conflict-card__tips-label">${escapeHtml(
                            copy.coupleCompareConflictTips || "Try this"
                          )}</p>
                          <ul class="couple-conflict-card__tips-list">
                            ${tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
                          </ul>
                        </div>`
                      : "";
                    return `
                  <article class="couple-conflict-card couple-conflict-card--${escapeHtml(area.id || "general")}">
                    <h4 class="couple-conflict-card__title">${escapeHtml(area.title)}</h4>
                    <p class="couple-conflict-card__text">${escapeHtml(area.text)}</p>
                    ${tipsHtml}
                  </article>`;
                  })
                  .join("")}
              </div>`
            : `<p class="couple-conflict-empty">${escapeHtml(conflictSummary.emptyNote || "")}</p>`
        }
      </section>`
    : "";

  const thriveCompareHtml = thriveSummary
    ? `
      <section class="couple-compare couple-compare--thrive">
        <h3 class="couple-compare__title">${escapeHtml(
          copy[thriveSummary.titleKey] || copy.coupleCompareThriveTitle
        )}</h3>
        <p class="couple-compare__intro">${escapeHtml(copy[thriveSummary.introKey] || "")}</p>
        <div class="couple-thrive-visuals" aria-hidden="true">
          <figure class="couple-thrive-visuals__shot">
            <img
              src="assets/couple-thrive-hands.png"
              alt=""
              class="couple-thrive-visuals__image"
              width="1024"
              height="682"
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
        <div class="couple-thrive-grid">
          ${(thriveSummary.partners || [])
            .map((card) => {
              const items = (card.needs || [])
                .map((need) => `<li>${escapeHtml(need)}</li>`)
                .join("");
              const empty = items
                ? ""
                : `<li>${escapeHtml(
                    state.language === "af"
                      ? "Nog nie genoeg antwoorde vir ’n kort opsomming nie."
                      : "Not enough answers yet for a short summary."
                  )}</li>`;
              return `
                <article class="couple-thrive-card couple-partner--${card.partner}">
                  <h4 class="couple-thrive-card__name">
                    <span class="couple-partner-dot" aria-hidden="true"></span>
                    <span class="couple-partner-name">${escapeHtml(card.name)}</span>
                  </h4>
                  <ul class="couple-thrive-card__list">${items || empty}</ul>
                </article>
              `;
            })
            .join("")}
        </div>
      </section>`
    : "";

  const parentingCompareHtml = parentingComparison
    ? `
      <section class="couple-compare couple-compare--parenting">
        <h3 class="couple-compare__title">${escapeHtml(
          copy[parentingComparison.titleKey] || copy.coupleCompareParentingTitle
        )}</h3>
        <p class="couple-compare__intro">${escapeHtml(copy[parentingComparison.introKey] || "")}</p>
        <article class="couple-compare__card couple-compare__card--parenting">
          ${renderCoupleCompareBody(
            parentingComparison.partnerLines,
            parentingComparison.together,
            copy,
            parentingComparison.nameA || nameA,
            parentingComparison.nameB || nameB
          )}
        </article>
      </section>`
    : "";

  return renderShell(
    `
      ${renderSampleReportBanner()}
      <section class="couple-merge-cover" aria-labelledby="couple-merge-title">
        ${renderInterpretSectionBanner({
          image: "assets/couple-report-banner.png",
          objectPosition: "center 72%",
          kicker: copy.coupleHubTag,
          titleId: "couple-merge-title",
          title: copy.coupleMergeTitle,
          lead: copy.coupleMergeDesc,
          variant: "couple",
          titleTag: "h2",
          width: 1024,
          height: 682,
        })}
        ${colorKey}
        <div class="couple-merge-grid">${cards}</div>
      </section>
      ${renderCoupleMergeIntro(copy)}
      ${compareHtml}
      ${workCompareHtml}
      ${conflictCompareHtml}
      ${thriveCompareHtml}
      ${parentingCompareHtml}
      ${renderCoupleWorkMergeSummaries(sess, copy)}
      <figure class="couple-closing-quote">
        <span class="couple-closing-quote__mark" aria-hidden="true">“</span>
        <blockquote class="couple-closing-quote__text">
          <p>${escapeHtml(copy.coupleClosingQuote)}</p>
        </blockquote>
        <span class="couple-closing-quote__rule" aria-hidden="true"></span>
      </figure>
      ${renderCoupleCombinedSubmitPanel(sess)}
      <div class="actions no-print">
        <button type="button" class="btn btn-secondary" data-action="couple-back-hub">${escapeHtml(copy.coupleMergeBack)}</button>
        <button type="button" class="btn btn-primary" data-action="print-couple-report">${escapeHtml(
          copy.couplePrint || copy.print
        )}</button>
      </div>
    `,
    renderProgress(),
    { stepType: "coupleHub" }
  );
}

function renderCoupleResultsBanner() {
  if (!isCouplePathway() || !state.coupleId) return "";
  const copy = currentUi();
  const session = getCoupleSession(state.coupleId);
  const bothDone = bothCouplePartnersComplete(session);
  const other = state.couplePartner === "a" ? "b" : "a";
  const otherDone = session?.partners?.[other]?.status === "complete";
  const waitingForPartner = !bothDone && !otherDone;

  const nextSteps = waitingForPartner
    ? `
      <div class="couple-next-steps">
        <h3 class="couple-next-steps__title">${escapeHtml(copy.coupleNextStepsTitle)}</h3>
        <p class="couple-next-steps__lead">${escapeHtml(copy.coupleNextStepsLead)}</p>
        <ol class="couple-next-steps__list">
          <li>${escapeHtml(copy.coupleNextStep1)}</li>
          <li>${escapeHtml(copy.coupleNextStep2)}</li>
          <li>${escapeHtml(copy.coupleNextStep3)}</li>
          <li>${escapeHtml(copy.coupleNextStep4)}</li>
        </ol>
        <p class="couple-next-steps__same">${escapeHtml(copy.coupleNextStepsSameDevice)}</p>
      </div>
    `
    : "";

  return `
    <div class="couple-results-banner no-print" role="status">
      <p><strong>${escapeHtml(copy.coupleYourTurn)} ${escapeHtml(couplePartnerLabel(state.couplePartner, session))}.</strong>
      ${bothDone || otherDone ? escapeHtml(copy.coupleBothReady) : escapeHtml(copy.coupleWaitingOther)}</p>
      ${nextSteps}
      ${bothDone ? renderCoupleCombinedSubmitPanel(session) : ""}
      <div class="couple-results-banner__actions">
        <button type="button" class="btn btn-secondary btn--compact" data-action="couple-back-hub">${escapeHtml(copy.coupleBackToHub)}</button>
        ${
          waitingForPartner
            ? `<button type="button" class="btn btn-primary btn--compact" data-action="couple-copy-link" data-partner="${other}">${escapeHtml(copy.coupleCopyPartnerLink)}</button>`
            : ""
        }
        ${
          state.couplePartner
            ? `<button type="button" class="btn btn-secondary btn--compact" data-action="couple-export" data-partner="${state.couplePartner}">${escapeHtml(copy.coupleExport)}</button>`
            : ""
        }
        ${
          bothDone
            ? `<button type="button" class="btn btn-secondary btn--compact" data-action="couple-view-merge">${escapeHtml(copy.coupleViewMerge)}</button>
               <button type="button" class="btn btn-primary btn--compact" data-action="print-couple-report">${escapeHtml(
                 copy.couplePrint || copy.print
               )}</button>`
            : ""
        }
      </div>
      <p class="couple-results-banner__hint">${escapeHtml(
        waitingForPartner ? copy.coupleExportHint : copy.coupleExportHint
      )}</p>
    </div>
  `;
}

function renderContext() {
  const copy = currentUi();
  const options = getLifeContextOptions()
    .map((option) => {
      const selected = state.lifeContext === option.id;
      return `
        <button
          type="button"
          class="respondent-option ${selected ? "is-selected" : ""}"
          data-life-context="${option.id}"
          aria-pressed="${selected}"
        >
          <strong>${escapeHtml(option.label)}</strong>
          <span>${escapeHtml(option.desc)}</span>
        </button>
      `;
    })
    .join("");

  return renderShell(
    `
      ${state.error ? `<div class="error-banner">${escapeHtml(state.error)}</div>` : ""}
      <span class="section-tag">${escapeHtml(copy.contextTag)}</span>
      <h2 class="step-title">${escapeHtml(copy.chooseContext)}</h2>
      <p class="step-desc">${escapeHtml(state.respondent === "teen" ? copy.chooseContextTeenDesc : copy.chooseContextAdultDesc)}</p>
      <div class="respondent-options">${options}</div>
      <div class="actions">
        <button class="btn btn-secondary" data-action="back">${escapeHtml(copy.back)}</button>
        <button class="btn btn-primary" data-action="next">${escapeHtml(copy.continue)}</button>
      </div>
    `,
    renderProgress(),
    { stepType: "context" }
  );
}

function renderConsent() {
  const copy = currentUi();
  const consentItems = getConsentItems(state.language, state.respondent || "adult");
  const sharingItems = getSharingConsentItems(
    state.language,
    state.respondent || "adult",
    state.lifeContext
  );
  const isWorkAdult = canOfferWorkReport();
  const canContinue = hasAllRequiredConsent();
  const consentDesc = isWorkAdult ? copy.consentDescWork : copy.consentDesc;
  const sharingHeading = isWorkAdult ? copy.consentSharingHeadingWork : copy.consentSharingHeading;
  const sharingDesc = isWorkAdult ? copy.consentSharingDescWork : copy.consentSharingDesc;
  const gateBody = isWorkAdult ? copy.consentGateDisclaimerWork : copy.consentGateDisclaimer;
  const required = consentItems
    .map(
      (text, i) => `
      <label class="consent-item">
        <input type="checkbox" data-consent="${i}" ${state.consent[i] ? "checked" : ""} />
        <span>${escapeHtml(text)}</span>
      </label>
    `
    )
    .join("");
  const sharing = sharingItems
    .map((item) => {
      const checked = Boolean(state.sharingConsent?.[item.id]);
      const optionalClass = item.required ? "" : " consent-item--optional";
      return `
      <label class="consent-item${optionalClass}">
        <input type="checkbox" data-sharing="${escapeHtml(item.id)}" ${checked ? "checked" : ""} />
        <span>${escapeHtml(item.label)}</span>
      </label>
    `;
    })
    .join("");

  const gateNotice = (placement) => `
      <aside
        class="consent-disclaimer"
        data-consent-disclaimer
        ${placement === "top" ? 'role="alert" aria-live="polite"' : 'aria-hidden="true"'}
        ${canContinue ? "hidden" : ""}
      >
        <p class="consent-disclaimer__eyebrow">${escapeHtml(copy.consentGateTitle)}</p>
        <p class="consent-disclaimer__body">${escapeHtml(gateBody)}</p>
      </aside>
    `;

  return renderShell(
    `
      ${state.error ? `<div class="error-banner" role="alert">${escapeHtml(state.error)}</div>` : ""}
      <span class="section-tag">${escapeHtml(copy.consentTag)}</span>
      <h2 class="step-title">${escapeHtml(copy.consent)}</h2>
      <p class="step-desc">${escapeHtml(consentDesc)}</p>
      ${gateNotice("top")}
      <p class="consent-privacy-note">${escapeHtml(copy.consentPrivacyNote)}</p>
      <h3 class="consent-subheading">${escapeHtml(copy.consentRequiredHeading)}</h3>
      <div class="consent-list">${required}</div>
      <div class="consent-sharing">
        <h3 class="consent-subheading">${escapeHtml(sharingHeading)}</h3>
        <p class="consent-sharing__desc">${escapeHtml(sharingDesc)}</p>
        <div class="consent-list">${sharing}</div>
      </div>
      ${gateNotice("bottom")}
      <div class="actions">
        <button class="btn btn-secondary" data-action="back">${escapeHtml(copy.back)}</button>
        <button
          class="btn btn-primary"
          data-action="next"
          ${canContinue ? "" : "disabled aria-disabled=\"true\""}
          title="${canContinue ? "" : escapeHtml(copy.requiredConsent)}"
        >${escapeHtml(copy.continue)}</button>
      </div>
    `,
    renderProgress(),
    { stepType: "consent" }
  );
}

function renderDemographics() {
  const copy = currentUi();
  const demographics = getDemographics(state.language, state.respondent || "adult");
  const fields = demographics.map(
    (f) => `
      <div class="field">
        <label for="${f.id}">${escapeHtml(f.label)}${f.required ? " *" : ""}</label>
        <input
          id="${f.id}"
          type="${f.type}"
          data-demo="${f.id}"
          value="${escapeHtml(state.demographics[f.id])}"
          ${f.required ? "required" : ""}
        />
      </div>
    `
  ).join("");

  return renderShell(
    `
      ${state.error ? `<div class="error-banner">${escapeHtml(state.error)}</div>` : ""}
      <span class="section-tag">${escapeHtml(copy.detailsTag)}</span>
      <h2 class="step-title">${escapeHtml(state.respondent === "parent" ? copy.detailsTitleParent : copy.detailsTitle)}</h2>
      <p class="step-desc">${escapeHtml(
        state.respondent === "parent"
          ? copy.detailsDescParent
          : state.respondent === "couple" && state.couplePartner
            ? `${copy.coupleYourTurn} ${couplePartnerLabel(state.couplePartner)}.`
            : copy.detailsDesc
      )}</p>
      ${fields}
      <div class="actions">
        <button class="btn btn-secondary" data-action="back">${escapeHtml(copy.back)}</button>
        <button class="btn btn-primary" data-action="next">${escapeHtml(copy.continue)}</button>
      </div>
    `,
    renderProgress(),
    { stepType: "demographics" }
  );
}

function domainNatureAccent(domainId) {
  const motifs = {
    auditory: "mountains",
    tactile: "flowers",
    movement: "mountains",
    visual: "flowers",
    smellTaste: "flowers",
    everyday: "mountains",
  };
  const motif = motifs[domainId] || "mountains";

  if (motif === "flowers") {
    return `
      <svg class="domain-accent__svg" viewBox="0 0 120 72" aria-hidden="true" focusable="false">
        <path d="M78 60 C76 44 84 32 92 24" fill="none" stroke="#6b9075" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
        <path d="M78 46 C70 40 62 42 56 48" fill="none" stroke="#7b9e87" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
        <path d="M84 38 C90 34 98 36 102 42" fill="none" stroke="#8faf98" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
        <g transform="translate(92 24)">
          <ellipse cx="0" cy="-8" rx="4.2" ry="7.6" fill="#c5d4c0" opacity="0.9"/>
          <ellipse cx="0" cy="-8" rx="4.2" ry="7.6" fill="#a8c4ae" opacity="0.85" transform="rotate(60)"/>
          <ellipse cx="0" cy="-8" rx="4.2" ry="7.6" fill="#88a487" opacity="0.8" transform="rotate(120)"/>
          <ellipse cx="0" cy="-8" rx="4.2" ry="7.6" fill="#c5d4c0" opacity="0.85" transform="rotate(180)"/>
          <ellipse cx="0" cy="-8" rx="4.2" ry="7.6" fill="#a8c4ae" opacity="0.85" transform="rotate(240)"/>
          <ellipse cx="0" cy="-8" rx="4.2" ry="7.6" fill="#88a487" opacity="0.8" transform="rotate(300)"/>
          <circle cx="0" cy="0" r="3.2" fill="#d8c48a"/>
        </g>
        <g transform="translate(56 50) scale(0.72)">
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#b8cbb8" opacity="0.9"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#88a487" opacity="0.85" transform="rotate(60)"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#6b9075" opacity="0.8" transform="rotate(120)"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#b8cbb8" opacity="0.85" transform="rotate(180)"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#88a487" opacity="0.85" transform="rotate(240)"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#6b9075" opacity="0.8" transform="rotate(300)"/>
          <circle cx="0" cy="0" r="2.8" fill="#e2d4a8"/>
        </g>
        <g transform="translate(104 44) scale(0.55)">
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#d5e3dc" opacity="0.95"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#a8c4ae" opacity="0.9" transform="rotate(60)"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#7b9e87" opacity="0.85" transform="rotate(120)"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#d5e3dc" opacity="0.9" transform="rotate(180)"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#a8c4ae" opacity="0.9" transform="rotate(240)"/>
          <ellipse cx="0" cy="-8" rx="4" ry="7" fill="#7b9e87" opacity="0.85" transform="rotate(300)"/>
          <circle cx="0" cy="0" r="2.6" fill="#f0e2b8"/>
        </g>
      </svg>
    `;
  }

  return `
    <svg class="domain-accent__svg" viewBox="0 0 120 72" aria-hidden="true" focusable="false">
      <circle cx="96" cy="18" r="8" fill="#f0e2b8" opacity="0.85"/>
      <circle cx="96" cy="18" r="4.5" fill="#f7efd0"/>
      <path d="M8 62 L32 28 L46 44 L62 18 L92 50 L112 34 L118 62Z" fill="#8aab90" opacity="0.55"/>
      <path d="M62 18 L67 28 L63 26 L60 31 L58 28 L54 34Z" fill="#f7f4ea" opacity="0.9"/>
      <path d="M4 62 L28 40 L42 52 L58 30 L78 48 L98 38 L118 62Z" fill="#4a6b55" opacity="0.72"/>
      <path d="M58 30 L62 37 L59 35 L57 39 L55 36 L52 41Z" fill="#eef3ea" opacity="0.8"/>
      <path d="M4 62 H118" stroke="#244b38" stroke-width="1.5" stroke-linecap="round" opacity="0.28"/>
    </svg>
  `;
}

function renderDomain(domain) {
  const copy = currentUi();
  const answers = state.answers[domain.id];
  const answeredCount = answers.filter((a) => typeof a === "boolean").length;
  const questionTotal = domain.questions.length;
  const mixedNote =
    state.respondent === "parent" ? copy.answerMixedNoteParent : copy.answerMixedNote;
  const showMixedNote = STEPS[state.step - 1]?.type !== "domain";
  const questions = domain.questions
    .map((q, i) => {
      const val = answers[i];
      return `
        <div class="question">
          <p class="question-text">${escapeHtml(q.text)}</p>
          <div class="yes-no" role="group" aria-label="${escapeHtml(copy.answerAria)} ${i + 1}">
            <button
              type="button"
              class="${val === true ? "selected" : ""}"
              data-domain="${domain.id}"
              data-q="${i}"
              data-answer="yes"
            >${escapeHtml(copy.yes)}</button>
            <button
              type="button"
              class="${val === false ? "selected" : ""}"
              data-domain="${domain.id}"
              data-q="${i}"
              data-answer="no"
            >${escapeHtml(copy.no)}</button>
          </div>
        </div>
      `;
    })
    .join("");

  const questionProgressHtml = `
    <p class="question-progress" aria-live="polite">
      <span class="question-progress__fill" style="width:${Math.round((answeredCount / questionTotal) * 100)}%"></span>
      <span class="question-progress__text">${answeredCount} ${escapeHtml(copy.of)} ${questionTotal} ${escapeHtml(copy.answered)}</span>
    </p>`;

  const isLastDomain = STEPS[state.step + 1]?.type === "results";
  const nextLabel = isLastDomain ? copy.seeResults || copy.continue : copy.continue;

  return renderShell(
    `
      ${state.error ? `<div class="error-banner">${escapeHtml(state.error)}</div>` : ""}
      <span class="section-tag">${domain.icon} ${escapeHtml(domain.shortTitle || domain.title)}</span>
      <header class="domain-heading">
        <div class="domain-heading__text">
          <h2 class="step-title domain-heading__title">${escapeHtml(domain.title)}</h2>
          <p class="step-desc domain-heading__desc">${escapeHtml(domain.description)}</p>
        </div>
        <div class="domain-accent" aria-hidden="true">
          ${domainNatureAccent(domain.id)}
        </div>
      </header>
      ${
        showMixedNote
          ? `<aside class="answer-mixed-note" aria-label="${escapeHtml(copy.answerMixedNoteLabel)}">
        <p class="answer-mixed-note__label">${escapeHtml(copy.answerMixedNoteLabel)}</p>
        <p>${escapeHtml(mixedNote)}</p>
      </aside>`
          : ""
      }
      <div class="question-list">${questions}</div>
      <div class="actions">
        <button type="button" class="btn btn-secondary" data-action="back">${escapeHtml(copy.back)}</button>
        <button type="button" class="btn btn-primary" data-action="next">${escapeHtml(nextLabel)}</button>
      </div>
    `,
    renderProgress({ questionProgressHtml }),
    { stepType: "domain", domainId: domain.id }
  );
}

function idealSaturdayCopy(copy = currentUi()) {
  const respondent = state.respondent || "adult";
  if (respondent === "teen") {
    return {
      title: copy.idealSaturdayTitleTeen,
      prompt: copy.idealSaturdayPromptTeen,
      hint: copy.idealSaturdayHintTeen,
      placeholder: copy.idealSaturdayPlaceholderTeen,
    };
  }
  if (respondent === "parent") {
    return {
      title: copy.idealSaturdayTitle,
      prompt: copy.idealSaturdayPromptParent,
      hint: copy.idealSaturdayHintParent,
      placeholder: copy.idealSaturdayPlaceholderParent,
    };
  }
  return {
    title: copy.idealSaturdayTitle,
    prompt: copy.idealSaturdayPromptAdult,
    hint: copy.idealSaturdayHintAdult,
    placeholder: copy.idealSaturdayPlaceholderAdult,
  };
}

function renderIdealSaturday() {
  const copy = currentUi();
  const fields = idealSaturdayCopy(copy);
  return renderShell(
    `
      ${state.error ? `<div class="error-banner">${escapeHtml(state.error)}</div>` : ""}
      <span class="section-tag">${escapeHtml(copy.idealSaturdayTag)}</span>
      <header class="domain-heading">
        <div class="domain-heading__text">
          <h2 class="step-title domain-heading__title">${escapeHtml(fields.title)}</h2>
          <p class="step-desc domain-heading__desc">${escapeHtml(fields.prompt)}</p>
        </div>
        <div class="domain-accent" aria-hidden="true">
          ${domainNatureAccent("everyday")}
        </div>
      </header>
      <p class="ideal-saturday__hint">${escapeHtml(fields.hint)}</p>
      <label class="ideal-saturday__label" for="ideal-saturday">
        <span class="visually-hidden">${escapeHtml(fields.title)}</span>
        <textarea
          id="ideal-saturday"
          class="ideal-saturday__input"
          data-ideal-saturday
          rows="8"
          placeholder="${escapeHtml(fields.placeholder)}"
        >${escapeHtml(state.idealSaturday || "")}</textarea>
      </label>
      <div class="actions">
        <button type="button" class="btn btn-secondary" data-action="back">${escapeHtml(copy.back)}</button>
        <button type="button" class="btn btn-primary" data-action="next">${escapeHtml(
          isCouplePathway() ? copy.continue : copy.seeResults || copy.continue
        )}</button>
      </div>
    `,
    renderProgress(),
    { stepType: "idealSaturday" }
  );
}

function renderIdealSaturdayResults(pageEntry) {
  if (isCouplePathway()) return "";
  const text = (state.idealSaturday || "").trim();
  if (!text) return "";
  const copy = currentUi();
  const isTeen = state.respondent === "teen";
  const isParent = state.respondent === "parent";
  const isHomeAdult = state.respondent === "adult" && state.lifeContext === "home";
  const closeQuote = copy.idealSaturdayHomeClose || "";

  if (isHomeAdult) {
    return `
    <section class="profile-section ideal-saturday-results ideal-saturday-results--home"${reportPageAttrs(pageEntry)} aria-labelledby="ideal-saturday-results-title">
      <div class="ideal-saturday-results__copy">
        <p class="profile-kicker">${escapeHtml(copy.idealSaturdayTag)}</p>
        <h3 id="ideal-saturday-results-title">${escapeHtml(copy.idealSaturdayResultsTitle)}</h3>
        <p class="profile-section__summary ideal-saturday-results__intro">${escapeHtml(copy.idealSaturdayResultsIntro)}</p>
        <blockquote class="ideal-saturday-results__quote">
          <p>${escapeHtml(text)}</p>
        </blockquote>
      </div>
      <figure class="ideal-saturday-results__close">
        <img
          src="assets/home-closing-trail.jpg"
          alt=""
          class="ideal-saturday-results__close-image"
          width="612"
          height="352"
          loading="eager"
          decoding="async"
        />
        ${
          closeQuote
            ? `<figcaption class="ideal-saturday-results__close-quote">
          <span class="ideal-saturday-results__close-mark" aria-hidden="true">“</span>
          <p>${escapeHtml(closeQuote)}</p>
        </figcaption>`
            : ""
        }
      </figure>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
    </section>`;
  }

  return `
    <section class="profile-section ideal-saturday-results${isTeen ? " ideal-saturday-results--teen" : ""}${isParent ? " ideal-saturday-results--parent" : ""}"${reportPageAttrs(pageEntry)} aria-labelledby="ideal-saturday-results-title">
      <p class="profile-kicker">${escapeHtml(copy.idealSaturdayTag)}</p>
      <h3 id="ideal-saturday-results-title">${escapeHtml(copy.idealSaturdayResultsTitle)}</h3>
      ${printMountainRule("section")}
      <p class="profile-section__summary ideal-saturday-results__intro">${escapeHtml(copy.idealSaturdayResultsIntro)}</p>
      <blockquote class="ideal-saturday-results__quote">
        <p>${escapeHtml(text)}</p>
      </blockquote>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
}

function renderTeenIdealSaturdayPrintBlock() {
  if (state.respondent !== "teen" && state.respondent !== "parent") return "";
  const text = (state.idealSaturday || "").trim();
  if (!text) return "";
  const copy = currentUi();

  return `
    <aside class="trail-interpret__ideal-saturday print-only" aria-labelledby="ideal-saturday-print-title">
      <p class="trail-interpret__ideal-kicker">${escapeHtml(copy.idealSaturdayTag)}</p>
      <h4 id="ideal-saturday-print-title" class="trail-interpret__ideal-title">${escapeHtml(copy.idealSaturdayResultsTitle)}</h4>
      <p class="trail-interpret__ideal-intro">${escapeHtml(copy.idealSaturdayResultsIntro)}</p>
      <blockquote class="trail-interpret__ideal-quote">
        <p>${escapeHtml(text)}</p>
      </blockquote>
    </aside>`;
}

const DOMAIN_COLORS = {
  auditory: "#6A9E8F",
  tactile: "#8AA66F",
  movement: "#D3A35D",
  visual: "#7A91B8",
  smellTaste: "#B8956C",
  everyday: "#C77D72",
};

function shortDomainTitle(scoreOrTitle) {
  if (scoreOrTitle && typeof scoreOrTitle === "object") {
    return scoreOrTitle.shortTitle || scoreOrTitle.title || "";
  }
  return String(scoreOrTitle || "");
}

function getProfileMetrics(scores) {
  const copy = currentUi();
  const subject = state.respondent === "parent" ? copy.yourChild : copy.you;
  const overall = scoreOverall(scores, state.language, state.respondent || "adult");
  const lean = overall.profile;
  const leanHeadline =
    state.language === "af"
      ? lean === "sensitive"
        ? `${subject} neig na ’n laer sensoriese drempel — insette word vinnig opgemerk.`
        : lean === "seeking"
          ? `${subject} neig na ’n hoër sensoriese drempel — meer insette word dikwels gesoek.`
          : "Die antwoorde lê in ’n meer gebalanseerde middelgrond."
      : lean === "sensitive"
        ? `${subject} ${state.respondent === "parent" ? "leans" : "lean"} toward a lower sensory threshold — noticing input quickly.`
        : lean === "seeking"
          ? `${subject} ${state.respondent === "parent" ? "leans" : "lean"} toward a higher sensory threshold — often seeking more input.`
          : "The answers sit in a more balanced middle ground.";

  return {
    ...overall,
    lean,
    leanHeadline,
  };
}

function ensureWorkReportDefaults() {
  if (!state.workReport.name && state.demographics.name) {
    state.workReport.name = state.demographics.name;
  }
  if (!state.workReport.jobTitle && state.demographics.occupation) {
    state.workReport.jobTitle = state.demographics.occupation;
  }
  ensureSettingReportComposerDefaults();
}

function getScoreRows(scores) {
  const labels = getProfileLabels(state.language, state.respondent || "adult");
  return scores.map((score) => {
    const threshold = getThresholdMeta(score.profile, state.language);
    const reading = getThresholdReading(score.id, score.profile, {
      language: state.language,
      respondent: state.respondent || "adult",
      lifeContext: state.lifeContext,
    });
    const profileMeta = labels[score.profile] || labels.neutral;
    return {
      id: score.id,
      icon: score.icon,
      title: score.title,
      shortTitle: shortDomainTitle(score),
      blurb: score.blurb || "",
      profile: score.profile,
      profileShort: profileMeta.short,
      color: DOMAIN_COLORS[score.id] || profileMeta.color,
      thresholdLabel: threshold.label,
      thresholdFull: threshold.full,
      thresholdKey: threshold.key,
      implication: reading.implication,
      recommendation: reading.recommendation,
    };
  });
}

function senseInterpretMarker(profile) {
  if (profile === "sensitive") return 14;
  if (profile === "seeking") return 86;
  return 50;
}

function senseInterpretLeanLabel(profile, copy) {
  if (profile === "sensitive") return copy.scoreLeanSensitive;
  if (profile === "seeking") return copy.scoreLeanSeeking;
  return copy.scoreLeanNeutral;
}

function renderBalanceBar(
  row,
  copy,
  { showStatus = true, compact = false, percent: exactPercent, axisSensitive, axisNeutral, axisSeeking } = {}
) {
  const percent = typeof exactPercent === "number" ? exactPercent : senseInterpretMarker(row.profile);
  const lean = senseInterpretLeanLabel(row.profile, copy);
  const leftLabel =
    axisSensitive ||
    (compact ? copy.scoreLeanSensitiveShort || "−" : copy.scoreLeanSensitive);
  const midLabel =
    axisNeutral ||
    (compact ? copy.scoreLeanNeutralShort || "Balanced" : copy.scoreLeanNeutral);
  const rightLabel =
    axisSeeking ||
    (compact ? copy.scoreLeanSeekingShort || "+" : copy.scoreLeanSeeking);
  return `
    <div
      class="balance-bar${compact ? " balance-bar--compact" : ""}"
      data-profile="${row.profile}"
      style="--marker:${percent}%; --domain-color:${row.color}"
    >
      <div
        class="balance-bar__track"
        role="img"
        aria-label="${escapeHtml(row.shortTitle)}: ${escapeHtml(lean)}"
      >
        <span class="balance-bar__zones" aria-hidden="true"></span>
        <span class="balance-bar__marker" aria-hidden="true"></span>
      </div>
      <div class="balance-bar__axis" aria-hidden="true">
        <span>${escapeHtml(leftLabel)}</span>
        <span>${escapeHtml(midLabel)}</span>
        <span>${escapeHtml(rightLabel)}</span>
      </div>
      ${
        showStatus
          ? `<span class="balance-bar__status sense-interpret__lean sense-interpret__lean--${row.profile}">${escapeHtml(lean)}</span>`
          : ""
      }
    </div>`;
}

function renderSenseGlanceGrid(rows, copy, pageEntry) {
  const cards = rows
    .map(
      (row, index) => `
      <li
        class="sense-glance__card"
        data-profile="${row.profile}"
        style="--domain-color:${row.color}; --glance-delay:${index * 60}ms"
      >
        <span class="sense-glance__icon" aria-hidden="true">${row.icon}</span>
        <strong class="sense-glance__title">${escapeHtml(row.shortTitle)}</strong>
        ${row.blurb ? `<p class="sense-glance__blurb">${escapeHtml(row.blurb)}</p>` : ""}
        <span class="threshold-pill threshold-pill--${row.thresholdKey}">${escapeHtml(row.thresholdLabel)}</span>
        ${renderBalanceBar(row, copy, { showStatus: true, compact: true })}
      </li>`
    )
    .join("");

  return `
    <div class="sense-glance"${reportPageAttrs(pageEntry)}>
      <p class="sense-glance__label">${escapeHtml(copy.scoreGlanceTitle)}</p>
      <ul class="sense-glance__grid">${cards}</ul>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
    </div>`;
}

function renderAdultSenseGlance(rows, copy, pageEntry) {
  return renderSenseGlanceGrid(rows, copy, pageEntry);
}

function renderTeenScoreGauge(balance, color, label) {
  const clamped = Math.max(0, Math.min(100, Number(balance) || 50));
  const radius = 54;
  const circumference = Math.PI * radius;
  const dash = (clamped / 100) * circumference;
  const angle = Math.PI * (1 - clamped / 100);
  const markerX = 70 + radius * Math.cos(angle);
  const markerY = 70 - radius * Math.sin(angle);

  return `
    <div class="teen-score__gauge" role="img" aria-label="${escapeHtml(label)}: ${Math.round(clamped)}%">
      <svg class="teen-score__gauge-svg" viewBox="0 0 140 88" focusable="false" aria-hidden="true">
        <path
          d="M16 70 A54 54 0 0 1 124 70"
          fill="none"
          stroke="rgba(36, 75, 56, 0.12)"
          stroke-width="10"
          stroke-linecap="round"
        />
        <path
          class="teen-score__gauge-arc"
          d="M16 70 A54 54 0 0 1 124 70"
          fill="none"
          stroke="${escapeHtml(color)}"
          stroke-width="10"
          stroke-linecap="round"
          stroke-dasharray="${dash.toFixed(2)} ${circumference.toFixed(2)}"
        />
        <circle cx="${markerX.toFixed(1)}" cy="${markerY.toFixed(1)}" r="6.5" fill="${escapeHtml(color)}" />
        <circle cx="${markerX.toFixed(1)}" cy="${markerY.toFixed(1)}" r="2.8" fill="#fff" />
      </svg>
      <div class="teen-score__gauge-readout">
        <strong>${Math.round(clamped)}</strong>
        <span>${escapeHtml(label)}</span>
      </div>
    </div>`;
}

function renderTeenOverallScoreCard(metrics, copy) {
  const labels = getProfileLabels(state.language, state.respondent || "adult");
  const threshold = getThresholdMeta(metrics.lean, state.language);
  const meta = labels[metrics.lean] || labels.neutral;

  return `
    <div class="teen-score" data-profile="${metrics.lean}" style="--tag-color:${meta.color}">
      <header class="teen-score__header">
        <p class="teen-score__kicker">${escapeHtml(copy.teenScoreBoardKicker || copy.overallScoreLabel)}</p>
        <p class="teen-score__note">${escapeHtml(copy.overallScoreNote)}</p>
      </header>

      <div class="teen-score__hero teen-score__hero--verdict-only">
        <div class="teen-score__verdict">
          <p class="teen-score__label">${escapeHtml(copy.overallScoreLabel)}</p>
          <strong class="teen-score__profile">${escapeHtml(meta.label || meta.short)}</strong>
          <span class="threshold-pill threshold-pill--${threshold.key}">${escapeHtml(threshold.label)}</span>
          ${renderTeenScoreGauge(
            metrics.balance,
            meta.color,
            copy.overallBalanceLabel
          )}
          <div class="teen-score__axis" aria-hidden="true">
            <span>${escapeHtml(copy.teenOverallAxisSensitive || copy.scoreLeanSensitive)}</span>
            <span>${escapeHtml(copy.teenOverallAxisSeeking || copy.scoreLeanSeeking)}</span>
          </div>
        </div>
      </div>
    </div>`;
}

function getSchoolVisualReportCopy() {
  const copy = currentUi();
  return {
    sectionVisual: copy.schoolReportSectionVisual,
    visualLegendSensitive: copy.schoolReportVisualLegendSensitive,
    visualLegendNeutral: copy.schoolReportVisualLegendNeutral,
    visualLegendSeeking: copy.schoolReportVisualLegendSeeking,
    visualAxisLeft: copy.schoolReportVisualAxisLeft,
    visualAxisRight: copy.schoolReportVisualAxisRight,
  };
}

function renderTeenSenseBalanceBars(rows, copy, pageEntry) {
  return `
    <div class="teen-sense-balance"${reportPageAttrs(pageEntry)}>
      <p class="teen-sense-balance__label">${escapeHtml(copy.scoreGlanceTitle)}</p>
      ${renderSchoolReportVisual(rows, getSchoolVisualReportCopy(), "balance")}
      ${reportPageNumberHtml(copy, pageEntry?.page)}
    </div>`;
}

/** Split long interpret copy into scannable bullets / labeled sections. */
function splitInterpretSentences(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const parts = cleaned.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [cleaned];
  return parts.map((part) => part.trim()).filter(Boolean);
}

function parseInterpretContent(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const labelRe = /(At school|At home|By die skool|By die huis)\s*:\s*/gi;
  if (labelRe.test(cleaned)) {
    labelRe.lastIndex = 0;
    const chunks = cleaned.split(labelRe);
    const sections = [];
    for (let i = 1; i < chunks.length; i += 2) {
      const heading = chunks[i].trim();
      const body = (chunks[i + 1] || "").trim();
      if (!body) continue;
      sections.push({
        heading,
        points: splitInterpretSentences(body),
      });
    }
    if (sections.length) return sections;
  }

  const points = splitInterpretSentences(cleaned);
  if (points.length <= 1) {
    return [{ heading: null, points: [cleaned] }];
  }
  return [{ heading: null, points }];
}

function renderInterpretContent(text) {
  const sections = parseInterpretContent(text);
  if (!sections.length) return "";

  return sections
    .map((section) => {
      const heading = section.heading
        ? `<p class="sense-interpret__section-title">${escapeHtml(section.heading)}</p>`
        : "";
      const points = section.points
        .map((point) => `<li>${escapeHtml(point)}</li>`)
        .join("");
      return `
        <div class="sense-interpret__section">
          ${heading}
          <ul class="sense-interpret__points">${points}</ul>
        </div>`;
    })
    .join("");
}

function senseInterpretTrail() {
  return `
    <div class="sense-interpret__trail" aria-hidden="true">
      <svg viewBox="0 0 200 28" fill="none" focusable="false">
        <path d="M4 22 L28 10 L42 18 L58 6 L78 16 L98 8 L118 18 L138 10 L158 16 L180 8 L196 22" stroke="#7b9e87" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
        <path d="M58 6 L62 12 L59 11 L57 14 L55 12 L52 16Z" fill="#f7f4ea" opacity="0.85"/>
        <circle cx="100" cy="12" r="2.2" fill="#d8c48a" opacity="0.9"/>
        <path d="M4 22 H196" stroke="#244b38" stroke-width="1" stroke-linecap="round" opacity="0.18"/>
      </svg>
    </div>`;
}

function renderSenseInterpretCard(row, index, copy, { detailed = false, pageEntry = null } = {}) {
  const meansBlock = detailed
    ? `
        <div class="sense-interpret__block sense-interpret__block--means">
          <h5 class="sense-interpret__label">${escapeHtml(copy.scoreColImplication)}</h5>
          <div class="sense-interpret__content">${renderInterpretContent(row.implication)}</div>
        </div>
        ${senseInterpretTrail()}
        ${printMountainRule("sense")}`
    : "";

  return `
      <article
        class="sense-interpret${detailed ? " sense-interpret--detailed" : ""}"
        data-profile="${row.profile}"
        data-domain="${escapeHtml(row.id)}"
        style="--domain-color:${row.color}; --interpret-delay:${index * 55}ms"${reportPageAttrs(pageEntry)}
      >
        <div class="sense-interpret__print-band print-only" aria-hidden="true"></div>
        <header class="sense-interpret__header">
          <span class="sense-interpret__icon" aria-hidden="true">${row.icon}</span>
          <div class="sense-interpret__titles">
            <p class="sense-interpret__print-kicker print-only">${escapeHtml(copy.scoreTableKicker || "Sensory system")}</p>
            <h4 class="sense-interpret__title">${escapeHtml(row.shortTitle)}</h4>
            ${
              row.blurb
                ? `<p class="sense-interpret__blurb">${escapeHtml(row.blurb)}</p>`
                : `<p class="sense-interpret__subtitle">${escapeHtml(row.title)}</p>`
            }
          </div>
          <div class="sense-interpret__badges">
            <span class="threshold-pill threshold-pill--${row.thresholdKey}" title="${escapeHtml(row.thresholdFull)}">
              ${escapeHtml(row.thresholdLabel)}
            </span>
          </div>
        </header>

        ${printSenseNatureArt(row.id)}
        ${printMountainRule("sense-top")}

        ${renderBalanceBar(row, copy, {
          showStatus: true,
          compact: false,
        })}

        <div class="sense-interpret__body">
          ${meansBlock}
          <div class="sense-interpret__block sense-interpret__block--help">
            <h5 class="sense-interpret__label">${escapeHtml(copy.scoreColRecommendation)}</h5>
            <div class="sense-interpret__content">${renderInterpretContent(row.recommendation)}</div>
          </div>
        </div>
        <div class="sense-interpret__print-footer print-only" aria-hidden="true">
          <span class="sense-interpret__print-footer-peak"></span>
          <span class="sense-interpret__print-footer-peak sense-interpret__print-footer-peak--mid"></span>
          <span class="sense-interpret__print-footer-peak sense-interpret__print-footer-peak--near"></span>
        </div>
        ${reportPageNumberHtml(copy, pageEntry?.page)}
      </article>`;
}

function renderProfileTag(label, profile, { large = false } = {}) {
  const labels = getProfileLabels(state.language, state.respondent || "adult");
  const meta = labels[profile] || labels.neutral;
  return `
    <span class="profile-tag profile-tag--${profile}${large ? " profile-tag--large" : ""}" style="--tag-color:${meta.color}">
      <span class="profile-tag__label">${escapeHtml(label)}</span>
      <span class="profile-tag__sep" aria-hidden="true">—</span>
      <span class="profile-tag__profile">${escapeHtml(meta.short)}</span>
    </span>
  `;
}

function renderClassicOverallScoreCard(metrics, copy) {
  const labels = getProfileLabels(state.language, state.respondent || "adult");
  const threshold = getThresholdMeta(metrics.lean, state.language);
  const meta = labels[metrics.lean] || labels.neutral;

  const stats = [
    { key: "sensitive", label: copy.overallSensitiveTotal, value: metrics.sensitive },
    { key: "neutral", label: copy.overallNeutralTotal, value: metrics.neutral },
    { key: "seeking", label: copy.overallSeekingTotal, value: metrics.seeking },
  ]
    .map(
      (stat) => `
      <li class="overall-score__stat overall-score__stat--${stat.key}">
        <span class="overall-score__stat-value">${stat.value}</span>
        <span class="overall-score__stat-label">${escapeHtml(stat.label)}</span>
      </li>`
    )
    .join("");

  const split = ["sensitive", "neutral", "seeking"]
    .map((key) => {
      const count = metrics.systems[key];
      const profileMeta = labels[key] || labels.neutral;
      return `
      <li class="overall-score__split-item" data-profile="${key}" style="--tag-color:${profileMeta.color}">
        <span class="overall-score__split-count">${count}</span>
        <span class="overall-score__split-label">${escapeHtml(profileMeta.short)}</span>
      </li>`;
    })
    .join("");

  return `
    <div class="overall-score" data-profile="${metrics.lean}" style="--tag-color:${meta.color}">
      <div class="overall-score__head">
        <div class="overall-score__heading">
          <p class="overall-score__note">${escapeHtml(copy.overallScoreNote)}</p>
        </div>
        <div class="overall-score__verdict">
          <p class="overall-score__label">${escapeHtml(copy.overallScoreLabel)}</p>
          <strong class="overall-score__profile">${escapeHtml(meta.label || meta.short)}</strong>
          <span class="threshold-pill threshold-pill--${threshold.key}">${escapeHtml(threshold.label)}</span>
        </div>
      </div>

      <ul class="overall-score__stats" aria-label="${escapeHtml(copy.overallScoreLabel)}">${stats}</ul>

      <div class="overall-score__bar">
        <p class="overall-score__bar-label">${escapeHtml(copy.overallBalanceLabel)}</p>
        ${renderBalanceBar(
          { profile: metrics.lean, color: meta.color, shortTitle: copy.overallScoreLabel },
          copy,
          {
            showStatus: true,
            percent: metrics.balance,
          }
        )}
      </div>

      <div class="overall-score__split">
        <p class="overall-score__split-label-head">${escapeHtml(copy.overallSystemsLabel)}</p>
        <ul class="overall-score__split-list">${split}</ul>
      </div>
    </div>
  `;
}

function renderOverallScoreCard(metrics, copy) {
  if (state.respondent === "teen") {
    return renderTeenOverallScoreCard(metrics, copy);
  }

  return renderClassicOverallScoreCard(metrics, copy);
}

function renderOverallSummary(metrics, pageEntry) {
  const copy = currentUi();
  const contextOverview = getContextOverview(state.lifeContext, metrics.lean, state.language);
  const framing = getContextFraming(state.lifeContext, state.language);
  return `
    <section class="profile-section profile-section--overall"${reportPageAttrs(pageEntry, { includeId: false })} aria-labelledby="overall-title">
      <p class="profile-kicker">${escapeHtml(copy.overallPattern)}</p>
      <h3 id="overall-title">${escapeHtml(metrics.leanHeadline)}</h3>
      ${printMountainRule("section")}
      <p class="profile-section__summary">${escapeHtml(copy.descriptiveMap)}</p>
      ${renderOverallScoreCard(metrics, copy)}
      ${
        contextOverview
          ? `
      ${printMountainRule("section")}
      <div class="context-reading">
        <p class="context-reading__label">${escapeHtml(framing ? framing.inSetting : lifeContextLabel())}</p>
        <p class="context-reading__text">${escapeHtml(contextOverview)}</p>
      </div>`
          : ""
      }
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
}

function getTeenCrewId(lean) {
  if (lean === "seeking") return "explorer";
  if (lean === "sensitive") return "observer";
  return "adaptor";
}

function shouldShowTrailProfile() {
  return (
    state.respondent === "adult" ||
    state.respondent === "teen" ||
    state.respondent === "parent" ||
    state.respondent === "couple"
  );
}

function getTrailDescriptionPage(crewId) {
  const pages = {
    explorer: {
      src: "assets/sensory-description-explorer.png?v=20260815a",
      width: 723,
      height: 1024,
      alt: "Sensory Explorer description — high threshold, sensory seeking",
    },
    adaptor: {
      src: "assets/sensory-description-adaptor.png?v=20260815a",
      width: 724,
      height: 1024,
      alt: "Sensory Adaptor description — medium threshold, sensory neutral",
    },
    observer: {
      src: "assets/sensory-description-observer.png?v=20260815a",
      width: 724,
      height: 1024,
      alt: "Sensory Observer description — low threshold, sensory sensitive",
    },
  };
  return pages[crewId] || pages.adaptor;
}

function renderTrailProfilePageFigure({ src, alt, width, height, className = "" }) {
  return `
    <figure class="trail-profile__figure${className ? ` ${className}` : ""}">
      <img
        class="trail-profile__image"
        src="${escapeHtml(src)}"
        alt="${escapeHtml(alt)}"
        width="${Number(width) || 724}"
        height="${Number(height) || 1024}"
        loading="eager"
        decoding="async"
      />
    </figure>`;
}

function renderSensoryTrailOverview(pageEntry) {
  if (!shouldShowTrailProfile()) return "";
  const copy = currentUi();
  const isParent = state.respondent === "parent";
  const isTeen = state.respondent === "teen";
  const title = isParent
    ? copy.teenCrewOverviewTitleParent || copy.teenCrewOverviewTitle
    : copy.teenCrewOverviewTitle;
  const overviewQuote = copy.teenTrailOverviewQuote || "";
  const overviewIntro = copy.teenTrailOverviewIntro || "";

  return `
    <section class="profile-section trail-profile trail-profile--page${isTeen ? " trail-profile--overview-teen" : ""}"${reportPageAttrs(pageEntry)} aria-labelledby="trail-overview-title">
      ${
        isTeen && (overviewQuote || overviewIntro)
          ? `
      <div class="trail-profile__overview-copy">
        <h3 id="trail-overview-title" class="trail-profile__overview-title">${escapeHtml(title)}</h3>
        ${
          overviewQuote
            ? `
        <blockquote class="trail-profile__overview-quote">
          <p>${escapeHtml(overviewQuote)}</p>
        </blockquote>`
            : ""
        }
        ${overviewIntro ? `<p class="trail-profile__overview-intro">${escapeHtml(overviewIntro)}</p>` : ""}
      </div>`
          : `<h3 id="trail-overview-title" class="visually-hidden">${escapeHtml(title)}</h3>`
      }
      ${renderTrailProfilePageFigure({
        src: "assets/sensory-trail-profile.png?v=20260817",
        alt: copy.teenCrewSummaryAria,
        width: 682,
        height: 1024,
        className: "trail-profile__figure--overview",
      })}
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>`;
}

function renderMatchedTrailDescription(metrics, pageEntry) {
  if (!shouldShowTrailProfile()) return "";
  const copy = currentUi();
  const youId = getTeenCrewId(metrics.lean);
  const roster = getTeenCrewRoster(copy);
  const you = roster.find((member) => member.id === youId) || roster[1];
  const page = getTrailDescriptionPage(youId);
  const isParent = state.respondent === "parent";
  const title = isParent
    ? (copy.teenCrewDescriptionTitleParent || copy.teenCrewDescriptionTitle || you.name)
    : (copy.teenCrewDescriptionTitle || you.name);
  const alt = `${you.name}: ${page.alt}`;

  return `
    <section class="profile-section trail-profile trail-profile--page trail-profile--matched"${reportPageAttrs(pageEntry)} aria-labelledby="trail-description-title" data-crew-you="${youId}">
      <h3 id="trail-description-title" class="visually-hidden">${escapeHtml(title)}</h3>
      ${renderTrailProfilePageFigure({
        src: page.src,
        alt,
        width: page.width,
        height: page.height,
        className: `trail-profile__figure--${youId}`,
      })}
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>`;
}

function renderMatchedTrailReveal(metrics, pageEntry) {
  if (!shouldShowTrailProfile()) return "";

  const copy = currentUi();
  const isParent = state.respondent === "parent";
  const youId = getTeenCrewId(metrics.lean);
  const roster = getTeenCrewRoster(copy);
  const you = roster.find((member) => member.id === youId) || roster[1];
  const youAre = isParent ? copy.teenCrewYouAreParent : copy.teenCrewYouAre;
  const detailTitle = isParent
    ? copy.teenCrewMatchTitleParent || copy.teenCrewDetailTitleParent
    : copy.teenCrewMatchTitle || copy.teenCrewDetailTitle;
  const lead = isParent
    ? copy.teenCrewMatchLeadParent || copy.teenCrewIntroParent
    : copy.teenCrewMatchLead || copy.teenCrewIntro;

  return `
    <section class="profile-section trail-profile trail-profile--reveal${
      state.respondent === "parent" ? " parent-report-section" : ""
    }"${reportPageAttrs(pageEntry)} aria-labelledby="trail-match-title" data-crew-you="${youId}">
      <header class="trail-profile__header trail-profile__header--reveal">
        <p class="profile-kicker">${escapeHtml(copy.teenCrewKicker)}</p>
        <h3 id="trail-match-title" class="${
          state.respondent === "parent" ? "couple-compare__title parent-section-title" : ""
        }">${escapeHtml(detailTitle)}</h3>
        ${state.respondent === "parent" ? "" : printMountainRule("section")}
        <p class="profile-section__summary">${escapeHtml(lead)}</p>
      </header>

      ${renderOverallScoreCard(metrics, copy)}

      <article class="teen-crew__detail teen-crew__match teen-crew__match--${youId} teen-crew__match--concise teen-crew__match--reveal${
        state.respondent === "parent" ? " parent-match-card" : ""
      }">
        <header class="teen-crew__match-heading">
          <p class="teen-crew__you-label">${escapeHtml(youAre)}</p>
          <h4 class="teen-crew__hero-name">${escapeHtml(you.name)}</h4>
          <p class="teen-crew__hero-tag">${escapeHtml(you.tag)}</p>
        </header>
        <figure class="teen-crew__match-portrait teen-crew__match-portrait--hero">
          ${teenCrewCharacterArt(youId, `reveal-${youId}`)}
        </figure>
        <div class="teen-crew__match-copy">
          <p class="teen-crew__hero-summary">${escapeHtml(you.summary)}</p>
          ${you.body ? `<p class="teen-crew__hero-body">${escapeHtml(you.body)}</p>` : ""}
        </div>
      </article>

      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>`;
}

function getTeenCrewRoster(copy) {
  const isParent = state.respondent === "parent";
  const isTeen = state.respondent === "teen";
  const pick = (baseKey, parentKey, teenKey) => {
    if (isParent) return copy[parentKey];
    if (isTeen && copy[teenKey] != null) return copy[teenKey];
    return copy[baseKey];
  };

  return [
    {
      id: "observer",
      lean: "sensitive",
      name: copy.teenCrewObserverName,
      tag: copy.teenCrewObserverTag,
      summary: pick(
        "teenCrewObserverSummary",
        "teenCrewObserverSummaryParent",
        "teenCrewObserverSummaryTeen"
      ),
      body: pick(
        "teenCrewObserverBody",
        "teenCrewObserverBodyParent",
        "teenCrewObserverBodyTeen"
      ),
      role: pick("teenCrewObserverRole", "teenCrewObserverRole", "teenCrewObserverRoleTeen"),
      traits:
        pick("teenCrewObserverTraits", "teenCrewObserverTraits", "teenCrewObserverTraitsTeen") ||
        [],
    },
    {
      id: "adaptor",
      lean: "neutral",
      name: copy.teenCrewAdaptorName,
      tag: copy.teenCrewAdaptorTag,
      summary: pick(
        "teenCrewAdaptorSummary",
        "teenCrewAdaptorSummaryParent",
        "teenCrewAdaptorSummaryTeen"
      ),
      body: pick(
        "teenCrewAdaptorBody",
        "teenCrewAdaptorBodyParent",
        "teenCrewAdaptorBodyTeen"
      ),
      role: pick("teenCrewAdaptorRole", "teenCrewAdaptorRole", "teenCrewAdaptorRoleTeen"),
      traits:
        pick("teenCrewAdaptorTraits", "teenCrewAdaptorTraits", "teenCrewAdaptorTraitsTeen") || [],
    },
    {
      id: "explorer",
      lean: "seeking",
      name: copy.teenCrewExplorerName,
      tag: copy.teenCrewExplorerTag,
      summary: pick(
        "teenCrewExplorerSummary",
        "teenCrewExplorerSummaryParent",
        "teenCrewExplorerSummaryTeen"
      ),
      body: pick(
        "teenCrewExplorerBody",
        "teenCrewExplorerBodyParent",
        "teenCrewExplorerBodyTeen"
      ),
      role: pick("teenCrewExplorerRole", "teenCrewExplorerRole", "teenCrewExplorerRoleTeen"),
      traits:
        pick("teenCrewExplorerTraits", "teenCrewExplorerTraits", "teenCrewExplorerTraitsTeen") ||
        [],
    },
  ];
}

function teenCrewCharacterArt(id, suffix = id) {
  const assets = {
    explorer: {
      src: "assets/sensory-character-explorer.png?v=20260812e",
      alt: "Sensory Explorer — I explore the trail",
      width: 1536,
      height: 1024,
    },
    adaptor: {
      src: "assets/sensory-character-adaptor.png?v=20260812e",
      alt: "Sensory Adaptor — I find my way",
      width: 1024,
      height: 768,
    },
    observer: {
      src: "assets/sensory-character-observer.png?v=20260812e",
      alt: "Sensory Observer — I notice the trail",
      width: 1024,
      height: 768,
    },
  };
  const asset = assets[id] || assets.adaptor;
  return `
    <img
      class="teen-crew__art teen-crew__art--photo teen-crew__art--${escapeHtml(id)}"
      src="${asset.src}"
      alt="${escapeHtml(asset.alt)}"
      width="${asset.width}"
      height="${asset.height}"
      loading="eager"
      decoding="async"
    />`;
}

function renderTeenCrewSummary(metrics, pageEntry) {
  if (!shouldShowTrailProfile()) return "";

  const copy = currentUi();
  const isParent = state.respondent === "parent";
  const isTeen = state.respondent === "teen";
  const youId = getTeenCrewId(metrics.lean);
  const roster = getTeenCrewRoster(copy);
  const you = roster.find((member) => member.id === youId) || roster[1];
  const title = isParent ? copy.teenCrewTitleParent : copy.teenCrewTitle;
  const intro = isParent ? copy.teenCrewIntroParent : copy.teenCrewIntro;
  const youAre = isParent ? copy.teenCrewYouAreParent : copy.teenCrewYouAre;
  const badge = isParent ? copy.teenCrewBadgeParent : copy.teenCrewBadge;
  const detailTitle = isTeen
    ? copy.teenCrewDetailTitleTeen || copy.teenCrewDetailTitle
    : isParent
      ? copy.teenCrewDetailTitleParent
      : copy.teenCrewDetailTitle;
  const footer = isParent ? copy.teenCrewFooterParent : copy.teenCrewFooter;
  const crewIntro = isTeen
    ? copy.teenCrewCrewIntroTeen || copy.teenCrewCrewIntro
    : copy.teenCrewCrewIntro;
  const traitsTitle = isTeen
    ? copy.teenCrewTraitsTitleTeen || copy.teenCrewTraitsTitle
    : copy.teenCrewTraitsTitle;
  const traits =
    Array.isArray(you.traits) && you.traits.length
      ? `
        <div class="trail-profile__traits teen-crew__match-traits">
          <p class="trail-profile__traits-title">${escapeHtml(traitsTitle)}</p>
          <ul class="trail-profile__traits-list">
            ${you.traits.map((trait) => `<li>${escapeHtml(trait)}</li>`).join("")}
          </ul>
        </div>`
      : "";

  const rosterCards = roster
    .map((member) => {
      const matched = member.id === youId;
      return `
        <article class="trail-roster__card trail-roster__card--${member.id}${matched ? " is-matched" : ""}" data-crew="${member.id}">
          <div class="trail-roster__art" aria-hidden="true">${teenCrewCharacterArt(member.id, `roster-${member.id}`)}</div>
          <div class="trail-roster__copy">
            ${matched ? `<p class="trail-roster__badge">${escapeHtml(badge)}</p>` : ""}
            <h4 class="trail-roster__name">${escapeHtml(member.name)}</h4>
            <p class="trail-roster__tag">${escapeHtml(member.tag)}</p>
            <p class="trail-roster__summary">${escapeHtml(member.summary)}</p>
          </div>
        </article>`;
    })
    .join("");

  return `
    <section class="profile-section teen-crew trail-profile trail-profile--concise"${reportPageAttrs(pageEntry)} aria-labelledby="teen-crew-title" data-crew-you="${youId}">
      <header class="trail-profile__header">
        <p class="profile-kicker">${escapeHtml(copy.teenCrewKicker)}</p>
        <h3 id="teen-crew-title">${escapeHtml(title)}</h3>
        ${printMountainRule("section")}
        <p class="profile-section__summary">${escapeHtml(intro)}</p>
        <p class="trail-profile__crew-intro">${escapeHtml(crewIntro)}</p>
      </header>

      <div class="trail-roster" role="list">
        ${rosterCards}
      </div>

      <article class="teen-crew__detail teen-crew__match teen-crew__match--${youId} teen-crew__match--concise">
        <header class="teen-crew__match-heading">
          <p class="teen-crew__detail-title">${escapeHtml(detailTitle)}</p>
          <p class="teen-crew__you-label">${escapeHtml(youAre)}</p>
          <h4 class="teen-crew__hero-name">${escapeHtml(you.name)}</h4>
          <p class="teen-crew__hero-tag">${escapeHtml(you.tag)}</p>
        </header>
        <figure class="teen-crew__match-portrait teen-crew__match-portrait--hero">
          ${teenCrewCharacterArt(youId, `hero-${youId}`)}
        </figure>
        <div class="teen-crew__match-copy">
          <p class="teen-crew__hero-summary">${escapeHtml(you.summary)}</p>
          ${you.body ? `<p class="teen-crew__hero-body">${escapeHtml(you.body)}</p>` : ""}
          ${traits}
        </div>
      </article>

      <p class="trail-profile__footer">${escapeHtml(footer)}</p>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
}

function renderBriefScoresHomeRest(copy) {
  if (state.respondent !== "adult" || state.lifeContext !== "home") return "";
  const quote = copy.briefScoresHomeQuote;
  if (!quote) return "";
  return `
    <aside class="brief-scores__home-rest">
      <figure class="brief-scores__home-figure">
        <img
          src="assets/home-scores-trail.jpg"
          alt=""
          class="brief-scores__home-image"
          width="1024"
          height="639"
          loading="eager"
          decoding="async"
        />
      </figure>
      <blockquote class="brief-scores__home-quote">
        <span class="brief-scores__home-mark" aria-hidden="true">“</span>
        <p>${escapeHtml(quote)}</p>
      </blockquote>
    </aside>`;
}

function renderBriefScoreSummary(scores, metrics, pageEntry) {
  const copy = currentUi();
  const isParent = state.respondent === "parent";
  const isTeen = state.respondent === "teen";
  const isHomeAdult = state.respondent === "adult" && state.lifeContext === "home";
  const rows = getScoreRows(scores);
  const kicker = isParent ? copy.briefScoresKickerParent : copy.briefScoresKicker;
  const intro = isParent ? copy.briefScoresIntroParent : copy.briefScoresIntro;
  const scoresVisual = canOfferWorkReport()
    ? renderWorkScoreScaleChart(
        rows,
        scoreOverall(scores, state.language, state.respondent || "adult"),
        getSettingReportCopy(),
        copy
      )
    : isTeen
      ? renderTeenSenseBalanceBars(rows, copy, null)
      : renderAdultSenseGlance(rows, copy, null);

  if (isParent) {
    return `
    <section class="profile-section profile-section--brief-scores parent-report-section parent-scores-sheet"${reportPageAttrs(pageEntry)} aria-labelledby="brief-scores-title">
      <div class="parent-scores-sheet__hero">
        <img
          src="assets/parent-scores-path.jpg"
          alt=""
          class="parent-scores-sheet__hero-image"
          width="1600"
          height="1067"
          loading="eager"
          decoding="async"
        />
        <div class="parent-scores-sheet__hero-veil" aria-hidden="true"></div>
        <div class="parent-scores-sheet__hero-copy">
          <p class="parent-scores-sheet__kicker">${escapeHtml(copy.viewpoint || "")}</p>
          <h3 id="brief-scores-title" class="parent-scores-sheet__title">${escapeHtml(kicker)}</h3>
          <p class="parent-scores-sheet__lead">${escapeHtml(intro)}</p>
        </div>
      </div>
      <div class="parent-scores-sheet__body">
        <p class="brief-scores__headline">${escapeHtml(metrics.leanHeadline)}</p>
        ${renderOverallScoreCard(metrics, copy)}
        ${scoresVisual}
      </div>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
    </section>`;
  }

  return `
    <section class="profile-section profile-section--brief-scores${
      isHomeAdult ? " profile-section--brief-scores-home" : ""
    }"${reportPageAttrs(pageEntry)} aria-labelledby="brief-scores-title">
      ${
        isHomeAdult
          ? `<h3 id="brief-scores-title" class="visually-hidden">${escapeHtml(kicker)}</h3>`
          : renderInterpretSectionBanner({
              image: "assets/heading-viewpoint-forest.png",
              objectPosition: "center 45%",
              kicker: "",
              titleId: "brief-scores-title",
              title: kicker,
              lead: intro,
              variant: "viewpoint",
              width: 1024,
              height: 682,
            })
      }
      ${renderBriefScoresHomeRest(copy)}
      <p class="brief-scores__headline">${escapeHtml(metrics.leanHeadline)}</p>
      ${canOfferWorkReport() ? "" : renderOverallScoreCard(metrics, copy)}
      ${scoresVisual}
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
}

function teenSupportModeLabel(profile, copy) {
  if (profile === "sensitive") return copy.senseSupportModeLow || "Turn it down";
  if (profile === "seeking") return copy.senseSupportModeHigh || "Turn it up";
  return copy.senseSupportModeMid || "Mix it";
}

function teenSupportModeKey(profile) {
  if (profile === "sensitive") return "low";
  if (profile === "seeking") return "high";
  return "mid";
}

function renderTeenSchoolMoveCards(rows, copy) {
  const cards = rows
    .map((row, index) => {
      const tips = getSenseSupportTips(row.id, row.profile, {
        language: state.language,
        respondent: "teen",
        setting: "school",
      });
      if (!tips.length) return "";
      const mode = teenSupportModeKey(row.profile);
      const moves = tips
        .map(
          (tip, tipIndex) => `
          <li>
            <span class="teen-move__n" aria-hidden="true">${tipIndex + 1}</span>
            <span>${escapeHtml(tip)}</span>
          </li>`
        )
        .join("");
      return `
      <article
        class="teen-move teen-move--${escapeHtml(row.profile)}"
        data-domain="${escapeHtml(row.id)}"
        data-profile="${escapeHtml(row.profile)}"
        style="--domain-color:${row.color}; --move-delay:${index * 50}ms"
      >
        <p class="teen-move__stamp" aria-hidden="true">${String(index + 1).padStart(2, "0")}</p>
        <header class="teen-move__head">
          <span class="teen-move__icon" aria-hidden="true">${row.icon}</span>
          <div>
            <h4 class="teen-move__title">${escapeHtml(row.shortTitle)}</h4>
            <p class="teen-move__mode teen-move__mode--${mode}">${escapeHtml(teenSupportModeLabel(row.profile, copy))}</p>
          </div>
        </header>
        <p class="teen-move__label">${escapeHtml(copy.senseSupportMoveLabel || "Moves")}</p>
        <ol class="teen-move__list">${moves}</ol>
      </article>`;
    })
    .filter(Boolean)
    .join("");
  return cards ? `<div class="teen-moves__grid">${cards}</div>` : "";
}

function renderTeenHomeSupportCards(rows, copy) {
  const cards = rows
    .map((row, index) => {
      const tips = getSenseSupportTips(row.id, row.profile, {
        language: state.language,
        respondent: "teen",
        setting: "home",
      });
      if (!tips.length) return "";
      const tipItems = tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("");
      const lean = senseInterpretLeanLabel(row.profile, copy);
      return `
        <article
          class="sense-support__card sense-support__card--${escapeHtml(row.profile)}"
          data-domain="${escapeHtml(row.id)}"
          data-profile="${escapeHtml(row.profile)}"
          style="--domain-color:${row.color}; --support-delay:${index * 45}ms"
        >
          <header class="sense-support__header">
            <span class="sense-support__icon" aria-hidden="true">${row.icon}</span>
            <div class="sense-support__titles">
              <h4 class="sense-support__name">${escapeHtml(row.shortTitle)}</h4>
              <p class="sense-support__lean">
                <span class="sense-support__lean-label">${escapeHtml(copy.senseSupportLeanLabel)}</span>
                <span class="threshold-pill threshold-pill--${row.thresholdKey}">${escapeHtml(row.thresholdLabel)}</span>
                <span class="sense-support__lean-text">${escapeHtml(lean)}</span>
              </p>
            </div>
          </header>
          <div class="sense-support__body">
            <p class="sense-support__try">${escapeHtml(copy.senseSupportHowLabel)}</p>
            <ul class="sense-support__tips">${tipItems}</ul>
          </div>
        </article>`;
    })
    .filter(Boolean)
    .join("");
  return cards ? `<div class="sense-support__grid">${cards}</div>` : "";
}

function renderTeenSenseSupportGuide(scores, pageEntry) {
  const copy = currentUi();
  const rows = getScoreRows(scores);
  const schoolCards = renderTeenSchoolMoveCards(rows, copy);
  const homeCards = renderTeenHomeSupportCards(rows, copy);
  if (!schoolCards && !homeCards) return "";

  return `
    <section class="profile-section profile-section--sense-support profile-section--teen-support"${reportPageAttrs(pageEntry)} aria-labelledby="sense-support-title">
      <div class="teen-support-sheet">
        ${renderInterpretSectionBanner({
          image: "assets/heading-learning-trail.png",
          objectPosition: "center 40%",
          kicker: copy.senseSupportKicker,
          titleId: "sense-support-title",
          title: copy.senseSupportTitle,
          lead: copy.senseSupportIntroTeen || copy.senseSupportIntro,
          variant: "forest",
          width: 1024,
          height: 768,
        })}
        ${
          schoolCards
            ? `
        <div class="teen-moves">
          <header class="teen-moves__intro">
            <p class="teen-moves__kicker">${escapeHtml(copy.senseSupportSchoolKicker || "At school")}</p>
            <h4 class="teen-moves__heading">${escapeHtml(copy.senseSupportSchoolTitle || "Your school moves")}</h4>
            <p class="teen-moves__lead">${escapeHtml(copy.senseSupportSchoolLead || "")}</p>
          </header>
          ${schoolCards}
        </div>`
            : ""
        }
      </div>
      ${
        homeCards
          ? `
      <div class="teen-home-support">
        <header class="teen-home-support__intro">
          <p class="profile-kicker">${escapeHtml(copy.senseSupportHomeChapterKicker || "At home")}</p>
          <h4 class="teen-home-support__heading">${escapeHtml(copy.senseSupportHomeChapterTitle || "Your home setup")}</h4>
          <p class="teen-home-support__lead">${escapeHtml(copy.senseSupportHomeChapterLead || "")}</p>
        </header>
        ${homeCards}
      </div>`
          : ""
      }
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>`;
}

const SENSE_SUPPORT_IMAGES = {
  auditory: [{ src: "assets/sense-auditory.png", alt: "Listening with headphones" }],
  tactile: [{ src: "assets/sense-tactile.png?v=20260829c", alt: "Holding and feeling flowing sand" }],
  movement: [{ src: "assets/sense-movement.png", alt: "Running outdoors" }],
  visual: [{ src: "assets/sense-visual.png", alt: "Seeing clearly through glasses" }],
  smellTaste: [{ src: "assets/sense-taste.png", alt: "Tasting a lemon" }],
  everyday: [{ src: "assets/sense-everyday.png", alt: "A calm everyday setting" }],
};

const SUPPORT_IMAGE_ADJUSTMENT_KEY = "sensory-support-image-adjustments-v1";
const POSITIONED_SUPPORT_IMAGES = new Set(["auditory", "tactile"]);

function getSupportImageAdjustment(domain) {
  const fallback = { scale: 1, x: 0, y: 0 };
  try {
    const stored = JSON.parse(window.localStorage.getItem(SUPPORT_IMAGE_ADJUSTMENT_KEY) || "{}");
    const saved = stored?.[domain];
    if (!saved) return fallback;
    return {
      scale: Math.min(2, Math.max(0.75, Number.isFinite(Number(saved.scale)) ? Number(saved.scale) : 1)),
      x: Math.min(220, Math.max(-220, Number.isFinite(Number(saved.x)) ? Number(saved.x) : 0)),
      y: Math.min(220, Math.max(-220, Number.isFinite(Number(saved.y)) ? Number(saved.y) : 0)),
    };
  } catch (_) {
    return fallback;
  }
}

function renderSenseSupportVisual(row, index) {
  const images = SENSE_SUPPORT_IMAGES[row.id] || [];
  if (!images.length) return "";
  const adjustment = POSITIONED_SUPPORT_IMAGES.has(row.id) ? getSupportImageAdjustment(row.id) : null;

  return `
    <figure
      class="sense-support__visual${images.length > 1 ? " sense-support__visual--duo" : ""}"
      aria-label="${escapeHtml(row.shortTitle)}"
      ${adjustment ? `style="--support-image-scale:${adjustment.scale}; --support-image-x:${adjustment.x}px; --support-image-y:${adjustment.y}px"` : ""}
    >
      ${images
        .map(
          (image) => `
        <img src="${image.src}" alt="${escapeHtml(image.alt)}" />`
        )
        .join("")}
      <span class="sense-support__visual-mark" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
    </figure>
    `;
}

function renderSenseSupportGuide(scores, pageEntry) {
  const copy = currentUi();
  const isParent = state.respondent === "parent";
  const isTeen = state.respondent === "teen";
  const rows = getScoreRows(scores);
  const title = isParent ? copy.senseSupportTitleParent : copy.senseSupportTitle;
  const intro = isParent
    ? copy.senseSupportIntroParent
    : isTeen
      ? copy.senseSupportIntroTeen || copy.senseSupportIntro
      : canOfferWorkReport()
        ? copy.senseSupportIntroWork || copy.senseSupportIntro
        : state.lifeContext === "home"
          ? copy.senseSupportIntroHome || copy.senseSupportIntro
          : copy.senseSupportIntro;

  if (canOfferWorkReport()) {
    const reportCopy = getSettingReportCopy();
    const guidance = getWorkReportGuidance(scores, state.language);
    const blocks = renderWorkSupportArticles(guidance.recommendations, reportCopy, {
      showPresentation: true,
      showStrategies: true,
    });
    if (!blocks) return "";
    return `
    <section class="profile-section profile-section--sense-support"${reportPageAttrs(pageEntry)} aria-labelledby="sense-support-title">
      ${renderInterpretSectionBanner({
        image: "assets/heading-forest-trail.png",
        objectPosition: "center 40%",
        kicker: copy.senseSupportKicker,
        titleId: "sense-support-title",
        title,
        lead: intro,
        variant: "forest",
        width: 682,
        height: 1024,
      })}
      <div class="work-support-list">${blocks}</div>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
  }

  if (isTeen) {
    return renderTeenSenseSupportGuide(scores, pageEntry);
  }

  const cards = rows
    .map((row, index) => {
      const tips = getSenseSupportTips(row.id, row.profile, {
        language: state.language,
        respondent: state.respondent || "adult",
        lifeContext: state.lifeContext,
      });
      if (!tips.length) return "";
      const tipItems = tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("");
      const lean = senseInterpretLeanLabel(row.profile, copy);
      return `
        <article
          class="sense-support__card sense-support__card--${escapeHtml(row.profile)}"
          data-domain="${escapeHtml(row.id)}"
          data-profile="${escapeHtml(row.profile)}"
          style="--domain-color:${row.color}; --support-delay:${index * 45}ms"
        >
          ${renderSenseSupportVisual(row, index)}
          <header class="sense-support__header">
            <span class="sense-support__icon" aria-hidden="true">${row.icon}</span>
            <div class="sense-support__titles">
              <h4 class="sense-support__name">${escapeHtml(row.shortTitle)}</h4>
              <p class="sense-support__lean">
                <span class="sense-support__lean-label">${escapeHtml(copy.senseSupportLeanLabel)}</span>
                <span class="threshold-pill threshold-pill--${row.thresholdKey}">${escapeHtml(row.thresholdLabel)}</span>
                <span class="sense-support__lean-text">${escapeHtml(lean)}</span>
              </p>
            </div>
          </header>
          <div class="sense-support__body">
            <p class="sense-support__try">${escapeHtml(copy.senseSupportHowLabel)}</p>
            <ul class="sense-support__tips">${tipItems}</ul>
          </div>
        </article>`;
    })
    .filter(Boolean)
    .join("");

  if (!cards) return "";

  if (isParent) {
    return `
    <section class="profile-section profile-section--sense-support parent-report-section parent-support-sheet"${reportPageAttrs(pageEntry)} aria-labelledby="sense-support-title">
      <figure class="parent-support-sheet__photo">
        <img
          src="assets/parent-support-forest.jpg"
          alt=""
          class="parent-support-sheet__image"
          width="1067"
          height="1600"
          loading="eager"
          decoding="async"
        />
      </figure>
      <div class="parent-support-sheet__content">
        <header class="parent-support-sheet__intro">
          <p class="parent-support-sheet__kicker">${escapeHtml(copy.senseSupportKicker || "")}</p>
          <h3 id="sense-support-title" class="parent-support-sheet__title">${escapeHtml(title)}</h3>
          <p class="parent-support-sheet__lead">${escapeHtml(intro)}</p>
        </header>
        <div class="sense-support__grid">${cards}</div>
      </div>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
    </section>`;
  }

  return `
    <section class="profile-section profile-section--sense-support"${reportPageAttrs(pageEntry)} aria-labelledby="sense-support-title">
      ${renderInterpretSectionBanner({
        image: "assets/heading-forest-trail.png",
        objectPosition: "center 40%",
        kicker: copy.senseSupportKicker,
        titleId: "sense-support-title",
        title,
        lead: intro,
        variant: "forest",
        width: 682,
        height: 1024,
      })}
      <div class="sense-support__grid">
        ${cards}
      </div>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
}

function getTrailSettingBanner(settingKey) {
  const banners = {
    school: {
      image: "assets/heading-learning-trail.png",
      objectPosition: "center 40%",
      variant: "forest",
      width: 1024,
      height: 768,
    },
    home: {
      image: "assets/heading-home-trail.png",
      objectPosition: "center 48%",
      variant: "forest",
      width: 683,
      height: 1024,
    },
    homeParent: {
      image: "assets/heading-home-trail.png",
      objectPosition: "center 42%",
      variant: "couple",
      width: 683,
      height: 1024,
    },
    work: {
      image: "assets/heading-work-trail.png",
      objectPosition: "center 40%",
      variant: "sunlight",
      width: 1024,
      height: 768,
    },
  };
  return banners[settingKey] || banners.home;
}

function renderTeenTrailSupportVisuals(settingKey) {
  if (state.respondent === "parent" && settingKey === "homeParent") {
    return renderParentHomeVisuals();
  }
  if (state.respondent !== "teen") return "";

  if (settingKey === "school") {
    return `
    <div class="trail-interpret__visuals trail-interpret__visuals--school" aria-hidden="true">
      <figure class="trail-interpret__visual trail-interpret__visual--supplies">
        <img
          src="assets/teen-school-learning-supplies.png"
          alt=""
          class="trail-interpret__visual-image"
          width="1024"
          height="575"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <figure class="trail-interpret__visual trail-interpret__visual--student">
        <img
          src="assets/teen-school-learning-student.png"
          alt=""
          class="trail-interpret__visual-image"
          width="1024"
          height="678"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>`;
  }

  if (settingKey === "home") {
    return `
    <div class="trail-interpret__visuals trail-interpret__visuals--home" aria-hidden="true">
      <figure class="trail-interpret__visual trail-interpret__visual--home">
        <img
          src="assets/teen-home-support.png"
          alt=""
          class="trail-interpret__visual-image"
          width="1024"
          height="682"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>`;
  }

  return "";
}

function renderTrailSettingInterpretations(metrics, pagePlan) {
  const keys = getTrailSettingKeys(state.respondent, state.lifeContext);
  if (!keys.length) return "";

  return keys
    .map((settingKey) => {
      const guide = getTrailSettingGuide(settingKey, metrics.lean, state.language);
      if (!guide) return "";
      const pageEntry = reportPageById(pagePlan, `report-trail-${settingKey}`);
      const banner = getTrailSettingBanner(settingKey);
      const supportItems = (guide.support || [])
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

      return `
        <section class="profile-section profile-section--trail-interpret"${reportPageAttrs(pageEntry)} aria-labelledby="trail-interpret-${escapeHtml(settingKey)}" data-trail-setting="${escapeHtml(settingKey)}" data-trail-profile="${escapeHtml(guide.profile)}">
          ${renderInterpretSectionBanner({
            image: banner.image,
            objectPosition: banner.objectPosition,
            kicker: guide.kicker,
            titleId: `trail-interpret-${settingKey}`,
            title: guide.title,
            lead: guide.lead || "",
            variant: banner.variant,
            width: banner.width,
            height: banner.height,
          })}
          ${settingKey === "work" ? renderWorkBucketExplain(currentUi()) : ""}
          <div class="trail-interpret">
            <article class="trail-interpret__block trail-interpret__block--needs">
              <h4 class="trail-interpret__label">${escapeHtml(guide.needsLabel)}</h4>
              <p class="trail-interpret__needs">${escapeHtml(guide.needs)}</p>
            </article>
            ${
              supportItems
                ? `
            <article class="trail-interpret__block trail-interpret__block--support">
              <h4 class="trail-interpret__label">${escapeHtml(guide.supportLabel)}</h4>
              <ul class="trail-interpret__list">${supportItems}</ul>
              ${renderTeenTrailSupportVisuals(settingKey)}
            </article>`
                : ""
            }
          </div>
          ${
            settingKey === "home" || settingKey === "homeParent"
              ? renderTeenIdealSaturdayPrintBlock()
              : ""
          }
          ${reportPageNumberHtml(currentUi(), pageEntry?.page)}
          <div class="print-page-motif print-only" aria-hidden="true"></div>
        </section>`;
    })
    .join("");
}

function renderSettingSectionBridge() {
  if (state.respondent !== "adult") return "";
  if (state.lifeContext !== "work" && state.lifeContext !== "home") return "";

  const copy = currentUi();
  const quote =
    state.lifeContext === "work" ? copy.settingBridgeQuoteWork : copy.settingBridgeQuoteHome;
  const isHome = state.lifeContext === "home";

  const visuals = isHome
    ? `
      <div class="results-section-bridge__visuals" aria-hidden="true">
        <figure class="results-section-bridge__shot results-section-bridge__shot--family">
          <img
            src="assets/home-life-family.png"
            alt=""
            class="results-section-bridge__image"
            width="1024"
            height="788"
            loading="eager"
            decoding="async"
          />
        </figure>
        <figure class="results-section-bridge__shot results-section-bridge__shot--adult">
          <img
            src="assets/home-life-adult.png"
            alt=""
            class="results-section-bridge__image"
            width="1024"
            height="682"
            loading="eager"
            decoding="async"
          />
        </figure>
      </div>`
    : "";

  const rule = isHome
    ? ""
    : `<img src="mountain-divider.svg" alt="" class="results-section-bridge__rule" width="600" height="44" />`;

  return `
    <aside class="results-section-bridge${isHome ? " results-section-bridge--home" : ""}" aria-label="${escapeHtml(copy.settingBridgeHeading)}">
      ${rule}
      <p class="results-section-bridge__kicker">${escapeHtml(copy.settingBridgeKicker)}</p>
      <h3 class="results-section-bridge__heading">${escapeHtml(copy.settingBridgeHeading)}</h3>
      <blockquote class="results-section-bridge__quote">
        <p>${escapeHtml(quote)}</p>
      </blockquote>
      <p class="results-section-bridge__credit">${escapeHtml(copy.settingBridgeCredit)}</p>
      ${visuals}
    </aside>
  `;
}

function renderAdultSettingGuide(scores, metrics, pageEntry) {
  if (state.respondent !== "adult") return "";
  if (state.lifeContext !== "work" && state.lifeContext !== "home") return "";

  const copy = currentUi();
  const report = getAdultSettingReport(
    state.lifeContext,
    metrics.lean,
    scores,
    state.language
  );
  if (!report || !report.sections.length) return "";

  const blocks = report.sections
    .map((section) => {
      const items =
        section.items && section.items.length
          ? `<ul class="setting-guide__list">${section.items
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}</ul>`
          : "";
      const body = section.body
        ? `<p class="setting-guide__body">${escapeHtml(section.body)}</p>`
        : "";
      return `
        <article class="setting-guide__block" data-setting-section="${escapeHtml(section.id)}">
          <h4 class="setting-guide__heading">${escapeHtml(section.title)}</h4>
          ${body}
          ${items}
        </article>`;
    })
    .join("");

  const domainHints =
    report.domainHints && report.domainHints.length
      ? `
      <aside class="setting-guide__hints">
        <p class="setting-guide__hints-label">${escapeHtml(copy.settingGuideDomainHints)}</p>
        <ul class="setting-guide__hints-list">
          ${report.domainHints
            .map(
              (hint) => `
            <li>
              <strong>${escapeHtml(hint.title)}</strong>
              <span>${escapeHtml(hint.text)}</span>
            </li>`
            )
            .join("")}
        </ul>
      </aside>`
      : "";

  return `
    ${renderSettingSectionBridge()}
    <section class="profile-section profile-section--setting-guide"${reportPageAttrs(pageEntry)} aria-labelledby="setting-guide-title" data-setting-context="${escapeHtml(report.lifeContext)}" data-setting-profile="${escapeHtml(report.profile)}">
      ${renderInterpretSectionBanner({
        image:
          report.lifeContext === "work"
            ? "assets/heading-work-trail.png"
            : "assets/heading-home-trail.png",
        objectPosition: report.lifeContext === "work" ? "center 40%" : "center 48%",
        kicker: report.kicker,
        titleId: "setting-guide-title",
        title: report.title,
        lead: report.intro,
        variant: report.lifeContext === "work" ? "sunlight" : "forest",
        width: report.lifeContext === "work" ? 1024 : 683,
        height: report.lifeContext === "work" ? 768 : 1024,
      })}
      <div class="setting-guide">
        ${blocks}
        ${domainHints}
      </div>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
}

function formatQuestionnaireDate(iso, language = "en") {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(language === "af" ? "af-ZA" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Ordered print pages for the sensory results packet (TOC + page numbers). */
function buildReportPagePlan(copy, scores, metrics) {
  const isParent = state.respondent === "parent";
  const pages = [];
  const add = (id, title, { listInToc = true } = {}) => {
    const page = pages.length + 1;
    const entry = { id, title: String(title || "").trim() || `Page ${page}`, page, listInToc };
    pages.push(entry);
    return entry;
  };

  if (shouldShowTrailProfile()) {
    const overviewTitle = isParent
      ? copy.teenCrewOverviewTitleParent || copy.teenCrewOverviewTitle
      : copy.teenCrewOverviewTitle;
    add("report-trail-overview", overviewTitle || "Your Sensory Trail Profile");
    const youId = getTeenCrewId(metrics.lean);
    const roster = getTeenCrewRoster(copy);
    const you = roster.find((member) => member.id === youId);
    const matchTitle = isParent
      ? copy.teenCrewMatchTitleParent || copy.teenCrewDetailTitleParent
      : copy.teenCrewMatchTitle || copy.teenCrewDetailTitle;
    add("report-trail-match", matchTitle || you?.name || "Your matched trail");
    const descriptionTitle = isParent
      ? copy.teenCrewDescriptionTitleParent || you?.name
      : copy.teenCrewDescriptionTitle || you?.name;
    add("report-trail-description", descriptionTitle || you?.name || "Matched trail");
  }

  add("report-brief-scores", copy.briefScoresTitle);
  add("report-sense-support", isParent ? copy.senseSupportTitleParent : copy.senseSupportTitle);

  if ((state.idealSaturday || "").trim() && !isCouplePathway() && state.respondent !== "teen") {
    add("report-ideal-saturday", copy.idealSaturdayResultsTitle);
  }

  getTrailSettingKeys(state.respondent, state.lifeContext).forEach((settingKey) => {
    const guide = getTrailSettingGuide(settingKey, metrics.lean, state.language);
    if (guide) add(`report-trail-${settingKey}`, guide.title || guide.kicker);
  });

  return pages;
}

function reportPageById(plan, id) {
  return plan.find((entry) => entry.id === id) || null;
}

function reportPageNumberHtml(copy, page) {
  if (!page) return "";
  const label = copy.reportPageLabel || "Page";
  return `<p class="report-page-number print-only" aria-hidden="true"><span class="report-page-number__label">${escapeHtml(label)}</span> <span class="report-page-number__value">${page}</span></p>`;
}

/** Ensure report images are decoded before print/PDF so full-page visuals are not blank. */
function waitForReportPrintImages(root = document) {
  const scope =
    root.querySelector?.(".card--results") ||
    root.querySelector?.("#app") ||
    root;
  const imgs = Array.from(
    scope.querySelectorAll(
      [
        ".interpret-cover img",
        ".interpret-toc img",
        ".interpret-glossary img",
        ".interpret-senses img",
        ".interpret-world img",
        ".interpret-section-banner img",
        ".trail-profile img",
        ".teen-crew img",
        ".results-section-bridge img",
        ".profile-section img",
        ".work-profile-cover img",
        ".home-profile-cover img",
        ".report-conclusion img",
        ".print-brand img",
      ].join(", ")
    )
  );

  return Promise.all(
    imgs.map((img) => {
      if (img.loading === "lazy") img.loading = "eager";

      const settle = () => {
        if (typeof img.decode === "function") {
          return img.decode().catch(() => undefined);
        }
        return Promise.resolve();
      };

      if (img.complete && img.naturalWidth > 0) {
        return settle();
      }

      return new Promise((resolve) => {
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          settle().finally(resolve);
        };
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
        // Safety net if load never fires (broken URL / stalled network).
        window.setTimeout(done, 6000);
      });
    })
  );
}

function printSensoryResultsPacket() {
  const isParent = state.respondent === "parent";
  document.body.classList.add("print-sensory-results");
  if (isParent) document.body.classList.add("print-parent-report");
  const cleanup = () => {
    document.body.classList.remove("print-sensory-results", "print-parent-report");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  const runPrint = () => {
    notifyReportDownloaded();
    window.print();
    window.setTimeout(cleanup, 2000);
  };

  waitForReportPrintImages(document)
    .catch(() => undefined)
    .then(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        })
    )
    .then(runPrint);
}

function printCoupleCombinedReport() {
  document.body.classList.add("print-sensory-results", "print-couple-merge");
  const cleanup = () => {
    document.body.classList.remove("print-sensory-results", "print-couple-merge");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  const runPrint = () => {
    notifyReportDownloaded();
    window.print();
    window.setTimeout(cleanup, 2000);
  };

  waitForReportPrintImages(document)
    .catch(() => undefined)
    .then(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        })
    )
    .then(runPrint);
}

function reportPageAttrs(entry, { includeId = true } = {}) {
  if (!entry) return "";
  const idAttr = includeId ? ` id="${escapeHtml(entry.id)}"` : "";
  return `${idAttr} data-report-page="${entry.page}"`;
}

function renderInterpretToc(copy, plan, tocEntry) {
  const rows = plan
    .filter((entry) => entry.listInToc)
    .map(
      (entry) => `
      <li class="interpret-toc__row">
        <a class="interpret-toc__link" href="#${escapeHtml(entry.id)}">
          <span class="interpret-toc__title">${escapeHtml(entry.title)}</span>
          <span class="interpret-toc__leader" aria-hidden="true"></span>
          <span class="interpret-toc__page">${entry.page}</span>
        </a>
      </li>`
    )
    .join("");

  const foliage = `
    <div class="interpret-toc__foliage" aria-hidden="true">
      <img
        class="interpret-toc__photo interpret-toc__photo--canopy"
        src="toc-watermark.svg"
        alt=""
        width="1000"
        height="700"
        loading="eager"
        decoding="async"
      />
      <img
        class="interpret-toc__photo interpret-toc__photo--sprig-tr"
        src="assets/glossary-leaves-sprig.png"
        alt=""
        width="800"
        height="1000"
        loading="eager"
        decoding="async"
      />
      <img
        class="interpret-toc__photo interpret-toc__photo--floor-bl"
        src="assets/glossary-leaves-floor.png"
        alt=""
        width="1200"
        height="1600"
        loading="eager"
        decoding="async"
      />
      <img
        class="interpret-toc__photo interpret-toc__photo--sprig-br"
        src="assets/glossary-leaves-sprig.png"
        alt=""
        width="800"
        height="1000"
        loading="eager"
        decoding="async"
      />
      <img
        class="interpret-toc__photo interpret-toc__photo--vine"
        src="vine-sprig.svg"
        alt=""
        width="48"
        height="120"
        loading="eager"
        decoding="async"
      />
    </div>`;

  return `
    <section class="interpret-toc"${reportPageAttrs(tocEntry)} aria-labelledby="interpret-toc-title">
      ${foliage}
      <p class="profile-kicker">${escapeHtml(copy.tocKicker)}</p>
      <h3 id="interpret-toc-title">${escapeHtml(copy.tocTitle)}</h3>
      ${printMountainRule("section")}
      <p class="profile-section__summary">${escapeHtml(copy.tocIntro)}</p>
      <ol class="interpret-toc__list">
        ${rows}
      </ol>
      ${reportPageNumberHtml(copy, tocEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
}

/** Print-only mountain rule used between report sections. */
function printMountainRule(variant = "default") {
  return `
    <div class="print-nature-rule print-nature-rule--${variant} print-only" aria-hidden="true">
      <svg viewBox="0 0 600 44" fill="none" focusable="false">
        <path d="M8 34h92l35-14 28 8 61-19 39 18 35-12 42 20h92l38-13 31 9 28-17 43 20h50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
        <path d="M126 34l37-19 24 11 37-17 39 18M404 34l28-20 28 15 21-12 28 17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M245 34c23 0 34-9 55-9s32 9 53 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 6" opacity="0.45"/>
      </svg>
    </div>`;
}

/** Nature vignettes keyed to each sensory system for print pages. */
function printSenseNatureArt(domainId) {
  const arts = {
    auditory: `<svg viewBox="0 0 220 120" fill="none" aria-hidden="true" focusable="false">
      <path d="M18 96c28-10 52-28 74-28s44 14 72 26c18 8 32 10 38 8" stroke="currentColor" stroke-width="1.4" opacity="0.28" stroke-linecap="round"/>
      <path d="M70 78c8-22 22-40 42-52" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>
      <path d="M86 84c10-18 24-32 42-42" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
      <path d="M102 90c8-12 18-22 34-30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="148" cy="52" r="7" fill="currentColor" opacity="0.85"/>
      <path d="M156 48c10-4 18-2 24 6M158 56c8 2 14 8 16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
      <path d="M42 38c6-8 14-10 20-6M176 28c8-6 16-4 22 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.4"/>
    </svg>`,
    tactile: `<svg viewBox="0 0 220 120" fill="none" aria-hidden="true" focusable="false">
      <path d="M40 98c20-36 38-58 62-58 18 0 30 14 42 34 8 14 18 24 34 24" stroke="currentColor" stroke-width="1.5" opacity="0.3" stroke-linecap="round"/>
      <path d="M78 92c4-28 16-48 34-48 14 0 24 16 30 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M98 90c2-18 8-30 18-30 8 0 14 10 18 24" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" opacity="0.7"/>
      <path d="M118 88c1-12 5-20 12-20s10 8 12 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
      <circle cx="148" cy="42" r="3" fill="currentColor" opacity="0.5"/>
      <circle cx="162" cy="54" r="2.2" fill="currentColor" opacity="0.4"/>
      <circle cx="136" cy="56" r="2" fill="currentColor" opacity="0.35"/>
      <path d="M56 46c8-10 18-12 26-6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.35"/>
    </svg>`,
    movement: `<svg viewBox="0 0 220 120" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 98 L48 58 L72 78 L108 32 L138 68 L168 44 L208 86 L208 98 Z" fill="currentColor" opacity="0.1"/>
      <path d="M12 98 L48 58 L72 78 L108 32 L138 68 L168 44 L208 86" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M28 98 L58 72 L86 88 L118 56 L148 82 L178 64 L208 92" stroke="currentColor" stroke-width="1.35" opacity="0.5" stroke-linejoin="round"/>
      <path d="M108 32 L112 40 L118 44M168 44 L164 52 L158 56" stroke="currentColor" stroke-width="1.2" opacity="0.45" stroke-linecap="round"/>
      <path d="M72 28c10-2 18 2 22 10" stroke="currentColor" stroke-width="1.2" opacity="0.35" stroke-linecap="round"/>
    </svg>`,
    visual: `<svg viewBox="0 0 220 120" fill="none" aria-hidden="true" focusable="false">
      <circle cx="110" cy="54" r="18" fill="currentColor" opacity="0.12"/>
      <circle cx="110" cy="54" r="11" fill="currentColor" opacity="0.82"/>
      <circle cx="110" cy="54" r="16" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.35"/>
      <g stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.55">
        <path d="M110 22v8M110 78v8M78 54h8M134 54h8"/>
        <path d="M88 32l5.5 5.5M126.5 70.5l5.5 5.5M88 76l5.5-5.5M126.5 37.5l5.5-5.5"/>
      </g>
      <path d="M28 98c24-8 50-12 82-12s58 4 82 12" stroke="currentColor" stroke-width="1.4" opacity="0.28" stroke-linecap="round"/>
      <path d="M48 88c18-14 36-22 62-22s44 8 62 22" stroke="currentColor" stroke-width="1.5" opacity="0.45" stroke-linecap="round"/>
    </svg>`,
    smellTaste: `<svg viewBox="0 0 220 120" fill="none" aria-hidden="true" focusable="false">
      <path d="M110 98c-2-28 8-48 28-64 4 14 2 28-6 40" fill="currentColor" opacity="0.14"/>
      <path d="M110 98c2-30-10-52-32-68-2 16 2 32 12 44" fill="currentColor" opacity="0.1"/>
      <path d="M110 98 V42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M110 56c-16-18-28-22-38-18 6 14 16 24 30 30M110 48c14-16 28-22 40-16-4 14-14 24-28 30" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M110 36c-10-12-18-14-26-10 4 10 12 16 22 20M110 32c10-12 20-14 28-8-2 10-10 16-20 20" stroke="currentColor" stroke-width="1.4" opacity="0.65" stroke-linecap="round"/>
      <circle cx="78" cy="30" r="2.5" fill="currentColor" opacity="0.45"/>
      <circle cx="148" cy="28" r="2" fill="currentColor" opacity="0.35"/>
    </svg>`,
    everyday: `<svg viewBox="0 0 220 120" fill="none" aria-hidden="true" focusable="false">
      <path d="M30 98c18-8 32-24 48-24 14 0 24 10 36 22 10-16 24-28 42-28 14 0 28 12 44 30" stroke="currentColor" stroke-width="1.5" opacity="0.3" stroke-linecap="round"/>
      <path d="M70 98c6-26 18-44 36-44 14 0 24 14 30 34" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M118 98c4-20 14-34 28-34 12 0 20 12 24 30" stroke="currentColor" stroke-width="1.6" opacity="0.7" stroke-linecap="round"/>
      <path d="M96 54c-2-18 6-34 22-42 2 12-2 24-10 34M128 58c4-16 14-28 28-34-4 12-10 22-18 30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
      <path d="M48 44c10-4 18 0 22 8M176 40c8-6 18-4 24 4" stroke="currentColor" stroke-width="1.2" opacity="0.35" stroke-linecap="round"/>
    </svg>`,
  };
  const art = arts[domainId] || arts.everyday;
  return `
    <div class="print-sense-art print-sense-art--${escapeHtml(domainId)} print-only" aria-hidden="true">
      ${art}
    </div>`;
}

/** Photo masthead for major interpret sections — same pattern as the report cover. */
function renderInterpretSectionBanner({
  image,
  objectPosition = "center 40%",
  kicker,
  titleId,
  title,
  lead = "",
  variant = "",
  titleTag = "h3",
  width = 682,
  height = 1024,
}) {
  const variantClass = variant ? ` interpret-section-banner--${variant}` : "";
  const headingTag = titleTag === "h2" ? "h2" : "h3";
  return `
    <header class="interpret-section-banner${variantClass}">
      <div class="interpret-section-banner__media" aria-hidden="true">
        <img
          src="${escapeHtml(image)}"
          alt=""
          class="interpret-section-banner__image"
          style="object-position: ${escapeHtml(objectPosition)}"
          width="${Number(width) || 682}"
          height="${Number(height) || 1024}"
          loading="eager"
          decoding="async"
        />
      </div>
      <div class="interpret-section-banner__veil" aria-hidden="true"></div>
      <div class="interpret-section-banner__content">
        ${
          kicker
            ? `<p class="interpret-section-banner__kicker">${escapeHtml(kicker)}</p>`
            : ""
        }
        <${headingTag} id="${escapeHtml(titleId)}" class="interpret-section-banner__title">${escapeHtml(title)}</${headingTag}>
        ${
          lead
            ? `<p class="interpret-section-banner__lead">${escapeHtml(lead)}</p>`
            : ""
        }
      </div>
    </header>`;
}

function renderInterpretCover(copy, pageEntry) {
  const isParent = state.respondent === "parent";
  const title = isParent ? copy.interpretCoverTitleParent : copy.interpretCoverTitle;
  const quote = isParent ? copy.interpretCoverQuoteParent : copy.interpretCoverQuote;
  const fullName = (state.demographics.name || "").trim();
  const { firstName, surname } = splitPersonName(fullName);
  const parentName = (state.demographics.parentName || "").trim();
  const dateLabel = formatQuestionnaireDate(state.completedAt, state.language);
  const displayName = [firstName, surname].filter(Boolean).join(" ") || fullName;

  const metaBlocks = [];
  if (displayName) {
    metaBlocks.push(`
      <div class="interpret-cover__meta-block interpret-cover__meta-block--wide">
        <p class="interpret-cover__meta-label">${escapeHtml(copy.interpretCoverPreparedFor)}</p>
        <p class="interpret-cover__meta-name">${escapeHtml(displayName)}</p>
      </div>`);
    if (isParent && parentName) {
      metaBlocks.push(`
        <div class="interpret-cover__meta-block interpret-cover__meta-block--wide">
          <p class="interpret-cover__meta-label">${escapeHtml(copy.interpretCoverParentLabel)}</p>
          <p class="interpret-cover__meta-parent">${escapeHtml(parentName)}</p>
        </div>`);
    }
  }
  if (dateLabel) {
    metaBlocks.push(`
      <div class="interpret-cover__meta-block">
        <p class="interpret-cover__meta-label">${escapeHtml(copy.interpretCoverDateLabel)}</p>
        <p class="interpret-cover__meta-date">${escapeHtml(dateLabel)}</p>
      </div>`);
  }

  return `
    <section class="interpret-cover"${reportPageAttrs(pageEntry)} aria-label="${escapeHtml(title)}">
      <div class="interpret-cover__media" aria-hidden="true">
        <img src="assets/outeniqua-trail-hero.png" alt="" class="interpret-cover__image" width="1536" height="1024" />
      </div>
      <div class="interpret-cover__print-scene" aria-hidden="true">
        <div class="interpret-cover__print-sky"></div>
        <div class="interpret-cover__print-sun"></div>
        <svg class="interpret-cover__print-birds" viewBox="0 0 160 40" fill="none" focusable="false">
          <path d="M18 22c4-6 9-8 13-6 4-3 9-2 13 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M62 14c6-8 13-10 19-7 5-4 12-2 18 8" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/>
          <path d="M118 24c4-5 8-6 11-5 3-2 7-1 10 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <div class="interpret-cover__print-mountain interpret-cover__print-mountain--far"></div>
        <div class="interpret-cover__print-mountain interpret-cover__print-mountain--mid"></div>
        <div class="interpret-cover__print-mountain interpret-cover__print-mountain--near"></div>
        <div class="interpret-cover__print-trees"></div>
        <div class="interpret-cover__print-trail"></div>
        <div class="interpret-cover__print-fog"></div>
      </div>
      <div class="interpret-cover__veil" aria-hidden="true"></div>
      <div class="interpret-cover__brand">
        <img src="assets/logo.png" alt="" class="interpret-cover__brand-logo" width="72" height="72" />
        <div class="interpret-cover__brand-text">
          <p class="interpret-cover__brand-name">Soulful Sensory OT</p>
          <p class="interpret-cover__brand-tag">${escapeHtml(copy.interpretCoverBrandTag || "Occupational Therapy Services")}</p>
        </div>
      </div>
      <div class="interpret-cover__content">
        <p class="interpret-cover__studio">${escapeHtml(copy.interpretCoverStudioMark || "SoulfulSensoryOT")}</p>
        <p class="interpret-cover__report-title">${escapeHtml(copy.interpretCoverReportTitle || "Sensory questionnaire results")}</p>
        <p class="interpret-cover__kicker">${escapeHtml(copy.scoreTableKicker)}</p>
        <h3 class="interpret-cover__title">${escapeHtml(title)}</h3>
        <blockquote class="interpret-cover__quote">
          <p>${escapeHtml(quote)}</p>
        </blockquote>
        ${
          metaBlocks.length
            ? `<div class="interpret-cover__meta">${metaBlocks.join("")}</div>`
            : ""
        }
        <p class="interpret-cover__credit">${escapeHtml(copy.interpretCoverCredit)}</p>
      </div>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
    </section>
  `;
}

function renderInterpretGlossary(copy, pageEntry) {
  const terms = Array.isArray(copy.interpretGlossary) ? copy.interpretGlossary : [];

  const leafBullet = `<svg class="interpret-glossary__leaf-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M8.1 1.6c2.6 1.8 4.6 4.6 4.8 7.6.1 2.1-.7 3.9-2.3 4.7-1.1.55-2.3.45-3.2-.2C5.8 12.3 4.6 10 4.2 7.4 3.8 4.6 5.2 2.4 8.1 1.6z" fill="currentColor" opacity="0.92"/>
      <path d="M8.05 3.1c.15 2.6.05 5.1-.55 7.55" fill="none" stroke="#f7faf6" stroke-width="0.85" stroke-linecap="round" opacity="0.55"/>
    </svg>`;

  const scenery = {
    leavesOval: `<svg viewBox="0 0 150 44" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M28 28c-4.2-7.5-.8-14.2 5.6-15.8 5.2-1.3 10.4 2.8 11.6 9.6 1 5.8-2.4 11.2-7.2 12.2-3.6.7-7.2-1.2-10-5.9z" opacity="0.55"/>
        <path d="M52 18c-3.5-6.8.2-12.8 5.8-13.8 4.8-.9 9.4 2.6 10.4 8.6.9 5.2-2 10-6.4 11-3.4.7-6.8-1-9.8-5.8z" opacity="0.78"/>
        <path d="M74 22c-3.8-7.2-.2-13.6 5.9-14.8 5-.9 9.8 2.8 11 9 .9 5.5-2.2 10.6-6.8 11.6-3.5.7-7-1.2-10.1-5.8z" opacity="0.62"/>
        <path d="M96 17c-3.2-6.2.4-11.6 5.4-12.5 4.4-.8 8.6 2.4 9.5 7.8.8 4.8-1.8 9.2-5.8 10-3.2.7-6.4-1-9.1-5.3z" opacity="0.72"/>
      </g>
      <path d="M34 30c14-2 28-4.5 42-4.8 12-.2 24 1.2 36 4" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" opacity="0.4"/>
      <path d="M52 18.5c.2 3.8-.2 7.2-1.4 10.2M74 22c.15 3.5-.3 6.8-1.5 9.6M96 17.5c.2 3.4-.15 6.5-1.2 9.2" fill="none" stroke="#f7faf6" stroke-width="0.7" stroke-linecap="round" opacity="0.35"/>
    </svg>`,
    leavesSprig: `<svg viewBox="0 0 150 48" aria-hidden="true" focusable="false">
      <path d="M18 8c18 10 36 22 52 34" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
      <path d="M42 10c-1.2 4.8 1.8 9.6 6.8 11.2 4.2 1.4 8.6-.8 10.2-5.2 1.8-4.8-1-9.8-5.6-11.2C48.8 3.6 43.4 5.6 42 10z" fill="currentColor" opacity="0.7"/>
      <path d="M62 20c-1 4.4 1.6 8.8 6.2 10.2 3.8 1.2 7.8-.8 9.2-4.8 1.6-4.4-.8-9-5.2-10.2-3.8-1.2-8.2.8-10.2 4.8z" fill="currentColor" opacity="0.82"/>
      <path d="M84 30c-.9 4 1.5 8 5.8 9.2 3.5 1 7.2-.8 8.5-4.4 1.5-4-.7-8.2-4.8-9.3-3.5-1-7.6.8-9.5 4.5z" fill="currentColor" opacity="0.62"/>
      <path d="M108 8c-16 11-30 24-42 36" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity="0.32"/>
      <path d="M118 14c1.1 4.2-1.4 8.6-5.8 10-3.8 1.2-7.8-.6-9.2-4.4-1.6-4.2.8-8.8 5-10.1 3.8-1.2 8 .7 10 4.5z" fill="currentColor" opacity="0.55"/>
      <g fill="none" stroke="#f7faf6" stroke-width="0.65" stroke-linecap="round" opacity="0.4">
        <path d="M48 8.5c1.2 3.2 1.4 6.4.4 9.2"/>
        <path d="M68 19.5c1 2.8 1.1 5.6.2 8.2"/>
        <path d="M89 30c.9 2.6 1 5.2.2 7.6"/>
      </g>
      <g fill="none" stroke="currentColor" stroke-width="0.55" stroke-linecap="round" opacity="0.35">
        <path d="M45.5 11.5l2.2-1.6M46.8 14.2l2.4-1M48 16.8l2.2-.6"/>
        <path d="M65.5 22l2.2-1.4M66.8 24.5l2.3-.8M68 27l2.1-.5"/>
      </g>
    </svg>`,
    leavesMaple: `<svg viewBox="0 0 120 48" aria-hidden="true" focusable="false">
      <path d="M60 6.5c1.2 3.8 1.4 7.2.4 10.2 3.8-2.2 7.8-3 11.5-1.8 2.8.9 4.8 3 5.2 5.6.3 2.2-.6 4.2-2.4 5.4 3.6.4 6.8 2.2 8.8 5 1.6 2.2 1.8 4.8.4 6.8-1.2 1.8-3.4 2.6-5.6 2.2 2.2 2.8 2.8 6 1.4 8.6-1.4 2.6-4.4 3.8-7.2 3.2 1.6 3.2.8 6.6-1.6 8.4-2 1.5-4.6 1.4-6.4-.2.6 3.2-.8 6-3.4 7.2-2.2 1-4.8.4-6.2-1.6-.6 2.6-2.6 4.4-5.2 4.6-2.8.2-5.2-1.6-5.8-4.2-1.6 2-4.2 2.8-6.6 1.8-2.4-1-3.6-3.6-3-6.2-2.2 1.4-5 .8-6.6-1.4-1.6-2.2-1.2-5.2.8-7-2.4.2-4.6-.8-5.8-2.8-1.4-2.2-.8-5 1.2-6.8 1.8-1.6 4.4-2 6.6-1.2-2.2-2.6-2.4-6-.6-8.6 1.6-2.2 4.6-3 7-2 1.6-2.6 4.4-4 7.4-3.6 2.8.4 5 2.2 5.8 4.8.8-2.8 3-4.8 5.8-5.4 2.4-.5 4.8.4 6.2 2.4z" fill="currentColor" opacity="0.7"/>
      <path d="M60 14.5c0 8.5-.2 16.5-1.2 24.5" fill="none" stroke="#f7faf6" stroke-width="0.85" stroke-linecap="round" opacity="0.4"/>
      <path d="M58.8 22c-5.5-2.2-10.2-2.8-15.2-1.6M61.2 22c5.5-2.2 10.2-2.8 15.2-1.6M57.5 30c-4.8.6-9.2 2.4-12.8 5.2M62.5 30c4.8.6 9.2 2.4 12.8 5.2" fill="none" stroke="#f7faf6" stroke-width="0.65" stroke-linecap="round" opacity="0.28"/>
      <path d="M60 40.5v5.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
    </svg>`,
    leavesOak: `<svg viewBox="0 0 130 46" aria-hidden="true" focusable="false">
      <path d="M22 24c2.2-6.5 6.8-10.5 12.2-10.8 3.2-.2 5.8 1 7.4 3.2 1.8-3.4 5.2-5.4 9-5.2 4 .2 7 2.8 8.2 6.4 2-2.8 5.4-4.2 9-3.8 4.2.4 7.2 3.4 8 7.2 2.2-2 5.4-2.8 8.6-2 3.8.9 6.4 4 6.8 7.6.2 2.4-.6 4.6-2.2 6.2 2.6 1.2 4.2 3.8 3.8 6.6-.4 3.2-3 5.4-6.2 5.6-1.8.1-3.4-.5-4.6-1.6-1.4 2.4-4 3.8-6.8 3.6-3.2-.2-5.8-2.4-6.4-5.2-1.8 2-4.6 3-7.4 2.6-3.2-.4-5.6-2.6-6.2-5.4-2 1.8-4.8 2.6-7.6 2-3.4-.6-5.8-3.2-6.2-6.4-2.2 1.2-4.8 1.4-7.2.4-3-.1-5-3.4-4.6-6.6.2-1.8 1.2-3.4 2.6-4.4z" fill="currentColor" opacity="0.58"/>
      <path d="M78 20c1.8-5.2 5.6-8.4 10-8.6 2.6-.1 4.8.8 6.2 2.6 1.5-2.8 4.4-4.4 7.6-4.2 3.4.2 5.8 2.4 6.8 5.4 1.7-2.2 4.6-3.4 7.6-3 3.6.4 6.2 3 6.8 6.2.2 2-.4 3.8-1.8 5.2 2.2 1 3.6 3.2 3.2 5.6-.4 2.8-2.6 4.6-5.4 4.8-1.4.1-2.8-.4-3.8-1.2-1.2 2-3.4 3.2-5.8 3-2.8-.2-4.8-2-5.4-4.4-1.6 1.6-3.8 2.4-6.2 2.2-2.8-.3-4.8-2.2-5.2-4.6-1.7 1.4-4 2-6.2 1.6-2.8-.5-4.8-2.6-5.2-5.2-1.8 1-4 1.2-6 .2-2.6-1.2-4.2-3.8-3.8-6.6.2-1.4.9-2.6 2-3.4z" fill="currentColor" opacity="0.42"/>
      <path d="M48 22c2 6.5 4.5 12.5 7.5 17.5" fill="none" stroke="#f7faf6" stroke-width="0.75" stroke-linecap="round" opacity="0.35"/>
      <path d="M96 18c1.6 5.2 3.6 10 6 14.2" fill="none" stroke="#f7faf6" stroke-width="0.65" stroke-linecap="round" opacity="0.28"/>
    </svg>`,
    sun: `<svg viewBox="0 0 120 40" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="glossary-sun-glow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.35"/>
          <stop offset="55%" stop-color="currentColor" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="22" rx="34" ry="14" fill="url(#glossary-sun-glow)"/>
      <circle cx="60" cy="20" r="8.5" fill="currentColor" opacity="0.92"/>
      <circle cx="60" cy="20" r="11.5" fill="none" stroke="currentColor" stroke-width="0.75" opacity="0.28"/>
      <g stroke="currentColor" stroke-width="1.15" stroke-linecap="round" opacity="0.55">
        <path d="M60 5.5v3.2M60 31.3v3.2M44.2 20h3.2M72.6 20h3.2"/>
        <path d="M49.2 9.8l2.1 2.1M68.7 28.1l2.1 2.1M49.2 30.2l2.1-2.1M68.7 11.9l2.1-2.1"/>
      </g>
      <path d="M18 34.5c12-2.5 24-3.8 42-3.8s30 1.3 42 3.8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.22" stroke-linecap="round"/>
    </svg>`,
    mountains: `<svg viewBox="0 0 160 42" aria-hidden="true" focusable="false">
      <path d="M4 38 C22 30 34 18 48 12 C58 20 66 26 78 30 C90 18 104 8 122 6 C136 14 146 24 156 38 Z" fill="currentColor" opacity="0.1"/>
      <path d="M4 38 C18 29 28 21 40 16 C52 24 62 29 74 33 C86 22 98 14 116 11 C130 18 142 27 156 38" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M28 38 C40 28 52 22 66 20 C78 26 88 30 98 34 C110 26 122 22 138 24" fill="none" stroke="currentColor" stroke-width="1.15" opacity="0.55" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M48 12 C50.5 15.5 53 17.8 56.5 19.2M122 6 C119.5 9.5 117.8 12.2 114.5 14.5" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" stroke-linecap="round"/>
      <path d="M4 38h152" fill="none" stroke="currentColor" stroke-width="1" opacity="0.25" stroke-linecap="round"/>
    </svg>`,
  };

  const sceneryOrder = ["leavesOval", "leavesSprig", "leavesMaple", "leavesOak", "sun", "mountains"];

  const sceneryBreak = (kind) => `
    <li class="interpret-glossary__scenery interpret-glossary__scenery--${kind}" aria-hidden="true">
      <span class="interpret-glossary__scenery-art">${scenery[kind]}</span>
    </li>`;

  const parts = [];
  terms.forEach((entry, index) => {
    const id = entry.id || `term-${index}`;
    parts.push(`
      <li class="interpret-glossary__item interpret-glossary__item--${escapeHtml(id)}">
        <span class="interpret-glossary__bullet" aria-hidden="true">${leafBullet}</span>
        <div class="interpret-glossary__copy">
          <strong class="interpret-glossary__term">${escapeHtml(entry.term)}</strong>
          <span class="interpret-glossary__definition">${escapeHtml(entry.definition)}</span>
        </div>
      </li>`);

    if (index % 2 === 1 && index < terms.length - 1) {
      const scene = sceneryOrder[Math.floor(index / 2) % sceneryOrder.length];
      parts.push(sceneryBreak(scene));
    }
  });

  const cornerLeaves = `
    <div class="interpret-glossary__foliage" aria-hidden="true">
      <img
        class="interpret-glossary__photo interpret-glossary__photo--sprig-top"
        src="assets/glossary-leaves-sprig.png"
        alt=""
        width="800"
        height="1000"
        loading="eager"
        decoding="async"
      />
      <img
        class="interpret-glossary__photo interpret-glossary__photo--floor-tl"
        src="assets/glossary-leaves-floor.png"
        alt=""
        width="1200"
        height="1600"
        loading="eager"
        decoding="async"
      />
      <img
        class="interpret-glossary__photo interpret-glossary__photo--floor-br"
        src="assets/glossary-leaves-floor.png"
        alt=""
        width="1200"
        height="1600"
        loading="eager"
        decoding="async"
      />
      <img
        class="interpret-glossary__photo interpret-glossary__photo--sprig-side"
        src="assets/glossary-leaves-sprig.png"
        alt=""
        width="800"
        height="1000"
        loading="eager"
        decoding="async"
      />
    </div>`;

  return `
    <section class="interpret-glossary"${reportPageAttrs(pageEntry)} aria-labelledby="interpret-glossary-title">
      ${renderInterpretSectionBanner({
        image: "assets/heading-forest-trail.png",
        objectPosition: "center 38%",
        kicker: copy.interpretGlossaryKicker,
        titleId: "interpret-glossary-title",
        title: copy.interpretGlossaryTitle,
        lead: copy.interpretGlossaryIntro,
        variant: "forest",
      })}
      ${cornerLeaves}
      <ul class="interpret-glossary__list">
        ${parts.join("")}
      </ul>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
}

function renderInterpretOurSenses(copy, pageEntry) {
  return `
    <section class="interpret-senses"${reportPageAttrs(pageEntry)} aria-labelledby="interpret-senses-title">
      <header class="interpret-senses__header no-print">
        <p class="profile-kicker">${escapeHtml(copy.interpretSensesKicker)}</p>
        <h3 id="interpret-senses-title">${escapeHtml(copy.interpretSensesTitle)}</h3>
        ${printMountainRule("section")}
        <p class="interpret-senses__subtitle">${escapeHtml(copy.interpretSensesSubtitle)}</p>
      </header>
      <figure class="interpret-senses__figure">
        <img
          class="interpret-senses__image"
          src="assets/our-senses-infographic.png?v=20260809h"
          alt="${escapeHtml(copy.interpretSensesAria)}"
          width="2339"
          height="3508"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </figure>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
    </section>
  `;
}

function renderInterpretSensoryWorld(copy, pageEntry) {
  return `
    <section class="interpret-world"${reportPageAttrs(pageEntry)} aria-labelledby="interpret-world-title">
      ${renderInterpretSectionBanner({
        image: "assets/heading-sunlight-trail.png",
        objectPosition: "center 45%",
        kicker: copy.interpretWorldKicker,
        titleId: "interpret-world-title",
        title: copy.interpretWorldTitle,
        variant: "sunlight",
      })}
      <figure class="interpret-world__figure">
        <img
          class="interpret-world__image"
          src="assets/sensory-infographic.png?v=20260809e"
          alt="${escapeHtml(copy.interpretWorldAria)}"
          width="2131"
          height="3200"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </figure>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
    </section>
  `;
}

function renderReportConclusion(pageEntry) {
  const copy = currentUi();
  const isParent = state.respondent === "parent";
  const body = isParent ? copy.reportConclusionBodyParent : copy.reportConclusionBody;
  const quote = isParent ? copy.reportConclusionQuoteParent : copy.reportConclusionQuote;

  return `
    <section class="report-conclusion"${reportPageAttrs(pageEntry)} aria-labelledby="report-conclusion-title">
      ${renderInterpretSectionBanner({
        image: "assets/heading-conclusion-trail.png",
        objectPosition: "center 48%",
        kicker: copy.reportConclusionKicker,
        titleId: "report-conclusion-title",
        title: copy.reportConclusionTitle,
        variant: "forest",
        titleTag: "h2",
        width: 1024,
        height: 682,
      })}
      <div class="report-conclusion__body">
        <p class="report-conclusion__description">${escapeHtml(body)}</p>
        <blockquote class="report-conclusion__quote">
          <p>${escapeHtml(quote)}</p>
        </blockquote>
        <p class="report-conclusion__credit">${escapeHtml(copy.reportConclusionCredit)}</p>
      </div>
      ${reportPageNumberHtml(copy, pageEntry?.page)}
      <div class="print-page-motif print-only" aria-hidden="true"></div>
    </section>
  `;
}

function renderScoreTable(scores, plan) {
  const copy = currentUi();
  const rows = getScoreRows(scores);
  const isParent = state.respondent === "parent";
  const title = copy.scoreTableTitleAdult;
  const intro = isParent ? copy.scoreTableIntroParent : copy.scoreTableIntroAdult;
  const framing = getContextFraming(state.lifeContext, state.language);
  const introEntry = reportPageById(plan, "report-scores-intro");
  const glanceEntry = reportPageById(plan, "report-sense-glance");

  const cards = rows
    .map((row, index) =>
      renderSenseInterpretCard(row, index, copy, {
        detailed: true,
        pageEntry: reportPageById(plan, `report-sense-${row.id}`),
      })
    )
    .join("");

  return `
    <section class="profile-section profile-section--scores profile-section--scores-adult" aria-labelledby="scores-title">
      <div class="sense-interpret-intro"${reportPageAttrs(introEntry)}>
        <p class="profile-kicker">${escapeHtml(copy.scoreTableKicker)}</p>
        <h3 id="scores-title">${escapeHtml(title)}</h3>
        ${printMountainRule("section")}
        <p class="profile-section__summary">${escapeHtml(intro)}${
          framing
            ? ` ${escapeHtml(
                (state.lifeContext === "homeSchool"
                  ? copy.contextDetailsNoteTeen
                  : copy.contextDetailsNote
                ).replace("{setting}", framing.atSetting)
              )}`
            : ""
        }</p>
        <ul class="sense-interpret-key" aria-label="${escapeHtml(copy.scoreColThreshold)}">
          <li class="sense-interpret-key__item sense-interpret-key__item--sensitive">
            <span class="sense-interpret-key__dot" aria-hidden="true"></span>
            ${escapeHtml(copy.scoreLeanSensitive)}
          </li>
          <li class="sense-interpret-key__item sense-interpret-key__item--neutral">
            <span class="sense-interpret-key__dot" aria-hidden="true"></span>
            ${escapeHtml(copy.scoreLeanNeutral)}
          </li>
          <li class="sense-interpret-key__item sense-interpret-key__item--seeking">
            <span class="sense-interpret-key__dot" aria-hidden="true"></span>
            ${escapeHtml(copy.scoreLeanSeeking)}
          </li>
        </ul>
        ${reportPageNumberHtml(copy, introEntry?.page)}
        <div class="print-page-motif print-only" aria-hidden="true"></div>
      </div>
      ${renderAdultSenseGlance(rows, copy, glanceEntry)}
      <div class="sense-interpret-grid sense-interpret-grid--adult">
        ${cards}
      </div>
      <p class="score-table__legend">${escapeHtml(copy.thresholdLegend)}</p>
    </section>
  `;
}

function workScaleBand(profile) {
  if (profile === "sensitive") return "low";
  if (profile === "seeking") return "high";
  return "medium";
}

function renderWorkSupportPhaseList(label, items) {
  if (!items || !items.length) return "";
  return `
    <div class="work-support__phase">
      <p class="work-support__phase-label">${escapeHtml(label)}</p>
      <ol class="work-support__list">
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ol>
    </div>`;
}

const WORK_SUPPORT_IMAGES = {
  auditory: "assets/support-auditory.png",
  tactile: "assets/support-tactile.png",
  movement: "assets/support-movement.png",
  visual: "assets/support-visual.png",
  smellTaste: "assets/support-smell-taste.png",
  everyday: "assets/support-everyday.png",
};

function renderWorkSupportArticles(groups, reportCopy, { showPresentation = true, showStrategies = true } = {}) {
  return (groups || [])
    .map((group) => {
      const band = workScaleBand(group.profile);
      const bandLabel =
        band === "low"
          ? reportCopy.scaleLow || "Low"
          : band === "high"
            ? reportCopy.scaleHigh || "High"
            : reportCopy.scaleMid || "Medium";
      const presentation =
        showPresentation && group.text
          ? `
        <p class="work-support__kicker">${escapeHtml(reportCopy.presentationLabel || "")}</p>
        <p class="work-support__presentation">${escapeHtml(group.text)}</p>`
          : "";
      const strategies = showStrategies
        ? `
        <div class="work-support__phases">
          ${renderWorkSupportPhaseList(reportCopy.phasePrepare || "Before the workday", group.prepare)}
          ${renderWorkSupportPhaseList(reportCopy.phaseDuring || "During the workday", group.during)}
          ${renderWorkSupportPhaseList(reportCopy.phaseRecover || "After work", group.recover)}
        </div>`
        : "";
      if (!presentation && !strategies) return "";
      return `
        <article class="work-support" data-band="${band}">
          <div class="work-support__media">
            <img
              src="${escapeHtml(WORK_SUPPORT_IMAGES[group.id] || WORK_SUPPORT_IMAGES.everyday)}"
              alt="${escapeHtml(group.title)} sensory support"
              loading="eager"
              decoding="async"
            />
          </div>
          <div class="work-support__content">
            <header class="work-support__header">
              <h6 class="work-support__title">${escapeHtml(group.title)}</h6>
              <span class="work-support__band work-support__band--${band}">${escapeHtml(bandLabel)}</span>
            </header>
            ${presentation}
            ${strategies}
          </div>
        </article>`;
    })
    .join("");
}

function renderWorkReportSupportBlocks(guidance, sections, reportCopy) {
  const showPresentation = Boolean(sections.challenges);
  const showStrategies = Boolean(sections.recommendations);
  if (!showPresentation && !showStrategies) return "";

  const blocks = renderWorkSupportArticles(guidance.recommendations, reportCopy, {
    showPresentation,
    showStrategies,
  });

  const heading = showStrategies ? reportCopy.sectionRecs : reportCopy.sectionChallenges;
  return `
            <section class="work-report-doc__support">
              <h5>${escapeHtml(heading)}</h5>
              <div class="work-support-list">${blocks}</div>
            </section>`;
}

function renderWorkScoreScaleChart(rows, overall, reportCopy, uiCopy) {
  const labels = getProfileLabels(state.language, state.respondent || "adult");
  const overallMeta = labels[overall.profile] || labels.neutral;
  const lowLabel = reportCopy.scaleLow || "Low";
  const midLabel = reportCopy.scaleMid || "Medium";
  const highLabel = reportCopy.scaleHigh || "High";
  const statusForBand = (band) => {
    if (band === "low") return reportCopy.scaleStatusLow || "Low threshold";
    if (band === "high") return reportCopy.scaleStatusHigh || "High threshold";
    return reportCopy.scaleStatusMid || "Medium threshold";
  };

  const chartRows = [
    ...rows.map((row) => ({
      id: row.id,
      title: row.shortTitle,
      profile: row.profile,
      color: row.color,
      band: workScaleBand(row.profile),
      status: statusForBand(workScaleBand(row.profile)),
    })),
    {
      id: "overall",
      title: uiCopy.overallScoreLabel,
      profile: overall.profile,
      color: overallMeta.color,
      band: workScaleBand(overall.profile),
      status: statusForBand(workScaleBand(overall.profile)),
      overall: true,
    },
  ];

  const items = chartRows
    .map((row) => {
      return `
      <li class="work-score-scale__row${row.overall ? " work-score-scale__row--overall" : ""}" data-band="${escapeHtml(row.band)}" data-profile="${escapeHtml(row.profile)}">
        <div class="work-score-scale__label">
          <strong>${escapeHtml(row.title)}</strong>
        </div>
        <div class="work-score-scale__track" role="img" aria-label="${escapeHtml(row.title)}: ${escapeHtml(row.status)}">
          <span class="work-score-scale__segments" aria-hidden="true">
            <span class="work-score-scale__seg work-score-scale__seg--low${row.band === "low" ? " is-active" : ""}"></span>
            <span class="work-score-scale__seg work-score-scale__seg--medium${row.band === "medium" ? " is-active" : ""}"></span>
            <span class="work-score-scale__seg work-score-scale__seg--high${row.band === "high" ? " is-active" : ""}"></span>
          </span>
        </div>
        <span class="work-score-scale__status">${escapeHtml(row.status)}</span>
      </li>`;
    })
    .join("");

  return `
    <div class="work-score-scale">
      ${reportCopy.scaleIntro ? `<p class="work-score-scale__intro">${escapeHtml(reportCopy.scaleIntro)}</p>` : ""}
      <ul class="work-score-scale__legend">
        <li class="work-score-scale__legend-item work-score-scale__legend-item--low">
          <span class="work-score-scale__swatch" aria-hidden="true"></span>
          <span><strong>${escapeHtml(lowLabel)}</strong>${reportCopy.scaleLowHint ? ` — ${escapeHtml(reportCopy.scaleLowHint)}` : ""}</span>
        </li>
        <li class="work-score-scale__legend-item work-score-scale__legend-item--medium">
          <span class="work-score-scale__swatch" aria-hidden="true"></span>
          <span><strong>${escapeHtml(midLabel)}</strong>${reportCopy.scaleMidHint ? ` — ${escapeHtml(reportCopy.scaleMidHint)}` : ""}</span>
        </li>
        <li class="work-score-scale__legend-item work-score-scale__legend-item--high">
          <span class="work-score-scale__swatch" aria-hidden="true"></span>
          <span><strong>${escapeHtml(highLabel)}</strong>${reportCopy.scaleHighHint ? ` — ${escapeHtml(reportCopy.scaleHighHint)}` : ""}</span>
        </li>
      </ul>
      <div class="work-score-scale__chart">
        <ul class="work-score-scale__rows">${items}</ul>
      </div>
    </div>`;
}

function renderWorkReport(scores) {
  if (!canOfferSettingReport()) return "";

  const reportCopy = getSettingReportCopy();
  const uiCopy = currentUi();
  const open = state.showWorkReport;
  const forWork = canOfferWorkReport();

  let panel = "";
  if (open) {
    ensureWorkReportDefaults();
    const report = state.workReport;
    const sections = getSettingReportSections();
    const displayName = report.name.trim() || reportCopy.notProvided;
    const jobTitle = report.jobTitle.trim() || reportCopy.notProvided;
    const reason = report.reasonForReferral.trim() || reportCopy.notProvided;
    const rows = getScoreRows(scores);
    const showNotesControls = isSchoolReport() && sections.notes;
    const showVisualControls = isSchoolReport() && sections.visual;

    const overall = scoreOverall(scores, state.language, state.respondent || "adult");
    const overallThreshold = getThresholdMeta(overall.profile, state.language);

    const scoreRows = forWork
      ? ""
      : rows
          .map(
            (row) => `
      <tr>
        <td><strong>${escapeHtml(row.shortTitle)}</strong></td>
        <td>${escapeHtml(row.thresholdFull)}</td>
      </tr>`
          )
          .join("") +
        `
      <tr class="work-report-doc__table-total">
        <td><strong>${escapeHtml(uiCopy.overallScoreLabel)}</strong></td>
        <td>
          <strong>${escapeHtml(overallThreshold.full)}</strong>
        </td>
      </tr>`;

    let challengesSection = "";
    let recsSection = "";

    if (forWork) {
      const guidance = getWorkReportGuidance(scores, state.language);
      recsSection = renderWorkReportSupportBlocks(guidance, sections, reportCopy);
      const generalItems = (guidance.general || [])
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

      if (sections.generalRecs && generalItems) {
        recsSection += `
            <section>
              <p class="work-report-doc__subhead">${escapeHtml(reportCopy.sectionGeneralRecs)}</p>
              <ul class="work-report-doc__recs">${generalItems}</ul>
            </section>`;
      }
    } else if (sections.recommendations) {
      const recItems = rows
        .map(
          (row) => `
      <li>
        <strong>${escapeHtml(row.shortTitle)} (${escapeHtml(row.thresholdLabel)}):</strong>
        ${escapeHtml(row.recommendation)}
      </li>`
        )
        .join("");

      recsSection = `
            <section>
              <h5>${escapeHtml(reportCopy.sectionRecs)}</h5>
              <ul class="work-report-doc__recs">${recItems}</ul>
            </section>`;
    }

    panel = `
      <div id="work-report-panel" class="work-report__panel is-open">
        <p class="work-report__intro">${escapeHtml(reportCopy.intro)}</p>

        <div class="work-report__form">
          <label class="work-report__field">
            <span>${escapeHtml(reportCopy.name)}</span>
            <input type="text" data-work-report="name" value="${escapeHtml(report.name)}" autocomplete="name" />
          </label>
          <label class="work-report__field">
            <span>${escapeHtml(reportCopy.roleLabel)}</span>
            <input type="text" data-work-report="jobTitle" value="${escapeHtml(report.jobTitle)}" autocomplete="organization-title" />
          </label>
          <label class="work-report__field work-report__field--full">
            <span>${escapeHtml(reportCopy.reason)}</span>
            <textarea data-work-report="reasonForReferral" rows="3" placeholder="${escapeHtml(reportCopy.reasonPlaceholder)}">${escapeHtml(report.reasonForReferral)}</textarea>
          </label>
          ${renderSettingReportSectionEditor(reportCopy)}
          ${
            showNotesControls
              ? `
          <div class="school-report-notes-ask work-report__field--full">
            <p class="school-report-notes-ask__label">${escapeHtml(reportCopy.notesAsk)}</p>
            <div class="contact-choice">
              <label>
                <input type="radio" name="school-report-notes" value="yes" ${state.schoolReportNotesEnabled ? "checked" : ""} />
                ${escapeHtml(reportCopy.notesAskYes)}
              </label>
              <label>
                <input type="radio" name="school-report-notes" value="no" ${!state.schoolReportNotesEnabled ? "checked" : ""} />
                ${escapeHtml(reportCopy.notesAskNo)}
              </label>
            </div>
            ${
              state.schoolReportNotesEnabled
                ? `
            <label class="work-report__field work-report__field--full school-report-notes-ask__field">
              <span>${escapeHtml(reportCopy.notesLabel)}</span>
              <textarea data-work-report="additionalNotes" rows="6" placeholder="${escapeHtml(reportCopy.notesPlaceholder)}">${escapeHtml(report.additionalNotes || "")}</textarea>
            </label>`
                : ""
            }
          </div>`
              : ""
          }
          ${showVisualControls ? renderSchoolVisualPicker(reportCopy) : ""}
        </div>

        <div class="work-report__preview" id="work-report-document">
          <p class="work-report__preview-label">${escapeHtml(reportCopy.preview)}</p>
          <article class="work-report-doc">
            <header class="work-report-doc__header">
              <p class="work-report-doc__clinic">${escapeHtml(reportCopy.clinic)}</p>
              <h4>${escapeHtml(reportCopy.docTitle)}</h4>
              <p class="work-report-doc__prepared">${escapeHtml(reportCopy.preparedBy)}</p>
            </header>

            ${
              sections.details
                ? `
            <section>
              <h5>${escapeHtml(reportCopy.sectionDetails)}</h5>
              <dl class="work-report-doc__details">
                <div><dt>${escapeHtml(reportCopy.labelName)}</dt><dd>${escapeHtml(displayName)}</dd></div>
                <div><dt>${escapeHtml(reportCopy.labelRole)}</dt><dd>${escapeHtml(jobTitle)}</dd></div>
                <div><dt>${escapeHtml(reportCopy.labelReason)}</dt><dd>${escapeHtml(reason)}</dd></div>
              </dl>
            </section>`
                : ""
            }

            ${
              sections.about
                ? `
            <section>
              <h5>${escapeHtml(reportCopy.sectionAbout)}</h5>
              <p data-work-report-text="about">${escapeHtml(fillReportTemplate(reportCopy.aboutBody, displayName))}</p>
            </section>`
                : ""
            }

            ${
              reportCopy.sectionOverload && sections.overload
                ? `
            <section>
              <h5>${escapeHtml(reportCopy.sectionOverload)}</h5>
              <p data-work-report-text="overload">${escapeHtml(fillReportTemplate(reportCopy.overloadBody, displayName))}</p>
            </section>`
                : ""
            }

            ${
              sections.referral
                ? `
            <section>
              <h5>${escapeHtml(reportCopy.sectionReferral)}</h5>
              <p data-work-report-text="referral">${escapeHtml(fillReportTemplate(reportCopy.referralBody, displayName))}</p>
            </section>`
                : ""
            }

            ${
              sections.scores || (isSchoolReport() && sections.visual)
                ? `
            <section>
              ${sections.scores ? `<h5>${escapeHtml(reportCopy.sectionScores)}</h5>` : ""}
              ${
                isSchoolReport() && sections.visual
                  ? `
              <div class="work-report-doc__visual">
                <p class="work-report-doc__visual-label">${escapeHtml(reportCopy.sectionVisual)}</p>
                ${renderSchoolReportVisual(rows, reportCopy)}
              </div>`
                  : ""
              }
              ${
                sections.scores
                  ? forWork
                    ? renderWorkScoreScaleChart(rows, overall, reportCopy, uiCopy)
                    : `
              <table class="work-report-doc__table">
                <thead>
                  <tr>
                    <th>${escapeHtml(uiCopy.scoreColSense)}</th>
                    <th>${escapeHtml(uiCopy.scoreColThreshold)}</th>
                  </tr>
                </thead>
                <tbody>${scoreRows}</tbody>
              </table>`
                  : ""
              }
            </section>`
                : ""
            }

            ${challengesSection}
            ${recsSection}

            ${
              showNotesControls && state.schoolReportNotesEnabled
                ? `
            <section class="work-report-doc__notes">
              <h5>${escapeHtml(reportCopy.sectionNotes)}</h5>
              <p class="work-report-doc__notes-body${(report.additionalNotes || "").trim() ? "" : " is-empty"}" data-work-report-text="notes">${
                (report.additionalNotes || "").trim()
                  ? escapeHtml(report.additionalNotes.trim())
                  : escapeHtml(reportCopy.notesEmpty)
              }</p>
            </section>`
                : ""
            }

            ${renderSettingReportCustomSectionsHtml()}

            ${sections.closing ? `<p class="work-report-doc__closing">${escapeHtml(reportCopy.closing)}</p>` : ""}
          </article>
        </div>

        <div class="work-report__actions">
          <button type="button" class="btn btn-primary" data-action="print-work-report">${escapeHtml(reportCopy.print)}</button>
        </div>
      </div>`;
  }

  return `
    <section class="work-report results-contact" aria-labelledby="work-report-ask-title">
      <p class="profile-kicker">${escapeHtml(reportCopy.kicker)}</p>
      <h3 id="work-report-ask-title">${escapeHtml(reportCopy.askTitle)}</h3>
      <p class="work-report__ask-desc">${escapeHtml(reportCopy.subtitle)}</p>
      <div class="contact-choice">
        <label>
          <input type="radio" name="work-report" value="yes" ${open ? "checked" : ""} />
          ${escapeHtml(reportCopy.askYes)}
        </label>
        <label>
          <input type="radio" name="work-report" value="no" ${!open && state.workReportDeclined ? "checked" : ""} />
          ${escapeHtml(reportCopy.askNo)}
        </label>
      </div>
      ${panel}
    </section>
  `;
}

function renderSensoryDiet(scores, plan) {
  const copy = currentUi();
  const isParent = state.respondent === "parent";
  const open = state.showSensoryDiet;
  const context = lifeContextLabel();
  const framing = getContextFraming(state.lifeContext, state.language);
  const sections = scores
    .map((score) => {
      const dietPlan = getSensoryDietPlan(score.id, score.profile, state.language, state.lifeContext);
      const groups = [];
      if (dietPlan.contextual.length) {
        groups.push({
          label: framing ? framing.inSetting : context,
          items: dietPlan.contextual,
          contextual: true,
        });
      }
      if (dietPlan.general.length) {
        groups.push({
          label: groups.length ? copy.dietEverywhere : "",
          items: dietPlan.general,
          contextual: false,
        });
      }
      if (!groups.length) return "";
      const pageEntry = reportPageById(plan, `report-diet-${score.id}`);
      return `
        <article class="sensory-diet__section"${reportPageAttrs(pageEntry)} style="--domain-color:${DOMAIN_COLORS[score.id]}" data-domain="${escapeHtml(score.id)}">
          <header class="sensory-diet__section-header">
            <span class="sensory-diet__icon" aria-hidden="true">${score.icon}</span>
            <div>
              <h4>${escapeHtml(score.title)}</h4>
              ${renderProfileTag(shortDomainTitle(score), score.profile)}
            </div>
          </header>
          ${printSenseNatureArt(score.id)}
          ${printMountainRule("diet")}
          ${groups
            .map(
              (group) => `
            ${group.label ? `<p class="sensory-diet__group-label${group.contextual ? " sensory-diet__group-label--context" : ""}">${escapeHtml(group.label)}</p>` : ""}
            <ul class="sensory-diet__ideas">
              ${group.items.map((idea) => `<li>${escapeHtml(idea)}</li>`).join("")}
            </ul>
          `
            )
            .join("")}
          ${reportPageNumberHtml(copy, pageEntry?.page)}
        </article>
      `;
    })
    .join("");

  const subtitle = isParent
    ? copy.dietSubtitleChild
    : context
      ? `${copy.dietSubtitle} (${context})`
      : copy.dietSubtitle;

  return `
    <section class="sensory-diet" aria-labelledby="diet-title">
      <button
        type="button"
        class="sensory-diet__trigger${open ? " is-open" : ""}"
        data-action="toggle-sensory-diet"
        aria-expanded="${open ? "true" : "false"}"
        aria-controls="sensory-diet-panel"
      >
        <span class="sensory-diet__badge" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="64" height="64" focusable="false">
            <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="2" opacity="0.35"/>
            <path d="M32 14c6 6 10 11 10 18a10 10 0 1 1-20 0c0-7 4-12 10-18z" fill="currentColor" opacity="0.9"/>
            <path d="M22 40c3 4 7 6 10 6s7-2 10-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            <circle cx="32" cy="22" r="2.2" fill="#fafcf8"/>
          </svg>
        </span>
        <span class="sensory-diet__trigger-copy">
          <span class="profile-kicker">${escapeHtml(copy.dietTitle)}</span>
          <strong id="diet-title">${escapeHtml(subtitle)}</strong>
          <span class="sensory-diet__cta">${escapeHtml(open ? copy.dietClose : copy.dietOpen)}</span>
        </span>
      </button>
      <div
        id="sensory-diet-panel"
        class="sensory-diet__panel${open ? " is-open" : ""}"
        ${open ? "" : "hidden"}
      >
        <p class="sensory-diet__intro">${escapeHtml(isParent ? copy.dietIntroChild : copy.dietIntro)}${framing ? ` ${escapeHtml((state.lifeContext === "homeSchool" ? copy.dietContextNoteTeen : copy.dietContextNote).replace("{setting}", framing.settingName))}` : ""}</p>
        <div class="sensory-diet__grid">
          ${sections || `<p class="sensory-diet__empty">${escapeHtml(copy.dietEmpty)}</p>`}
        </div>
      </div>
    </section>
  `;
}

function renderShortReportSectionExtras(metrics, sections) {
  const copy = currentUi();
  const parts = [];

  if (sections.overallPattern) {
    const label = profileLabelPlain(metrics.meta) || metrics.leanHeadline;
    if (label) {
      parts.push(`
        <section class="results-summary__snippet results-summary__snippet--pattern" aria-labelledby="short-overall-title">
          <p class="profile-kicker">${escapeHtml(copy.summaryOverallKicker)}</p>
          <h3 id="short-overall-title">${escapeHtml(label)}</h3>
          <p class="results-summary__snippet-note">${escapeHtml(copy.summaryOverallNote)}</p>
        </section>
      `);
    }
  }

  if (sections.domainGlance) {
    const scores = scoreAllDomains(
      state.answers,
      currentDomains(),
      state.language,
      state.respondent || "adult"
    );
    const rows = getScoreRows(scores);
    if (rows.length) {
      const list = rows
        .map(
          (row) => `
          <li class="results-summary__domain">
            <span class="results-summary__domain-name">${escapeHtml(row.shortTitle || row.title)}</span>
            <span class="results-summary__domain-lean">${escapeHtml(row.profileShort || row.thresholdLabel || "—")}</span>
          </li>`
        )
        .join("");
      parts.push(`
        <section class="results-summary__snippet results-summary__snippet--domains" aria-labelledby="short-domains-title">
          <p class="profile-kicker">${escapeHtml(copy.summaryDomainsKicker)}</p>
          <h3 id="short-domains-title">${escapeHtml(copy.summaryDomainsTitle)}</h3>
          <ul class="results-summary__domains">${list}</ul>
          <p class="results-summary__snippet-note">${escapeHtml(copy.summaryDomainsNote)}</p>
        </section>
      `);
    }
  }

  if (sections.trailCharacter && shouldShowTrailProfile()) {
    const roster = getTeenCrewRoster(copy);
    const youId = getTeenCrewId(metrics.lean);
    const you = roster.find((member) => member.id === youId) || roster[1];
    if (you) {
      parts.push(`
        <section class="results-summary__snippet results-summary__snippet--trail" aria-labelledby="short-trail-title">
          <p class="profile-kicker">${escapeHtml(copy.summaryTrailKicker)}</p>
          <h3 id="short-trail-title">${escapeHtml(you.name)}</h3>
          <p class="results-summary__snippet-tag">${escapeHtml(you.tag || "")}</p>
          <p class="results-summary__snippet-note">${escapeHtml(copy.summaryTrailNote)}</p>
        </section>
      `);
    }
  }

  return parts.length
    ? `<div class="results-summary__extras">${parts.join("")}</div>`
    : "";
}

function renderShortReportEditor(sections) {
  if (!isShortReportDashboardPreview()) return "";
  const copy = currentUi();
  return `
    <aside class="short-report-editor no-print" aria-labelledby="short-report-editor-title">
      <div class="short-report-editor__head">
        <p class="short-report-editor__eyebrow">Therapist tools</p>
        <h3 id="short-report-editor-title">${escapeHtml(copy.summaryEditorTitle)}</h3>
        <p>${escapeHtml(copy.summaryEditorLead)}</p>
      </div>
      <fieldset class="short-report-editor__fields">
        <legend class="visually-hidden">${escapeHtml(copy.summaryEditorLegend)}</legend>
        <label class="short-report-editor__choice">
          <input type="checkbox" data-short-section="overallPattern"${sections.overallPattern ? " checked" : ""} />
          <span>
            <strong>${escapeHtml(copy.summaryEditorOverall)}</strong>
            <em>${escapeHtml(copy.summaryEditorOverallHint)}</em>
          </span>
        </label>
        <label class="short-report-editor__choice">
          <input type="checkbox" data-short-section="domainGlance"${sections.domainGlance ? " checked" : ""} />
          <span>
            <strong>${escapeHtml(copy.summaryEditorDomains)}</strong>
            <em>${escapeHtml(copy.summaryEditorDomainsHint)}</em>
          </span>
        </label>
        <label class="short-report-editor__choice">
          <input type="checkbox" data-short-section="trailCharacter"${sections.trailCharacter ? " checked" : ""} />
          <span>
            <strong>${escapeHtml(copy.summaryEditorTrail)}</strong>
            <em>${escapeHtml(copy.summaryEditorTrailHint)}</em>
          </span>
        </label>
      </fieldset>
      <p class="short-report-editor__note">${escapeHtml(copy.summaryEditorNote)}</p>
    </aside>
  `;
}

function renderResultsSummary() {
  clearSensoryDraft();
  if (!state.completedAt) {
    state.completedAt = new Date().toISOString();
  }
  ensureAssessmentArchived();
  const copy = currentUi();
  const scores = scoreAllDomains(
    state.answers,
    currentDomains(),
    state.language,
    state.respondent || "adult"
  );
  const metrics = getProfileMetrics(scores);
  const sections = readShortReportSections();
  const fromDashboard = isShortReportDashboardPreview();

  if (shouldEmailResultsToClinician()) {
    queueMicrotask(() => ensureResultsSubmitted());
  }

  const submissionNote =
    shouldEmailResultsToClinician() && state.submissionStatus
      ? `<p class="submission-status submission-status--${escapeHtml(state.submissionStatus)}" data-submission-status role="status">${escapeHtml(
          submissionStatusMessage(copy)
        )}</p>${renderSubmissionErrorDetail()}`
      : shouldEmailResultsToClinician()
        ? `<p class="submission-status submission-status--pending" data-submission-status role="status">${escapeHtml(copy.thankYouSending)}</p>`
        : "";

  return renderShell(
    `
      ${
        fromDashboard
          ? `<div class="results-dashboard-bar no-print">
              <button type="button" class="btn btn-secondary" data-action="back-dashboard">← Back to dashboard</button>
              <button type="button" class="btn btn-secondary" data-action="switch-report-full">View full report</button>
            </div>`
          : ""
      }

      ${renderShortReportEditor(sections)}

      <div class="results-summary results-summary--brief">
        <div class="results-summary__hero">
          ${renderInterpretSectionBanner({
            image: "assets/short-report-misty-trail.png",
            objectPosition: "center 42%",
            kicker: copy.summaryKicker,
            titleId: "summary-title",
            title: copy.summaryTitle,
            lead: copy.summaryBannerLead || "",
            variant: "forest",
            titleTag: "h2",
            width: 768,
            height: 1024,
          })}
          ${
            state.demographics.name
              ? `<p class="results-summary__name">${escapeHtml(state.demographics.name)}</p>`
              : ""
          }
          <p class="results-summary__intro">${escapeHtml(copy.summaryIntro)}</p>
          ${submissionNote}
        </div>

        ${renderShortReportSectionExtras(metrics, sections)}

        <section class="results-summary__next" aria-labelledby="summary-next-title">
          ${renderInterpretSectionBanner({
            image: "assets/short-report-sunlight-trail.png",
            objectPosition: "center 48%",
            kicker: copy.summaryNextKicker || copy.summaryNextTitle,
            titleId: "summary-next-title",
            title: copy.summaryNextTitle,
            lead: copy.summaryNextBannerLead || "",
            variant: "sunlight",
            titleTag: "h3",
            width: 682,
            height: 1024,
          })}
          <div class="results-summary__next-body">
            <p>${escapeHtml(copy.summaryNextBody)}</p>
            <div class="actions">
              ${
                fromDashboard
                  ? ""
                  : `<a class="btn btn-primary" href="${WHATSAPP_FEEDBACK_URL}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.summaryBookCta)}</a>`
              }
              <button type="button" class="btn ${fromDashboard ? "btn-primary" : "btn-secondary"}" data-action="${fromDashboard ? "back-dashboard" : "back-home"}">${escapeHtml(
                fromDashboard ? copy.summaryEditorBack : copy.thankYouHome
              )}</button>
              ${
                shouldEmailResultsToClinician() && state.submissionStatus === "error"
                  ? `<button type="button" class="btn btn-secondary" data-action="retry-submit">${escapeHtml(copy.thankYouRetry)}</button>`
                  : ""
              }
            </div>
          </div>
        </section>
      </div>
    `,
    renderProgress(),
    { stepType: "results" }
  );
}

function renderParentReportCover(copy, submissionNote = "") {
  const childName = (state.demographics.name || "").trim();
  const parentName = (state.demographics.parentName || "").trim();
  const dateLabel = formatQuestionnaireDate(state.completedAt, state.language);
  const paragraphs = [
    copy.parentReportIntroP1,
    copy.parentReportIntroP2,
    copy.parentReportIntroP3,
  ].filter(Boolean);
  const regarding = copy.parentReportRegarding || "Parent / child";

  return `
    <section class="parent-report-cover" aria-labelledby="profile-title">
      <div class="parent-report-cover__hero">
        <img
          src="assets/couple-intro-trail.png"
          alt=""
          class="parent-report-cover__hero-image"
          width="1200"
          height="800"
          loading="eager"
          decoding="async"
        />
        <div class="parent-report-cover__hero-veil" aria-hidden="true"></div>
        <div class="parent-report-cover__brand">
          <img src="assets/logo.png" alt="" class="parent-report-cover__logo" width="72" height="72" />
          <div class="parent-report-cover__brand-text">
            <p class="parent-report-cover__studio">Soulful Sensory OT</p>
            <p class="parent-report-cover__tag">${escapeHtml(
              copy.interpretCoverBrandTag || "Occupational Therapy Services"
            )}</p>
          </div>
        </div>
        <div class="parent-report-cover__hero-copy">
          <p class="parent-report-cover__kicker">${escapeHtml(copy.viewpoint || "")}</p>
          <h2 id="profile-title" class="parent-report-cover__title">${escapeHtml(
            copy.parentReportIntroTitle || copy.profileTitleParent || copy.profileTitle
          )}</h2>
          ${
            copy.parentReportIntroLead
              ? `<p class="parent-report-cover__lead">${escapeHtml(copy.parentReportIntroLead)}</p>`
              : ""
          }
        </div>
      </div>
      <div class="parent-report-cover__sheet">
        <div class="parent-report-cover__identity">
          <div class="parent-report-cover__who">
            ${
              childName
                ? `<p class="parent-report-cover__label">${escapeHtml(
                    copy.interpretCoverPreparedFor || "Prepared for"
                  )}</p>
              <p class="parent-report-cover__name">${escapeHtml(childName)}</p>`
                : ""
            }
            ${
              parentName
                ? `<p class="parent-report-cover__parent"><span>${escapeHtml(
                    copy.interpretCoverParentLabel || "Parent / guardian"
                  )}</span> ${escapeHtml(parentName)}</p>`
                : ""
            }
          </div>
          <div class="parent-report-cover__facts">
            <p class="parent-report-cover__regarding">${escapeHtml(regarding)}</p>
            ${dateLabel ? `<p class="parent-report-cover__date">${escapeHtml(dateLabel)}</p>` : ""}
            ${
              copy.profileTitleParent
                ? `<p class="parent-report-cover__profile">${escapeHtml(copy.profileTitleParent)}</p>`
                : ""
            }
          </div>
        </div>
        <div class="parent-report-cover__reading">
          <figure class="parent-report-cover__portrait">
            <img
              src="assets/home-life-family.png"
              alt=""
              class="parent-report-cover__portrait-image"
              width="1024"
              height="682"
              loading="eager"
              decoding="async"
            />
          </figure>
          <div class="parent-report-cover__body">
            ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            ${
              copy.descriptiveMap
                ? `<p class="parent-report-cover__disclaimer">${escapeHtml(copy.descriptiveMap)}</p>`
                : ""
            }
          </div>
        </div>
        ${renderSharingPermissionsSummary()}
        ${submissionNote}
      </div>
    </section>
  `;
}

function renderParentHomeVisuals() {
  return `
    <div class="parent-home-visuals couple-visual-visuals" aria-hidden="true">
      <figure class="couple-visual-visuals__shot">
        <img
          src="assets/home-life-family.png"
          alt=""
          class="couple-visual-visuals__image"
          width="1024"
          height="682"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <figure class="couple-visual-visuals__shot">
        <img
          src="assets/teen-home-support.png"
          alt=""
          class="couple-visual-visuals__image"
          width="1024"
          height="682"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>`;
}

function renderParentClosingQuote(copy) {
  const quote = copy.parentClosingQuote || copy.coupleClosingQuote;
  if (!quote) return "";
  return `
    <figure class="couple-closing-quote parent-closing-quote">
      <span class="couple-closing-quote__mark" aria-hidden="true">“</span>
      <blockquote class="couple-closing-quote__text">
        <p>${escapeHtml(quote)}</p>
      </blockquote>
      <span class="couple-closing-quote__rule" aria-hidden="true"></span>
    </figure>`;
}

function renderWorkProfileCover(copy) {
  const name = (state.demographics.name || "").trim();
  return `
    <section class="work-profile-cover" aria-labelledby="profile-title">
      <div class="work-profile-cover__media">
        <img
          src="assets/front-page-sensory-trail.png"
          alt=""
          class="work-profile-cover__image"
          width="682"
          height="1024"
          loading="eager"
          decoding="async"
        />
      </div>
      <div class="work-profile-cover__content">
        <p class="work-profile-cover__kicker">${escapeHtml(copy.viewpoint || "Viewpoint")}</p>
        <h2 id="profile-title" class="work-profile-cover__title">Sensory trail profile</h2>
        ${name ? `<p class="work-profile-cover__name">${escapeHtml(name)}</p>` : ""}
        <p class="work-profile-cover__regarding">Regarding: work</p>
      </div>
    </section>`;
}

function renderHomeProfileCover(copy) {
  const name = (state.demographics.name || "").trim();
  const dateLabel = formatQuestionnaireDate(state.completedAt, state.language);
  const context = copy.contextHome || "Home";
  return `
    <section class="home-profile-cover" aria-labelledby="profile-title">
      <div class="home-profile-cover__hero">
        <img
          src="assets/home-cover-trail.jpg"
          alt=""
          class="home-profile-cover__hero-image"
          width="682"
          height="1024"
          loading="eager"
          decoding="async"
        />
        <div class="home-profile-cover__hero-veil" aria-hidden="true"></div>
        <div class="home-profile-cover__brand">
          <img src="assets/logo.png" alt="" class="home-profile-cover__logo" width="72" height="72" />
          <div class="home-profile-cover__brand-text">
            <p class="home-profile-cover__studio">Soulful Sensory OT</p>
            <p class="home-profile-cover__tag">${escapeHtml(
              copy.interpretCoverBrandTag || "Occupational Therapy Services"
            )}</p>
          </div>
        </div>
      </div>
      <div class="home-profile-cover__board">
        <div class="home-profile-cover__copy">
          <p class="home-profile-cover__kicker">${escapeHtml(copy.viewpoint || "Viewpoint")}</p>
          <h2 id="profile-title" class="home-profile-cover__title">${escapeHtml(
            copy.profileTitle || "Sensory trail profile"
          )}</h2>
          ${name ? `<p class="home-profile-cover__name">${escapeHtml(name)}</p>` : ""}
          <p class="home-profile-cover__regarding">Regarding: ${escapeHtml(context)}</p>
          ${dateLabel ? `<p class="home-profile-cover__date">${escapeHtml(dateLabel)}</p>` : ""}
        </div>
      </div>
    </section>`;
}

function renderResults() {
  clearSensoryDraft();
  if (!state.completedAt) {
    state.completedAt = new Date().toISOString();
  }
  ensureAssessmentArchived();
  const copy = currentUi();
  const scores = scoreAllDomains(
    state.answers,
    currentDomains(),
    state.language,
    state.respondent || "adult"
  );
  const metrics = getProfileMetrics(scores);
  const context = lifeContextLabel();
  const framing = getContextFraming(state.lifeContext, state.language);
  const fromDashboard = Boolean(state.archiveReadOnly) && canAccessTherapistDashboard();
  const pagePlan = buildReportPagePlan(copy, scores, metrics);
  const isParent = state.respondent === "parent";
  const isWorkProfile = state.respondent === "adult" && state.lifeContext === "work";
  const isHomeProfile = state.respondent === "adult" && state.lifeContext === "home";

  if (shouldEmailResultsToClinician()) {
    queueMicrotask(() => ensureResultsSubmitted());
  }

  const submissionNote =
    shouldEmailResultsToClinician() && state.submissionStatus
      ? `<p class="submission-status submission-status--${escapeHtml(state.submissionStatus)}" data-submission-status role="status">${escapeHtml(
          submissionStatusMessage(copy)
        )}</p>${renderSubmissionErrorDetail()}`
      : shouldEmailResultsToClinician()
        ? `<p class="submission-status submission-status--pending" data-submission-status role="status">${escapeHtml(copy.thankYouSending)}</p>`
        : "";

  const introBlock = isParent
    ? renderParentReportCover(copy, submissionNote)
    : isWorkProfile
      ? `
      <div class="results-intro results-intro--concise results-intro--work" aria-labelledby="profile-title">
        ${renderWorkProfileCover(copy)}
        ${submissionNote}
      </div>

      ${renderSharingPermissionsSummary()}`
    : isHomeProfile
      ? `
      <div class="results-intro results-intro--concise results-intro--home" aria-labelledby="profile-title">
        ${renderHomeProfileCover(copy)}
        ${submissionNote}
      </div>

      ${renderSharingPermissionsSummary()}`
    : `
      <div class="results-intro results-intro--concise" aria-labelledby="profile-title">
        ${renderInterpretSectionBanner({
          image: "assets/heading-viewpoint-sunrise.png?v=20260815c",
          objectPosition: "center 48%",
          kicker: copy.viewpoint,
          titleId: "profile-title",
          title: copy.profileTitle,
          variant: "viewpoint",
          titleTag: "h2",
          width: 1024,
          height: 639,
        })}
        ${
          state.demographics.name
            ? `<p class="results-intro__name">${escapeHtml(state.demographics.name)}</p>`
            : ""
        }
        ${
          context
            ? `<p class="results-intro__context">
          <span class="context-chip">${escapeHtml(copy.focusedOn)} · ${escapeHtml(context)}</span>
          <span class="results-intro__context-text">${escapeHtml(
            state.lifeContext === "homeSchool"
              ? copy.contextResultsNoteTeen
              : copy.contextResultsNote.replace("{setting}", framing ? framing.choiceName : context)
          )}</span>
        </p>`
            : ""
        }
        ${submissionNote}
      </div>

      ${renderSharingPermissionsSummary()}`;

  return renderShell(
    `
      ${
        isParent
          ? ""
          : `<div class="results-atmosphere" aria-hidden="true">
        <img src="assets/protea-left.png" alt="" class="results-atmosphere__protea results-atmosphere__protea--left" />
        <img src="assets/protea-right.png" alt="" class="results-atmosphere__protea results-atmosphere__protea--right" />
        <img src="assets/protea-right.png" alt="" class="results-atmosphere__protea results-atmosphere__protea--mid" />
      </div>`
      }

      ${
        fromDashboard
          ? `<div class="results-dashboard-bar no-print">
              <button type="button" class="btn btn-secondary" data-action="back-dashboard">← Back to dashboard</button>
              <button type="button" class="btn btn-secondary" data-action="switch-report-basic">Preview short report</button>
              <button type="button" class="btn btn-primary" data-action="print">${escapeHtml(copy.print)}</button>
            </div>`
          : ""
      }

      ${renderCoupleResultsBanner()}

      ${renderSampleReportBanner()}

      <div class="${isParent ? "parent-report" : ""}">
      ${introBlock}
      ${renderSensoryTrailOverview(reportPageById(pagePlan, "report-trail-overview"))}
      ${renderMatchedTrailReveal(metrics, reportPageById(pagePlan, "report-trail-match"))}
      ${renderMatchedTrailDescription(metrics, reportPageById(pagePlan, "report-trail-description"))}
      ${renderBriefScoreSummary(scores, metrics, reportPageById(pagePlan, "report-brief-scores"))}
      ${renderSenseSupportGuide(scores, reportPageById(pagePlan, "report-sense-support"))}
      ${renderIdealSaturdayResults(reportPageById(pagePlan, "report-ideal-saturday"))}
      ${renderCoupleWorkResults()}
      ${renderTrailSettingInterpretations(metrics, pagePlan)}
      ${isParent ? renderParentClosingQuote(copy) : ""}
      </div>

      <div class="results-contact">
        <h3>${escapeHtml(copy.contactTitle)}</h3>
        <div class="contact-choice">
          <label>
            <input type="radio" name="contact" value="yes" ${state.contactPreference === "yes" ? "checked" : ""} />
            ${escapeHtml(copy.contactYes)}
          </label>
          <label>
            <input type="radio" name="contact" value="no" ${state.contactPreference === "no" ? "checked" : ""} />
            ${escapeHtml(copy.contactNo)}
          </label>
        </div>
      </div>

      ${renderWorkReport(scores)}

      <div class="actions">
        ${
          fromDashboard
            ? `<button class="btn btn-secondary" data-action="back-dashboard">← Dashboard</button>`
            : `<button class="btn btn-secondary" data-action="back">${escapeHtml(copy.review)}</button>`
        }
        <button class="btn btn-primary" data-action="print">${escapeHtml(copy.print)}</button>
        ${
          shouldEmailResultsToClinician() && state.submissionStatus === "error"
            ? `<button type="button" class="btn btn-secondary" data-action="retry-submit">${escapeHtml(copy.thankYouRetry)}</button>`
            : ""
        }
      </div>
    `,
    renderProgress(),
    { stepType: "results" }
  );
}

function syncQuestionnaireChrome() {
  const isQuestionnaire = state.view === "questionnaire" && state.step > 0;
  const isAfrikaans = isQuestionnaire && state.language === "af";
  document.documentElement.lang = isAfrikaans ? "af" : "en";
  document.title = isAfrikaans
    ? "Soulful Sensory Sensoriese Siftingsvraelys"
    : "Soulful Sensory Screening Questionnaire";

  const tagline = document.getElementById("brand-tagline");
  if (tagline) {
    tagline.textContent = isAfrikaans ? "Arbeidsterapiedienste" : "Occupational Therapy Services";
  }

  const printTagline = document.getElementById("print-brand-tagline");
  if (printTagline) {
    printTagline.textContent = isAfrikaans ? "Arbeidsterapiedienste" : "Occupational Therapy Services";
  }

  const disclaimer = document.getElementById("footer-disclaimer");
  if (disclaimer) {
    disclaimer.textContent = isAfrikaans
      ? "Hierdie siftingsinstrument is nie ’n diagnose nie. Resultate dien slegs as riglyn."
      : "This screening tool does not constitute a diagnosis. Results are for guidance only.";
  }
}

function render({ scrollToTop = false } = {}) {
  let html;
  const isPainView =
    state.view === "pain" ||
    state.view === "pain-category" ||
    state.view === "pain-summary";
  const isAuthView =
    state.view === "login" ||
    state.view === "signup" ||
    state.view === "forgot" ||
    state.view === "reset" ||
    state.view === "settings" ||
    state.view === "account" ||
    state.view === "dashboard";
  const isHomeView =
    state.view === "home" ||
    isPainView ||
    state.view === "sensory" ||
    state.view === "clinician";

  document.body.classList.toggle("is-home", isHomeView);
  document.body.classList.toggle("is-pain", isPainView);
  document.body.classList.toggle(
    "is-pain-screen",
    state.view === "pain-category" || state.view === "pain-summary"
  );
  document.body.classList.toggle("is-sensory", state.view === "sensory");
  document.body.classList.toggle("is-clinician", state.view === "clinician");
  document.body.classList.toggle("is-dashboard", state.view === "dashboard");
  document.body.classList.toggle("is-auth", isAuthView);
  document.body.classList.toggle("is-settings", state.view === "settings");
  document.body.classList.toggle("has-intro-modal", Boolean(state.showIntroModal));

  if (state.view === "settings") {
    html = renderSettings();
  } else if (state.view === "dashboard") {
    html = renderDashboard();
  } else if (state.view === "account") {
    html = renderAccount();
  } else if (state.view === "login") {
    html = renderLogin();
  } else if (state.view === "forgot") {
    html = renderForgotPassword();
  } else if (state.view === "reset") {
    html = renderResetPassword();
  } else if (state.view === "signup") {
    html = renderSignup();
  } else if (state.view === "clinician") {
    html = renderClinician();
  } else if (state.view === "pain-summary") {
    html = renderPainSummaryScreen();
  } else if (state.view === "pain-category") {
    html = renderPainCategoryScreen();
  } else if (state.view === "pain") {
    html = renderPainLanding();
  } else if (state.view === "sensory") {
    html = renderSensoryLanding();
  } else if (state.view === "home" || state.step === 0) {
    state.view = "home";
    state.step = 0;
    html = renderHome();
  } else {
    const step = STEPS[state.step];
    switch (step.type) {
      case "respondent":
        if (hasLockedRespondent()) {
          state.respondent = state.assignedRespondent;
          if (hasLockedLifeContext()) state.lifeContext = state.assignedLifeContext;
          moveStep(1);
          if (needsCoupleHub()) {
            html = renderCoupleHub();
          } else if (needsLifeContext()) {
            html = renderContext();
          } else {
            html = renderConsent();
          }
        } else {
          html = renderRespondent();
        }
        break;
      case "coupleHub":
        if (!needsCoupleHub()) {
          moveStep(1);
          html = needsLifeContext() ? renderContext() : renderConsent();
        } else {
          html = renderCoupleHub();
        }
        break;
      case "context":
        if (!needsLifeContext()) {
          moveStep(1);
          html = renderConsent();
        } else {
          html = renderContext();
        }
        break;
      case "consent":
        html = renderConsent();
        break;
      case "demographics":
        html = renderDemographics();
        break;
      case "domain": {
        const domain = currentDomain(step.domainId);
        html = domain ? renderDomain(domain) : renderRespondent();
        break;
      }
      case "idealSaturday":
        if (!needsIdealSaturday()) {
          moveStep(1);
          html = needsCoupleWork() ? renderCoupleWork() : renderResults();
        } else {
          html = renderIdealSaturday();
        }
        break;
      case "coupleWork":
        if (!needsCoupleWork()) {
          moveStep(1);
          html = renderResults();
        } else {
          html = renderCoupleWork();
        }
        break;
      case "results":
        try {
          const access = getPatientResultsAccess();
          if (access === RESULTS_ACCESS.full) {
            html = renderResults();
          } else if (access === RESULTS_ACCESS.basic) {
            html = renderResultsSummary();
          } else {
            html = renderSubmissionThankYou();
            queueMicrotask(() => ensureResultsSubmitted());
          }
        } catch (err) {
          console.error("Results render failed:", err);
          state.error =
            state.language === "af"
              ? "Die resultate kon nie oopgemaak word nie. Probeer asseblief weer, of herlaai die bladsy."
              : "Results could not be opened. Please try again, or refresh the page.";
          state.step = Math.max(1, STEPS.length - 2);
          const domain = currentDomain(STEPS[state.step]?.domainId);
          html = domain ? renderDomain(domain) : renderRespondent();
        }
        break;
      default:
        state.view = "home";
        state.step = 0;
        html = renderHome();
    }

    if (state.showIntroModal && state.view === "questionnaire") {
      html += renderIntroModal();
    }
  }

  syncQuestionnaireChrome();
  syncAccountChrome();
  app.innerHTML = renderFileProtocolBanner() + html;
  if (state.showIntroModal) {
    const introCta = app.querySelector("[data-action='dismiss-intro']");
    if (introCta) introCta.focus();
  }
  if (scrollToTop) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function clearErrorBanner() {
  const errorBanner = app.querySelector(".error-banner");
  if (errorBanner) errorBanner.remove();
}

function updateChoiceSelection(selectedBtn, attr) {
  app.querySelectorAll(`[${attr}]`).forEach((button) => {
    const selected = button === selectedBtn;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  clearErrorBanner();
}

function updateAnswerSelection(answerBtn) {
  const group = answerBtn.closest(".yes-no");
  if (!group) return;

  group.querySelectorAll("button").forEach((button) => {
    button.classList.remove("selected");
  });
  answerBtn.classList.add("selected");

  clearErrorBanner();

  const domainId = answerBtn.dataset.domain;
  if (domainId) {
    const domain = currentDomain(domainId);
    const answers = state.answers[domainId];
    const answeredCount = answers.filter((a) => typeof a === "boolean").length;
    const questionTotal = domain?.questions.length || answers.length;
    const progressEl = app.querySelector(".question-progress");
    if (progressEl) {
      const pct = Math.round((answeredCount / questionTotal) * 100);
      const fill = progressEl.querySelector(".question-progress__fill");
      const text = progressEl.querySelector(".question-progress__text");
      if (fill) fill.style.width = `${pct}%`;
      if (text) {
        text.textContent = `${answeredCount} ${currentUi().of} ${questionTotal} ${currentUi().answered}`;
      }
    }
  }
}

function validateStep() {
  state.error = null;
  const step = STEPS[state.step];
  const copy = currentUi();

  if (step.type === "respondent") {
    if (!state.respondent) {
      state.error = copy.requiredRespondent;
      return false;
    }
  }

  if (step.type === "context") {
    if (needsLifeContext() && !state.lifeContext) {
      state.error = copy.requiredContext;
      return false;
    }
  }

  if (step.type === "consent") {
    if (!hasAllRequiredConsent()) {
      state.error = copy.requiredConsent;
      return false;
    }
  }

  if (step.type === "demographics") {
    const demographics = getDemographics(state.language, state.respondent || "adult");
    for (const field of demographics) {
      if (field.required && !state.demographics[field.id]?.trim()) {
        state.error = `${copy.requiredField} "${field.label}".`;
        return false;
      }
    }
    if (state.demographics.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.demographics.email)) {
      state.error = copy.validEmail;
      return false;
    }
  }

  if (step.type === "domain") {
    const domain = currentDomain(step.domainId);
    const answers = state.answers[step.domainId];
    const unanswered = domain.questions.findIndex(
      (_, i) => typeof answers[i] !== "boolean"
    );
    if (unanswered !== -1) {
      state.error = `${copy.answerAll} (${state.language === "af" ? "vraag" : "question"} ${unanswered + 1} ${copy.unanswered}).`;
      return false;
    }
  }

  if (step.type === "idealSaturday") {
    if (needsIdealSaturday() && !(state.idealSaturday || "").trim()) {
      state.error = copy.idealSaturdayRequired;
      return false;
    }
  }

  if (step.type === "coupleWork") {
    const work = ensureCoupleWorkState();
    if (!work.employment) {
      state.error = copy.coupleWorkRequiredEmployment;
      return false;
    }
    if (!work.isParent) {
      state.error = copy.coupleWorkRequired;
      return false;
    }
    if (work.employment === "works") {
      if (!work.workLocation) {
        state.error = copy.coupleWorkRequired;
        return false;
      }
      if (work.workLocation === "other" && !work.workLocationOther.trim()) {
        state.error = copy.coupleWorkRequired;
        return false;
      }
      if (!work.workWith) {
        state.error = copy.coupleWorkRequired;
        return false;
      }
      if (work.workWith === "other" && !work.workWithOther.trim()) {
        state.error = copy.coupleWorkRequired;
        return false;
      }
      if (!work.workingHours.trim()) {
        state.error = copy.coupleWorkRequired;
        return false;
      }
      if (!work.endOfDay.length) {
        state.error = copy.coupleWorkRequired;
        return false;
      }
      if (!work.rechargeAfterWork.length) {
        state.error = copy.coupleWorkRequired;
        return false;
      }
      if (work.rechargeAfterWork.includes("other") && !work.rechargeAfterWorkOther.trim()) {
        state.error = copy.coupleWorkRequired;
        return false;
      }
      if (!work.rechargingSaturday.trim()) {
        state.error = copy.coupleWorkRequired;
        return false;
      }
    }
  }

  return true;
}

function bindEvents() {
  const accountChrome = document.getElementById("account-chrome");
  if (accountChrome) {
    accountChrome.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.getAttribute("data-action") || btn.dataset.action;
      if (action === "open-login") {
        if (isPatientInvite()) {
          beginInviteAccountGate();
          render({ scrollToTop: true });
          return;
        }
        resetAuthForm(state.authForm.role || "patient");
        state.view = "login";
        clearAuthResetParams();
        render({ scrollToTop: true });
      } else if (action === "open-signup") {
        resetAuthForm("patient");
        state.view = "signup";
        render({ scrollToTop: true });
      } else if (action === "open-forgot") {
        state.authError = null;
        state.authNotice = null;
        state.authForm.password = "";
        state.authForm.confirmPassword = "";
        state.view = "forgot";
        render({ scrollToTop: true });
      } else if (action === "open-account") {
        state.view = currentAuthUser() ? "account" : "login";
        if (!currentAuthUser()) resetAuthForm();
        render({ scrollToTop: true });
      } else if (action === "open-settings") {
        const user = currentAuthUser();
        if (!user || user.role !== "admin") {
          state.authError = "Admin access required.";
          state.view = "login";
        } else {
          state.view = "settings";
          state.settingsTab = "overview";
        }
        render({ scrollToTop: true });
      } else if (action === "open-dashboard") {
        saveSensoryDraft();
        state.view = "dashboard";
        state.dashboardTab = "register";
        state.dashboardNotice = null;
        state.clinicianPinError = null;
        if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
          state.clinicianUnlocked = true;
        }
        maybeNotifyExpiringQuestionnaires();
        render({ scrollToTop: true });
      } else if (action === "open-preferences") {
        saveSensoryDraft();
        state.view = "dashboard";
        state.dashboardTab = "preferences";
        state.dashboardNotice = null;
        state.prefsNotice = null;
        state.clinicianPinError = null;
        if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
          state.clinicianUnlocked = true;
        }
        render({ scrollToTop: true });
      } else if (action === "open-clinician" || action === "open-create-patient") {
        openCreatePatientView();
        render({ scrollToTop: true });
      } else if (action === "logout") {
        handleLogout();
        render({ scrollToTop: true });
      } else if (action === "back-home") {
        saveSensoryDraft();
        clearInviteSession();
        state.viewingArchivedId = null;
        state.archiveReadOnly = false;
        state.reportViewMode = null;
        state.sampleReportPreview = false;
        state.view = "home";
        state.step = 0;
        if (window.history?.replaceState) {
          const clean = new URL(window.location.href);
          clean.searchParams.delete("invite");
          clean.searchParams.delete("patient");
          clean.searchParams.delete("results");
          clean.searchParams.delete("dashboard");
          clean.searchParams.delete("patients");
          clean.searchParams.delete("preview");
          clean.searchParams.delete("sample");
          clean.searchParams.delete("respondent");
          clean.searchParams.delete("pathway");
          clean.searchParams.delete("context");
          clean.searchParams.delete("lifeContext");
          clean.searchParams.delete("reset");
          clean.searchParams.delete("forgot");
          window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
        }
        render({ scrollToTop: true });
      }
    });
  }

  app.addEventListener("click", (e) => {
    const languageBtn = e.target.closest("[data-language]");
    if (languageBtn) {
      const nextLanguage = languageBtn.dataset.language;
      if (state.language !== nextLanguage) {
        state.language = nextLanguage;
        if (state.respondent) {
          const nextConsent = getConsentItems(state.language, state.respondent);
          state.consent = nextConsent.map((_, i) => Boolean(state.consent[i]));
          const nextSharing = createEmptySharingConsent(
            state.language,
            state.respondent,
            state.lifeContext
          );
          state.sharingConsent = Object.fromEntries(
            Object.keys(nextSharing).map((id) => [id, Boolean(state.sharingConsent?.[id])])
          );
        }
      }
      document.documentElement.lang = state.language;
      state.error = null;
      saveSensoryDraft();
      render();
      return;
    }

    const respondentBtn = e.target.closest("[data-respondent]");
    if (respondentBtn) {
      const nextRespondent = respondentBtn.dataset.respondent;
      if (state.respondent !== nextRespondent) {
        state.respondent = nextRespondent;
        state.lifeContext = nextRespondent === "teen" ? "homeSchool" : null;
        if (nextRespondent === "couple") {
          state.couplePartner = null;
          state.coupleShowMerge = false;
          state.coupleHubNotice = null;
          ensureCoupleSession();
        } else {
          state.coupleId = null;
          state.couplePartner = null;
          state.coupleShowMerge = false;
          state.coupleHubNotice = null;
        }
        state.consent = getConsentItems(state.language, nextRespondent).map(() => false);
        state.sharingConsent = createEmptySharingConsent(
          state.language,
          nextRespondent,
          state.lifeContext
        );
        state.demographics = { name: "", age: "", email: "", occupation: "", parentName: "", partnerName: "" };
        state.completedAt = null;
        state.answers = emptyAnswers();
        state.idealSaturday = "";
        state.coupleWork = emptyCoupleWork();
        state.contactPreference = null;
        state.showWorkReport = false;
        state.workReportDeclined = false;
        state.workReport = { name: "", jobTitle: "", reasonForReferral: "", additionalNotes: "" };
        state.schoolReportVisual = "balance";
        state.schoolReportNotesEnabled = false;
        resetSettingReportComposer();
      }
      state.error = null;
      moveStep(1);
      state.view = "questionnaire";
      saveSensoryDraft();
      render({ scrollToTop: true });
      return;
    }

    const coupleWorkBtn = e.target.closest("[data-couple-work-field]");
    if (coupleWorkBtn) {
      const field = coupleWorkBtn.dataset.coupleWorkField;
      const value = coupleWorkBtn.dataset.coupleWorkValue;
      const work = ensureCoupleWorkState();
      if (field && value && Object.prototype.hasOwnProperty.call(work, field)) {
        if (field === "endOfDay") {
          const current = normalizeCoupleWorkEndOfDay(work.endOfDay);
          work.endOfDay = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];
        } else if (field === "rechargeAfterWork") {
          const current = normalizeCoupleWorkRecharge(work.rechargeAfterWork);
          work.rechargeAfterWork = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];
          if (!work.rechargeAfterWork.includes("other")) {
            work.rechargeAfterWorkOther = "";
          }
        } else {
          work[field] = value;
        }
        if (field === "employment" && value === "doesNotWork") {
          work.workLocation = null;
          work.workLocationOther = "";
          work.workWith = null;
          work.workWithOther = "";
          work.workingHours = "";
          work.endOfDay = [];
          work.rechargeAfterWork = [];
          work.rechargeAfterWorkOther = "";
          work.rechargingSaturday = "";
        }
        state.error = null;
        saveSensoryDraft();
        render();
      }
      return;
    }

    const lifeContextBtn = e.target.closest("[data-life-context]");
    if (lifeContextBtn) {
      const nextContext = lifeContextBtn.dataset.lifeContext;
      if (state.lifeContext !== nextContext) {
        state.lifeContext = nextContext;
        const nextSharing = createEmptySharingConsent(
          state.language,
          state.respondent,
          state.lifeContext
        );
        state.sharingConsent = Object.fromEntries(
          Object.keys(nextSharing).map((id) => [id, Boolean(state.sharingConsent?.[id])])
        );
      }
      state.showWorkReport = false;
      state.workReportDeclined = false;
      state.schoolReportVisual = "balance";
      state.schoolReportNotesEnabled = false;
      resetSettingReportComposer();
      state.error = null;
      updateChoiceSelection(lifeContextBtn, "data-life-context");
      saveSensoryDraft();
      return;
    }

    const painScaleBtn = e.target.closest("[data-pain-value]");
    if (painScaleBtn) {
      const catId = painScaleBtn.dataset.painCat;
      const qIndex = Number(painScaleBtn.dataset.painQ);
      const value = Number(painScaleBtn.dataset.painValue);
      ensurePainAnswers();
      state.painAnswers[catId][qIndex] = value;
      state.error = null;

      const scale = painScaleBtn.closest(".pain-scale");
      if (scale) {
        scale.querySelectorAll(".pain-scale__btn").forEach((button) => {
          const selected = button === painScaleBtn;
          button.classList.toggle("selected", selected);
          button.setAttribute("aria-pressed", String(selected));
        });
      }

      const category = getPainCategory(catId);
      const answers = state.painAnswers[catId] || [];
      const answeredCount = answers.filter((answer) => typeof answer === "number").length;
      const total = category?.questions.length || 0;
      const progress = app.querySelector(".pain-screen__progress");
      if (progress && total) {
        const fill = progress.querySelector(".question-progress__fill");
        const text = progress.querySelector(".question-progress__text");
        if (fill) fill.style.width = `${Math.round((answeredCount / total) * 100)}%`;
        if (text) text.textContent = `${answeredCount} of ${total} answered`;
      }
      return;
    }

    const answerBtn = e.target.closest("[data-answer]");
    if (answerBtn) {
      const { domain, q, answer } = answerBtn.dataset;
      state.answers[domain][Number(q)] = answer === "yes";
      state.error = null;
      updateAnswerSelection(answerBtn);
      saveSensoryDraft();
      return;
    }

    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    // Prefer attribute read for SVG nodes (more reliable than dataset in some browsers)
    const action = btn.getAttribute("data-action") || btn.dataset.action;

    if (action === "start-sensory") {
      if (inviteNeedsAccount()) {
        beginInviteAccountGate();
        render({ scrollToTop: true });
        return;
      }
      if (currentAssignedPatient()) {
        startAssignedQuestionnaire();
        render({ scrollToTop: true });
        return;
      }
      state.view = "sensory";
      state.sensoryArea = null;
      state.error = null;
      render({ scrollToTop: true });
      return;
    }

    if (action === "start-assigned-questionnaire") {
      startAssignedQuestionnaire();
      render({ scrollToTop: true });
      return;
    }

    if (action === "start-questionnaire") {
      if (inviteNeedsAccount()) {
        beginInviteAccountGate();
        render({ scrollToTop: true });
        return;
      }
      if (currentAssignedPatient()) {
        startAssignedQuestionnaire();
        render({ scrollToTop: true });
        return;
      }
      state.sensoryArea = btn.dataset.area || null;
      clearSensoryDraft();
      resetSensoryQuestionnaireProgress();
      render({ scrollToTop: true });
      return;
    }

    if (action === "dismiss-intro") {
      state.showIntroModal = false;
      render({ scrollToTop: true });
      return;
    }

    if (action === "resume-questionnaire") {
      if (inviteNeedsAccount()) {
        beginInviteAccountGate();
        render({ scrollToTop: true });
        return;
      }
      const draft = readSensoryDraft();
      if (!draft) {
        state.sensoryArea = null;
        resetSensoryQuestionnaireProgress();
        render({ scrollToTop: true });
        return;
      }
      applySensoryDraft(draft);
      render({ scrollToTop: true });
      return;
    }

    if (action === "start-pain") {
      state.view = "pain";
      state.painCategory = null;
      state.error = null;
      ensurePainAnswers();
      restorePainSelection();
      render({ scrollToTop: true });
      return;
    }

    if (action === "toggle-pain-area") {
      const categoryId = btn.getAttribute("data-pain-category") || btn.dataset.painCategory;
      if (!getPainCategory(categoryId)) return;
      e.preventDefault();
      togglePainSelection(categoryId);
      state.error = null;
      updatePainMapSelectionUI();
      return;
    }

    if (action === "start-pain-questionnaires") {
      if (!state.painSelected.length) {
        state.error = "Please select at least one area on the map before continuing.";
        render();
        return;
      }
      state.view = "pain-category";
      state.painCategory = state.painSelected[0];
      state.error = null;
      ensurePainAnswers();
      render({ scrollToTop: true });
      return;
    }

    if (action === "next-pain-category") {
      const categoryId = btn.dataset.painCategory;
      if (!getPainCategory(categoryId) || !state.painSelected.includes(categoryId)) return;
      state.view = "pain-category";
      state.painCategory = categoryId;
      state.error = null;
      ensurePainAnswers();
      render({ scrollToTop: true });
      return;
    }

    if (action === "back-pain-map") {
      state.view = "pain";
      state.painCategory = null;
      state.error = null;
      render({ scrollToTop: true });
      return;
    }

    if (action === "view-pain-summary") {
      state.view = "pain-summary";
      state.error = null;
      render({ scrollToTop: true });
      return;
    }

    if (action === "toggle-sensory-diet") {
      state.showSensoryDiet = !state.showSensoryDiet;
      render();
      if (state.showSensoryDiet) {
        const panel = app.querySelector("#sensory-diet-panel");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      return;
    }

    if (action === "print-work-report") {
      if (!canOfferSettingReport()) return;
      ensureWorkReportDefaults();
      const needsOpen = !state.showWorkReport;
      state.showWorkReport = true;
      state.workReportDeclined = false;
      if (needsOpen) render();
      document.body.classList.add("print-work-report");
      const cleanup = () => {
        document.body.classList.remove("print-work-report");
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
      requestAnimationFrame(() => {
        window.print();
        setTimeout(cleanup, 1000);
      });
      return;
    }

    if (action === "add-setting-heading") {
      if (!canOfferSettingReport() || !state.showWorkReport) return;
      ensureSettingReportComposerDefaults();
      state.settingReportCustomSections = [
        ...normalizeSettingReportCustomSections(state.settingReportCustomSections),
        { id: createSettingReportCustomId(), heading: "", body: "" },
      ];
      render();
      queueMicrotask(() => {
        const fields = app.querySelectorAll("[data-setting-custom='heading']");
        const last = fields[fields.length - 1];
        if (last) {
          last.focus();
          last.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
      return;
    }

    if (action === "remove-setting-heading") {
      if (!canOfferSettingReport() || !state.showWorkReport) return;
      const customId = btn.dataset.customSectionId;
      state.settingReportCustomSections = normalizeSettingReportCustomSections(
        state.settingReportCustomSections
      ).filter((item) => item.id !== customId);
      render();
      return;
    }

    if (action === "back-home") {
      saveSensoryDraft();
      clearInviteSession();
      state.viewingArchivedId = null;
      state.archiveReadOnly = false;
      state.reportViewMode = null;
      state.sampleReportPreview = false;
      state.view = "home";
      state.step = 0;
      state.showIntroModal = false;
      state.sensoryArea = null;
      state.painCategory = null;
      clearPainSelection();
      state.error = null;
      state.authError = null;
      state.authNotice = null;
      state.settingsError = null;
      state.settingsNotice = null;
      state.dashboardNotice = null;
      state.editingUserId = null;
      state.clinicianPinError = null;
      state.clinicianCopyStatus = null;
      // Drop invite query params so a refresh does not re-enter invite mode.
      if (window.history?.replaceState) {
        const clean = new URL(window.location.href);
        clean.searchParams.delete("invite");
        clean.searchParams.delete("results");
        clean.searchParams.delete("dashboard");
        clean.searchParams.delete("patients");
        window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
      }
      render({ scrollToTop: true });
      return;
    }

    if (action === "open-login") {
      if (isPatientInvite()) {
        beginInviteAccountGate();
        render({ scrollToTop: true });
        return;
      }
      resetAuthForm(state.authForm.role || "patient");
      state.view = "login";
      state.authMode = "login";
      clearAuthResetParams();
      render({ scrollToTop: true });
      return;
    }

    if (action === "open-forgot") {
      state.authError = null;
      state.authNotice = null;
      state.authForm.password = "";
      state.authForm.confirmPassword = "";
      state.view = "forgot";
      render({ scrollToTop: true });
      return;
    }

    if (action === "open-signup") {
      resetAuthForm("patient");
      state.view = "signup";
      state.authMode = "signup";
      render({ scrollToTop: true });
      return;
    }

    if (action === "open-account") {
      if (!currentAuthUser()) {
        resetAuthForm();
        state.view = "login";
      } else {
        state.view = "account";
      }
      render({ scrollToTop: true });
      return;
    }

    if (action === "open-settings") {
      const user = currentAuthUser();
      if (!user || user.role !== "admin") {
        state.authError = "Admin access required.";
        state.view = "login";
      } else {
        state.view = "settings";
        state.settingsTab = "overview";
        state.settingsError = null;
        state.settingsNotice = null;
      }
      render({ scrollToTop: true });
      return;
    }

    if (action === "open-clinician" || action === "open-create-patient") {
      openCreatePatientView();
      render({ scrollToTop: true });
      return;
    }

    if (action === "open-dashboard") {
      saveSensoryDraft();
      state.view = "dashboard";
      state.dashboardTab = "register";
      state.dashboardNotice = null;
      state.clinicianPinError = null;
      if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
        state.clinicianUnlocked = true;
      } else {
        state.clinicianUnlocked = sessionStorage.getItem(CLINICIAN_SESSION_KEY) === "1";
      }
      maybeNotifyExpiringQuestionnaires();
      render({ scrollToTop: true });
      return;
    }

    if (action === "open-preferences") {
      saveSensoryDraft();
      state.view = "dashboard";
      state.dashboardTab = "preferences";
      state.dashboardNotice = null;
      state.prefsNotice = null;
      state.clinicianPinError = null;
      if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
        state.clinicianUnlocked = true;
      } else {
        state.clinicianUnlocked = sessionStorage.getItem(CLINICIAN_SESSION_KEY) === "1";
      }
      render({ scrollToTop: true });
      return;
    }

    if (action === "back-dashboard") {
      exitArchivedReport();
      render({ scrollToTop: true });
      return;
    }

    if (action === "couple-start") {
      const partner = btn.dataset.partner;
      if (!COUPLE_PARTNERS.includes(partner)) return;
      ensureCoupleSession();
      startCouplePartnerQuestionnaire(partner);
      saveSensoryDraft();
      render({ scrollToTop: true });
      return;
    }

    if (action === "couple-copy-link") {
      const partner = btn.dataset.partner;
      if (!COUPLE_PARTNERS.includes(partner)) return;
      const session = ensureCoupleSession();
      const url = buildCouplePartnerUrl(session.id, partner);
      const copy = currentUi();
      const notice =
        state.couplePartner && partner !== state.couplePartner
          ? copy.couplePartnerLinkCopied
          : copy.coupleLinkCopied;
      const done = () => {
        state.coupleHubNotice = notice;
        render();
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(() => {
          window.prompt(copy.coupleCopyLink, url);
          done();
        });
      } else {
        window.prompt(copy.coupleCopyLink, url);
        done();
      }
      return;
    }

    if (action === "couple-export") {
      const partner = btn.dataset.partner || state.couplePartner;
      if (!COUPLE_PARTNERS.includes(partner)) return;
      ensureCoupleSession();
      if (isCouplePathway() && state.couplePartner === partner && STEPS[state.step]?.type === "results") {
        persistCurrentPartnerToCoupleSession(state.viewingArchivedId);
      }
      const code = encodeCoupleCompletionPackage(state.coupleId, partner);
      const copy = currentUi();
      if (!code) {
        state.coupleHubNotice = copy.coupleImportBad;
        openCoupleHub();
        render({ scrollToTop: true });
        return;
      }
      const done = () => {
        state.coupleHubNotice = copy.coupleExportCopied;
        if (STEPS[state.step]?.type === "coupleHub") render();
        else render();
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(() => {
          window.prompt(copy.coupleExport, code);
          done();
        });
      } else {
        window.prompt(copy.coupleExport, code);
        done();
      }
      return;
    }

    if (action === "couple-import") {
      const copy = currentUi();
      const payload = decodeCoupleCompletionPackage(state.coupleImportText);
      if (!payload) {
        state.coupleHubNotice = copy.coupleImportBad;
        render();
        return;
      }
      const result = applyCoupleCompletionPackage(payload);
      if (!result.ok) {
        state.coupleHubNotice =
          result.reason === "mismatch" ? copy.coupleImportMismatch : copy.coupleImportBad;
        render();
        return;
      }
      state.coupleImportText = "";
      state.coupleHubNotice = copy.coupleImportOk;
      openCoupleHub({ coupleId: result.session.id });
      render({ scrollToTop: true });
      return;
    }

    if (action === "couple-view-merge") {
      openCoupleHub({ showMerge: true });
      render({ scrollToTop: true });
      return;
    }

    if (action === "print-couple-report") {
      if (!bothCouplePartnersComplete()) return;
      if (!state.coupleShowMerge) {
        openCoupleHub({ showMerge: true });
        render({ scrollToTop: true });
        queueMicrotask(() => printCoupleCombinedReport());
        return;
      }
      printCoupleCombinedReport();
      return;
    }

    if (action === "couple-submit-combined" || action === "couple-retry-combined") {
      if (!canOfferCoupleCombinedSubmit()) return;
      ensureCoupleCombinedSubmitted({ force: action === "couple-retry-combined" });
      return;
    }

    if (action === "couple-back-hub") {
      openCoupleHub();
      render({ scrollToTop: true });
      return;
    }

    if (action === "preview-sample-report") {
      if (!isSampleReportPreviewEnabled()) return;
      const opened = openSampleReportPreview({
        respondent: btn.dataset.sampleRespondent || "adult",
        lifeContext: btn.dataset.sampleContext || null,
      });
      if (!opened) {
        state.dashboardNotice = "Sample report preview is not available.";
        state.view = "dashboard";
      }
      render({ scrollToTop: true });
      return;
    }

    if (action === "open-assessment" || action === "open-assessment-summary" || action === "open-assessment-short" || action === "download-assessment") {
      if (!canAccessTherapistDashboard()) {
        state.view = "dashboard";
        render({ scrollToTop: true });
        return;
      }
      const assessmentId = btn.dataset.assessmentId;
      const record = getAssessmentById(assessmentId);
      if (!record) {
        state.dashboardNotice = "That assessment could not be found.";
        state.view = "dashboard";
        render({ scrollToTop: true });
        return;
      }
      if (isIncompleteAssessment(record)) {
        applyIncompleteAssessmentRecord(record);
        render({ scrollToTop: true });
        return;
      }
      const reportLength =
        action === "open-assessment-short"
          ? REPORT_LENGTH.short
          : action === "open-assessment-summary"
            ? REPORT_LENGTH.summary
            : REPORT_LENGTH.full;
      applyAssessmentRecord(record, {
        viewMode: reportLength === REPORT_LENGTH.full ? RESULTS_ACCESS.full : RESULTS_ACCESS.basic,
        reportLength,
      });
      render({ scrollToTop: true });
      if (action === "download-assessment") {
        queueMicrotask(() => printSensoryResultsPacket());
      }
      return;
    }

    if (action === "continue-assessment") {
      if (!canAccessTherapistDashboard()) {
        state.view = "dashboard";
        render({ scrollToTop: true });
        return;
      }
      const assessmentId = btn.dataset.assessmentId;
      const coupleMatch = String(assessmentId || "").match(/^couple-progress-(.+)-([ab])$/);
      if (coupleMatch) {
        state.coupleId = coupleMatch[1];
        startCouplePartnerQuestionnaire(coupleMatch[2]);
        saveSensoryDraft();
        render({ scrollToTop: true });
        return;
      }
      const record = getAssessmentById(assessmentId);
      if (!record || !isIncompleteAssessment(record)) {
        state.dashboardNotice = "That incomplete questionnaire could not be found.";
        state.view = "dashboard";
        render({ scrollToTop: true });
        return;
      }
      applyIncompleteAssessmentRecord(record);
      render({ scrollToTop: true });
      return;
    }

    if (action === "switch-report-basic" || action === "switch-report-full") {
      if (!state.archiveReadOnly || !canAccessTherapistDashboard()) return;
      if (action === "switch-report-full") {
        state.reportViewMode = RESULTS_ACCESS.full;
        state.reportLengthMode = REPORT_LENGTH.full;
      } else {
        const length =
          readTherapistPrefs().reportLength === REPORT_LENGTH.summary
            ? REPORT_LENGTH.summary
            : REPORT_LENGTH.short;
        state.reportViewMode = RESULTS_ACCESS.basic;
        state.reportLengthMode = length;
        applyPreferredShortReportExtras(length);
      }
      state.patientResultsAccess = state.reportViewMode;
      render({ scrollToTop: true });
      return;
    }

    if (action === "delete-assessment") {
      if (!canAccessTherapistDashboard()) return;
      const assessmentId = btn.dataset.assessmentId;
      if (String(assessmentId || "").startsWith("couple-progress-")) {
        const confirmed = window.confirm("Remove this incomplete couple questionnaire from the dashboard on this device?");
        if (!confirmed) return;
        deleteCoupleProgressEntry(assessmentId);
        state.dashboardNotice = "Incomplete questionnaire removed from this device.";
        state.view = "dashboard";
        render({ scrollToTop: true });
        return;
      }
      const record = getAssessmentById(assessmentId);
      if (!record) return;
      const incomplete = isIncompleteAssessment(record);
      const label =
        record.summary?.patientName ||
        record.summary?.completerName ||
        (incomplete ? "this incomplete questionnaire" : "this assessment");
      const confirmed = window.confirm(
        incomplete
          ? `Remove ${label} from the dashboard on this device? They can start again later.`
          : `Remove ${label} from the dashboard on this device?`
      );
      if (!confirmed) return;
      deleteAssessmentById(assessmentId);
      state.dashboardNotice = incomplete
        ? "Incomplete questionnaire removed from this device."
        : "Assessment removed from this device.";
      state.view = "dashboard";
      render({ scrollToTop: true });
      return;
    }

    if (action === "logout") {
      handleLogout();
      render({ scrollToTop: true });
      return;
    }

    if (action === "dashboard-tab") {
      const tab = btn.dataset.tab;
      state.dashboardTab =
        tab === "preferences" ? "preferences" : tab === "create" ? "create" : "register";
      state.prefsNotice = null;
      state.dashboardNotice = null;
      if (tab === "create") {
        state.patientFormError = null;
      } else {
        state.clinicianCopyStatus = null;
      }
      render({ scrollToTop: true });
      return;
    }

    if (action === "create-another-patient") {
      resetPatientForm();
      state.createdPatient = null;
      state.dashboardTab = "create";
      state.clinicianCopyStatus = null;
      state.patientSendStatus = null;
      state.patientSendError = null;
      render({ scrollToTop: true });
      return;
    }

    if (action === "send-patient-email" || action === "send-patient-email-again") {
      const details = resolvePatientInviteDetails(btn);
      const fromDashboard = Boolean(btn.dataset.assessmentId) && state.dashboardTab === "register";
      handleSendPatientInviteEmail(details, { fromDashboard });
      return;
    }

    if (action === "send-patient-whatsapp") {
      const details = resolvePatientInviteDetails(btn);
      const url = details ? patientInviteWhatsAppUrl(details) : "";
      if (!url) {
        e.preventDefault();
        state.dashboardNotice = "Add a contact number to send on WhatsApp.";
        render();
        return;
      }
      if (btn.tagName !== "A") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      return;
    }

    if (action === "copy-created-patient" || action === "copy-created-patient-link") {
      const details = state.createdPatient;
      if (!details) return;
      const text =
        action === "copy-created-patient-link"
          ? details.inviteUrl
          : patientCredentialsText(details);
      const done = () => {
        state.clinicianCopyStatus = "copied";
        state.dashboardNotice = action === "copy-created-patient-link" ? "Invite link copied." : "Sign-in details copied.";
        render();
        setTimeout(() => {
          if (state.clinicianCopyStatus === "copied") {
            state.clinicianCopyStatus = null;
            if (state.view === "dashboard") render();
          }
        }, 1800);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => done());
      } else {
        done();
      }
      return;
    }

    if (action === "copy-patient-invite" || action === "view-patient-details") {
      const assessmentId = btn.dataset.assessmentId;
      const record = getAssessmentById(assessmentId);
      if (!record) return;
      const patient =
        typeof Auth !== "undefined"
          ? Auth.listUsers().find((u) => u.id === record.patientUserId || (u.email && u.email === (record.summary?.email || record.demographics?.email)))
          : null;
      if (!patient) {
        state.dashboardNotice = "This patient account is not on this device.";
        render();
        return;
      }
      const details = patientCredentialsPayload(patient, patient.temporaryPassword, buildAssignedPatientInviteUrl(patient));
      if (action === "copy-patient-invite") {
        const text = details.inviteUrl;
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            state.dashboardNotice = "Invite link copied.";
            render();
          });
        } else {
          state.dashboardNotice = "Invite link ready on the Add patient tab.";
          state.createdPatient = details;
          state.dashboardTab = "create";
          render({ scrollToTop: true });
        }
        return;
      }
      state.createdPatient = details;
      state.dashboardTab = "create";
      render({ scrollToTop: true });
      return;
    }

    if (action === "reset-patient-password") {
      const userId = btn.dataset.userId;
      if (!userId || typeof Auth === "undefined" || !Auth.resetPatientPassword) return;
      Auth.resetPatientPassword(userId).then((result) => {
        if (!result.ok) {
          state.patientFormError = result.error;
          render();
          return;
        }
        state.createdPatient = patientCredentialsPayload(
          result.user,
          result.password,
          buildAssignedPatientInviteUrl(result.user)
        );
        state.dashboardTab = "create";
        state.patientSendStatus = null;
        state.patientSendError = null;
        state.dashboardNotice = "A new password is ready. Send email (default) or WhatsApp it to the patient.";
        render({ scrollToTop: true });
      });
      return;
    }

    if (action === "settings-tab") {
      const tab = btn.dataset.tab;
      state.settingsTab = tab === "settings" || tab === "users" || tab === "overview" ? tab : "overview";
      state.settingsNotice = null;
      state.settingsError = null;
      render();
      return;
    }

    if (action === "settings-filter") {
      state.settingsFilter = btn.dataset.filter || "all";
      render();
      return;
    }

    if (action === "edit-user") {
      state.editingUserId = btn.dataset.userId || null;
      state.settingsError = null;
      render();
      return;
    }

    if (action === "cancel-edit-user") {
      state.editingUserId = null;
      render();
      return;
    }

    if (action === "approve-user") {
      const result = Auth.updateUserById(btn.dataset.userId, { status: "active" });
      if (!result.ok) {
        state.settingsError = result.error;
      } else {
        state.settingsNotice = `${result.user.name} approved.`;
        state.settingsError = null;
      }
      render();
      return;
    }

    if (action === "delete-user") {
      const userId = btn.dataset.userId;
      const target = Auth.listUsers().find((u) => u.id === userId);
      if (!target) return;
      const confirmed = window.confirm(`Delete account for ${target.name} (${target.email})?`);
      if (!confirmed) return;
      const result = Auth.deleteUserById(userId);
      if (!result.ok) {
        state.settingsError = result.error;
      } else {
        state.settingsNotice = "User deleted.";
        state.editingUserId = null;
      }
      render();
      return;
    }

    if (action === "clinician-unlock") {
      const input = app.querySelector("[data-clinician-pin]");
      const pin = (input?.value || state.clinicianPinInput || "").trim();
      state.clinicianPinInput = pin;
      if (pin === CLINICIAN_PIN) {
        state.clinicianUnlocked = true;
        state.clinicianPinError = null;
        sessionStorage.setItem(CLINICIAN_SESSION_KEY, "1");
        initTherapistPrefs();
        // PIN unlock from the dashboard gate should land on the dashboard.
        if (state.view === "dashboard" || state.view === "home" || state.view === "login") {
          state.view = "dashboard";
        }
      } else {
        state.clinicianPinError = "Incorrect PIN. Check clinicianPin in config.js (default: soulfulot).";
      }
      render({ scrollToTop: true });
      return;
    }

    if (action === "copy-invite") {
      const link = buildPatientInviteUrl(
        state.clinicianDraftVisibility || state.clinicianDraftResultsAccess
      );
      const done = () => {
        state.clinicianCopyStatus = "copied";
        render();
        setTimeout(() => {
          if (state.clinicianCopyStatus === "copied") {
            state.clinicianCopyStatus = null;
            if (state.view === "clinician") render();
          }
        }, 1800);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(link).then(done).catch(() => {
          const field = app.querySelector("[data-invite-link]");
          if (field) {
            field.focus();
            field.select();
          }
        });
      } else {
        const field = app.querySelector("[data-invite-link]");
        if (field) {
          field.focus();
          field.select();
          try {
            document.execCommand("copy");
            done();
          } catch (_) {
            /* ignore */
          }
        }
      }
      return;
    }

    if (action === "retry-submit") {
      ensureResultsSubmitted({ force: true });
      render();
      return;
    }

    if (action === "next") {
      if (!validateStep()) {
        render();
        const errorBanner = app.querySelector(".error-banner");
        if (errorBanner) {
          errorBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        return;
      }
      moveStep(1);
      state.view = "questionnaire";
      if (STEPS[state.step]?.type === "results") {
        clearSensoryDraft();
      } else {
        saveSensoryDraft();
      }
      try {
        render({ scrollToTop: true });
      } catch (err) {
        console.error("Failed to open results:", err);
        state.step = Math.max(0, state.step - 1);
        state.error =
          state.language === "af"
            ? "Die resultate kon nie oopgemaak word nie. Probeer asseblief weer, of herlaai die bladsy."
            : "Results could not be opened. Please try again, or refresh the page.";
        saveSensoryDraft();
        render();
        const errorBanner = app.querySelector(".error-banner");
        if (errorBanner) {
          errorBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
      return;
    }

    if (action === "back") {
      state.error = null;
      moveStep(-1);
      if (STEPS[state.step]?.type === "coupleHub") {
        state.couplePartner = null;
        state.coupleShowMerge = false;
      }
      if (state.step === 0) {
        state.view = "sensory";
        state.showIntroModal = false;
        saveSensoryDraft();
      } else {
        state.view = "questionnaire";
        saveSensoryDraft();
      }
      render({ scrollToTop: true });
      return;
    }

    if (action === "print") {
      printSensoryResultsPacket();
    }
  });

  app.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.showIntroModal) {
      e.preventDefault();
      state.showIntroModal = false;
      render({ scrollToTop: true });
      return;
    }

    if (e.key === "Enter" && e.target.matches?.("[data-clinician-pin]")) {
      e.preventDefault();
      const unlock = app.querySelector("[data-action='clinician-unlock']");
      if (unlock) unlock.click();
      return;
    }

    if (e.key !== "Enter" && e.key !== " ") return;
    const node = e.target.closest("[data-pain-category][data-action='toggle-pain-area']");
    if (!node) return;
    e.preventDefault();
    node.click();
  });

  app.addEventListener("change", (e) => {
    if (e.target.matches("[data-dash-row-action]")) {
      const select = e.target;
      const action = select.value;
      if (!action) return;
      const assessmentId = select.dataset.assessmentId || "";
      select.value = "";
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.hidden = true;
      trigger.setAttribute("data-action", action);
      if (assessmentId) trigger.setAttribute("data-assessment-id", assessmentId);
      select.insertAdjacentElement("afterend", trigger);
      trigger.click();
      trigger.remove();
      return;
    }

    if (e.target.matches('[data-auth-field="role"]')) {
      state.authForm.role = e.target.value === "therapist" ? "therapist" : "patient";
      state.authError = null;
      render();
      return;
    }

    if (e.target.matches("[data-consent]")) {
      const index = Number(e.target.dataset.consent);
      const consentItems = getConsentItems(state.language, state.respondent || "adult");
      const next = consentItems.map((_, i) =>
        i === index ? e.target.checked : Boolean(state.consent[i])
      );
      state.consent = next;
      state.error = null;
      saveSensoryDraft();
      const nextBtn = app.querySelector('[data-action="next"]');
      const disclaimers = app.querySelectorAll("[data-consent-disclaimer]");
      const canContinue = hasAllRequiredConsent();
      if (nextBtn) {
        nextBtn.disabled = !canContinue;
        nextBtn.setAttribute("aria-disabled", canContinue ? "false" : "true");
        nextBtn.title = canContinue ? "" : currentUi().requiredConsent;
      }
      disclaimers.forEach((disclaimer) => {
        disclaimer.hidden = canContinue;
      });
      const errorBanner = app.querySelector(".error-banner");
      if (errorBanner && canContinue) errorBanner.remove();
      return;
    }

    if (e.target.matches("[data-sharing]")) {
      const id = e.target.dataset.sharing;
      state.sharingConsent = { ...state.sharingConsent, [id]: e.target.checked };
      state.error = null;
      saveSensoryDraft();
      const nextBtn = app.querySelector('[data-action="next"]');
      const disclaimers = app.querySelectorAll("[data-consent-disclaimer]");
      const canContinue = hasAllRequiredConsent();
      if (nextBtn) {
        nextBtn.disabled = !canContinue;
        nextBtn.setAttribute("aria-disabled", canContinue ? "false" : "true");
        nextBtn.title = canContinue ? "" : currentUi().requiredConsent;
      }
      disclaimers.forEach((disclaimer) => {
        disclaimer.hidden = canContinue;
      });
      const errorBanner = app.querySelector(".error-banner");
      if (errorBanner && canContinue) errorBanner.remove();
      return;
    }

    if (e.target.matches("[data-demo]")) {
      state.demographics[e.target.dataset.demo] = e.target.value;
      state.error = null;
      saveSensoryDraft();
    }

    if (e.target.matches("[data-couple-work-text]")) {
      const field = e.target.dataset.coupleWorkText;
      const work = ensureCoupleWorkState();
      if (field && Object.prototype.hasOwnProperty.call(work, field)) {
        work[field] = e.target.value;
        state.error = null;
        saveSensoryDraft();
      }
    }

    if (e.target.matches("[data-ideal-saturday]")) {
      state.idealSaturday = e.target.value;
      state.error = null;
      saveSensoryDraft();
    }

    if (e.target.matches("[data-invite-results]")) {
      syncInviteDraftFromVisibility(e.target.value);
      state.clinicianCopyStatus = null;
      render();
      return;
    }

    if (e.target.name === "patient-questionnaire-type") {
      if (!state.patientForm) state.patientForm = emptyPatientForm();
      state.patientForm.questionnaireType = e.target.value;
      state.patientFormError = null;
      render();
      return;
    }

    if (e.target.name === "pref-report-length") {
      writeTherapistPrefs({ reportLength: e.target.value });
      state.prefsNotice = "Default report length saved.";
      render();
      return;
    }

    if (e.target.name === "pref-report-visibility") {
      writeTherapistPrefs({ reportVisibility: e.target.value });
      state.prefsNotice = "Default report visibility saved.";
      render();
      return;
    }

    if (e.target.matches("[data-pref-notify]")) {
      const key = e.target.getAttribute("data-pref-notify");
      const allowed = ["completed", "incomplete", "expiring", "downloaded", "followUp"];
      if (!allowed.includes(key)) return;
      writeTherapistPrefs({ notifications: { [key]: Boolean(e.target.checked) } });
      state.prefsNotice = "Notification preferences saved.";
      render();
      return;
    }

    if (e.target.matches("[data-short-section]")) {
      if (!isShortReportDashboardPreview()) return;
      const key = e.target.getAttribute("data-short-section");
      if (!Object.prototype.hasOwnProperty.call(DEFAULT_SHORT_REPORT_SECTIONS, key)) return;
      const sections = readShortReportSections();
      sections[key] = Boolean(e.target.checked);
      writeShortReportSections(sections);
      render();
      return;
    }

    if (e.target.matches("[data-setting-section]")) {
      if (!canOfferSettingReport() || !state.showWorkReport) return;
      ensureSettingReportComposerDefaults();
      const key = e.target.getAttribute("data-setting-section");
      const defaults = defaultSettingReportSections();
      if (!Object.prototype.hasOwnProperty.call(defaults, key)) return;
      state.settingReportSections = {
        ...getSettingReportSections(),
        [key]: Boolean(e.target.checked),
      };
      if (key === "notes" && !e.target.checked) {
        state.schoolReportNotesEnabled = false;
      }
      render();
      return;
    }

    if (e.target.name === "contact") {
      const previous = state.contactPreference;
      state.contactPreference = e.target.value;
      persistContactPreferenceToArchive();
      saveSensoryDraft();
      if (e.target.value === "yes" && previous !== "yes") {
        notifyFollowUpRequested();
      }
    }

    if (e.target.name === "work-report") {
      const wantsReport = e.target.value === "yes";
      state.showWorkReport = wantsReport;
      state.workReportDeclined = !wantsReport;
      if (wantsReport) ensureWorkReportDefaults();
      render();
      if (wantsReport) {
        const panel = app.querySelector("#work-report-panel");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }

    if (e.target.name === "school-report-visual") {
      state.schoolReportVisual = e.target.value;
      render();
      const visual = app.querySelector(".work-report-doc__visual");
      if (visual) visual.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    if (e.target.name === "school-report-notes") {
      state.schoolReportNotesEnabled = e.target.value === "yes";
      render();
      if (state.schoolReportNotesEnabled) {
        const notesField = app.querySelector('[data-work-report="additionalNotes"]');
        if (notesField) {
          notesField.focus();
          notesField.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }
  });

  app.addEventListener("input", (e) => {
    if (e.target.matches("[data-clinician-pin]")) {
      state.clinicianPinInput = e.target.value;
      return;
    }

    if (e.target.matches("[data-dashboard-search]")) {
      state.dashboardSearch = e.target.value;
      clearTimeout(state._dashboardSearchTimer);
      state._dashboardSearchTimer = setTimeout(() => {
        render();
        const search = app.querySelector("[data-dashboard-search]");
        if (search) {
          search.focus();
          const len = search.value.length;
          try {
            search.setSelectionRange(len, len);
          } catch (_) {
            /* ignore */
          }
        }
      }, 180);
      return;
    }

    if (e.target.matches("[data-auth-field]")) {
      const key = e.target.dataset.authField;
      if (key in state.authForm) {
        state.authForm[key] = e.target.value;
        state.authError = null;
      }
      return;
    }

    if (e.target.matches("[data-patient-field]")) {
      const key = e.target.dataset.patientField;
      if (!state.patientForm) state.patientForm = emptyPatientForm();
      if (key in state.patientForm) {
        state.patientForm[key] = e.target.value;
        state.patientFormError = null;
      }
      return;
    }

    if (e.target.matches("[data-settings-search]")) {
      state.settingsSearch = e.target.value;
      clearTimeout(state._settingsSearchTimer);
      state._settingsSearchTimer = setTimeout(() => {
        render();
        const search = app.querySelector("[data-settings-search]");
        if (search) {
          search.focus();
          const len = search.value.length;
          try {
            search.setSelectionRange(len, len);
          } catch (_) {
            /* ignore */
          }
        }
      }, 180);
      return;
    }

    if (e.target.matches("[data-demo]")) {
      state.demographics[e.target.dataset.demo] = e.target.value;
      state.error = null;
      saveSensoryDraft();
      return;
    }

    if (e.target.matches("[data-couple-name]")) {
      const partner = e.target.dataset.coupleName;
      if (!COUPLE_PARTNERS.includes(partner)) return;
      const session = ensureCoupleSession();
      session.partners[partner].label = e.target.value;
      saveCoupleSession(session);
      return;
    }

    if (e.target.matches("[data-couple-import]")) {
      state.coupleImportText = e.target.value;
      return;
    }

    if (e.target.matches("[data-couple-work-text]")) {
      const field = e.target.dataset.coupleWorkText;
      const work = ensureCoupleWorkState();
      if (field && Object.prototype.hasOwnProperty.call(work, field)) {
        work[field] = e.target.value;
        state.error = null;
        saveSensoryDraft();
      }
      return;
    }

    if (e.target.matches("[data-ideal-saturday]")) {
      state.idealSaturday = e.target.value;
      state.error = null;
      saveSensoryDraft();
      return;
    }

    if (e.target.matches("[data-setting-custom]")) {
      const customId = e.target.getAttribute("data-custom-section-id");
      const fieldKey = e.target.getAttribute("data-setting-custom");
      if (!customId || (fieldKey !== "heading" && fieldKey !== "body")) return;
      ensureSettingReportComposerDefaults();
      state.settingReportCustomSections = normalizeSettingReportCustomSections(
        state.settingReportCustomSections
      ).map((item) =>
        item.id === customId ? { ...item, [fieldKey]: e.target.value } : item
      );
      refreshSettingReportCustomPreview(customId);
      return;
    }

    const field = e.target.closest("[data-work-report]");
    if (!field) return;
    const key = field.dataset.workReport;
    if (!(key in state.workReport)) return;
    state.workReport[key] = field.value;
    refreshWorkReportPreview();
  });

  app.addEventListener("submit", async (e) => {
    const patientForm = e.target.closest("[data-patient-form]");
    if (patientForm) {
      e.preventDefault();
      if (typeof Auth === "undefined" || !Auth.createPatientAccount) return;
      const formData = new FormData(patientForm);
      state.patientForm = {
        firstName: String(formData.get("firstName") || ""),
        surname: String(formData.get("surname") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        age: String(formData.get("age") || ""),
        questionnaireType: String(formData.get("patient-questionnaire-type") || state.patientForm.questionnaireType || "adult-home"),
        reasonForReferral: String(formData.get("reasonForReferral") || ""),
      };
      state.patientFormBusy = true;
      state.patientFormError = null;
      render();
      const visibility = readTherapistPrefs().reportVisibility;
      const result = await Auth.createPatientAccount({
        ...state.patientForm,
        createdByUserId: currentAuthUser()?.id || null,
        reportVisibility: visibility,
        expiryDays: QUESTIONNAIRE_EXPIRY_DAYS,
      });
      state.patientFormBusy = false;
      if (!result.ok) {
        state.patientFormError = result.error;
        render({ scrollToTop: true });
        return;
      }
      createAssignedAssessment(result.user);
      state.createdPatient = patientCredentialsPayload(
        result.user,
        result.password,
        buildAssignedPatientInviteUrl(result.user)
      );
      state.dashboardTab = "create";
      state.patientSendStatus = null;
      state.patientSendError = null;
      state.dashboardNotice = `${assignedPatientFullName(result.user)} can now sign in. This questionnaire expires in ${QUESTIONNAIRE_EXPIRY_DAYS} days.`;
      resetPatientForm();
      render({ scrollToTop: true });
      await deliverPatientInviteEmail(state.createdPatient);
      return;
    }

    const loginForm = e.target.closest('[data-auth-form="login"]');
    if (loginForm) {
      e.preventDefault();
      const formData = new FormData(loginForm);
      state.authForm.email = String(formData.get("email") || "");
      state.authForm.password = String(formData.get("password") || "");
      state.authBusy = true;
      state.authError = null;
      state.authNotice = null;
      render();
      const result = await Auth.loginUser({
        email: state.authForm.email,
        password: state.authForm.password,
      });
      state.authBusy = false;
      if (!result.ok) {
        state.authError = result.error;
        render({ scrollToTop: true });
        return;
      }
      state.authForm.password = "";
      state.authForm.confirmPassword = "";
      routeAfterAuth(result.user);
      render({ scrollToTop: true });
      return;
    }

    const forgotForm = e.target.closest('[data-auth-form="forgot"]');
    if (forgotForm) {
      e.preventDefault();
      const formData = new FormData(forgotForm);
      state.authForm.email = String(formData.get("email") || "");
      state.authBusy = true;
      state.authError = null;
      state.authNotice = null;
      render();
      const result = await Auth.requestPasswordReset({ email: state.authForm.email });
      if (!result.ok) {
        state.authBusy = false;
        state.authError = result.error;
        render({ scrollToTop: true });
        return;
      }
      if (result.sent && result.token) {
        try {
          await sendPasswordResetEmail({
            email: result.email,
            name: result.name,
            token: result.token,
          });
        } catch (err) {
          state.authBusy = false;
          const classified = classifyDeliveryError(err, "Could not send the reset email");
          if (classified.code === "formsubmit-activation") {
            state.authNotice =
              "Check that inbox for a one-time FormSubmit confirmation email and click Confirm, then request the reset link again.";
            state.authError = null;
          } else {
            state.authError = classified.message;
          }
          render({ scrollToTop: true });
          return;
        }
      }
      state.authBusy = false;
      state.authNotice =
        "If that email belongs to a therapist or admin account, a reset link is on its way. It expires in 24 hours.";
      render({ scrollToTop: true });
      return;
    }

    const resetForm = e.target.closest('[data-auth-form="reset"]');
    if (resetForm) {
      e.preventDefault();
      const formData = new FormData(resetForm);
      state.authForm.password = String(formData.get("password") || "");
      state.authForm.confirmPassword = String(formData.get("confirmPassword") || "");
      if (state.authForm.password !== state.authForm.confirmPassword) {
        state.authError = "Passwords do not match.";
        render();
        return;
      }
      state.authBusy = true;
      state.authError = null;
      state.authNotice = null;
      render();
      const result = await Auth.completePasswordReset({
        token: state.resetToken,
        password: state.authForm.password,
      });
      state.authBusy = false;
      if (!result.ok) {
        state.authError = result.error;
        render({ scrollToTop: true });
        return;
      }
      state.authForm.password = "";
      state.authForm.confirmPassword = "";
      state.authNotice = "Your password has been updated. Sign in with your new password.";
      state.view = "login";
      clearAuthResetParams();
      render({ scrollToTop: true });
      return;
    }

    const signupForm = e.target.closest('[data-auth-form="signup"]');
    if (signupForm) {
      e.preventDefault();
      const formData = new FormData(signupForm);
      state.authForm.name = String(formData.get("name") || "");
      state.authForm.email = String(formData.get("email") || "");
      state.authForm.phone = String(formData.get("phone") || "");
      state.authForm.password = String(formData.get("password") || "");
      state.authForm.confirmPassword = String(formData.get("confirmPassword") || "");
      const roleValue = isPatientInvite()
        ? "patient"
        : String(formData.get("auth-role") || state.authForm.role || "patient");
      state.authForm.role = roleValue === "therapist" ? "therapist" : "patient";
      if (state.authForm.password !== state.authForm.confirmPassword) {
        state.authError = "Passwords do not match.";
        render();
        return;
      }
      state.authBusy = true;
      state.authError = null;
      state.authNotice = null;
      render();
      const result = await Auth.registerUser({
        name: state.authForm.name,
        email: state.authForm.email,
        password: state.authForm.password,
        phone: state.authForm.phone,
        role: state.authForm.role,
      });
      state.authBusy = false;
      if (!result.ok) {
        state.authError = result.error;
        render({ scrollToTop: true });
        return;
      }
      state.authForm.password = "";
      state.authForm.confirmPassword = "";
      if (result.pending) {
        state.authNotice =
          "Therapist account created. An admin must approve it before you can sign in.";
        state.view = "login";
        render({ scrollToTop: true });
        return;
      }
      routeAfterAuth(result.user);
      render({ scrollToTop: true });
      return;
    }

    const editForm = e.target.closest("[data-edit-user]");
    if (editForm) {
      e.preventDefault();
      const userId = editForm.getAttribute("data-edit-user");
      const formData = new FormData(editForm);
      const result = Auth.updateUserById(userId, {
        name: String(formData.get("name") || ""),
        phone: String(formData.get("phone") || ""),
        role: String(formData.get("role") || "patient"),
        status: String(formData.get("status") || "active"),
        notes: String(formData.get("notes") || ""),
      });
      if (!result.ok) {
        state.settingsError = result.error;
      } else {
        state.settingsNotice = `Updated ${result.user.name}.`;
        state.settingsError = null;
        state.editingUserId = null;
      }
      render();
      return;
    }

    const settingsForm = e.target.closest("[data-settings-form]");
    if (settingsForm) {
      e.preventDefault();
      const formData = new FormData(settingsForm);
      Auth.saveSettings({
        practiceName: String(formData.get("practiceName") || "").trim(),
        clinicianEmail: String(formData.get("clinicianEmail") || "").trim(),
        showPainPathway: formData.get("showPainPathway") === "on",
        allowPatientSignup: formData.get("allowPatientSignup") === "on",
        allowTherapistSignup: formData.get("allowTherapistSignup") === "on",
        requireTherapistApproval: formData.get("requireTherapistApproval") === "on",
      });
      state.settingsNotice = "Settings saved.";
      state.settingsError = null;
      render();
    }
  });
}

function refreshWorkReportPreview() {
  const doc = app.querySelector(".work-report-doc");
  if (!doc) return;
  const reportCopy = getSettingReportCopy();
  const name = state.workReport.name.trim() || reportCopy.notProvided;
  const job = state.workReport.jobTitle.trim() || reportCopy.notProvided;
  const reason = state.workReport.reasonForReferral.trim() || reportCopy.notProvided;
  const details = doc.querySelectorAll(".work-report-doc__details dd");
  if (details[0]) details[0].textContent = name;
  if (details[1]) details[1].textContent = job;
  if (details[2]) details[2].textContent = reason;
  const about = doc.querySelector('[data-work-report-text="about"]');
  const overload = doc.querySelector('[data-work-report-text="overload"]');
  const referral = doc.querySelector('[data-work-report-text="referral"]');
  if (about) about.textContent = fillReportTemplate(reportCopy.aboutBody, name);
  if (overload) overload.textContent = fillReportTemplate(reportCopy.overloadBody, name);
  if (referral) referral.textContent = fillReportTemplate(reportCopy.referralBody, name);
  const notes = doc.querySelector('[data-work-report-text="notes"]');
  if (notes) {
    const notesText = state.workReport.additionalNotes.trim();
    notes.textContent = notesText || reportCopy.notesEmpty;
    notes.classList.toggle("is-empty", !notesText);
  }
}

function refreshSettingReportCustomPreview(customId) {
  const doc = app.querySelector(".work-report-doc");
  if (!doc) return;
  const item = normalizeSettingReportCustomSections(state.settingReportCustomSections).find(
    (entry) => entry.id === customId
  );
  const safeId =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(customId)
      : String(customId).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  let section = doc.querySelector(`[data-custom-section-id="${safeId}"]`);
  if (!item || !(item.heading.trim() || item.body.trim())) {
    if (section) section.remove();
    return;
  }
  if (!section) {
    section = document.createElement("section");
    section.className = "work-report-doc__custom";
    section.setAttribute("data-custom-section-id", customId);
    section.innerHTML = `<h5 data-setting-custom-text="heading"></h5><p data-setting-custom-text="body"></p>`;
    const closing = doc.querySelector(".work-report-doc__closing");
    if (closing) doc.insertBefore(section, closing);
    else doc.appendChild(section);
  }
  const heading = section.querySelector('[data-setting-custom-text="heading"]');
  const body = section.querySelector('[data-setting-custom-text="body"]');
  if (heading) heading.textContent = item.heading.trim() || "—";
  if (body) {
    body.textContent = item.body.trim();
    body.classList.toggle("is-empty", !item.body.trim());
  }
}

bindEvents();
readInviteFromUrl();
window.addEventListener("pagehide", saveSensoryDraft);

async function bootApp() {
  if (typeof Auth !== "undefined") {
    try {
      await Auth.ensureAdminSeed();
    } catch (err) {
      console.error("Failed to seed admin account:", err);
    }
  }
  // Deep links to admin settings require an active admin session.
  if (state.view === "settings") {
    const user = currentAuthUser();
    if (!user || user.role !== "admin") {
      state.authError = "Sign in with your admin account to open settings.";
      state.view = "login";
    }
  }
  // Dashboard deep link: therapists/admins or PIN session can stay; others see the gate.
  if (state.view === "dashboard") {
    if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
      state.clinicianUnlocked = true;
    }
    initTherapistPrefs();
  }
  if (typeof Auth !== "undefined" && Auth.canAccessClinicianTools()) {
    initTherapistPrefs();
  }
  if (state.view === "reset") {
    if (!state.resetToken) {
      state.authError = "This reset link is missing. Please request a new one.";
      state.view = "forgot";
    } else if (typeof Auth !== "undefined") {
      try {
        const peek = await Auth.peekPasswordReset(state.resetToken);
        if (!peek.ok) {
          state.authError = peek.error;
          state.view = "forgot";
          clearAuthResetParams();
        }
      } catch (err) {
        console.error("Could not check reset link:", err);
        state.authError = "This reset link could not be checked. Please request a new one.";
        state.view = "forgot";
      }
    }
  }
  // Therapist invite links always require an account before the screening.
  if (inviteNeedsAccount() && (state.view === "home" || state.view === "sensory" || state.view === "questionnaire")) {
    beginInviteAccountGate();
  }

  // Dev shortcut: ?preview=report opens a full sample report (admin/therapist only).
  // ?preview=couple-merge opens the combined couple profile with sample partners.
  const sampleBoot = state._openSamplePreviewOnBoot;
  delete state._openSamplePreviewOnBoot;
  if (sampleBoot && isSampleReportPreviewEnabled()) {
    const wantsCoupleMerge = Boolean(sampleBoot.coupleMerge || sampleBoot.respondent === "couple-merge");
    if (wantsCoupleMerge) {
      openSampleCoupleMergePreview();
      if (window.history?.replaceState) {
        const clean = new URL(window.location.href);
        ["preview", "sample", "respondent", "pathway", "context", "lifeContext"].forEach((key) =>
          clean.searchParams.delete(key)
        );
        window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
      }
    } else {
      openSampleReportPreview(sampleBoot);
      if (window.history?.replaceState) {
        const clean = new URL(window.location.href);
        ["preview", "sample", "respondent", "pathway", "context", "lifeContext"].forEach((key) =>
          clean.searchParams.delete(key)
        );
        window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
      }
    }
  }

  render();
  maybeNotifyExpiringQuestionnaires();
}

bootApp();
