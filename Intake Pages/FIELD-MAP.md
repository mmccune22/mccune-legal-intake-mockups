# Intake → Forms Field Map

The master mapping for the McCune Legal debtor intake (white-label, powered by BK Fast Lane).

This document does two things:

1. **Destination map** — every intake field → the exact line on the official bankruptcy form it will populate. This is how we generate the petition and schedules from intake data.
2. **Source / extraction map** — which uploaded document each field can be *pre-filled* from when we scan, and whether that extraction is **deterministic** (fixed format, same result every time) or **inferred** (variable format, AI best-guess that must be confirmed).

The whole intake is built on one principle: **ask once, derive the rest.** A value the debtor gives in one place flows to every form line that needs it; values we can compute (exemption state, venue) are never asked.

---

## Two concepts, kept separate

**Destination (output side).** When we generate forms, intake field X writes to Form Y, line Z. One intake field often feeds several form lines (e.g. the home address appears on Form 101, Schedule A/B, and is used to derive venue).

**Source/extraction (input side).** Before the debtor types anything, we scan their uploads and pre-fill what we can. The reliability of that pre-fill depends entirely on the document:

| Tier | Meaning | Behavior |
|---|---|---|
| **Deterministic** | Document has a fixed, standardized structure — the value is always in the same place / encoded format. | Auto-fill with high confidence. |
| **Inferred** | Document format varies by issuer; value located by AI reading, not fixed position. | Pre-fill, but **always flag for debtor confirmation.** |
| **Manual** | No reliable source document; debtor enters it. | No pre-fill. |

This is the distinction Jimmy/Codex flagged as a **deterministic outcome**: the scan of a given document must return the same result every time, from a known location — not a guess that varies run to run. Standardized documents (driver's license barcode, W-2 boxes, 1040 lines) give us that; free-form documents (most pay stubs, letters) do not, so those stay "inferred + confirm."

### Deterministic source documents we expect to rely on

| Document | Why it's deterministic | Fields it can reliably yield |
|---|---|---|
| **Driver's license / state ID** | Back-of-card barcode is the AAMVA PDF417 standard — fixed, machine-readable fields. | Full legal name, DOB, residential address, sex, ID number |
| **W-2** | Fixed IRS box layout (Box 1, Box a, Box e/f). | Name, SSN, employer name/address, wages |
| **Form 1040 (tax return)** | Named IRS line items at known locations. | Filing status, dependents, names, AGI, address |
| **1099** | Standardized IRS layout. | Name, SSN/TIN, payer, income amount |
| **SSA card** | Single standardized field. | SSN, name as printed |

### Inferred (confirm-required) source documents

| Document | Why it's inferred | Typical use |
|---|---|---|
| **Pay stubs** | Layout varies wildly by employer/payroll vendor. | Income, deductions, employer, pay frequency |
| **Bank statements** | Format varies by bank. | Account numbers, balances, transaction history |
| **Utility / household bills** | No standard layout. | Monthly expense amounts, account holder, address |
| **Creditor statements** | Vary by creditor. | Creditor name, balance, account number |

> **Build rule for the dev:** keep deterministic and inferred fields visibly separated in the data model, and never auto-commit an inferred value without a confirm step. The debtor confirm-screen already exists in the intake flow — that's where inferred pre-fills land.

---

## SECTION 1 — Personal Information

Reflects the live fields on `personal.html`. Form destination = Form 101 (Voluntary Petition) unless noted. "Debtor 1" = the filer; "Debtor 2" = spouse when filing jointly.

| Intake field | Req | → Form destination | ← Source doc(s) | Extraction | Notes |
|---|---|---|---|---|---|
| First name | ✓ | Form 101, Pt 1, Line 1 (First name) | License (barcode), 1040, W-2 | Deterministic | "As on your ID" |
| Middle name |  | Form 101, Pt 1, Line 1 (Middle name) | License, 1040 | Deterministic | |
| Last name (incl. suffix) | ✓ | Form 101, Pt 1, Line 1 (Last name + Suffix) | License, 1040, W-2 | Deterministic | Suffix folded into last name per Matt — rare, debtor appends |
| Other names used (last 8 yrs) |  | Form 101, Pt 1, Line 2 (Other names used) | — | Manual | Maiden/prior names, comma-separated. Also feeds SOFA context |
| Email address | ✓ | *(not on petition)* — firm contact / portal | — | Manual | Firm operational field, not a form line |
| Contact number | ✓ | *(not on petition)* — firm contact | License (sometimes) | Manual | Firm operational field; petition has no debtor phone line |
| Number and street (residence) | ✓ | Form 101, Pt 1, Line 5 (Where you live) | License (barcode), 1040 | Deterministic | |
| City | ✓ | Form 101, Pt 1, Line 5 | License, 1040 | Deterministic | |
| State | ✓ | Form 101, Pt 1, Line 5 | License, 1040 | Deterministic | Defaults "Colorado" |
| ZIP code | ✓ | Form 101, Pt 1, Line 5 | License, 1040 | Deterministic | |
| County | ✓ | Form 101, Pt 1, Line 5 (County) + **drives venue** | Derived from ZIP | Deterministic (derived) | See Derived fields |
| Mailing address (if different) |  | Form 101, Pt 1, Line 5 (Mailing address) | — | Manual | Revealed by checkbox; accepts P.O. Box |
| Date of birth | ✓ | *(used for identity / dependents logic)* | License (barcode), 1040 | Deterministic | Typed MM/DD/YYYY |
| Social Security number | ✓ | **Form 121** (Statement About SSN) — not printed on 101 | SSA card, W-2, 1099, 1040 | Deterministic | **Encrypt at rest.** Form 101 shows last 4 only; full SSN goes to Form 121 |
| Have you filed bankruptcy before? |  | Form 101, Pt 3, Lines 9–10 (Prior cases) | — | Manual | "Yes" reveals a free-text field: case number, chapter, approximate filing date (best-effort) |
| → Prior bankruptcy detail (text) | shown on Yes | Form 101, Pt 3, Lines 9–10 | — | Manual | One textarea; attorney parses/verifies. Structured fields *to build* later if needed |
| Has dependents? |  | **Schedule J, Line 2** (Dependents) | 1040 (dependents) | Inferred | "Yes" reveals per-dependent rows; "No" reveals nothing |
| → Dependent rows: Relationship, Age, Lives with you? (Yes / No / Part-time) | shown on Yes | **Schedule J, Line 2** | 1040 | Inferred | **Matches Form 106J. NO name field** — the form says "Do not state the dependents' names." Form 106J only has Yes/No for "lives with you" — **"Part-time" maps to Yes** with the nuance noted for the attorney. "Add another dependent" clones a row |
| Marital status | ✓ | Drives spouse block + Schedule I/J + **SOFA Q1** | 1040 (filing status) | Inferred | **Placed LAST in the section.** 1040 status ≈ marital status; confirm. "Married" reveals the Spouse block below |
| Note to attorney |  | *(internal — not a form line)* | — | Manual | Firm intake note |

**Personal Info field order (individual debtor):** name → other names → email/phone → home address → mailing (if diff) → DOB → SSN → prior bankruptcy → dependents → **marital status (last)** → spouse block (if Married) → note to attorney.

### Spouse flow — revealed only when Marital status = "Married"

When Married is selected, the **only** thing shown is one gating question:

**"Will your spouse be filing jointly with you?" → Yes / No / Unsure**

This gates everything else, so a nervous non-filing spouse is never asked for personal data up front. What each answer reveals:

| Answer | What appears | Why |
|---|---|---|
| **Yes** | Full **Debtor 2** block (fields below) | Spouse becomes a co-debtor with their own Form 101 columns + Form 121 SSN |
| **No** | Info-tip only (no fields) | Individual filing is allowed; non-filing spouse's **income still counts** (means test / Schedule I). Notice tells them income docs are needed in the Income section |
| **Unsure** | Info-tip only (no fields) | Same as No, but copy frames it as a strategic decision to discuss with the attorney. Income docs still needed |

**Debtor 2 block — shown only on "Yes".** Omits marital status (already answered) and dependents (shared household → listed once on Schedule J). All fields below mirror the debtor's mandatory set.

| Intake field | Req | → Form destination | ← Source doc(s) | Extraction | Notes |
|---|---|---|---|---|---|
| Spouse first / last name | ✓ | Form 101 Debtor 2, Line 1 | Spouse license, 1040 | Inferred | Deterministic if spouse license uploaded |
| Spouse middle name |  | Form 101 Debtor 2, Line 1 | Spouse license, 1040 | Inferred | |
| Spouse other names (last 8 yrs) |  | Form 101 Debtor 2, Line 2 | — | Manual | |
| Spouse email | ✓ | *(firm contact)* | — | Manual | |
| Spouse contact number | ✓ | *(firm contact)* | — | Manual | |
| Spouse home address (street/city/state/ZIP) | ✓ | Form 101 Debtor 2 address | License | Inferred | "Same as home address listed above" checkbox (default checked → hides fields). **No mailing-address option** (removed as overkill) |
| Spouse date of birth | ✓ | Identity (Debtor 2) | Spouse license, 1040 | Inferred | |
| Spouse SSN | ✓ | **Form 121** (2nd SSN) | Spouse SSA/W-2/1040 | Inferred | **Encrypt at rest** |
| Has your spouse filed bankruptcy before? |  | Form 101 Debtor 2, Pt 3 Lines 9–10 | — | Manual | "Yes" reveals a free-text detail box (same as debtor's) |

> **Cross-section dependency:** when joint = **No or Unsure**, the **Income** section must surface a **non-filing-spouse income upload** (pay stubs / proof of income) — the No/Unsure info-tips promise it. Wire this when building Income.

### Personal Info — still to build
- **Prior bankruptcy detail** is currently a single free-text field. If the dev wants structured form-fill, split into district / case number / filing date / chapter / disposition later.
- **Spouse prior-bankruptcy detail** (revealed on the spouse's "Yes") could likewise be expanded from Yes/No to detail fields, parallel to Debtor 1.

---

## Derived fields (computed, never asked)

These are *outputs* the system calculates from data collected elsewhere. They exist so we never ask the debtor a redundant or confusing legal question.

| Derived value | Computed from | Rule | Used for |
|---|---|---|---|
| **County** | Residential ZIP | ZIP → county lookup | Form 101 Line 5; venue |
| **Venue (proper district)** | Address history (SOFA Q2) | 180-day rule — district where debtor lived the greater part of the 180 days before filing | Where the case is filed |
| **Exemption state** | Address history (SOFA Q2) | 730-day rule — if not in current state the full 2 years before filing, exemptions follow the prior domicile | Schedule C exemptions |

> This is why **"How long in Colorado?" was removed** from Personal Info: SOFA Q2 already captures all addresses for the last 3 years, and exemption-state + venue are *computed from that*, not asked. Collect the address history once (SOFA Q2); derive the rest.

---

## SECTION 6 — Statement of Financial Affairs (Form 107)

`financial-affairs.html` mirrors Form 107 exactly: all 26 numbered questions, in official order, grouped under the form's 11 parts. Each is a Yes/No that (when built out) reveals the detail fields for that question. Several overlap with data collected earlier and should be **carried through read-only**, not re-asked.

| SOFA Part | Questions | → Form 107 | Overlap / carry-through |
|---|---|---|---|
| Pt 1 — Marital status & residence | Q1 (marital status), Q2 (addresses, last 3 yrs) | 107 Pt 1 | Q1 carries from Personal Info marital status (read-only). **Q2 is the source of truth for address history → venue + exemption derivation** |
| Pt 2 — Income | Q3 (income this/last 2 yrs), Q4 (other income) | 107 Pt 2 | Q4 carries from Income section (read-only) |
| Pt 3 — Creditor payments | Q5, Q6, Q7 (payments, insiders, advantage) | 107 Pt 3 | Insider payments cross-ref Debts |
| Pt 4 — Legal actions | Q8 (suits), Q9 (repossessions/garnishments), Q10 (setoffs) | 107 Pt 4 | Manual |
| Pt 5 — Gifts & contributions | Q11 (gifts), Q12 (charitable) | 107 Pt 5 | Manual |
| Pt 6 — Losses | Q13 (losses, theft, gambling) | 107 Pt 6 | Manual |
| Pt 7 — Payments re: bankruptcy | Q14 (attorney/advisor), Q15 (other parties) | 107 Pt 7 | Manual |
| Pt 8 — Transfers | Q16, Q17 (transfers), Q18 (self-settled trusts) | 107 Pt 8 | Cross-ref Assets |
| Pt 9 — Closed accounts | Q19 (financial accounts), Q20 (safe deposit), Q21 (storage) | 107 Pt 9 | Cross-ref bank statements |
| Pt 10 — Property held for others | Q22 (property of others), Q23 (environmental) | 107 Pt 10 | Manual |
| Pt 11 — Business | Q24, Q25 (businesses), Q26 (bookkeepers) | 107 Pt 11 | Manual |

> SOFA detail fields per question are **to be built**. When built, Q2 detail (address history) must be wired to the venue/exemption derivation above.

---

## Document → Section map

Each intake step has a sidebar listing the documents needed for that section. The same uploads also feed extraction (see source map above).

| Step | Page | Documents in sidebar | Required? |
|---|---|---|---|
| 1 — Personal Info | personal.html | Driver's license; SSA card / W-2 / 1099; Tax return (last yr); Tax return (2 yrs ago). **If joint = Yes:** + Spouse's driver's license, Spouse's SSN doc, Spouse's tax returns (only if filed separately) | License + SSN doc required; tax returns needed (N/A allowed). Spouse docs revealed in the sidebar only when joint filing = Yes; also listed on the page-7 summary tagged "if spouse is filing" |
| 2 — Income | income.html | Pay stubs (6 mo), other income proof | Required |
| 3 — Assets | assets.html | Titles, deeds, account statements | Per applicability |
| 4 — Debts | debts.html | **Statements for all debts** | Required (no N/A — drives creditor schedules) |
| 5 — Expenses | expenses.html | Utility / household bills | Per applicability |
| 6 — Financial Affairs | financial-affairs.html | Supporting docs per question | Per applicability |
| 7 — Documents | documents.html | Recap of all of the above + "Other documents · Optional" catch-all | — |

---

## Maintenance

Update this file whenever a section's fields change. Pair each change with the matching SUGGESTIONS.md round entry. Keep the deterministic/inferred column honest — it's the part the dev relies on to know what can auto-fill vs. what must be confirmed.
