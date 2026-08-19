---
name: git-commit-helper
description: Use whenever the user wants to commit changes to git, stage files, write a commit message, split a large diff into logical commits, or create/name a branch. Also trigger for "commit this", "git commit", "clean up my commits", "consistent commit messages", "commit history", or after a large refactor/feature when the user wants to save their work with clear, traceable commits. Applies the Conventional Commits format and a simple branch-naming scheme so commit history stays consistent and easy to trace over time.
---

# Git Commit Helper

Helps produce clean, consistent, traceable git history: staged changes split into
logical commits, messages in Conventional Commits format, and sensibly named
branches.

## Workflow

1. **Check status first.** Always run `git status` and `git diff --stat` (not the
   full diff unless needed) before doing anything, to see the scope of changes.

2. **Decide: one commit or several?**
   - Small, single-purpose change → one commit.
   - Large refactor / multiple unrelated changes → split into logical commits.
     Use `git add -p` (interactive hunk staging) or `git add <specific files>`
     per logical unit, rather than `git add -A` for everything at once.
   - If the user just wants everything committed quickly and doesn't care about
     splitting, `git add -A` + one well-written message is fine — don't force
     splitting on someone who didn't ask for it.

3. **Write the commit message using Conventional Commits:**

   ```
   <type>(<scope>): <short imperative summary, <=50 chars>

   <optional body — explain WHY, not what, wrap ~72 chars>

   <optional footer — BREAKING CHANGE: ..., Refs #123>
   ```

   Types:
   | Type | Use for |
   |---|---|
   | `feat` | new feature |
   | `fix` | bug fix |
   | `refactor` | code change that's not a fix or a feature |
   | `chore` | tooling, deps, config, maintenance |
   | `docs` | documentation only |
   | `test` | adding or fixing tests |
   | `style` | formatting/whitespace, no logic change |
   | `perf` | performance improvement |
   | `build` | build system or external dependencies |
   | `ci` | CI/CD config |

   Rules of thumb:
   - Summary line: imperative mood ("add", not "added"/"adds"), no trailing period.
   - Scope is optional but helpful in larger repos: `feat(auth): ...`.
   - Body explains motivation/context, especially for refactors where the "what"
     is obvious from the diff but the "why" isn't.
   - One logical change per commit — if the message needs "and" to describe it,
     consider splitting.

4. **Branch naming**, when creating a new branch:

   ```
   <type>/<short-kebab-description>
   ```

   e.g. `feature/user-auth`, `fix/login-redirect`, `refactor/data-layer`,
   `chore/upgrade-deps`. Keep it under ~40 chars, all lowercase, hyphen-separated.

5. **Execute.** Run the actual `git` commands (status → add → commit, or
   checkout -b for branches) rather than just printing instructions, unless the
   user only asked for advice/message text.

## Splitting a large refactor into logical commits

When a diff touches many unrelated things:

1. `git diff --stat` to see which files changed.
2. Group files/hunks by logical concern (e.g. "data layer", "API routes", "tests").
3. Stage and commit each group separately with `git add <files>` or `git add -p`.
4. Keep going until `git status` shows a clean tree.

Example sequence:

```bash
git add src/services/auth/**
git commit -m "refactor(auth): extract auth logic into service layer"

git add src/models/**
git commit -m "refactor(models): rename UserManager to UserService"

git add tests/**
git commit -m "test: update tests for new service layer structure"
```

## Output format when just asked for a message (not asked to run commands)

Give the commit message in a fenced code block, ready to copy into
`git commit -m "..."` or a commit editor, e.g.:

```
refactor(core): restructure data layer into repository pattern

Splits monolithic DataManager into separate repositories per domain
entity. No behavior change intended; existing tests still pass.
```

No `Co-Authored-By` or AI-attribution trailer — the commit message ends with
the body/footer only.

## Notes

- Never fabricate an issue/ticket number for the footer — only add `Refs #123` /
  `Closes #123` if the user gives you the number.
- If unsure whether to split commits, ask, or default to splitting when the diff
  clearly spans unrelated concerns and stay as one commit otherwise.
- Don't invent a `scope` that isn't reflected in the actual changed paths.
- **Never include a `Co-Authored-By: Claude` (or similar) trailer in any commit
  message**, whether committing directly or just printing a message to copy.
