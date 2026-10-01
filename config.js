/**
 * Soulful Sensory OT — delivery & clinician settings
 *
 * Therapist tools require an admin or therapist sign-in. Set ADMIN_PASSWORD
 * in the server environment. Emails are sent once from soulfulsensoryot@gmail.com through the practice
 * server (`npm start` locally, or the Netlify function). Patient invites
 * include the working questionnaire link — there is no FormSubmit
 * confirm-and-resend step. Set GMAIL_APP_PASSWORD in `.env` or Netlify.
 */
const APP_CONFIG = {
  clinicianEmail: "soulfulsensoryot@gmail.com",
  /** Street address shown on the privacy notice. Fill this in for the practice. */
  practiceAddress: "George",
  informationOfficer: "Cayley Alberts",
  informationOfficerEmail: "soulfulsensoryot@gmail.com",
  /**
   * Gmail via the practice server. Set GMAIL_USER and GMAIL_APP_PASSWORD
   * in `.env` (local) or Netlify environment variables.
   * Use "web3forms" only with an access key, or "none" to turn emails off.
   */
  /**
   * Live address of this site (the Cloudflare domain), with no trailing slash.
   * Invite links use it when the page is opened on localhost.
   * Leave blank to use the address currently open in the browser.
   */
  publicAppUrl: "",
  deliveryProvider: "gmail", // "gmail" | "web3forms" | "none"
  web3formsAccessKey: "",
  /**
   * Show the Pain pathway button on the home screen.
   * Set to true when ready to bring the pain trail back.
   */
  showPainPathway: false,

  /** Practice sign-in. Set ADMIN_PASSWORD in the server environment. Do not put a password in this file. */
  adminName: "Cayley Alberts",
  adminEmail: "soulfulsensoryot@gmail.com",
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
  devAllowSampleReport: false,

  /**
   * Admin overview totals recorded card payments when this is true.
   * Leave false until an online payment provider is connected.
   */
  onlinePaymentsEnabled: false,
  paymentCurrency: "ZAR",
};
