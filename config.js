/**
 * Soulful Sensory OT — delivery & clinician settings
 *
 * Change CLINICIAN_PIN before sharing the clinician link with anyone.
 * Email delivery uses FormSubmit (https://formsubmit.co) — the first
 * real submission sends a confirmation email to CLINICIAN_EMAIL; click
 * Confirm once, then every completed adult / teen / parent screening
 * emails the detailed report. Download and expiry reminders use the same
 * inbox. AJAX delivery disables FormSubmit reCAPTCHA (_captcha: false) so the
 * browser gets a JSON response instead of an HTML captcha page.
 */
const APP_CONFIG = {
  clinicianEmail: "soulfulsensoryot@gmail.com",
  /** PIN for the clinician share page (?clinician=1). Change this. */
  clinicianPin: "soulfulot",
  /**
   * FormSubmit AJAX endpoint. Uses clinicianEmail above.
   * Or set a Web3Forms access key and switch deliveryProvider to "web3forms".
   */
  deliveryProvider: "formsubmit", // "formsubmit" | "web3forms" | "none"
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
