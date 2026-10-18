// Helpers for integration tests that run against a real InstantDB TEST app (never production).
// Test files must also mock `@/lib/db` and `@instantdb/react-native` — see backup-service.integration.test.ts.
import schema from '@/interfaces/schema'
import { id, init, InstantAdminDatabase } from '@instantdb/admin'

export type AdminDb = InstantAdminDatabase<typeof schema>

export function initTestDb(): AdminDb {
	const appId = process.env.INSTANT_TEST_APP_ID
	const adminToken = process.env.INSTANT_ADMIN_TOKEN
	if (!appId || !adminToken) {
		throw new Error('Set INSTANT_TEST_APP_ID and INSTANT_ADMIN_TOKEN (TEST app only) in .env to run integration tests')
	}
	return init({ appId, adminToken, schema })
}

export const runId = () => id().slice(0, 8)

export async function createTestUser(db: AdminDb, email: string): Promise<string> {
	await db.auth.createToken({ email })
	const user = await db.auth.getUser({ email })
	if (!user) throw new Error(`Could not create test user ${email}`)
	return user.id
}

export async function deleteTestUsers(db: AdminDb, emails: string[]): Promise<void> {
	// Publishers are not cascaded from $users, so remove them explicitly
	const { publishers } = await db.query({ publishers: { $: { where: { 'user.email': { $in: emails } } } } })
	if (publishers.length) await db.transact(publishers.map((p) => db.tx.publishers[p.id].delete()))
	await Promise.all(emails.map((email) => db.auth.deleteUser({ email }).catch(() => undefined)))
}

export async function deleteCongregations(db: AdminDb, ids: string[]): Promise<void> {
	if (ids.length) await db.transact(ids.map((congId) => db.tx.congregations[congId].delete()))
}

export const PERMISSION_DENIED = /permission denied|rate limit/i
