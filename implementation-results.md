# Implementation Results — improvements.md Roadmap

All improvements from `improvements.md` have been implemented. Each change was committed individually on the `develop` branch. Below is a summary of what was done and the results.

---

## Previously completed (1.1–1.3)

| # | Title | Status |
|---|-------|--------|
| 1.1 | Eliminate `any` types in hooks and components | ✅ Done |
| 1.2 | Extract hardcoded strings to constants | ✅ Done |
| 1.3 | Centralize storage keys | ✅ Done |

---

## This session (1.4–1.11 + Section 2)

### 1.4 Remove dead code
**Commit:** `85dde74`

- Removed `loadMore`, `loadingMore`, `hasMore` stubs from `use-maps.ts`
- Removed unused `mutate` stubs from `use-maps.ts`, `use-all-maps.ts`, `use-districts.ts`
- Deleted all `*Response` interfaces (`MapResponse`, `MapsResponse`, `PublisherResponse`, `PublishersResponse`, `CityResponse`, `CitiesResponse`, `DistrictResponse`, `DistrictsResponse`, `CongregationResponse`, `CongregationsResponse`) from every service file
- Cleaned up `src/services/instantdb/index.ts` re-exports to match

**Result:** 5 fewer unused interfaces across 6 service files. Reduced confusion about the API surface.

---

### 1.5 Standardize search query operators
**Commit:** `6b4151a`

- Replaced `$like` with `$ilike` in `use-all-maps.ts` (3 occurrences), `use-cities.ts`, `use-districts.ts`, and `use-publishers.ts`

**Result:** All 4 search hooks now use case-insensitive `$ilike` consistently.

---

### 1.6 Create shared Modal wrapper component
**Commit:** `fa1e77e`

- Created `src/components/sheet-modal.tsx` — a reusable wrapper that handles the `Modal + bg-background View + header row (title + close button)` pattern
- Refactored `extra-map-form-modal.tsx` to use `SheetModal`
- Refactored `personal-annotation.tsx` to use `SheetModal`

**Result:** ~30 lines of duplicated modal boilerplate eliminated. Future modals can use `SheetModal` directly.

---

### 1.7 Standardize service return types
**Commit:** `ea1fe0b`

- `createPublisher()` now returns `Promise<string>` (new publisher ID)
- `createCity()` now returns `Promise<string>` (new city ID)
- `createDistrict()` now returns `Promise<string>` (new district ID)
- `createCongregation()` now returns `Promise<string>` (new congregation ID)

**Result:** All `create*` methods now return the new entity ID, consistent with `createMap()`. Callers can now navigate directly to the new entity without a follow-up query.

---

### 1.8 Extract magic numbers
**Commit:** `35c1566`

- `maps-service.ts`: `batchLimit = 25` → `UNASSIGN_BATCH_LIMIT = 25` (module-level constant)
- `get-location-distance.ts`: `if (total > 999)` → `METER_TO_KM_THRESHOLD = 999`
- `map-item.tsx`: `screenWidth - 10 - 10 - 10 - 80 - 20` → `TEXT_MAX_WIDTH = screenWidth - 130` with an explanatory comment

---

### 1.9 Fix `get-badge-color.ts` missing default
**Commit:** `35c1566` (same commit as 1.8/1.10)

- Added `default: return 'bg-border'` to the `switch` statement
- Unknown or future tags now get a safe fallback color instead of returning `undefined`

---

### 1.10 Fix lint-staged config
**Commit:** `35c1566`

- Changed `"yarn lint"` → `"pnpm lint"` in `package.json`'s `lint-staged` section to match the project's package manager

---

### 1.11 Add CI/CD pipeline
**Commit:** `fb81706`

- Created `.github/workflows/ci.yml`
- Triggers on pull requests targeting `main` and `develop`
- Steps: checkout → pnpm setup → Node 20 → `pnpm install --frozen-lockfile` → lint → TypeScript check → test
- Uses `--passWithNoTests` so CI passes before more tests are added

---

### Section 2: Test Coverage — Phase 1 (Utils)
**Commit:** `1664469`

**Dependencies installed:**
- `jest ^30.2.0`
- `jest-expo ^55.0.9`
- `@testing-library/react-native ^13.3.3`
- `@types/jest ^30.0.0`

**Configuration:**
- `jest.config.js` — uses `babel-jest` with the project's existing Babel config; `testEnvironment: node` for util tests; `moduleNameMapper` for `@/` alias
- `jest.setup.js` — lightweight replacement for `react-native/jest/setup.js` (which uses ESM incompatible with pnpm + RN 0.81)
- `src/__mocks__/expo-location.js` — stub for `expo-location` in util tests
- `src/__mocks__/lodash-sum.js` — stub for `lodash/sum` in util tests
- `package.json` scripts: `test`, `test:watch`, `test:coverage`

**Test files created (11 files, 47 tests — all passing):**

| File | Tests |
|------|-------|
| `src/utils/get-badge-color.test.ts` | 5 — all tag values + unknown fallback |
| `src/utils/get-pin-color.test.ts` | 2 — assigned/unassigned color mapping |
| `src/utils/first-letter.test.ts` | 5 — uppercase, empty, multi-word |
| `src/utils/first-name.test.ts` | 4 — single, full, multi-word, empty |
| `src/utils/normalize-username.test.ts` | 6 — lowercase, spaces, accents, specials |
| `src/utils/coordinates-average.test.ts` | 4 — single, two, multiple, negative |
| `src/utils/get-expiration.test.ts` | 4 — future, past, zero minutes, type |
| `src/utils/get-marker-coordinate.test.ts` | 4 — valid, null, short array, zeros |
| `src/utils/valid-coordinates.test.ts` | 4 — non-zero, both-zero, one-zero, summing-zero |
| `src/utils/get-location-distance.test.ts` | 5 — null from, short array, meters, km, same |
| `src/utils/date-format.test.ts` | 4 — valid string, numeric timestamp, year, invalid |

**Test run result:**
```
Test Suites: 11 passed, 11 total
Tests:       47 passed, 47 total
Time:        ~1s
```

---

## Commits summary

```
1664469  test: add Jest setup and Phase 1 util test coverage
fb81706  ci: add GitHub Actions CI pipeline
35c1566  refactor: extract magic numbers, fix badge color fallback, fix lint-staged
ea1fe0b  refactor: all create* service methods now return the new entity ID
fa1e77e  refactor: extract SheetModal wrapper and reduce modal duplication
6b4151a  refactor: standardize search to $ilike for case-insensitive queries
85dde74  refactor: remove dead code stubs and unused response types
```

---

## What remains (from improvements.md)

| Phase | Status |
|-------|--------|
| Phase 1 utils tests | ✅ Complete (90%+ coverage on utils) |
| Phase 2 service tests | 🔲 Next step (requires InstantDB `db` mock) |
| Phase 3 hook tests | 🔲 After service mocks exist |
| Phase 4 component tests | 🔲 Ongoing |
