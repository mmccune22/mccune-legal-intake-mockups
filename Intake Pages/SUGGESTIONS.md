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

## Round 22 — SOFA follow-up fields built out (2026-06-28)

**Files:** financial-affairs.html, FIELD-MAP.md

**What changed:** Built the "Yes" follow-up inputs for all 26 SOFA toggle
questions (Q2–Q3, Q5–Q28). Each reveals a Form 107–matched set of fields as a
repeatable card (add/remove) where multiple entries are likely — e.g. Q6
creditor/paid/still-owed/dates; Q9 case title/court/number/status; Q13
recipient/relationship/describe/value/date; Q20 institution/type/last-4/
balance/date; Q27 business name/type/role/EIN/dates. Toggles now start blank
(no pre-set No). Q2/Q9/Q10 kept their original upload notes and gained the
structured card. Q2 prior-address note converted to a lightbulb info-tip.
Intro subtitle + video box reworded ("answer completely and accurately so your
lawyer can properly advise you; for some answers we'll ask for court
paperwork").

**Rationale:** Completes the SOFA so each answer maps to the actual Form 107
line. First-pass field choices — up for Matt's review question-by-question.

---

## Round 23 — SOFA review pass + Assets/Debts joint language (2026-06-30)

**Files:** financial-affairs.html, assets.html, debts.html, FIELD-MAP.md

**What changed:**
- **Assets & Debts** intros: added joint-filing instruction (list assets/debts
  owned by you individually, by your spouse individually, and jointly).
- **SOFA Q1** marital status simplified to Married / Not married (per the form).
- **SOFA Q2** rebuilt to the form's two-column structure: structured Debtor 1
  prior address (street/city/state dropdown/ZIP + From/To on one line), and a
  Debtor 2 (spouse) column that appears only when filing jointly, with a "Same
  as your prior address" checkbox. Prior-address note is now a lightbulb
  info-tip. Repeatable.
- **SOFA Q4 (income)** simplified: Yes/No → wages vs. self-employment/business
  type checkboxes + a note that exact annual figures come from the uploaded tax
  returns (no hand-entered 3-year grid). Q5 (other income) left as the
  repeatable source card.
- **SOFA Q6 (primarily consumer debts)** confirmed derived from the Debts
  business-debt branch — not asked on the SOFA. Documented in FIELD-MAP, along
  with the note that on-screen SOFA numbers are internal (field map is the
  crosswalk to Form 107 lines).

**Rationale:** Lean on documents/derivation instead of asking debtors to
hand-calculate or re-answer. Q2 matches the form's Debtor 1/Debtor 2 layout for
clean mapping.

---

## Round 24 — SOFA Part 3 reordered (insiders first) (2026-06-30)

**Files:** financial-affairs.html

**What changed:** Reordered Part 3 to match the SOFA: insider-payment and
insider-transfer questions now come first, followed by the 90-day $600 creditor
(preference) payment. Reveals moved with their questions. On-screen qn numbers
left as-is (internal; field map is the crosswalk) — can renumber for display
later if wanted.

---

## Round 25 — SOFA income Q4/Q5 polish + spouse handling (2026-07-01)

**Files:** financial-affairs.html, FIELD-MAP.md

**What changed:**
- Q4/Q5 upload notes reference pay stubs + tax returns (Q4) and proof of other
  income + tax returns (Q5), each reminding to upload in the Income section; Q5
  note reworded to mirror Q4.
- Q5 question wording matched to Q4 ("this year or in the two years before").
- Added Debtor 2 (spouse) options gated on joint filing: Q4 gets a "Your spouse"
  block with the same wages/business type checkboxes; Q5 source cards get a
  "Whose income is this?" (You / Your spouse) selector. Reuses the Q2
  joint-detection; generalized the gating JS with a `.spouse-only` class.
- FIELD-MAP: corrected Part 2 mapping (our Q4=Form 107 Q4 employment, Q5=Q5
  other income) and Part 3 (Q6 consumer-debts DERIVED from Debts; insider-first
  on-screen order).

**Rationale:** Keeps income honest to how data flows (documents + derivation) and
matches the form's Debtor 1/Debtor 2 columns for joint cases.

---

## Round 26 — Fix SOFA joint-filing trigger (2026-07-02)

**Files:** personal.html, financial-affairs.html

**What changed:** The SOFA Debtor 2 columns (Q2 address, Q4/Q5 income) were
keyed off marital status = Married, and Personal never saved the joint-filing
answer — so they didn't appear. Fixed: Personal now saves the "Will your spouse
be filing jointly?" answer to sessionStorage (`mcl_joint`); Financial Affairs
keys the Debtor 2 columns off `mcl_joint === 'yes'`. Demo override `?joint=1`.

**Rationale:** SOFA Debtor 2 columns should appear only for an actual joint
filing, not just because the debtor is married (a married person can file
alone = Debtor 1 only). The Income section's spouse-income block intentionally
still keys off marital status, since a non-filing spouse's income still matters
for the means test.

---

## Round 27 — SOFA numbering, insider definition, toggle fix (2026-07-02)

**Files:** financial-affairs.html

**What changed:**
- Renumbered on-screen SOFA questions sequentially 1–28 (the Part 3 reorder had
  left a gap). Field map remains the crosswalk to Form 107 lines.
- Added a plain-language **insider** definition info-tip at the top of Part 3 (so
  it's read before answering both insider questions); removed the statute cite
  and the now-redundant parentheticals on the two insider questions.
- Fixed the SOFA Yes/No toggle: it was stretching full-width (because `.sofa-q`
  carries `.field` = flex column). Added `align-self:flex-start` so it hugs its
  content, and matched the span styling (center + divider) to the other pages.

---

## Round 28 — SOFA Q6–Q28 form-alignment pass + FIELD-MAP rewrite (2026-07-02)
**File(s):** financial-affairs.html, FIELD-MAP.md
**What changed:**
- Completed the question-by-question review of SOFA against Form 107 (Q6–Q28),
  aligning every detail box to the official form:
  - **Q6–Q8** (Part 3): 90-day $600 creditor payment first, then the two insider
    questions; all three boxes identical (name, reason, total paid, still owed, dates).
  - **Q16/Q17** simplified to Who paid / Date / Amount (dropped "what for"/"what
    promised" — always money). Reworded Q16 to "seeking bankruptcy relief"; added
    debt-program parenthetical to Q17.
  - **Q18** added a plain-language "ordinary course" definition in the parenthetical.
  - **Q21/Q22** added "Do you still have it?" (Y/N) to match the form.
  - **Part 10 (Q24–Q26):** added a plain-language definitions info-tip (environmental
    law / site / hazardous material) using the same lightbulb widget as the insider
    tip; added "Name of site" to Q24/Q25 and put boxes on two lines; Q26 uses
    "Nature of the case" (not case number) per the form.
  - **Q27** expanded the business-connection parenthetical to the full Form 107 list,
    removed "role/connection," put "Dates business existed" From/To on one line.
  - **Q28** trimmed to Who received + Date (matches the form).
- **FIELD-MAP.md Section 6 fully rewritten:** on-screen Q numbers now align **1:1**
  with Form 107 line numbers (the old "internal sequence" caveat is retired). New
  per-question table lists the exact detail box captured and every carry-through.
**Rationale:** Every SOFA field now has a verified Form 107 destination, and the
crosswalk is accurate for the Codex handoff. Reminder: share FIELD-MAP.md with Jimmy.

---

## Round 29 — Documents summary v2 + new Step 7 counseling page (mockups) (2026-07-03)
**File(s):** documents-v2-mockup.html (new), counseling-step7-mockup.html (new), FIELD-MAP.md

**What changed:**
- **Documents step redesigned as a three-tier checklist** (mockup, does not replace
  documents.html yet):
  - Tier 1 "Required to submit" — hard-blocks submission (ID, SSN proof, pay stubs,
    bank statements).
  - Tier 2 "Upload these — or tell us why you can't" — upload OR a plain-language
    "I don't have this" answer with a one-tap reason (didn't file / don't have a
    copy / will send later). Either resolves the item; reason is stored per item.
  - Tier 3 "Optional" — collapsed by default, never blocks, never counts in progress.
- Progress bar counts **required items only** (tier 1 + tier 2); optional items can
  never keep it from 100%.
- Submit gating: hard modal if tier-1 items open; soft "submit now, add later" modal
  if only tier-2 items are open or marked "later."
- Interview-derived skips surfaced in a banner ("we're not asking for vehicle title —
  no vehicle listed") — checklist is generated from earlier sections, N/A is the
  fallback, not the default.
- Catch-all drop zone ("not sure where it goes? drop it here") — AI classifies the
  upload into the right checklist item, debtor confirms.
- **Language rule applied: no "N/A" anywhere.** All copy rewritten to ~5th-grade
  reading level ("I don't have this," "That's okay — which one fits?").
- **New Step 7 — Counseling class** (counseling-step7-mockup.html), between
  Financial Affairs and Documents; Documents becomes Step 8 (8-step topnav):
  - Explainer facts (≈1 hour, phone or computer, $10–50, fee help available).
  - Two paths: "Yes, I took it" → certificate upload + provider/date (both
    extractable from the certificate, confirm-style); "Not yet" → firm-preferred
    provider card with firm code, 3-step how-to, and reassurance that they can keep
    going.
  - **Decision: NOT a submit gate.** Debtor can submit the intake without the
    certificate; the follow-up email system chases it. Case can't be *filed* without
    it — that constraint lives with the attorney, not the form. 180-day validity
    note shown on the "not yet" path.

**Rationale:** The counseling class is a *task*, not a *fetch* — burying it as a
checklist row undersold the one item debtors must go do. A dedicated step explains
it and routes them to the class, while soft-gating keeps completed intake data
flowing into the database for instant case analysis instead of stalling at the
last step. Three-tier checklist fixes the old page treating a hard court
requirement and "foreclosure docs · if any" as visually identical, and stops
optional items from inflating "still needed" counts.

---

## Round 30 — counseling.html added to the live flow; 8-step topnav wired (2026-07-03)
**File(s):** counseling.html (new), personal.html, income.html, assets.html, debts.html, expenses.html, financial-affairs.html, documents.html, README.md

**What changed:**
- Built production `counseling.html` from the shared page shell (same head/CSS as
  the other pages) implementing the Step 7 mockup: facts row, "Have you taken the
  class yet?" two-path choice, certificate upload with provider/date confirm
  fields, provider card + 3-step how-to, keep-going reassurance, 180-day note.
- All seven flow pages' topnavs updated to **8 steps**: "Counseling class" inserted
  as step 7, Documents renumbered to 8 (shown as done ✓ on documents.html).
- financial-affairs.html Continue button now goes to counseling.html (was
  documents.html).
- README page table updated (counseling + documents rows added).
- documents.html content itself is **unchanged** — the three-tier redesign is
  still mockup-only (documents-v2-mockup.html) pending approval.

**Rationale:** Step 7 approved from the mockup (Round 29). Soft gate stands:
Continue is never blocked; the follow-up system chases the certificate.

---

## Round 31 — counseling.html rebuilt on the uniform section layout (2026-07-03)
**File(s):** counseling.html

**What changed:** Rebuilt the page on the standard two-column shell used by
steps 1–6: left docbar rail (secure badge, 0/1 count, progress bar, one
"Counseling class certificate" upload button — no N/A pill), section-video row
(sv-intro + Vimeo frame; **iframe src left empty** with a comment for Matt's
video), facts row, and the standard `.qrow` Yes/"Not yet" toggle revealing
either the certificate upload card (with provider/date confirm fields) or the
how-to card (provider link + 3 steps + keep-going and 180-day callouts).
Footer matches the other pages (Save & continue → documents.html, saved flag,
Save & exit). Docbar upload button opens the Yes path and syncs with the drop
zone.

**Rationale:** Uniform look across all eight steps; video slot ready for the
section-guide video.

---

## Round 32 — DOC-LOGIC.md: conditional document-request spec for devs (2026-07-03)
**File(s):** DOC-LOGIC.md (new), DOC-REQUESTS.md (new, Round 31.5 snapshot), FIELD-MAP.md

**What changed:**
- **DOC-REQUESTS.md**: complete inventory of the 25 current document requests by
  section, with tier / N/A availability / reveal conditions, plus 7 discrepancies.
- **DOC-LOGIC.md**: the redesign spec — every possible doc_type with an IF → THEN
  trigger over existing intake answers (e.g., no real estate → no Zillow, no
  foreclosure docs, no mortgage or HOA statements). Includes: three tiers
  (T1 required / T2 needed-with-reason / T3 optional), plain-language skip
  reasons replacing "N/A", dedup rules (bank statements = one doc_type satisfying
  Income + Assets), per-instance child items (one KBB per vehicle), trigger
  retraction, a shared JSON state model, and Step 8 summary/submit-gate behavior.
- **Decisions (Matt, 2026-07-03):** bank statements move to hard-required;
  pay stubs conditional on employment (not everyone has them); no utility bill
  requests in Expenses (FIELD-MAP Document → Section map updated accordingly);
  counseling certificate stays soft-gated.

**Rationale:** Generated checklists kill most "N/A" taps before they exist; the
shared doc_type state fixes the rail-vs-summary sync gap; the spec is the
developer handoff artifact alongside FIELD-MAP.md.

---

## Round 33 — DOC-LOGIC redesign applied to the live pages (2026-07-03)
**File(s):** documents.html (rebuilt), personal.html, income.html, assets.html, debts.html, expenses.html, financial-affairs.html, counseling.html, DOC-REQUESTS.md

**What changed:**
- Plain-language sweep of all rails (no "N/A" anywhere); data-doc IDs on every
  upload button; Income bank statements hard-required; Assets duplicate bank
  request removed; Income rail demonstrates trigger gating (pay stubs appear
  only when employed = Yes).
- documents.html rebuilt as the three-tier summary per DOC-LOGIC §7 (tier-first
  groups, required-only progress, section-origin chips, reason chips, hard/soft
  submit gate, derived-skips banner, catch-all zone). Demo scenario: individual
  renter, employed, financed vehicle.

**Rationale:** Implements Rounds 29/32 on the live mockups so Matt can click
the real flow end-to-end. Full cross-page shared doc state stays a dev-build
item (specced in DOC-LOGIC §6); the mockups approximate it per page.

---

## Round 34 — Personal Info: prior bankruptcy + dependents now mandatory (2026-07-04)
**File(s):** personal.html, FIELD-MAP.md

**What changed:** "Have you filed for bankruptcy before?" and "Do you have
dependents?" now carry the required marker; FIELD-MAP Req column updated for
both. Dev build: these two toggles must have an answer (Yes or No) before the
section validates — a blank is not a No. Prior-case history gates refiling
eligibility/automatic-stay analysis (Form 101 Pt 3); dependents drive Schedule J
and means-test household size.

---

## Round 35 — Full gating audit: 107 static checks + 74 dynamic assertions, all pass (2026-07-05)
**File(s):** gating-test.js (new — jsdom harness, rerunnable)

**What was verified:**
- Static (107 checks): every overlay-referenced doc_type button, element id, and
  label-match string exists on its page; all DOC-LOGIC conditional doc_types are
  gated; cross-page keys written by Assets are read by Debts; no visible "N/A"
  text anywhere.
- Dynamic (74 assertions, real page scripts in a headless DOM): income default/
  employed/other-income flows incl. hide-on-No; married spouse gating both
  directions; assets all six items incl. the investments OR-gate flipping on/off
  via different source questions; mcl_doc_triggers persistence; debts clean
  (only unsecured visible), all five question gates, two-property + vehicle
  carryover with labeled panels, HOA reveal, answer-only fallback panels; SOFA
  court paperwork Q9/Q10 OR-gate both directions; personal spouse docs hidden by
  default; Step 8 tier counts, required-only progress, and soft-modal contents.

**Result: 181/181 pass.** Known mockup-only limits (specced for dev in
DOC-LOGIC): per-tab sessionStorage; hidden-after-upload items keep their upload
(dev build marks `orphaned` per §5.4).

---

## Round 36 — Full-intake UX runthrough vs mortgage/tax industry + confirmation rebuild (2026-07-05)
**File(s):** confirmation.html (rebuilt), DOC-LOGIC.md (§8 roadmap added)

**What changed:**
- **confirmation.html rebuilt** — it still carried the pre-redesign doc rail
  (retired items, "N/A"/"Marked N/A" language). Now a post-submit status page:
  success hero, 3-step what-happens-next (review → follow-up → strategy
  session), "Book my strategy session" CTA, and a sample "Still on the list"
  open-items block (live build renders from shared doc state). No rail.
- **DOC-LOGIC §8** logs the approved roadmap: bank linking as alternate
  satisfier for bank_statements; reviewing/needs_attention verification states;
  magic-link resume + SMS; Spanish; extraction prefill priority; time
  estimates.

**Assessment summary (vs Rocket/Blend/TurboTax-class onboarding):** at or ahead
on conditional logic, plain language, contextual collection, soft gating, and
AI catch-all sorting; gaps closed by the §8 roadmap (bank linking, verification
loop, post-submit experience, passwordless resume, localization).

---

## Round 37 — Step 8 summary goes dynamic; answer persistence across all sections (2026-07-05)
**File(s):** documents.html, income.html, assets.html, debts.html, financial-affairs.html, gating-test.js

**What changed:**
- All section overlays now **merge** their raw answers into one sessionStorage
  object (`mcl_doc_triggers`): employed/other-income/spouse (Income);
  real-estate/vehicle/financed/behind-mortgage/behind-payments/investments
  (Assets); other-secured/DSO/back-taxes/student-loans/business-debt/HOA
  (Debts); lawsuit (SOFA Q9/Q10).
- **documents.html tier-2 list and the "not asking for" banner are now
  generated from those answers** — the summary finally reflects what the debtor
  actually said instead of a hardcoded demo scenario (mockup approximation of
  DOC-LOGIC §6 shared state). Clean session shows taxes + counseling only.
- "Other documents" origin chip: "Anything" → "Extra".
- Harness updated: clean-session and seeded-session summary scenarios;
  **84/84 dynamic + 107 static checks pass.**

**Open item flagged to Matt:** the Step 8 section video predates the three-tier
redesign — check narration still matches.

---

## Round 38 — Spouse documents now flow to the Step 8 summary (2026-07-05)
**File(s):** personal.html, documents.html, gating-test.js

**What changed:**
- personal.html persists the joint-filing answer into `mcl_doc_triggers.joint`.
- documents.html Step 8 now renders the full spouse set per DOC-LOGIC:
  joint = Yes → spouse ID + spouse SSN proof appear in **Required to submit**
  (tier 1) and spouse tax returns in tier 2 with a "We filed together" reason;
  married but not joint → spouse bank statements requested instead (joint
  accounts otherwise covered); spouse pay stubs / other-income proof follow
  their Income toggles as before.
- Harness: 3 new scenarios (joint, married-not-joint, personal persistence) —
  **93 dynamic + 107 static, all pass.**

**Rationale:** Previously only spouse pay stubs reached the summary; a joint
filing's required spouse identity docs were invisible on Step 8 and couldn't
gate submit.

---

## Round 39 — Step 8 completeness check: all doc_types now renderable (2026-07-05)
**File(s):** documents.html, gating-test.js

**What changed:** Systematic sweep of DOC-LOGIC §3 vs the Step 8 renderer found
two missing rows: `vehicle_title` (vehicle AND not financed) and `repo_docs`
(financed AND behind on payments). Both added; harness covers the mutually
exclusive financed states. Coverage now 32/32 doc_types (correction: an audit regex missed the 4 tax-return doc_types containing digits; they were already renderable — true total is 32); **97 dynamic + 107
static checks pass.**

---

## Round 40 — Fix stale spouse-doc trigger: joint requires Married everywhere (2026-07-05)
**File(s):** personal.html, documents.html, gating-test.js

**What changed:** Matt saw spouse ID/SSN in "Required to submit" without a
married-joint answer. Cause: the joint flag could go stale — answering Married +
jointly Yes, then changing marital status back, left `joint=yes` in storage
(the hidden toggle never re-fires). Fixes: personal.html computes joint as
*Married AND toggle Yes* and re-applies on marital-status change; documents.html
requires MARRIED && joint for spouse T1 rows and spouse tax returns. Two new
harness scenarios (stale-joint, marital-switch); **101 dynamic + 107 static
pass.**

---

## Round 41 — Assets: structured property address per Schedule A/B (2026-07-06)
**File(s):** assets.html, FIELD-MAP.md, gating-test.js

**What changed:** The real-estate card's single "Property address" line is now a
structured block matching Personal Info's home address exactly (Number and
street / City / State select / ZIP), because Schedule A/B Pt 1 needs the full
mailing address. The Debts carryover intentionally uses **street only** — the
secured-debt panel header stays "Your property · 123 Main St" so the debtor can
attach the mortgage/HOA to the right asset without address clutter. Carryover
mechanics unchanged (street is still the card's first input). Repeatable
"Add another property" cards clone the full structured block.

---

## Round 42 — SOFA: marital-status question removed; renumbered 1–27 (2026-07-06)
**File(s):** financial-affairs.html, FIELD-MAP.md, DOC-LOGIC.md, gating-test.js

**What changed:** Old Q1 (marital status) removed — it duplicated Personal Info
(it was already pre-populated from there). Form 107 Pt 1 L1 is now derived,
never asked. Remaining questions renumbered sequentially 1–27, so **on-screen
QN = Form 107 line N+1**; FIELD-MAP §6 documents the offset and remains the
authoritative crosswalk (this supersedes Round 28's 1:1 alignment — ask-once
beats number-matching). Court-paperwork gate updated to on-screen Q8/Q9
(lines 9/10); DOC-LOGIC trigger table updated; harness renumbered — 103
dynamic + 107 static pass.

---

## Round 43 — Fix: Personal now restores its answers; SOFA spouse columns work reliably (2026-07-06)
**File(s):** personal.html, gating-test.js

**What changed:** Matt's live test of the SOFA Debtor-2 columns failed. Root
cause: personal.html had NO restore-on-load — revisiting it reset the marital
select to blank, the base sync() then overwrote `mcl_marital` with '' at load
(pre-existing bug), and Round 40's stale-joint guard then cleared `mcl_joint`
too. Any return trip through Personal silently killed the spouse logic
downstream. Fix: a pre-script snapshots storage before the base script runs;
the overlay restores the marital select and joint toggle from it (via real
change/click events so all the base reveal logic replays). New harness
scenarios: revisit-restores-and-preserves-storage, plus SOFA spouse columns
visible with joint=yes and hidden without — **111 dynamic + 107 static pass.**

---

## Round 44 — All SOFA questions mandatory with required marker (2026-07-07)
**File(s):** financial-affairs.html, FIELD-MAP.md

**What changed:** All 27 SOFA questions now carry the red asterisk, glued to
the question mark with a non-breaking space (same-line rule from Round 34's
asterisk fix). FIELD-MAP §6 notes the dev-build rule: every Yes/No must be
explicitly answered — a blank is not a No. Matches Form 107 reality: the
debtor must answer every line under penalty of perjury.

---

## Round 45 — Debts: all questions mandatory with required marker (2026-07-07)
**File(s):** debts.html

**What changed:** All eight Yes/No gate questions (other-secured, domestic
support, back taxes, student loans, co-signer, business debt, >50% business
debt, and the per-property HOA question in the generated panel) plus the
unsecured-debt total estimate now carry the red asterisk, nbsp-glued per the
same-line rule. Dev rule same as SOFA (Round 44): every gate must be
explicitly answered — a blank is not a No.

---

## Round 46 — Income: all gate questions mandatory with required marker (2026-07-07)
**File(s):** income.html

**What changed:** "Are you employed?" and "Is there any other source of monthly
income in your household?" now carry the red asterisk, plus the two spouse
mirrors in the conditional married block. Same dev rule: explicit Yes/No
required — a blank is not a No. (These four gates also drive the pay-stub /
other-income document triggers, so an unanswered gate would otherwise silently
suppress document requests.)

---

## Round 47 — Home address gets Jimmy's Find Address autocomplete (2026-07-09)
**File(s):** personal.html

**What changed:** Ported the assets address-autocomplete component (Jimmy's, from
assets.html) to the Personal Info home address. Same endpoint
(intake.bkfastlane.com/api/address-suggest), same CSS, same behavior: type 5+
chars in Number and street → ranked suggestions (Boulder County / CO
prioritized), click fills street/city/state/ZIP and closes the menu. Zillow
zestimate branches self-disable on this page (no such elements). Verified via
mocked-API smoke test + full harness (111/111).

**Note for Jimmy:** the component now exists in two copies (assets.html +
personal.html, rescoped to #homeAddressCard with 3 string-level changes).
Good candidate to extract into a shared address-autocomplete.js alongside
data-intake-best-practices.js. Spouse address + mailing address are not yet
enhanced — say the word if wanted.

---

## Round 48 — Counseling attorney code gets an accessible copy control (2026-07-10)
**File(s):** counseling.html, gating-test.js, jimmy-changes.js

**What changed:** Added a dedicated copy icon beside attorney code `449858` on
the Counseling class page. The control uses the browser Clipboard API, falls
back for older or restricted browsers, announces `Copied` through an ARIA live
status, and selects the code with a `Press Ctrl+C` prompt if copying is blocked.
The external Cricket Debt link and code are unchanged. The shared Colab feed
also records this release and the CRM organization-name/logo synchronization
completed on 2026-07-10. The harness now covers the clipboard interaction and
uses deterministic address-API stubs plus stable SOFA question attributes;
**116/116 dynamic checks pass.**

**Rationale:** Copying is an explicit, keyboard-accessible action with clear
feedback; opening the external training site does not unexpectedly overwrite
the debtor's clipboard.

---

<!-- Add new rounds below this line. Template:

## Round N — short title (date)
**File(s):** ...
**What changed:** ...
**Rationale:** ...
-->
