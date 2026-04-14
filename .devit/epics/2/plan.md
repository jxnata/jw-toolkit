# E02 — Backup / Restore

## Context

Congregation admins need a way to export all territorial data (cities + maps) into a portable JSON file and later restore it — useful before migrations, device changes, or accidental data loss. This feature lives inside the existing Export screen, alongside the current PDF export option.

## Scope

- **Backup**: query all cities and maps for the congregation, serialize to a versioned `.json` file, and share it via the native Share sheet.
- **Restore**: pick a `.json` backup file, validate its shape and congregation ownership, warn the user that the operation is irreversible, then delete all current data and re-create from the backup — all in batches to avoid rate limits.
- Assignments are intentionally excluded from backup/restore (they are ephemeral).
- Only admins may perform backup or restore.

## Key Decisions

- Backup JSON includes `congregation_id`, `version`, `created_at`, `cities[]`, and `maps[]` — each map carries a `city_id` field referencing its city's original ID.
- Restore creates cities first (batches of 25), builds an old→new city-ID map, then creates maps in batches using that mapping.
- Delete pass (before restore) also runs in batches of 25 to mirror the existing `UNASSIGN_BATCH_LIMIT` pattern in `maps-service.ts`.
- File I/O uses `expo-file-system` (already installed) for writing and `expo-document-picker` (new dependency) for reading.
- Validation: correct JSON shape + `congregation_id` matches session congregation + user `type === 'admin'`.

## References

- Existing export screen: `src/app/(app)/admin/export/index.tsx`
- Maps service (batching pattern): `src/services/instantdb/maps-service.ts`
- Session context: `src/contexts/session-provider.tsx`
- InstantDB schema: `src/interfaces/schema.ts`
