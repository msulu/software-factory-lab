# Collaboration and portable context

## Working agreement

- The user primarily acts as product/business owner and factory operator: choosing
  outcomes and priorities, clarifying requirements, accepting results, and
  authorizing delivery. Normal operation should not require writing implementation code.
- Agents handle inspection, planning, implementation, verification, and reporting
  within the current authorization and the rules in `AGENTS.md`.
- Introduce capabilities incrementally. Before each significant step, explain what
  will happen, why it is needed, and the expected result.
- Explain new architectural concepts when introduced, using the current project
  as a concrete example.
- Prefer delegating bounded implementation work to agents when appropriate and
  supported. Keep one accountable coordinating agent; avoid unnecessary multi-agent
  architecture and premature complexity.
- Use the simplest solution that meets the present learning goal. Proposals and
  previous approvals are not permission to implement or deliver future work.

## Recovering context across sessions

For a Codex or other session with repository access, follow the reading order and
state checks in `FACTORY.md`. Do not depend on earlier conversation history.

For a ChatGPT or other session without repository access, the user or an authorized
repository-capable agent supplies a context handoff containing:

1. Repository identity, branch, full commit SHA, capture date, and whether local
   changes exist. Identify any supplied uncommitted changes explicitly.
2. `AGENTS.md`, `FACTORY.md`, this document, `ARCHITECTURE.md`, and `JOURNAL.md`,
   copied or attached from that same revision, in that order.
3. Recent Git history and relevant source/configuration when the task depends on
   implementation details, plus any relevant external observations with provenance.
4. The current request, its authorized scope, and any unresolved work needed to
   continue safely. Do not transfer old delivery approvals as standing permission.

A repository URL alone does not provide context to a session that cannot read it.
No generated bundle or extra service is required: a manual copy/attachment is
sufficient. The user need not write implementation code to provide this handoff.

Suggested opening instruction:

> Recover project context from this revision-stamped repository handoff. Summarize
> what exists, the working and delivery rules, uncertainties, and the next action
> authorized by my request. Distinguish implementation, historical observations,
> and proposals. State your provisional Memory impact: YES/NO and reason.

The receiving session should identify its snapshot revision and evidence limits.
It must not claim live repository or GitHub access from a supplied snapshot. Ask
for refreshed files or observations when they are necessary to continue correctly.
Surface contradictions rather than guessing which state is current.

Important outcomes from a conversation must return to the appropriate repository
documents in an authorized task/PR. Until then, they are proposed or temporary
context, not an update to the durable source of truth.

## Recovery experiment

After delivery, test fresh sessions without earlier conversation history:

- Give Codex repository access and an ordinary continuation request. PASS if it
  recovers the website behavior, CI limits, working rules, and delivery gates.
- Give ChatGPT only the handoff above. PASS if it recovers the same essentials and
  states the snapshot's limits without claiming live access.
- Give future tasks without a memory reminder: a trivial styling change should
  report NO without memory churn; adding persistence should report YES and update
  the affected architecture in the same PR, including reload/storage behavior.

These are proposed acceptance experiments, not claims that they have been run.
Resolve failures with targeted instruction improvements before adding tooling.
