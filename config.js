/**
 * Soulful Sensory OT — delivery & clinician settings
 *
 * Change CLINICIAN_PIN before sharing the clinician link with anyone.
 * Emails are sent once from soulfulsensoryot@gmail.com through the practice
 * server (`npm start` locally, or the Netlify function). Patient invites
 * include the working questionnaire link — there is no FormSubmit
 * confirm-and-resend step. Set GMAIL_APP_PASSWORD in `.env` or Netlify.
 */
const APP_CONFIG = {
  clinicianEmail: "soulfulsensoryot@gmail.com",
  /** PIN for the clinician share page (?clinician=1). Change this. */
  clinicianPin: "soulfulot",
  /**
   * Gmail via the practice server. Set GMAIL_USER and GMAIL_APP_PASSWORD
   * in `.env` (local) or Netlify environment variables.
   * Use "web3forms" only with an access key, or "none" to turn emails off.
   */
  deliveryProvider: "gmail", // "gmail" | "web3forms" | "none"
  web3formsAccessKey: "",
  /**
   * Show the Pain pathway button on the home screen.
   * Set to true when ready to bring the pain trail back.
   */
  showPainPathway: false,

  /** Seeded admin account (created automatically on first load). Change the password. */
  adminName: "Cayley Alberts",
  adminEmail: "soulfulsensoryot@gmail.com",
  adminPassword: "SoulfulAdmin2026!",
  adminPhone: "068 901 4209",
  practiceName: "Soulful Sensory OT",
  /** Patients are created by a therapist; public self-signup stays off. */
  allowPatientSignup: false,
  allowTherapistSignup: true,
  /** Therapist signups stay pending until you approve them in Settings. */
  requireTherapistApproval: true,

  /**
   * Incomplete questionnaires expire after this many days (from first save).
   * A reminder is emailed to clinicianEmail when this many days remain.
   */
  questionnaireExpiryDays: 14,
  questionnaireExpiryWarningDays: 3,
  devAllowSampleReport: true,

  /**
   * Admin overview totals recorded card payments when this is true.
   * Leave false until an online payment provider is connected.
   */
  onlinePaymentsEnabled: false,
  paymentCurrency: "ZAR",
};
