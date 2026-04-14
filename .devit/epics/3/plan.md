# Epic 3 — Unit Test Coverage

## Context

The app already has Jest configured (jest-expo + babel-jest) and 11 passing utility tests. However,
several critical business-logic paths have zero coverage: the backup/restore validation function,
the subscription identifier parser, the map-grouping algorithm, and two minor pure utilities.
The freemium limit hook and the BackupService batch-processing layer are the highest-risk code
paths because errors there cause data loss or silent paywall bypasses.

## Scope

- Extract `validateBackupFile` from `use-backup-restore.ts` into a testable utility
- Add tests for all untested pure utilities: `group-maps`, `subscriptions`, `get-map-region`, `get-assignment-message`
- Add unit tests for `BackupService` with a mocked InstantDB client
- Add unit tests for `useLimits` hook with mocked session, subscription, and db

## Key Decisions

- Keep `testEnvironment: 'node'` for service/utility tests; introduce `jsdom` only for hook tests
- Mock `@/lib/db` (InstantDB) at the module level for service tests
- Mock React contexts (`useSession`, `useSubscription`) and `db.useQuery` for hook tests
- `validateBackupFile` is moved to `src/utils/validate-backup-file.ts` to make it importable

## References

- Jest config: `jest.config.js`
- Existing test pattern: `src/utils/get-badge-color.test.ts`
- Backup logic: `src/services/instantdb/backup-service.ts`, `src/hooks/use-backup-restore.ts`
- Freemium logic: `src/hooks/use-limits.ts`, `src/constants/env.ts`
