# McCune Legal — Debtor Intake Mockup

Front-end design mockup for a debtor-facing bankruptcy intake, branded McCune
Legal (white-label; powered by BK Fast Lane concept). Built as standalone HTML
pages so each renders on its own with no build step and no external dependencies.

## Pages

| File | Purpose |
|------|---------|
| `login.html` | Entry point — sign in / create account / resume |
| `personal.html` | Stage 1 — personal information |
| `income.html` | Stage 2 — income |
| `assets.html` | Stage 3 — assets |
| `debts.html` | Stage 4 — debts |
| `expenses.html` | Stage 5 — monthly expenses |
| `financial-affairs.html` | Stage 6 — financial affairs (SOFA questions) |
| `counseling.html` | Stage 7 — credit counseling class (explainer + certificate upload; soft gate) |
| `documents.html` | Stage 8 — document summary & submit |
| `jimmy-changes.html` | Stage 9 — Colab changelog, approvals, and conversation |
| `confirmation.html` | Post-submit status page (intake locked) |
| `upload-center.html` | Post-submission Upload Center — token-gated /upload/{token}; identity gate → outstanding items → confirmation (CRM-driven chase list) |

Open `login.html` and click through. Navigation, toggles, document upload/N/A,
and progress are interactive (front-end only; no back end / no real file storage).

## Conventions

- CSS and JS are **inlined** in each file — no shared assets, no CDN links.
- Firm branding lives in CSS `--firm-*` variables at the top of each file
  (name, tagline, colors, logo). Change those to re-skin for another firm.
- Review notes are inline `<!-- SUGGESTION: ... -->` comments placed where they
  apply. See `SUGGESTIONS.md` for the running change log.

## Status

Front-end mockup. Login/save and document upload are simulated for click-through;
wiring real authentication, persistence, and file storage is the next (back-end)
phase.
