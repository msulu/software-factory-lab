# Software Factory

## Vision and operating model

The user describes business outcomes and requirements in natural language. The
factory should increasingly handle planning, implementation, verification, and
delivery, while keeping its work understandable and reviewable.

The user primarily acts as product/business owner and factory operator: choosing
priorities, clarifying requirements, accepting results, and authorizing delivery.
Normal operation should not require the user to write implementation code.

The intended delivery process is: business requirement → agent work on a task
branch from current `main` → pull request to `main` → verification → explicit
human authorization → merge → deployment. Run relevant local checks before
pushing and review CI results on the PR. Push, merge, and deployment each require
explicit authorization; permission to open a PR does not authorize merging.
Merging to `main` triggers Pages deployment under the current configuration.
This is an operating policy; required-check enforcement in GitHub remains a
separate migration step.

Today this is an agent-assisted static website with basic CI and human acceptance,
not an autonomous factory. The website is a small proving ground for improving the
development process. Its “Run Factory” button updates a message and a local counter;
it does not execute an automated software delivery pipeline.

## Source of truth

Repository: https://github.com/msulu/software-factory-lab (main branch).

Keep durable context in this repository rather than relying on chat history:

- [AGENTS.md](../AGENTS.md): repository work and QA rules.
- [ARCHITECTURE.md](ARCHITECTURE.md): current components, boundaries, and options.
- [JOURNAL.md](JOURNAL.md): significant milestones, decisions, and evidence.

Source files and Git history establish implemented behavior. GitHub settings and
run results are external state: record observations with their provenance and
recheck them when relevant. Documentation does not grant permission to commit,
push, merge, deploy, or implement a suggested next step.

## Recovering context in a new session

1. Read `AGENTS.md`, then this file, `ARCHITECTURE.md`, and `JOURNAL.md`.
2. Inspect `git status`, recent commits, and the source/configuration relevant to
   the request. Preserve existing uncommitted work.
3. Distinguish current implementation, historical observations, and proposals.
   Verify external GitHub state when the task depends on it.
4. State a brief plan and work within the user's current authorization. Run
   relevant checks, report PASS or FAIL, and disclose verification limitations.

Keep architecture current as the system changes. Append only meaningful journal
milestones with evidence; avoid copying conversation transcripts or routine logs.
