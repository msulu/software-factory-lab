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
