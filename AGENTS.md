# Software Factory Rules

- Work only within this repository.
- Before making changes, briefly state your plan.
- Keep changes limited to the user's request.
- Prefer the simplest solution that satisfies the requirement.
- Do not add dependencies unless they are necessary.
- Verify your work before declaring the task complete.
- Do not push, deploy, or merge unless the user explicitly authorizes that action.

## Delivery flow

- Normal delivery follows: task branch → pull request → required CI and verification → explicit human authorization → merge → deployment.
- Start changes on a task branch from current `main`; do not deliver changes by pushing directly to `main`.
- Target pull requests at `main`. Run relevant local checks before pushing, then review the diff and PR CI results before requesting merge authorization.
- Stop before merge until verification passes and the user explicitly authorizes merging. Permission to push or open a PR is not permission to merge.
- Merging to `main` triggers Pages deployment under the current configuration; make that consequence clear when seeking authorization.

## Persistent context and memory

- Before significant work, recover context by reading this file, `docs/FACTORY.md`, `docs/COLLABORATION.md`, `docs/ARCHITECTURE.md`, and `docs/JOURNAL.md`, in that order. Inspect working-tree status, recent history, and relevant source/configuration; preserve existing work.
- Distinguish implemented behavior, historical external observations, and proposals. Recheck external state when the task depends on it; documentation and past approvals do not authorize new delivery actions.
- For every task, state a provisional `Memory impact: YES` or `Memory impact: NO` with a reason. Reassess against the final diff before delivery.
- Use YES when leaving memory unchanged would materially mislead a future session about vision, architecture, operating model, important state, decisions, lessons, or collaboration. Update affected durable memory in the same PR; use the document ownership guidance in `docs/FACTORY.md`.
- Use NO for trivial changes that leave durable context accurate. Do not manufacture documentation edits, journal entries, or timestamp updates to satisfy the process.
- Include the final memory-impact decision, reason, memory files updated (if applicable), and PASS/FAIL verification in task reports and PR descriptions. For read-only work, distinguish proposed memory changes from applied changes.
- Follow `docs/COLLABORATION.md` for the portable working agreement and context handoff. Keep important project knowledge in the repository, not solely in conversation history.

## Verification and QA

- For user-facing web changes, verify the result in a real browser when browser access is available.
- Test important user interactions, not only the source code.
- Report verification results clearly as PASS or FAIL.
- If a test fails, investigate the cause before changing implementation code.
- Distinguish product failures from test-tool or environment failures using evidence.
- Do not change working product code merely to satisfy a faulty test tool.
- When practical, cross-check ambiguous failures using another verification method.
