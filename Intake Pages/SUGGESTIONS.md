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

## Round 13 — Assets: Vehicles rebuild + sidebar docs (2026-06-23)

**Files:** assets.html, documents.html, FIELD-MAP.md

**What changed:**
- **Vehicles** converted to a gated, repeatable card like Real estate: "Do you
  own or have any interest in any vehicles?" (…or similar property) → Yes reveals
  card(s) with ✕ Remove. Fields: year/make/model/mileage, vehicle purchase date
  (MM/YYYY), estimated value with a clickable KBB.com link + upload note.
- "Is this vehicle financed or leased?" gates the rest: Yes reveals "Do you want
  to keep the vehicle?" and "Are you behind on payments?" (Yes → repossession
  info-tip: file before repossession if you want to keep it). No reveals an
  "upload the title" note. Loan balance/payment moved to Debts (Schedule D).
- Foreclosure note reworded to add "and you want to save the house"; repossession
  note mirrors it ("and you want to keep the vehicle").
- Asset upload sidebar updated: added KBB valuation statement, Vehicle title (if
  any), Vehicle repossession documents (if any); removed Lien-free vehicle title
  and Vehicle/asset valuation. Page-7 summary rebuilt to match (count 6).

**Rationale:** Same asset-vs-debt split as real estate — the vehicle and its
value belong in Assets (Schedule A/B); the loan is a secured debt (Schedule D).
Gating keep/repossession on "financed" keeps paid-off vehicles simple. KBB link
gives a concrete valuation path.

---

## Round 14 — Assets: Personal/Household + Financial Assets to Schedule A/B (2026-06-24)

**Files:** assets.html, documents.html, FIELD-MAP.md

**What changed:**
- **Personal and Household Items** (new heading, placed after Vehicles per Sch
  A/B order) — table rebuilt to the official Part 3 categories (Q6–14) with brief
  summaries: household goods, electronics, collectibles, sports/hobby, firearms,
  clothes, jewelry, animals/pets (now a value), and "other" with inline describe.
  Garage-sale wording.
- **Financial Assets** (new heading) — replaced the "tap a chip" UI with the
  full Sch A/B Part 4 (Q16–35) as individual Yes/No questions under "Do you own
  or have any interest in any of the following:". Symmetrical layout (fixed-width
  labels so all pills align; long labels wrap). Each Yes reveals a value;
  describe fields added where the form needs detail (business, bonds, security
  deposits, education, trusts, IP, licenses, money owed, inheritance, claims,
  other). Repeatable cards (institution/type/value + statement-upload reminder
  naming the box) for: bank/financial accounts, bonds/stocks, retirement/pension,
  annuities, insurance, legal claims, and "other financial assets." Legal-claims
  "must be listed" warning is always visible.
- Cash + accounts reworded to item style (dropped "Do you have any…").
- Upload sidebar: renamed "Other account statements" → "Bank or financial
  account statements"; added "Investments, retirement, pensions, etc." Page-7
  summary updated (Assets count 7).

**Rationale:** Mirrors Schedule A/B exactly (Parts 3–4) so the data maps 1:1 to
the form. Yes/No-with-reveal keeps a long list scannable; repeatable cards handle
multiple holdings; named upload boxes tell debtors exactly where each statement
goes and avoid duplicate uploads already provided in Income.

---

## Round 15 — Assets: Business + Farm/Fishing property (Parts 5–6) (2026-06-24)

**Files:** assets.html, FIELD-MAP.md

**What changed:** Added the final two Schedule A/B sections after Financial
Assets:
- **Business Related Property** (Part 5) — single gated Yes/No; Yes reveals a
  large description box (unpaid commissions, accounts receivable, office
  equipment/supplies, machinery, tools/fixtures, inventory, partnership/business
  interests, other).
- **Farm & Commercial Fishing Property** (Part 6) — single gated Yes/No; Yes
  reveals a large description box (farm animals/livestock, crops, farm/fishing
  equipment, machinery and implements, other).
Both reuse the Financial Assets `.faTg[data-reveal]` wiring. Hyphens removed from
headings/labels per request.

**Rationale:** Completes Assets coverage of Schedule A/B Parts 1–6. These two are
rare for consumer debtors, so a single gated question with a free-text box is
enough — the attorney follows up if Yes.

---

## Round 16 — Debts: Secured Debts with Assets carryover (2026-06-25)

**Files:** assets.html, debts.html, FIELD-MAP.md

**What changed:** Added a **Secured Debts** section at the top of Debts, built on
the first real cross-section carryover:
- assets.html now saves to sessionStorage (`mcl_secured`) every real estate
  address and every vehicle marked financed/leased (year/make/model).
- debts.html reads it and generates a bordered panel per asset. **Real estate ·
  [address]** panels (assumed secured — no gate) contain repeatable Mortgages
  (lender/balance/payment) and a gated, repeatable HOA sub-section (name/balance
  if behind/monthly dues). **Vehicle · [year make model]** panels contain the
  loan/lease (lender/balance/payment).
- Catch-all at the end: "Are there any other debts where a creditor can take
  back property if you don't pay?" → repeatable card (lender, collateral, amount
  owed, monthly payment).
- Upload sidebar: added Mortgage statements, HOA statements, Other secured debt
  statements, Vehicle loan/lease statements (in that order); each card's reminder
  names its box.
- Fixed two bugs: double-add (shared wireAddRow also firing — renamed my add rows
  to `.secadd`); HOA reveal not firing (scoped to `.prop-panel` not `.item`).

**Rationale:** Most consumer secured debt is a mortgage or car loan already
captured as an asset, so carrying the asset over and asking only for the loan
terms avoids re-entry and matches Schedule D. Per-property panels keep multiple
properties/mortgages/HOAs clearly separated.

---

## Round 17 — Debts: Priority Debts (Schedule E) (2026-06-27)

**Files:** debts.html, FIELD-MAP.md

**What changed:** Added a **Priority Debts** section after Secured Debts with two
gated, repeatable questions:
- "Do you owe any domestic support obligations?" (child support, alimony,
  maintenance) → owed to whom, total owed (if behind), monthly amount + a
  "Domestic support documents" upload reminder.
- "Do you owe any back taxes?" (IRS or state) → taxing authority, tax year(s),
  amount owed + a "Tax notices" upload reminder.
Removed the old scattered "Back taxes?" block and "Do you owe child support…"
yes/no (consolidated here). Added "Domestic support documents" and "Tax notices"
upload boxes. Added the missing `.fa-q` style to debts.html (spacing was off);
DSO question label sized to content so it stays on one line.

**Rationale:** Domestic support and taxes are the common priority (Schedule E)
debts and get special treatment, so they deserve their own section separate from
general unsecured debt.

---

## Round 18 — Debts: Student Loans, Unsecured, Co-signers (2026-06-27)

**Files:** debts.html, FIELD-MAP.md

**What changed:**
- **Student Loans** section: explanatory subtitle (presumed non-dischargeable,
  sometimes dischargeable, talk to attorney); gated repeatable card + "Student
  loan statements" upload box. Removed the old lump "Student loans" field.
- **Unsecured Debts**: collapsed category totals into a single "Estimated total
  unsecured debt" field with a prominent info-tip — credit reports pulled but
  upload statements; **medical bills no longer show on credit reports** so upload
  every one; also upload collection/attorney letters. New required "Unsecured
  debt statements & collection / attorney notices" box; removed the old generic
  "Statements for all debts" and "Attorney / collector letters" boxes.
- Moved "Creditors without a statement" directly under Unsecured.
- **Co-signers**: "Has anyone co-signed?" → info-tip (co-signer stays liable
  after your bankruptcy) + repeatable card (name, which debt, mailing address).
  Kept the two business yes/no questions; wrapped the three wrap-up questions in
  a card to match the Creditors section indentation; aligned the Yes/No pills.

**Rationale:** Rounds out Debts across Schedules D/E/F (plus H co-signers).
Student loans and the medical-bill upload point are practice-critical nuances.

---

## Round 19 — Business-debt branch + section UX (2026-06-27)

**Files:** debts.html, personal/income/assets/expenses/financial-affairs.html

**What changed:**
- Debts business-debt question reworded ("…a business you owned or self
  employment?"). Yes reveals a personal-guarantee info-tip + a "Business debt
  statements" upload box, and gates the >50% follow-up ("Is it possible that
  more than 50% of all of your debt is related to your business or self
  employment?"), which on Yes reveals a "special considerations" info-tip.
- Unsecured total field relabeled to a plain-language prompt.
- Added a tailored end-of-section reassurance message (sage box + checkmark)
  above the footer on all six section pages — calm/steady tone, varied per
  section, not peppy.
- Reordered every section footer so **Save & continue (primary) is on the left**
  as the preferred forward action, with Save & exit on the right.

**Rationale:** The business-debt branch surfaces the non-consumer-debtor and
personal-guarantee issues that matter for eligibility. The end-of-section
message reassures distressed users their progress is saved; left-aligning the
primary button matches reading order and reduces accidental exits.

---

## Round 20 — Expenses to Schedule J + saved-state honesty (2026-06-27)

**Files:** expenses.html, all six section pages

**What changed:**
- **Expenses** rebuilt to mirror Schedule J line-by-line, grouped by the form's
  structure (Home, Utilities, Living & family, Transportation & insurance, Other
  obligations) with friendly labels. Filled previously-missing J lines (5, 6d,
  10, 16, 19, 20); removed demo dollar values. Mortgage/HOA/vehicle-payment rows
  carry from Debts silently (no "carries from Debts" label).
- **Saved indicator fix:** the footer "✓ Saved automatically" was always showing
  before any input. Now hidden until the user types in any field.
- **End-of-section messages** reworded so they no longer claim "your progress is
  saved" before the user acts — now frame it as "save and continue," and add
  reassurance that they can "save and exit and come back later to finish."

**Rationale:** Matching Schedule J makes Expenses map 1:1 to the form like the
other sections. The saved-state changes remove a misleading "saved" claim — the
form shouldn't say it saved before the user does anything.

---

## Round 21 — SOFA carry-throughs are editable pre-fills (2026-06-27)

**Files:** financial-affairs.html, FIELD-MAP.md

**What changed:** The two read-only carry-through boxes on the SOFA (Q1 marital
status from Personal Info; Q4 income from Income) were locked grey panels. Now
they are normal editable fields **pre-populated** with the carried value, plus a
hint: "We carried this over from your [section] — if it is not correct, you can
change it here." Q1 is an editable dropdown; Q4 an editable amount field.

**Rationale:** A locked box that shows a value the debtor can't fix is
frustrating if the carryover is wrong. Pre-fill + editable respects the
"ask once" intent while letting the debtor correct it.

---

<!-- Add new rounds below this line. Template:

## Round N — short title (date)
**File(s):** ...
**What changed:** ...
**Rationale:** ...
-->
