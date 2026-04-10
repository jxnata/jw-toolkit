# Task Execution Guide

## Task Selection

**No epic specified:** Check if only one epic exists (use it), else ask user and list available from `.devit/epics/`

**Epic specified, no task:** Read `meta.json`, find first `"status": "pending"`, inform if all completed

**Both specified:** Proceed with task

**Before starting:** Read `plan.md` (context), `tasks/{M}.json` (details), review previous tasks if needed

## Workflow (6 Steps)

### 1. Update Status → `in_progress`

Update `meta.json`: `"status": "in_progress"` and commit.

### 2. Implement

- Read `tasks/{M}.json`
- Follow steps in order (file paths, patterns, validations)
- Implement per description and acceptance criteria
- Write tests from `tests` array
- Handle loading/error/empty states

### 3. Verify (CRITICAL - All Must Pass)

```bash
bun run ts:check  # ✅ No TypeScript errors
bun run lint   		# ✅ No ESLint errors
bun run test   		# ✅ All tests pass
```

**Manual checks:**

- [ ] All acceptance criteria met
- [ ] Follows existing patterns
- [ ] No console errors

### 4. Commit

Format: `{type}: {description} (E{NN} task {M})`

Types: `feat`, `fix`, `refactor`, `test`, `docs`

### 5. Update Status → `completed`

Update `meta.json`: `"status": "completed"`, `"commits": ["abc1234"]`

Multiple commits: `"commits": ["abc1234", "def5678"]`

### 6. Handle PR (if `pr_per_task` = true)

Branch Format: `E{NN}-{M}-description`

Update `meta.json` with PR number

If `pr_per_task` = false: Continue on epic branch, single PR at end

## Definition of Done

A task is **ONLY** considered done when **ALL** of these are true:

- [ ] All steps from task JSON completed
- [ ] All tests written and passing (`bun run test`)
- [ ] TypeScript compiles with no errors (`bun run ts:check`)
- [ ] ESLint passes with no errors (`bun run lint`)
- [ ] All acceptance criteria verified
- [ ] Loading/error/empty states handled (if applicable)
- [ ] Task status updated to "completed" in meta.json
- [ ] Git commit created with proper format
- [ ] Commit hash(es) added to meta.json
- [ ] Pull request created (if `pr_per_task` is `true`)

## Troubleshooting

**Tests fail:** Review specs in task JSON, check acceptance criteria, verify mocks. DO NOT complete until passing.

**TypeScript errors:** Check imports, Supabase types (`src/types/supabase.ts`), prop types. DO NOT complete until build succeeds.

**Linting errors:** Fix formatting/style. Never disable rules. DO NOT complete until lint passes.

## Quick Reference

```bash
# Find next pending task (example)
cat .devit/epics/5/meta.json | jq '.tasks[] | select(.status == "pending") | .id, .title'

# Verify all
bun run ts:check && bun run lint && bun run test

# Get commit hash
git log -1 --format="%h"
```

**Always follow this workflow. Never skip verification.**
