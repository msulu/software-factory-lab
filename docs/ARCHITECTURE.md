# Current architecture

## Components and responsibilities

| Component | Responsibility |
| --- | --- |
| Codex or another agent | Inspect, plan, implement, verify, and report within the authorized scope. |
| `AGENTS.md` | Define repository work and verification rules. |
| `index.html` | Self-contained HTML, CSS, and JavaScript; no application dependencies or build step. |
| Git | Record reviewable changes and version history. |
| GitHub | Host the shared repository and support collaboration. |
| GitHub Actions | Run the `Website CI` static validation workflow. |
| `scripts/check_site.py` | Check initial HTML properties using Python's standard library. |
| GitHub Pages | Publish the static website using externally configured repository settings. |
| Browser QA | Verify rendered appearance and important real user interactions. |
| Human acceptance | Confirm that results satisfy the intended requirements before requested delivery. |

## Website and verification flow

The page initially shows “Factory is running” and “Orders processed: 0”. Each
activation of “Run Factory” displays “Order received!” and increments the counter.
The counter is in memory and resets on reload; there is no backend or order storage.

The intended delivery flow is requirements → implementation on a task branch
from current `main` → PR to `main` → verification → explicit human authorization
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

## CI and deployment boundaries

Tracked configuration: `.github/workflows/ci.yml` runs on every branch push and on
pull requests opened, synchronized, or reopened. One Ubuntu job checks out the
repository and runs the validator with read-only repository permissions. No
package installation or browser testing is configured.

External configuration: GitHub Pages was observed configured to deploy from
`main`, repository root. This setting is not defined by the tracked CI workflow.
The user verified successful CI and Pages runs for the first CI push; details and
evidence provenance are in the journal. Historical observations are not a guarantee
of current GitHub settings or future run results.

**CI and deployment currently run independently. Failed CI does not block Pages
deployment.** The workflow also does not itself require checks before merging;
read-only GitHub API inspection on 2026-09-29 found `main` unprotected, no required
checks, and no repository rulesets. The branch/PR policy above is not yet enforced
by GitHub; configuring required checks remains a separate step.

CI does not execute JavaScript, verify mouse/keyboard behavior, check responsive
rendering, comprehensively audit accessibility, or test the deployed site. Browser
QA and human acceptance remain necessary. Browser automation reliability varies
by session and environment.

## Possible next steps — not commitments

- Add reliable real-browser interaction checks to CI.
- Require successful checks before merging through GitHub rules.
- Make deployment depend on successful verification.
- Add post-deployment smoke checks.

Choose the next improvement from actual needs; none of these options authorizes
implementation or a change to deployment configuration.
