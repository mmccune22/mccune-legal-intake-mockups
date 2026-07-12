# Document Request Logic Map (Developer Spec)

The IF → THEN rules for every document the intake can request. This is the
redesign spec (2026-07-03): the checklist is **generated from the debtor's
answers** — a document is never shown unless its trigger fires. Companion to
FIELD-MAP.md (fields → form lines) and DOC-REQUESTS.md (pre-redesign inventory).

---

## 1. Principles

1. **Generated, not static.** Each doc request has a trigger expression over
   intake fields. Trigger false → the request does not exist anywhere (rail,
   summary, database, follow-up emails).
2. **One shared document state.** Every request keyed by a stable `doc_type`.
   Section rails and the Step 8 summary render from the same state. An upload
   in Income shows as done in the summary and vice versa.
3. **Three tiers.**
   - **T1 REQUIRED** — blocks submit. No skip path.
   - **T2 NEEDED** — upload OR give a reason ("I don't have this" → one-tap
     reason). Either resolves the item. Reasons are stored and drive follow-up.
   - **T3 OPTIONAL** — never blocks, never counts in progress.
4. **No "N/A" anywhere.** Skip reasons are plain language (see §4).
5. **Progress = required only.** Progress bars count T1 + T2 items;
   T3 never inflates the denominator.
6. **Submit gate:** hard-block only on unresolved T1; soft modal ("submit now,
   add later") when T2 items are open or marked *will send later*.
7. **Submit = lock (decision 2026-07-10).** Once submitted, the intake is
   closed and read-only — nobody re-enters the form, including the debtor.
   Post-submit sign-in lands on the status page (confirmation), never the form.
   ALL post-submit document collection flows through the CRM: each open item
   gets its own secure single-item upload link. Corrections to answers happen
   attorney-side via the CRM, with an audit trail — never by re-opening the
   intake.

## 2. Trigger fields

All triggers reference answers already collected (see FIELD-MAP for form
destinations). No new questions are introduced for document logic.

| Trigger ID | Question | Asked in |
|---|---|---|
| `married` | Marital status = Married | Personal |
| `joint` | Spouse filing jointly? = Yes | Personal |
| `spouse_filed_separately` | Spouse tax returns filed separately | Personal (spouse block) |
| `employed` | Are you employed? = Yes | Income |
| `sp_employed` | Is your spouse employed? = Yes | Income (spouse block) |
| `other_income` | Other source of monthly income? = Yes | Income |
| `sp_other_income` | Other income from spouse? = Yes | Income (spouse block) |
| `real_estate` | Own/interest in real estate? = Yes | Assets |
| `behind_mortgage` | Behind on mortgage payments? = Yes (any property) | Assets |
| `vehicle` | Own/interest in vehicles? = Yes | Assets |
| `vehicle_financed` | Vehicle financed or leased? = Yes (per vehicle) | Assets |
| `behind_vehicle` | Behind on vehicle payments? = Yes (any vehicle) | Assets |
| `investments` | Any Yes among Assets Q18, Q21, Q23, Q24, Q31 (stocks/funds, retirement, annuities, education accts, insurance w/ cash value) | Assets |
| `hoa` | HOA? = Yes (per property) | Debts |
| `dso` | Owe domestic support? = Yes | Debts |
| `back_taxes` | Owe back taxes? = Yes | Debts |
| `student_loans` | Have student loans? = Yes | Debts |
| `business_debt` | Business/self-employment debt? = Yes | Debts |
| `lawsuit` | SOFA on-screen Q8 (lawsuit/court action, Form 107 L9) = Yes OR on-screen Q9 (repossessed/foreclosed/garnished/seized, L10) = Yes | Financial Affairs |

## 3. Master document map — IF this, THEN ask for that

`Rail` = section page whose sidebar shows the request. Every triggered item
also appears in the Step 8 summary under its section group.

| doc_type | Ask for (debtor-facing label) | Rail | Tier | IF (trigger) |
|---|---|---|---|---|
| `id_license` | Driver's license or photo ID | Personal | **T1** | always |
| `ssn_proof` | Social Security card, W-2, or 1099 | Personal | **T1** | always |
| `tax_return_y1` | Tax return — last year | Personal | T2 | always |
| `tax_return_y2` | Tax return — two years ago | Personal | T2 | always |
| `sp_id_license` | Spouse's driver's license | Personal | **T1** | `joint` |
| `sp_ssn_proof` | Spouse's Social Security card, W-2, or 1099 | Personal | **T1** | `joint` |
| `sp_tax_return_y1` | Spouse's tax return — last year | Personal | T2 | `joint AND spouse_filed_separately` |
| `sp_tax_return_y2` | Spouse's tax return — two years ago | Personal | T2 | `joint AND spouse_filed_separately` |
| `bank_statements` | Bank statements — last 6 months (all accounts) | Income | **T1** | always |
| `pay_stubs` | Pay stubs — last 6 months | Income | T2 | `employed` |
| `other_income_proof` | Proof of other income — last 6 months | Income | T2 | `other_income` |
| `sp_pay_stubs` | Spouse's pay stubs — last 6 months | Income | T2 | `married AND sp_employed` |
| `sp_other_income_proof` | Spouse's proof of other income — last 6 months | Income | T2 | `married AND sp_other_income` |
| `sp_bank_statements` | Spouse's bank statements — last 6 months | Income | T2 | `married AND NOT joint` *(joint accounts usually covered by `bank_statements`; see §5.2)* |
| `zillow_valuation` | Zillow value report for your home | Assets | T2 | `real_estate` (one per property) |
| `foreclosure_docs` | Foreclosure paperwork | Assets | T2 | `real_estate AND behind_mortgage` |
| `kbb_valuation` | KBB value report for your vehicle | Assets | T2 | `vehicle` (one per vehicle) |
| `vehicle_title` | Vehicle title | Assets | T2 | `vehicle AND NOT vehicle_financed` (per vehicle — lien-free only) |
| `repo_docs` | Vehicle repossession paperwork | Assets | T2 | `vehicle_financed AND behind_vehicle` |
| `investment_statements` | Investment / retirement account statements | Assets | T2 | `investments` |
| `mortgage_statements` | Mortgage statements | Debts | T2 | `real_estate` (mortgage assumed per FIELD-MAP §4) |
| `hoa_statements` | HOA statements | Debts | T2 | `hoa` |
| `other_secured_statements` | Statements for other secured debts | Debts | T2 | other-secured catch-all = Yes |
| `vehicle_loan_statements` | Vehicle loan or lease statements | Debts | T2 | `vehicle_financed` |
| `dso_docs` | Support order / court paperwork for support | Debts | T2 | `dso` |
| `tax_notices` | Tax notices or balance statements | Debts | T2 | `back_taxes` |
| `student_loan_statements` | Student loan statements | Debts | T2 | `student_loans` |
| `unsecured_statements` | Statements for credit cards, medical bills, and other debts + collection / attorney letters | Debts | **T1** | always |
| `business_debt_statements` | Business debt statements | Debts | T2 | `business_debt` |
| `court_paperwork` | Court paperwork | Fin. Affairs | T2 | `lawsuit` |
| `counseling_certificate` | Counseling class certificate | Counseling | T2* | always — *special flow: auto-delivered by provider when taken via firm link; upload only if taken elsewhere; reason option "I haven't taken the class yet." Soft gate per 2026-07-03 decision; case cannot be FILED without it (180-day validity check on `mcl_counseling_date`)* |
| `other_docs` | Anything else you'd like us to have | Summary only | T3 | always |

**Removed relative to DOC-REQUESTS.md:** Assets' "Bank or financial account
statements" (duplicate — `bank_statements` satisfies Assets Q17; see §5.1);
Expenses requests nothing (decision 2026-07-03: no utility bills — typed
amounts + bank statements suffice).

## 4. Skip reasons (T2 only)

Debtor taps **"I don't have this"** → one-tap reason. Stored per item as
`reason`, with timestamp.

| Reason code | Debtor sees | Follow-up behavior |
|---|---|---|
| `will_send_later` | "I'll send it later" | Item stays on the chase list; reminder emails reference it |
| `dont_have_copy` | "I don't have a copy" | Chase list, softer cadence; attorney may pull alternative source |
| `doesnt_apply` | "This doesn't apply to me" | Closes item; flags answer-mismatch for attorney review (trigger said it applies) |
| `didnt_file` | "I didn't file that year" | Tax returns only. Closes item; flags for attorney (means test / Form 122 implications) |
| `not_taken_yet` | "I haven't taken the class yet" | Counseling only. Chase list with class link; blocks FILING, not submit |

`doesnt_apply` on a triggered item is a signal, not an error — the debtor may
know something the form doesn't. Surface these in the attorney dashboard.

## 5. Dedup & satisfaction rules

1. **One doc_type per real-world document.** `bank_statements` satisfies both
   the Income request and Assets Q17 ("most recent statement" per account).
   Rails in both sections may display it, but it is ONE state object — uploaded
   once, done everywhere.
2. **Joint accounts:** if `married AND joint`, spouse activity is usually in
   the same statements; `sp_bank_statements` only triggers for married
   non-joint filings. If the debtor indicates separate spouse accounts in
   Assets Q17 cards, trigger it regardless.
3. **Per-instance requests:** `zillow_valuation`, `kbb_valuation`,
   `vehicle_title`, `mortgage_statements` generate one child item per
   property/vehicle card (label suffixed: "KBB report — 2019 Honda Civic").
   Child items inherit the parent tier; all children must resolve to resolve
   the parent.
4. **Trigger retraction:** if an answer changes and a trigger goes false, the
   request is hidden, not deleted — any uploaded file stays in the case file,
   state marked `orphaned` for attorney review.

## 6. State model (per client)

```json
{
  "doc_type": "kbb_valuation",
  "instance_of": "vehicle:2",
  "label": "KBB value report — 2019 Honda Civic",
  "tier": "T2",
  "trigger": "vehicle",
  "triggered": true,
  "status": "open | uploaded | reason_given | orphaned",
  "reason": null,
  "files": [{"name": "...", "uploaded_at": "..."}],
  "resolved_at": null
}
```

Summary page, section rails, progress bars, submit gate, attorney dashboard,
and follow-up email generator all read this array. Nothing else tracks
document state.

## 7. Step 8 summary behavior

- Groups by section, **T1 group pinned first** ("Required to submit").
- Row order inside groups: open first, then reason-given, then uploaded.
- Counts: "N of M required resolved" where M = triggered T1+T2 items.
- Submit: unresolved T1 → hard modal (list + "Got it"); open T2 or
  `will_send_later`/`not_taken_yet` → soft modal ("Submit — I'll add these
  later"); all resolved → straight through.
- Catch-all drop zone: uploads classified by the backend into a `doc_type`,
  debtor confirms; unmatched files land in `other_docs`.

## 8a. Client Document Upload Portal (post-submission; decided 2026-07-12; mockup: upload-center.html)

**Official name (Matt, 2026-07-12): "client document upload portal"** — the
firm/CRM-side term, leaning into standard practice-management language.
(Earlier drafts said "Upload Center.") Debtor-facing copy stays a warm, short
to-do list; the debtor never sees the word "portal" except the browser-tab
title ("Document Upload Portal — {firm}").

The only debtor doorway after submit (per Principle 7). Lives in THIS app as a
second token-gated route — **/upload/{token}** — reusing intake components and
styling. Behaves like a password-reset page: nothing renders without a valid
token.

- **Auth:** magic link + one lightweight identity check — date of birth OR SSN
  last-4 (data given at intake). No passwords, no account login.
- **Content:** ONLY the outstanding items, served live from the CRM
  (bkfl-crm-lite chase list, built from firm review rejections/rulings). One
  upload slot per requested item, multiple files allowed. NO free-form
  dropzone — files land pre-categorized. Page shows item names + the firm's
  notes verbatim; never intake answers or case data.
- **Item states:** waiting → uploaded ("Got it — your law firm will review")
  → or reason given. Reason picker: I'll send it later / I don't have a copy /
  This doesn't apply to me / I didn't file / I haven't taken it yet.
- **Progress:** "N of M done"; partial progress fine — same link resumes.
- **Tokens:** per-lead, expiring; every follow-up email carries a fresh link;
  revoked when the case reaches Ready for Petition Prep.
- **API contract:** GET /upload-session/{token} → { firstName, firmName,
  items:[{id,name,note,status}] } · POST /upload/{token}/{itemId} (file) ·
  POST /reason/{token}/{itemId} (reason code). Uploads flow into the CRM as
  AI-screened checklist items; the CRM's 5:00 a.m. batch creates the firm's
  review task.
- **Tone:** firm-voiced, natural case, no product terms; reads like a short
  to-do list, never like a heavyweight account portal.

## 8. Approved roadmap (Matt, 2026-07-05) — dev-build items

1. **Bank linking as an alternate satisfier for `bank_statements`.** Offer
   "connect your bank securely" (Plaid-class aggregation) alongside upload.
   Either path resolves the item; linked data feeds the same 6-month lookback
   the statements would. This is the highest-impact friction removal in the
   flow — bank statements are the only hard-required multi-document item.
2. **Verification states.** Extend `status` (§6) with `reviewing` and
   `needs_attention` (e.g., blurry photo, wrong document). `needs_attention`
   reopens the item with a plain-language reason and re-request.
3. **Post-submit tracker.** confirmation.html is now a status page (received →
   review → strategy session, with booking CTA + live open-items list). Live
   build renders the open-items list from the shared doc state.
4. **Magic-link resume + SMS nudges.** Follow-up emails/texts deep-link back
   into the intake without password re-entry.
5. **Spanish toggle.** Full ES localization; Cricket Debt already offers the
   class in Spanish.
6. **Extraction prefill** (FIELD-MAP deterministic/inferred model) — snap a
   W-2/license, we read it, debtor confirms. Already specced; build priority.
7. Smaller: per-section time estimates ("about 10 minutes"); momentum
   microcopy on progress.

---
*Maintain with FIELD-MAP.md and SUGGESTIONS.md per the standing rule: any
change to triggers, tiers, labels, or doc_types updates this file in the same
pass. Share with Jimmy alongside FIELD-MAP.md at handoff.*
