# Epic and Task Planning Guide

Break features into **epics** (major features) and **tasks** (1-2 hour units). Apply **TDD**: tests → implementation → refactor.

## Structure

```
.devit/epics/{N}/
├── meta.json          # Epic metadata + task index
├── plan.md            # Epic overview, context, and goals
└── tasks/
    ├── 1.json        # Task details
    └── 2.json
```

**plan.md** One-page summary of the epic (≤40 lines): 1-paragraph context, scope (bullets), key decisions, references. No redundancy.

## meta.json

```json
{
	"epic": "E06",
	"title": "Dashboard & Metrics",
	"objective": "Business value (1–2 sentences)",
	"branch": "feature/dashboard-metrics",
	"pull_request": null,
	"pr_per_task": false,
	"tasks": [
		{
			"id": 1,
			"title": "Create Component",
			"file": "tasks/1.json",
			"status": "pending",
			"commits": [],
			"pull_request": null
		}
	]
}
```

**Fields**: `branch`, `pull_request`, `pr_per_task`, `status` (pending|in_progress|completed), `commits` (7-char), task `pull_request` if per-task.

## Task File

```json
{
	"id": 1,
	"title": "Create Component Name",
	"description": "What and why (1–3 sentences)",
	"steps": [
		"Write failing tests (expected behavior)",
		"Create src/path/file.tsx",
		"Import X from Y (only if necessary, not all)",
		"Define schema: field (validation)",
		"Implement to pass tests",
		"Refactor safely"
	],
	"tests": ["Happy path", "Validation errors", "Edge cases", "Conditional logic"],
	"acceptanceCriteria": ["All tests pass", "Feature behaves as specified", "Loading/error states handled", "No TypeScript errors"],
	"files": {
		"modify": ["src/existing.ts"],
		"create": ["src/new.tsx", "src/new.test.tsx"]
	}
}
```

## Guidelines

-   **Title**: verb + noun, <60 chars
-   **Steps**: specific paths, validations, patterns
-   **Tests**: first (TDD); `[]` only if trivial
-   **Acceptance**: measurable; end with “No TypeScript errors”

## Task Size (1–2h)

**Good**: component + tests; form (3–5 fields); hook/utility

**Split**: full page → layout + sections; large form → subcomponents; CRUD → per layer

**Combine**: minor changes (imports, typos)

## Ordering

1. Foundation: query keys → hooks → utils
2. Building: components, forms, dialogs
3. Composition: tables, sheets, lists
4. Integration: pages, routes

## Process

1. Define epic (scope, objective)
2. Identify parts (data, UI, pages)
3. Break into tasks (tests first)
4. Order by dependency
5. Validate (1–2h, no blockers)

## Writing Rules

-   **Steps**: concrete/technical

    -   ✅ `Create src/x/form.tsx`, `Define Zod schema: amount (positive)`
    -   ❌ vague

-   **Acceptance**: outcomes, not implementation

    -   ✅ `Form validates fields`
    -   ❌ `Uses useState`

-   **Tests**: happy path, validation, edges, conditions

## Checklist

-   [ ] Clear title/objective
-   [ ] Tasks 1–2h, well named
-   [ ] Tests first (TDD)
-   [ ] Ordered by dependency
-   [ ] Steps specific
-   [ ] Acceptance measurable
-   [ ] Files complete
-   [ ] No blockers

## Quick Commands

```bash
mkdir -p .devit/epics/6/tasks
touch .devit/epics/6/meta.json
touch .devit/epics/6/plan.md
```

```bash
# git log -1 --format="%h"
# update meta.json: status + commits
```
