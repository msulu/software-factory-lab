# Software Factory

## Vision and operating model

The user describes business outcomes and requirements in natural language. The
factory should increasingly handle planning, implementation, verification, and
delivery, while keeping its work understandable and reviewable.

The user primarily acts as product/business owner and factory operator: choosing
priorities, clarifying requirements, accepting results, and authorizing delivery.
Normal operation should not require the user to write implementation code.

The intended delivery process is: business requirement → agent work on a task
branch from current `main` → pull request to `main` → required CI and verification → explicit
human authorization → merge → deployment. Run relevant local checks before
pushing and review CI results on the PR. Push, merge, and deployment each require
explicit authorization; permission to open a PR does not authorize merging.
Merging to `main` triggers Pages deployment under the current configuration.
Main-branch protection and the required static validation check were externally
verified by the user during the previous delivery cycle, reported on 2026-09-30.
See `ARCHITECTURE.md` and `JOURNAL.md` for settings, provenance, and limitations.

Today this is an agent-assisted static website with static and Chromium interaction
checks in CI and human acceptance, not an autonomous factory. The website is a
small proving ground for improving the
development process. Its “Run Factory” button updates a message and a local counter;
it does not execute an automated software delivery pipeline.

Browser Verification v1 checks the existing interaction and reload behavior with
Playwright. It is a separate CI job, not a required merge check yet; promoting it
requires explicit authorization and an external branch-protection change.

## Source of truth

Repository: https://github.com/msulu/software-factory-lab (main branch).

Keep durable context in this repository rather than relying on chat history:

- [AGENTS.md](../AGENTS.md): repository work and QA rules.
- [COLLABORATION.md](COLLABORATION.md): working agreement and portable context handoff.
- [ARCHITECTURE.md](ARCHITECTURE.md): current components, boundaries, and options.
- [JOURNAL.md](JOURNAL.md): significant milestones, decisions, and evidence.

Source files and Git history establish implemented behavior. GitHub settings and
run results are external state: record observations with their provenance and
recheck them when relevant. Documentation does not grant permission to commit,
push, merge, deploy, or implement a suggested next step.

## Recovering context in a new session

1. Read `AGENTS.md`, then this file, `COLLABORATION.md`, `ARCHITECTURE.md`, and `JOURNAL.md`.
2. Inspect `git status`, recent commits, and the source/configuration relevant to
   the request. Preserve existing uncommitted work.
3. Distinguish current implementation, historical observations, and proposals.
   Verify external GitHub state when the task depends on it.
4. Briefly report what exists, applicable constraints, uncertainties, and the next
   authorized action. State a plan and provisional memory-impact decision. Run
   relevant checks, report PASS or FAIL, and disclose verification limitations.

Sessions without repository access use the revision-stamped handoff described in
[COLLABORATION.md](COLLABORATION.md); a repository link alone is not sufficient.

## Maintaining durable memory

Self-Maintaining Factory Memory v1 is a task responsibility, not a background
service. Every task evaluates `Memory impact: YES/NO` at planning and against the
final diff. Ask: would unchanged memory materially mislead a future session?
For YES, update only the affected documents in the same PR:

| Document | Owns |
| --- | --- |
| `FACTORY.md` | Vision, scope, maturity, high-level operating model, and recovery process. |
| `ARCHITECTURE.md` | Current components, behavior boundaries, persistence, CI, deployment, and technical limitations. |
| `JOURNAL.md` | Significant milestones, decisions, rationale, and reusable lessons with evidence. |
| `AGENTS.md` | Mandatory execution, authorization, QA, and memory-maintenance rules. |
| `COLLABORATION.md` | Roles, explanations, incremental learning, delegation preferences, and context handoff. |

A journal entry alone does not repair stale current-state documentation. Not every
YES needs a journal entry. Trivial styling, wording, or behavior-preserving refactors
normally mean NO unless they change durable understanding. Report the reason
without editing memory merely to show activity.

Retain accepted decisions, important unresolved issues, and reusable knowledge.
Keep scratch notes, routine logs, discarded drafts, and conversation transcripts
out of memory. Label retained proposals as proposals. Record external observations
with their source and observation/report date; do not present them as live checks.
The PR template makes the assessment visible; v1 has no CI memory enforcement.
