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

The page initially shows “Factory is running” and “Orders processed: 0”. Each
activation of “Run Factory” displays “Order received!” and increments the counter.
The counter is in memory and resets on reload; there is no backend or order storage.

The intended delivery flow is requirements → implementation on a task branch
from current `main` → PR to `main` → required CI and verification → explicit human authorization
→ merge → deployment. Run relevant local checks before pushing; review PR CI
results, applicable browser QA, and human acceptance before merge. Commit and
push only when requested; push or PR authorization does not authorize merge or
deployment. Merging to `main` triggers Pages deployment. Browser failures require
investigation: distinguish product defects from test-tool or environment problems
before changing working code.

Run `python3 scripts/check_site.py` from the repository root. It checks nonempty
HTML, the title and heading, initial status and counter, button label, required
unique IDs, document language, and mobile viewport metadata. It prints PASS/FAIL
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

One isolated Chromium test verifies the title, heading, visible/enabled button,
initial message and count, two mouse activations (counts 1 and 2), Enter activation
(count 3), reload resetting message/count, and activation after reload (count 1).
Reload uses the same browser context so stored counts cannot hide behind a fresh
session. Uncaught page JavaScript errors observed during these steps fail the test.
The test uses real browser input and waiting assertions, not direct handler calls
or fixed sleeps. There is one worker, a 30-second test timeout, five-second assertion
timeouts, and no automatic retries.

Failures retain a screenshot, trace, and available error context in `test-results/`.
Open a trace with `npx playwright show-trace <path-to-trace.zip>`. CI uploads available
failure diagnostics for seven days; setup failures remain visible in job logs even
when no browser artifacts exist. Generated files and local tooling are ignored by Git.
Diagnose installation/server/browser-launch failures separately from failed product
assertions; an ambiguous failure is not permission to change working product code.

## CI and deployment boundaries

Tracked configuration: `.github/workflows/ci.yml` runs on every branch push and on
pull requests opened, synchronized, or reopened. The existing Ubuntu job
**Validate static website** still runs the unchanged Python validator. A separate
Ubuntu job, **Verify browser interaction**, installs Node 24, uses `npm ci`, installs
Chromium with its system libraries, and runs `npm run test:browser`. Both use
read-only repository permissions. Browser setup adds downloads and CI time but no
deployment service, browser matrix, or application build.

The browser job is not a required merge check yet. Adding it to branch protection
is a separate, explicitly authorized action; this implementation does not change
GitHub settings or the delivery authorization gates.

External configuration, verified by the user in the previous delivery cycle and
reported on 2026-09-30:

- `main` branch protection is enabled and changes require a pull request.
- Required status check: **Validate static website**. Branches must be up to date
  before merge.
- Required approving reviews: **0**. Protection is enforced for administrators.
- Force pushes and branch deletion are disallowed.
- GitHub Pages remains configured from `main`, repository root.

PR #1 merged through this protected flow as `26655a0`; the user verified that
post-merge CI and Pages deployment both passed. These are externally verified
historical observations supplied by the user, not settings defined by the workflow
or independently rechecked during the original memory update. They supersede the
earlier observation that `main` was unprotected. Recheck external configuration
when a task depends on its current state; see `JOURNAL.md` for provenance.

During Browser Verification v1 commissioning on 2026-09-30, the agent read the
GitHub branch-protection API and reconfirmed the listed protection settings, with
only **Validate static website** required. No settings were changed. This newer
observation concerns protection only, not Pages configuration or historical run results.

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

- Consider making the browser job required after commissioning and explicit authorization.
- Make post-merge deployment depend on successful verification.
- Add post-deployment smoke checks.

Choose the next improvement from actual needs; none of these options authorizes
implementation or a change to deployment configuration.
