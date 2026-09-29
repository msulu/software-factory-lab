# Software Factory Rules

- Work only within this repository.
- Before making changes, briefly state your plan.
- Keep changes limited to the user's request.
- Prefer the simplest solution that satisfies the requirement.
- Do not add dependencies unless they are necessary.
- Verify your work before declaring the task complete.
- Do not push or deploy unless the user explicitly requests it.

## Verification and QA

- For user-facing web changes, verify the result in a real browser when browser access is available.
- Test important user interactions, not only the source code.
- Report verification results clearly as PASS or FAIL.
- If a test fails, investigate the cause before changing implementation code.
- Distinguish product failures from test-tool or environment failures using evidence.
- Do not change working product code merely to satisfy a faulty test tool.
- When practical, cross-check ambiguous failures using another verification method.
