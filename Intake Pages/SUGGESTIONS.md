# Design suggestions log

Running log of design/markup changes for the McCune Legal debtor intake mockup.
Each round records: the file(s) touched, what changed, and the UX rationale.
Inline review notes also appear in the HTML as `<!-- SUGGESTION: ... -->` comments
right where they apply.

---

## Round 0 — Initial setup (baseline)

**Files:** login.html, personal.html, income.html, assets.html, debts.html,
expenses.html, financial-affairs.html, confirmation.html

**What's here:**
- White-label debtor intake, branded McCune Legal (logo + brand teal `#224E5F`
  embedded; all firm-specific values live in CSS `--firm-*` tokens at the top of
  each file for easy re-skinning).
- Login is the entry page (sign in / create account). The six intake stages are
  separate pages linked by a top section nav. Confirmation page after submit.
- Persistent left "Upload documents" sidebar on every stage page (not on login).
  Core docs are required; the rest can be marked "N/A". Status shows
  "Uploaded" / "Need to upload" / "Marked N/A".
- Interactive: Yes/No toggles reveal follow-ups, asset chips select, document
  boxes simulate upload / N/A / undo with a live progress count, "add another"
  rows clone, answers persist across pages within a session (sessionStorage).
- Every file is standalone — inlined CSS + JS, no external dependencies.

**Rationale:** Matches the real BK Fast Lane 7-step product structure while
reading as the firm's own tool; debtor-first plain language and an always-present
document panel so uploads never feel like a separate chore.

---

## Round 1 — "Statements for all debts" now required (2026-06-13)

**Files:** assets.html, debts.html, expenses.html, financial-affairs.html,
income.html, personal.html, confirmation.html

**What changed:** Removed the "N/A" (not applicable) option from the
"Statements for all debts" document box. It can no longer be skipped.

**Rationale:** Debt statements are needed for every case — they drive the
creditor schedules. Treat it as a required upload like ID and pay stubs, not an
optional one.

---

## Round 2 — Welcome video + login layout (2026-06-15)

**Files:** login.html

**What changed:** Login page is now centered around the full McCune Legal logo
lockup at the top, with two equal-size boxes below — sign-in on the left, a
welcome video on the right (same height). Stacks vertically on mobile (≤820px).
Video is a **Vimeo embed** with a clean player (no title/byline/portrait), so no
media file lives in the repo. To swap the video, change the Vimeo ID in the
`player.vimeo.com/video/ID` URL.

**Rationale:** A short intro video reassures first-time debtors and explains how
the intake works. Vimeo's minimal player keeps it distraction-free, and the
embed keeps the repo lightweight (no large MP4).

**Note:** the Vimeo video's privacy must allow embedding / "anyone with the link"
for the player to load for outside viewers.

---

## Round 3 — Larger form text on all six intake sections (2026-06-15)

**Files:** personal.html, income.html, assets.html, debts.html, expenses.html,
financial-affairs.html

**What changed:** Increased font sizes across the intake form — field labels,
inputs, section titles/descriptions, Yes/No toggles, and chips. Document sidebar
text left unchanged (sized intentionally smaller).

**Rationale:** The previous sizes read too small for a form debtors fill out
carefully; larger text improves legibility and reduces entry errors.

---

## Round 4 — Document summary page (7th step) (2026-06-15)

**Files:** documents.html (new); personal/income/assets/debts/expenses/
financial-affairs.html (nav updated)

**What changed:** Added a 7th step, "Documents," after Financial affairs. It
recaps document status in three groups — Still needed, Uploaded, Marked N/A —
with a count summary at top and Upload buttons on the needed items. Financial
affairs now continues to this page; the final "Submit my intake" lives here.

**Rationale:** Gives debtors a clear final checkpoint of what's outstanding
before submitting, instead of having to scan the sidebar.

---

## Round 5 — Step nav as a connected path (2026-06-15)

**Files:** all section pages + documents.html (shared topnav CSS)

**What changed:** Replaced the pill-style step nav with a stepper "path" — the 7
steps are evenly spaced numbered bubbles joined by a connecting line. Completed
steps fill green (line into them turns green), current step is teal, upcoming
steps gray. Labels hide on narrow screens, leaving the numbered path.

**Rationale:** A connected path communicates progress and sequence more clearly
than separate pills, and spacing the bubbles evenly across the width reads as a
guided journey.

---

## Round 6 — Per-step guide videos (2026-06-15)

**Files:** personal, income, assets, debts, expenses, financial-affairs,
documents.html

**What changed:** Each of the 7 intake pages now has a collapsible "Watch a
quick guide to this section" bar under its title. Collapsed by default; clicking
expands an inline video. Each step has its own placeholder slot + a tailored
blurb (e.g. Assets = "what counts as an asset and why it's protected"). Real
Vimeo IDs to be swapped per step — see the SWAP note in each guidevideo block.

**Rationale:** Step-specific help reduces confusion without crowding the form —
collapsed by default keeps the questions prominent for users who don't need it.

---

## Round 7 — Conditional spouse block on marital status (2026-06-20)

**Files:** personal.html, FIELD-MAP.md

**What changed:** The "Filing jointly with a spouse?" toggle was removed from
the always-on "A few quick questions" row. In its place, selecting **Married**
in Marital status now reveals a dedicated **Your spouse** block: spouse name,
other names, email, contact number, DOB, SSN, a "spouse lives at a different
address" toggle (reveals spouse address only if checked), and the question
"Will your spouse be filing jointly with you?" Answering that **Yes** expands a
further follow-up ("Has your spouse filed bankruptcy before?"). The block stays
hidden for Single/Separated/Divorced/Widowed.

**Rationale:** Marital status and joint filing are different things — a married
person can file individually. We still need spouse data on an individual filing
(non-filing spouse appears on the SOFA; spouse income counts toward the means
test / Schedule I), so "Married" justifies the basics. Only "filing jointly =
Yes" makes the spouse a Debtor 2 with their own form columns, so the full
co-debtor follow-ups gate on that. Avoids asking spouse questions of unmarried
filers and avoids re-asking the address when it's shared.

---

## Round 8 — Reorder + conditional prior-BK and dependents; Schedule J match (2026-06-20)

**Files:** personal.html, FIELD-MAP.md

**What changed:**
- **Marital status moved to the end** of the section (after dependents). It now
  gates the spouse block that follows it.
- **"Have you filed for bankruptcy before?"** — "Yes" reveals a single free-text
  field (placeholder asks for case number, chapter, and approximate filing
  date, best-effort). "No" reveals nothing.
- **Dependents fixed:** the detail no longer shows regardless of answer. "Yes"
  reveals per-dependent rows; "No" reveals nothing. Rows now match **Schedule J
  / Official Form 106J exactly**: Relationship, Age, and "Lives with you?"
  (Yes/No). The **name field was removed** — the official form explicitly says
  "Do not state the dependents' names." "Add another dependent" retained.
- Removed the old always-on "quick questions" row and the old name/age/
  relationship dependent card.

**Rationale:** Asking marital status last lets the debtor clear all the
universal questions first, then branch into the spouse questions only if
relevant. Gating prior-BK and dependents detail on "Yes" keeps the form short
for the common case. Matching Schedule J's exact fields (and omitting names per
the form's instruction) means the dependent data maps straight onto the
petition with no rework.

---

## Round 9 — Spouse flow gated on joint-filing question (2026-06-20)

**Files:** personal.html, FIELD-MAP.md

**What changed:** Selecting Married no longer dumps all spouse fields. It now
shows a single gating question — "Will your spouse be filing jointly with you?"
(Yes / No / Unsure, inline pill style, no description). Each answer reveals a
different thing:
- **Yes** → full Debtor 2 block: spouse first/middle/last name, other names,
  email, contact, home address ("Same as home address listed above" checkbox,
  default checked), DOB, SSN, and "Has your spouse filed bankruptcy before?"
  (with a free-text detail reveal). Mandatory fields carry red asterisks
  matching the debtor. Omits marital status (already answered) and dependents
  (shared household). Spouse mailing-address option removed as overkill.
- **No** → a lightbulb info-tip (larger text, single paragraph, no fields):
  married debtors can file individually, but the non-filing spouse's income is
  still factored in, so income docs will be needed in the next section.
- **Unsure** → same widget, copy framing it as a strategic decision to discuss
  with the attorney; income docs still needed.

Also: all toggles on the page now start unselected (no pre-filled answer);
dependent rows match Schedule J (relationship/age/lives-with-you, no names);
toggles sit inline beside their question label and align vertically.

**Rationale:** A non-filing spouse often gets nervous about handing over
personal data (SSN, DOB). Gating on the joint question means we only request
spouse identity details when the spouse is actually a co-debtor. For No/Unsure
we explain why income still matters and collect only what's needed (income
docs), not identity. Matches how the petition treats Debtor 2 vs. a non-filing
spouse.

**Cross-section note:** Income section must add a non-filing-spouse income
upload for the No/Unsure paths (the info-tips promise it).

---

## Round 10 — Conditional spouse documents (joint = Yes) (2026-06-20)

**Files:** personal.html, documents.html, FIELD-MAP.md

**What changed:** When joint filing = Yes, the left secure-upload sidebar now
reveals a "Spouse documents" section: Spouse's driver's license (required),
Spouse's Social Security card / W-2 / 1099 (required), and Spouse's tax returns
for the last 2 years (marked "Only if filed separately," with N/A). The sidebar
counter updates 0/4 → 0/7. A lightbulb info-tip at the top of the spouse block
points the debtor to upload these in the secure bar. The page-7 Documents
summary (documents.html) lists the same three spouse rows, tagged "if spouse is
filing" / "if filed separately," group count bumped 4 → 7.

**Rationale:** A co-filing spouse (Debtor 2) needs the same identity/income
documents as the debtor. Surfacing them only on joint = Yes keeps the upload
list short for individual filers, and the tax-return "if filed separately"
qualifier avoids asking for a return that's already covered by the debtor's
joint return.

---

## Round 11 — Income section rebuilt around gated questions (2026-06-22)

**Files:** income.html, documents.html, FIELD-MAP.md

**What changed:** Reworked Income into a guided, single-filer-first flow:
- Title cased to "Income Information"; intro comma fixed.
- "Your employment" heading removed. Lead question **"Are you employed?"** →
  Yes reveals job card(s): occupation, employer name, employer address, how
  long employed, approximate annual gross income (before taxes). Repeatable with
  per-card **✕ Remove** (hidden when only one), plus an in-card dashed reminder
  to upload that job's pay stubs.
- **"Is there any other source of monthly income in your household?"** → Yes
  reveals source + amount-per-month rows, also repeatable with remove + an
  in-card proof-of-income reminder.
- Removed the "own a business" question (belongs in Financial Affairs / SOFA).
- Removed all placeholder examples (bare fields); kept the $ and the
  descriptive "Social Security, child support…" line.
- Upload sidebar split into three "needed + N/A" boxes: Pay stubs, Proof of
  other income, Bank statements (was two required boxes). Page-7 summary
  updated to match (count 3).
- **Conditional spouse income:** when marital status = Married (read from
  Personal via sessionStorage `mcl_marital`; demo override `?married=1`), a
  Spouse income block appears — "Is your spouse employed?" and "…other monthly
  income from your spouse?" mirroring the debtor, plus three spouse doc boxes
  (pay stubs, proof of other income, bank statements "only if not already
  provided"). Personal now saves marital status so Income can read it.

**Rationale:** Gated questions keep the form short and intuitive. Mapping to
Schedule I (employment Pt 1 + other income Line 8) means the data fills the form
directly. The Married-triggered spouse block satisfies the non-filing-spouse
income requirement promised by the Personal page's No/Unsure notices, without
asking for spouse identity details that aren't needed unless filing jointly.

---

## Round 12 — Assets: titles + Real estate rebuild (2026-06-23)

**Files:** assets.html

**What changed:**
- Title kept "Assets"; subtitle reworded (exempt/protected framing, detailed
  list with valuations). Intro box heading changed "What you own" → "Assets"
  with a one-line instruction; removed the specific doc list (uploads are
  conditional).
- **Real estate** converted to a gated question: "Do you own or have any
  interest in any real estate?" (residence, condo, home, land, timeshare,
  mobile home…) — starts blank, inline compact pill. Yes reveals the property
  card; No hides it.
- Property card (repeatable, ✕ Remove, hidden when one): address, home purchase
  date (MM/YYYY), estimated value with a clickable Zillow.com link + upload
  note. Two separate questions: "Do you want to keep the house?" and "Are you
  behind on mortgage payments?" — behind = Yes reveals a foreclosure info-tip
  ("must be filed before the sale date"). A dashed note says mortgage/HOA
  amounts and statements go in the Debts section.
- **Mortgage balance / monthly payment / HOA money fields removed** from Assets
  — they belong in Debts (Schedule D).
- Upload sidebar: replaced "Real estate tax assessment" with **Zillow valuation
  statement** (top) and added **Foreclosure documents · if any**.
- Ported the "toggles start unselected (no default)" fix to this page's shared
  script; cleared pre-set Yes on vehicle Financed?/Keep it? toggles.

**Rationale:** Assets should capture the property and its value (Schedule A/B);
the mortgage is a debt (Schedule D), so amounts move to Debts to avoid asking
twice and to match the forms. Gating real estate keeps the section clean. Zillow
link + valuation upload gives a concrete way to establish value.

---

<!-- Add new rounds below this line. Template:

## Round N — short title (date)
**File(s):** ...
**What changed:** ...
**Rationale:** ...
-->
