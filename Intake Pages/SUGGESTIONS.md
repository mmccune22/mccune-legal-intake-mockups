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

<!-- Add new rounds below this line. Template:

## Round N — short title (date)
**File(s):** ...
**What changed:** ...
**Rationale:** ...
-->
