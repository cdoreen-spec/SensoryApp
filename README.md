# Soulful Sensory Screening Questionnaire

A custom web app for the Soulful Sensory OT screening questionnaire, with per-system scoring for sensory sensitive/avoiding, neutral, and seeking profiles.

## Why a web app instead of Google Forms?

Google Forms is excellent for simple data collection, but it cannot:

- Calculate and **display instant sensory profile results** to the person completing it
- Apply **different scoring weights** per question (some Yes answers indicate sensitivity, others indicate seeking)
- Match your **custom brand design** without significant limitations
- Provide a polished, guided multi-step experience with visual results

This web app solves all of those.

## Run locally

Open `index.html` in any modern browser, or serve the folder:

```bash
# Python 3
python3 -m http.server 8080

# Then visit http://localhost:8080
```

## Scoring logic

Each yes/no question is tagged as:

- **Sensitive** — Yes suggests a lower threshold / avoiding pattern
- **Seeking** — Yes suggests a higher threshold / seeking pattern
- **Neutral** — Not used in scoring (preference questions)

For each sensory system, the app compares sensitive vs seeking counts and assigns:

| Profile | Meaning |
|---------|---------|
| **Sensory Sensitive / Avoiding** | More sensitive indicators — may need *less* stimulation |
| **Sensory Neutral** | Mixed pattern — moderate threshold |
| **Sensory Seeking** | More seeking indicators — may need *more* stimulation |

> Review question tags in `questions.js` with your clinical judgement and adjust as needed.

## Files

- `index.html` — Page shell
- `questions.js` — All questions from your Google Form
- `scoring.js` — Scoring engine
- `app.js` — UI and step flow
- `styles.css` — Soulful Sensory theme

## Next steps (optional)

- Host on Netlify, Vercel, or your website (required for patient email delivery)
- Add a PDF export of results
- Fine-tune scoring thresholds with your OT expertise

## Results email (every completed screening)

When someone finishes an **adult**, **teenager**, or **parent** sensory screening (from the home pathway or an invite link), a detailed report is emailed to `clinicianEmail` in `config.js` (default: `soulfulsensoryot@gmail.com`). The email subject starts with the name of the person who completed the assessment.

1. **Host the site** on a public URL (FormSubmit cannot email from `file://`).
2. **First email only:** FormSubmit sends a confirmation to that address — open it and click Confirm. After that, results arrive automatically.

Optional: set `deliveryProvider: "web3forms"` and add a [Web3Forms](https://web3forms.com) access key if you prefer that provider. Set `deliveryProvider: "none"` to turn emails off.

## Therapist patient dashboard

Completed screenings are also saved in **this browser** so you can reopen and print reports later.

1. **Sign in** as admin (seeded from `config.js`) or as an approved therapist — you land on the **Patient dashboard**.
2. Or open **Therapist dashboard** on the home page / `?dashboard=1`, and unlock with the clinician PIN if needed.
3. Each row shows the patient name, assessment date, overall pattern, and sense-by-sense chips.
4. **View results** opens the full packet; **Download report** opens the print dialog (choose “Save as PDF” if you want a file).

Note: the list lives in localStorage on this device. Use the same computer/browser where patients complete screenings (or where you open their invite links) to see them here. Emails still arrive regardless.

## Send to patients (clinician invites)

1. From the dashboard choose **Invite links**, or open **Clinician invite link** / `?clinician=1`.
2. Unlock with the PIN in `config.js` (`clinicianPin` — default `soulfulot`; change this).
3. Choose their access **when you create the link** (patients have no report by default):
   - **No report access** — thank-you only; you get the full email and give feedback in a booked session
   - **Basic summary only** — high-level overall pattern; detailed report stays for your feedback session
   - **Full detailed report** — they see the complete sensory profile; you still get the email
4. Copy the invite link and send it to the patient.

## Google Forms alternative

If you prefer to stay on Google Forms, you would need **Google Apps Script** to calculate scores — and respondents still wouldn't see their profile instantly. The form design options would remain limited.
