# Current architecture

## Components and responsibilities

| Component | Responsibility |
| --- | --- |
| Codex or another agent | Inspect, plan, implement, verify, and report within the authorized scope. |
| `AGENTS.md` | Define repository work and verification rules. |
| `docs/` memory and PR template | Preserve context, guide session handoff, and expose each task's memory-impact assessment; no automated memory enforcement. |
| `index.html` | Self-contained HTML, CSS, and JavaScript; no application dependencies or build step. |
| Git | Record reviewable changes and version history. |
| GitHub | Host the shared repository and support collaboration. |
| GitHub Actions | Run the `Website CI` static validation and browser interaction jobs. |
| `scripts/check_site.py` | Check initial HTML properties using Python's standard library. |
| Playwright Test, `tests/factory.spec.js`, and `playwright.config.js` | Verify the page in Chromium over local HTTP; development-only dependencies with a committed npm lockfile. |
| GitHub Pages | Publish the static website using externally configured repository settings. |
| Browser QA | Verify rendered appearance and important real user interactions. |
| Human acceptance | Confirm that results satisfy the intended requirements before requested delivery. |

## Website and verification flow

Factory Order Intake v1 replaces the demonstration button with a labelled multiline
Business requirement field and Submit order action. Empty or whitespace-only input
shows an accessible error and creates no order. All other text is accepted without
quality assessment or an arbitrary length cap. Surrounding whitespace is trimmed;
internal whitespace and line breaks are retained.

The page keeps an `orders` array of `{ id, requirement, status }` records in memory.
Identities are ORD-1, ORD-2, and so on within that page session; the only status is
Received. Each successful submission appends a visible receipt without replacing
older ones, clears the input/error, and returns focus to the field. Requirement
text is rendered with `textContent`, never interpreted as HTML. An invalid submission
preserves the input and earlier receipts, marks the field invalid, and focuses it.

Permanent copy explains that orders belong only to the current browser session in
this tab and that planning/execution have NOT started. Reload clears orders and the
draft and restarts numbering. Other tabs have independent state. There is no backend,
browser storage, AI call, agent invocation, planning, repository automation, or
simulated execution. The form's draft and validation message are UI state, not orders.
Persistence, globally unique identities, and any execution lifecycle are later steps;
receipt currently means acceptance into local page memory only.

The intended delivery flow is requirements → implementation on a task branch
from current `main` → PR to `main` → required CI and verification → explicit human authorization
→ merge → deployment. Run relevant local checks before pushing; review PR CI
results, applicable browser QA, and human acceptance before merge. Commit and
push only when requested; push or PR authorization does not authorize merge or
deployment. Merging to `main` triggers Pages deployment. Browser failures require
investigation: distinguish product defects from test-tool or environment problems
before changing working code.

Run `python3 scripts/check_site.py` from the repository root. It checks nonempty
HTML, the title and heading, initial intake/empty state, submission form and label,
multiline input without a length cap, accessible error association, permanent
session/execution disclosure, required unique IDs, language, and viewport metadata. It prints PASS/FAIL
for checks and exits nonzero on failure. It is not a full HTML validator.

### Browser Verification v1

Prerequisites: Node.js 24 with npm and Python 3 available as `python3`. From the
repository root, install the locked development dependencies and Chromium, then
run both checks:

```sh
npm ci
npx playwright install chromium
python3 scripts/check_site.py
npm run test:browser
```

On Linux, use `npx playwright install --with-deps chromium` to install browser
system libraries as well. After updating Playwright, reinstall its matching browser.
For diagnosis, use `npm run test:browser -- --headed`.

Playwright starts and stops Python's standard-library HTTP server, serving this
repository on `http://127.0.0.1:8765`. It waits for readiness and refuses to reuse an
existing server; free port 8765 before running. No build step or application
dependency was added. The browser download and Node packages are verification tools.

One isolated Chromium test verifies initial state and permanent disclosure, empty
and whitespace-only rejection, trimmed multiline receipts with sequential identities
and Received status, preservation of previous orders, literal HTML-like text,
keyboard submission, focus/error recovery, resubmission without new text, and a
requirement longer than 5,000 characters. Enter in the textarea inserts a newline.
Reload uses the same browser context and verifies cleared orders/draft plus restarted
numbering. Observed uncaught page JavaScript errors fail the test. It uses real browser
input and waiting assertions, not direct handler calls or fixed sleeps. There is one
worker, a 30-second test timeout, five-second assertion timeouts, and no automatic retries.

Failures retain a screenshot, trace, and available error context in `test-results/`.
Open a trace with `npx playwright show-trace <path-to-trace.zip>`. CI uploads available
failure diagnostics for seven days; setup failures remain visible in job logs even
when no browser artifacts exist. Generated files and local tooling are ignored by Git.
Diagnose installation/server/browser-launch failures separately from failed product
assertions; an ambiguous failure is not permission to change working product code.

## CI and deployment boundaries

Tracked configuration: `.github/workflows/ci.yml` runs on every branch push and on
pull requests opened, synchronized, or reopened. The existing Ubuntu job
**Validate static website** runs the Python static validator. A separate
Ubuntu job, **Verify browser interaction**, installs Node 24, uses `npm ci`, installs
Chromium with its system libraries, and runs `npm run test:browser`. Both use
read-only repository permissions. Browser setup adds downloads and CI time but no
deployment service, browser matrix, or application build.

Live branch protection after the explicitly authorized promotion on 2026-09-30,
read back and verified by the agent through GitHub's API:

- `main` requires a pull request.
- Required checks: **Validate static website** and **Verify browser interaction**.
  Both are bound to GitHub Actions (app ID `15368`). These are the exact check
  names, not the workflow name `Website CI` or YAML job IDs.
- Strict/up-to-date checking remains enabled.
- Required approving reviews: **0**. Administrator enforcement remains enabled.
- Force pushes and branch deletion remain disabled.
- A full before/after protection comparison confirmed that only the required
  check list changed; all other protection fields were preserved.

The browser job was initially non-required during commissioning. Promotion followed
successful fault-injection checks and the successful main CI run on PR #3's merge
commit `9e18941c840c1bbc7e90bd1d4d9f2894ee4a8126`. See `JOURNAL.md` for evidence.
No workflow, application, or Pages settings changed during promotion. Future job
renames must keep required-check names aligned. Current push and PR triggers cover
normal delivery; introducing a merge queue would require a `merge_group` trigger.

Pages was last reported by the user on 2026-09-30 as configured from `main`,
repository root. That source setting was not rechecked or changed during promotion.
External settings can change; recheck them when a task depends on their current state.

**The enforced quality gate is before merge.** CI and Pages still run independently
after merge; a failed post-merge CI run does not itself block Pages deployment.
Zero required approving reviews does not remove the agent policy requiring explicit
human merge authorization. The workflow alone does not configure branch protection.

CI now executes JavaScript and checks the specified mouse/Enter interaction in
Chromium. It does not verify other browsers, responsive appearance, comprehensive
accessibility or screen-reader output, every input sequence, delayed errors after
the scenario finishes, or the deployed Pages site. Browser QA and human acceptance
remain necessary. Browser automation reliability varies by session and environment.

## Possible next steps — not commitments

- Make post-merge deployment depend on successful verification.
- Add post-deployment smoke checks.

Choose the next improvement from actual needs; none of these options authorizes
implementation or a change to deployment configuration.
