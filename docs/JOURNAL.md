# Project journal

This records significant milestones and lessons, not every conversation. Commit
references identify tracked changes; UI observations and human acceptance are
explicitly distinguished from repository evidence.

## Initial repository — `1c04fbc`

Created `HELLO.md` with “Software Factory is alive.” as the first small execution
test. Initialized Git on `main`, configured the GitHub origin, and pushed after
GitHub authentication was configured. This established the basic request-to-commit
workflow.

## Working rules — `81a6205`

Added `AGENTS.md`: stay within the repository and requested scope, state a plan,
prefer simple solutions, avoid unnecessary dependencies, verify results, and do
not push or deploy without an explicit request.

## First website — `394f3fc`

Added a dependency-free single page with “Software Factory”, the initial running
message, and a “Run Factory” button that changes the message to “Order received!”.
The user confirmed manual acceptance before requesting commit and push.

GitHub Pages was subsequently enabled through GitHub settings. The observed source
was `main` / repository root. This was an external configuration milestone, not a
deployment configuration file added to Git.

## Browser QA lesson

In-app automated mouse clicks appeared to fail while Enter activation worked.
The button was enabled and unobstructed, and no browser errors were reported.
A Safari mouse click succeeded against the same unchanged page and localhost
server. Evidence therefore favored an in-app mouse automation false failure;
the exact tooling defect was not established. Product code was left unchanged.

Decision: investigate failed checks, compare independent verification methods when
practical, and distinguish product failures from tooling/environment failures.
Never change working product code merely to satisfy a faulty test tool. Do not
treat this historical diagnosis as proof that every future failure is tooling.

## QA policy and order counter — `fe098a2`

Recorded the browser QA principles in `AGENTS.md` and added the order counter.
Real-browser keyboard tests confirmed increments and the existing message behavior;
mouse automation remained limited in that session. The user subsequently confirmed
manual acceptance. The counter intentionally has no persistence across reloads.

## First CI quality checks — `e1cc49d`

Added `.github/workflows/ci.yml` and `scripts/check_site.py` for small,
dependency-free static checks. Local validation passed. An in-memory test with an
incorrect initial count produced FAIL and exit code 1 without changing the page.

Verified external milestone, reported by the user after inspecting GitHub Actions:

- Workflow: **Website CI**; run: **#1**.
- Commit: **e1cc49d**; branch: **main**.
- Result: **PASS**; displayed duration: **8 seconds**.
- GitHub Pages deployment triggered by the same push was also observed successful.

These are manually verified GitHub UI results supplied by the user, not results
inferred from the YAML or independently fetched during documentation creation.
CI success and Pages success were separate outcomes: failed CI does not yet block
deployment. Connecting those gates is a possible future architectural step.

## Protected PR-based delivery — PR #1 / `26655a0`

Repository evidence: commit `8630268` documented the PR delivery policy, and
[PR #1](https://github.com/msulu/software-factory-lab/pull/1) merged as `26655a0`
on 2026-09-29.

External evidence: on 2026-09-30, the user supplied verified observations from the
previous delivery cycle:

- `main` protection was enabled, requiring a PR and the **Validate static website**
  status check, with branches up to date before merge.
- Required approving reviews were **0**; protection applied to administrators.
- Force pushes and branch deletion were disallowed.
- PR #1 merged successfully through the protected flow.
- Post-merge CI: **PASS**. GitHub Pages deployment: **PASS**.
- Pages remained configured from `main` / repository root.

These settings and run outcomes were verified externally by the user, not inferred
from Git or the workflow and not independently fetched for this entry. The report
date is not a claim about the exact time settings changed. It supersedes the older
unprotected-main observation. CI and Pages still run independently after merge;
the enforced quality gate is before merge. Explicit human merge authorization
remains mandatory even though GitHub requires no approving reviews.

## Self-Maintaining Factory Memory v1

Lesson: repository memory became stale immediately after an externally configured
architecture change. The delivery policy was tracked, but the completed protection
setup and successful protected delivery were missing from current-state memory.
A later session therefore recovered an outdated description of the merge gate.

Decision: make memory maintenance part of each task. Assess `Memory impact: YES/NO`
with a reason during planning and against the final diff; update affected durable
memory in the same PR for YES. Keep trivial changes free of documentation churn.
Use the collaboration agreement and revision-stamped handoff to support sessions
with and without repository access. The PR template exposes the assessment;
there is no CI enforcement for memory declarations in v1.

Keep external observations dated and attributed, and reconcile them with current
architecture when learned. Conversation history must not be the only record of
important project knowledge. Fresh-session recovery experiments are described in
`COLLABORATION.md`; their outcomes remain to be verified after delivery.

## Browser Verification v1 — commissioned 2026-09-30

Added one Playwright Test scenario in Chromium against the actual static page,
served locally by Python's standard-library HTTP server. It checks initial state,
exact increments from mouse and Enter activation, reset on reload in the same
browser context, and successful activation afterward. It also rejects observed
uncaught page JavaScript errors. Product behavior and the static validator are
unchanged. Playwright is development-only, pinned with an npm lockfile.

Agent-observed local commissioning on macOS with Node 24 and Playwright 1.63.0:

- PASS: the real implementation completed the browser scenario.
- PASS: temporarily changing the increment from 1 to 2 failed on first activation
  (expected 1, received 2; test exit 1).
- PASS: temporarily storing/restoring the counter with localStorage failed at the
  reload assertion (expected 0, received 3; test exit 1).
- PASS: an injected uncaught microtask error failed the JavaScript-error assertion
  even though the visible interaction updated successfully (test exit 1).
- PASS: the original page bytes were restored after each injection; no intentional
  fault is part of the delivered change. Failure screenshots and traces were produced.
- PASS: a clean lockfile install, all 11 static checks, the final Chromium scenario,
  and the diff check. The product page and validator match the base revision.

The initial sandboxed run could not bind the loopback HTTP port (PermissionError).
Running with the required environment permission passed without product changes;
this was an environment failure, not an interaction defect.

The separate **Verify browser interaction** CI job installs Chromium and runs the
same test, retaining available failure artifacts for seven days. The existing
**Validate static website** job is unchanged. Local results do not establish a
GitHub Actions result; inspect the PR's checks before delivery authorization.

The agent read GitHub's main branch-protection API on 2026-09-30 and confirmed that
only **Validate static website** is required, with strict/up-to-date checks,
administrator enforcement, zero required approving reviews, and force pushes and
deletion disabled. No settings were changed during commissioning. The browser job
was non-required at that stage; promotion needed separate explicit authorization.
The implementation task did not authorize merge or deployment.

## Browser verification promoted to required — 2026-09-30

After explicit user authorization, the agent updated only GitHub's required status
checks configuration for `main`, adding **Verify browser interaction** from GitHub
Actions (app ID `15368`) alongside **Validate static website** from the same app.

Promotion evidence: the commissioning checks above rejected broken increments,
persistence, and uncaught JavaScript errors. PR #3 merged as
`9e18941c840c1bbc7e90bd1d4d9f2894ee4a8126`; its
[main CI run](https://github.com/msulu/software-factory-lab/actions/runs/36689139586)
passed both static validation and browser interaction. The agent verified these
GitHub results directly, rather than inferring success from workflow configuration.

Live read-back verification: **PASS**. Both exact required names have app ID
`15368`; strict/up-to-date checks and administrator enforcement remain enabled.
Comparing the complete protection responses before and after, excluding only the
expected check-list addition, confirmed that no unrelated protection field changed.
Workflow, application code, Pages settings, and other GitHub settings were not changed.

This strengthens the pre-merge gate. Post-merge CI and Pages still run independently,
and explicit human merge authorization is still required. The accompanying memory
update is delivered through its own protected PR; promotion does not authorize
merging that documentation PR.

## Factory Order Intake v1 — 2026-09-30

Replaced the Run Factory demonstration with the first business-domain capability:
a requirement form creates page-memory orders with sequential session identities,
trimmed requirement text, and status Received. Visible receipts preserve earlier
submissions. Empty/whitespace input is rejected accessibly; no arbitrary length cap
or business-quality assessment is applied. Reload clears orders and restarts IDs.

Decision: distinguish receipt from execution explicitly in permanent UI copy.
No persistence, backend, planning, model/agent calls, or repository automation is
introduced. This establishes an order record and acceptance boundary before later
storage or execution work. The existing dependency-free application and CI jobs remain.

Agent-observed local verification:

- PASS: updated static checks and Chromium intake scenario, including validation,
  sequential identities, prior receipts, reload, keyboard/focus behavior, multiline
  and literal HTML-like text, long input, and no observed uncaught JavaScript errors.
- PASS: commissioning rejected a false execution disclosure in static validation,
  incorrect identity numbering in Chromium, and whitespace acceptance in Chromium.
  Each fault returned exit 1 at the intended assertion; original product bytes were
  restored after every injection. No intentional fault is delivered.
- PASS: desktop and 375-pixel mobile screenshots inspected for initial/error/receipt
  layouts; mobile receipt layout had no horizontal overflow.
- The first sandboxed browser run failed to bind localhost (PermissionError).
  The permitted run passed without product changes: an environment restriction.

A read-only GitHub protection check during this task confirmed both existing named
CI checks remain required with strict/up-to-date checking. No settings were changed.
Local results do not establish PR CI or deployed behavior. Delivery stops at the PR
pending separate human merge authorization; intake does not itself execute delivery.
