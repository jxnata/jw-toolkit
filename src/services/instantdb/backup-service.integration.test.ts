/**
 * Integration tests for BackupService against a real InstantDB TEST app — never point these at production.
 *
 * Requires in .env: INSTANT_TEST_APP_ID and INSTANT_ADMIN_TOKEN (admin token of that same app).
 * Run with: bun run test:integration
 *
 * Every run creates its own congregations, users and publishers and deletes them at the end.
 * `@/lib/db` is replaced by the admin SDK impersonating a test user, so the real permission rules apply.
 */
import 'dotenv/config'
import { BackupData } from '@/interfaces'
import schema from '@/interfaces/schema'
import { parseBackupFile } from '@/utils/validate-backup-file'
import { id, init, InstantAdminDatabase } from '@instantdb/admin'
import { backupService } from './backup-service'

jest.mock('@instantdb/react-native', () => {
	const admin = jest.requireActual('@instantdb/admin')
	return { id: admin.id, i: admin.i }
})

// Points to whichever impersonated client the current test is acting as
const mockDbRef: { current: any } = { current: null }

jest.mock('@/lib/db', () => ({
	__esModule: true,
	default: {
		queryOnce: async (query: unknown) => ({ data: await mockDbRef.current.query(query) }),
		transact: (chunks: unknown) => mockDbRef.current.transact(chunks),
		get tx() {
			return mockDbRef.current.tx
		},
	},
}))

const APP_ID = process.env.INSTANT_TEST_APP_ID
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN

const runId = id().slice(0, 8)
const adminEmail = `backup-admin-${runId}@integration.test`
const publisherEmail = `backup-publisher-${runId}@integration.test`

let adminDb: InstantAdminDatabase<typeof schema>
let congregationId: string
let otherCongregationId: string
let publisherId: string
let originalBackup: BackupData

// ── helpers ──────────────────────────────────────────────────────────────────

const actAs = (email: string) => {
	mockDbRef.current = adminDb.asUser({ email })
}

async function createUser(email: string): Promise<string> {
	await adminDb.auth.createToken({ email })
	const user = await adminDb.auth.getUser({ email })
	if (!user) throw new Error(`Could not create test user ${email}`)
	return user.id
}

async function seedTerritory(congId: string, assignedTo?: string) {
	const [cityA, cityB] = [id(), id()]
	const maps = [id(), id(), id(), id()]

	await adminDb.transact([
		adminDb.tx.cities[cityA].update({ name: 'Cidade A' }).link({ congregation: congId }),
		adminDb.tx.cities[cityB].update({ name: 'Cidade B' }).link({ congregation: congId }),
		adminDb.tx.districts[id()].update({ name: 'Centro' }).link({ city: cityA }),
		adminDb.tx.districts[id()].update({ name: 'Vila Nova' }).link({ city: cityA }),
		adminDb.tx.districts[id()].update({ name: 'Jardim' }).link({ city: cityB }),
		adminDb.tx.maps[maps[0]]
			.update({
				name: 'Mapa 1',
				address: 'Rua 1, 100',
				details: 'Portão azul',
				district: 'Centro',
				lat: -23.55,
				lng: -46.63,
				tag: 'comercial',
				found: true,
				found_info: 'Morador atendeu',
				visited: '2026-03-01T12:00:00.000Z',
				visited_by: 'Ana',
			})
			.link({ congregation: congId, city: cityA, ...(assignedTo ? { assigned: assignedTo } : {}) }),
		adminDb.tx.maps[maps[1]]
			.update({ name: 'Mapa 2', address: 'Rua 2, 200', lat: -23.56, lng: -46.64, group_code: 'grp1' })
			.link({ congregation: congId, city: cityA }),
		adminDb.tx.maps[maps[2]]
			.update({ name: 'Mapa 3', address: 'Rua 3, 300', lat: -23.57, lng: -46.65, group_code: 'grp1' })
			.link({ congregation: congId, city: cityB }),
		adminDb.tx.maps[maps[3]]
			.update({ name: 'Mapa 4', address: 'Rua 4, 400', lat: -23.58, lng: -46.66, district: 'Jardim', found: false })
			.link({ congregation: congId, city: cityB }),
	])

	return { cityIds: [cityA, cityB], mapIds: maps }
}

// Reads the congregation's territory (as the admin SDK, bypassing permissions) in an ID-independent shape
async function readTerritory(congId: string) {
	const data = await adminDb.query({
		cities: {
			$: { where: { congregation: congId } },
			districts: {},
			maps: { assigned: {} },
		},
	})

	const cities = data.cities
		.map((city) => ({
			name: city.name,
			districts: city.districts.map((district) => district.name).sort(),
			maps: city.maps
				.map((map) => ({
					name: map.name,
					address: map.address,
					details: map.details ?? null,
					district: map.district ?? null,
					lat: map.lat ?? null,
					lng: map.lng ?? null,
					tag: map.tag ?? null,
					group_code: map.group_code ?? null,
					found: map.found ?? null,
					found_info: map.found_info ?? null,
					visited: map.visited ? new Date(map.visited).getTime() : null,
					visited_by: map.visited_by ?? null,
				}))
				.sort((a, b) => a.name.localeCompare(b.name)),
		}))
		.sort((a, b) => a.name.localeCompare(b.name))

	return {
		cities,
		cityIds: data.cities.map((city) => city.id),
		mapIds: data.cities.flatMap((city) => city.maps.map((map) => map.id)),
		assigned: data.cities.flatMap((city) => city.maps.filter((map) => map.assigned)).length,
	}
}

// ── setup / teardown ─────────────────────────────────────────────────────────

beforeAll(async () => {
	if (!APP_ID || !ADMIN_TOKEN) {
		throw new Error('Set INSTANT_TEST_APP_ID and INSTANT_ADMIN_TOKEN (TEST app only) in .env to run integration tests')
	}

	adminDb = init({ appId: APP_ID, adminToken: ADMIN_TOKEN, schema })

	const [adminUserId, publisherUserId] = await Promise.all([createUser(adminEmail), createUser(publisherEmail)])

	congregationId = id()
	otherCongregationId = id()
	publisherId = id()

	await adminDb.transact([
		adminDb.tx.congregations[congregationId].update({ name: `[integration] backup ${runId}`, enabled: true }),
		adminDb.tx.congregations[otherCongregationId].update({ name: `[integration] other ${runId}`, enabled: true }),
		adminDb.tx.publishers[id()]
			.update({ name: 'Admin', level: 1, approved: true })
			.link({ congregation: congregationId, user: adminUserId }),
		adminDb.tx.publishers[publisherId]
			.update({ name: 'Publicador', level: 3, approved: true })
			.link({ congregation: congregationId, user: publisherUserId }),
	])

	await seedTerritory(congregationId, publisherId)
	await seedTerritory(otherCongregationId)

	actAs(adminEmail)
	originalBackup = await backupService.fetchBackupData(congregationId)
})

afterAll(async () => {
	if (!adminDb) return
	// Deleting a congregation cascades to its cities (→ districts, maps) and publishers
	await adminDb.transact([congregationId, otherCongregationId].filter(Boolean).map((congId) => adminDb.tx.congregations[congId].delete()))
	await Promise.all([adminEmail, publisherEmail].map((email) => adminDb.auth.deleteUser({ email }).catch(() => undefined)))
})

beforeEach(() => actAs(adminEmail))

// ── tests ────────────────────────────────────────────────────────────────────

describe('BackupService (integration)', () => {
	it('backs up every city, district and map of the congregation — and nothing else', async () => {
		expect(originalBackup.version).toBe('1.1')
		expect(originalBackup.congregation_id).toBe(congregationId)
		expect(originalBackup.cities.map((c) => c.name).sort()).toEqual(['Cidade A', 'Cidade B'])
		expect(originalBackup.districts.map((d) => d.name).sort()).toEqual(['Centro', 'Jardim', 'Vila Nova'])
		expect(originalBackup.maps).toHaveLength(4)

		const cityIds = new Set(originalBackup.cities.map((c) => c.id))
		expect(originalBackup.districts.every((d) => cityIds.has(d.city_id))).toBe(true)
		expect(originalBackup.maps.every((m) => cityIds.has(m.city_id))).toBe(true)

		const map1 = originalBackup.maps.find((m) => m.name === 'Mapa 1')
		expect(map1).toMatchObject({
			details: 'Portão azul',
			district: 'Centro',
			tag: 'comercial',
			found: true,
			found_info: 'Morador atendeu',
			visited_by: 'Ana',
		})
		expect(new Date(map1!.visited!).toISOString()).toBe('2026-03-01T12:00:00.000Z')
	})

	it('produces a file that passes validation after serialization', () => {
		const parsed = parseBackupFile(JSON.stringify(originalBackup, null, 2))
		expect(parsed).toEqual(originalBackup)
	})

	it('restore replaces the current territory with the backup content', async () => {
		const before = await readTerritory(congregationId)
		const otherBefore = await readTerritory(otherCongregationId)
		expect(before.assigned).toBe(1)

		// Diverge from the backup: remove a map, rename a city, add a new city with a map
		const extraCity = id()
		await adminDb.transact([
			adminDb.tx.maps[before.mapIds[0]].delete(),
			adminDb.tx.cities[before.cityIds[0]].update({ name: 'Renomeada' }),
			adminDb.tx.cities[extraCity].update({ name: 'Cidade Extra' }).link({ congregation: congregationId }),
			adminDb.tx.maps[id()]
				.update({ name: 'Mapa Extra', address: 'Rua X', lat: 0, lng: 0 })
				.link({ congregation: congregationId, city: extraCity }),
		])

		const progress = jest.fn()
		const summary = await backupService.restoreBackup(originalBackup, congregationId, progress)

		expect(summary).toEqual({ cities: 2, districts: 3, maps: 4, skippedMaps: 0 })
		expect(progress).toHaveBeenCalledWith('maps', 4, 4)

		const after = await readTerritory(congregationId)
		expect(after.cities).toEqual(before.cities)
		// Everything was recreated with new IDs and the old data is gone
		expect(after.cityIds.some((cityId) => before.cityIds.includes(cityId) || cityId === extraCity)).toBe(false)
		expect(after.mapIds.some((mapId) => before.mapIds.includes(mapId))).toBe(false)
		// Assignments are intentionally not part of the backup
		expect(after.assigned).toBe(0)

		// Other congregations are never touched
		expect(await readTerritory(otherCongregationId)).toEqual(otherBefore)
	})

	it('restoring the same backup twice does not duplicate data', async () => {
		await backupService.restoreBackup(originalBackup, congregationId)
		const once = await readTerritory(congregationId)
		await backupService.restoreBackup(originalBackup, congregationId)
		const twice = await readTerritory(congregationId)
		expect(twice.cities).toEqual(once.cities)
		expect(twice.mapIds).toHaveLength(4)
	})

	it('restores a v1.0 backup (no districts or history fields)', async () => {
		const legacy = {
			...originalBackup,
			version: '1.0',
			districts: undefined,
			maps: originalBackup.maps.map(({ found, found_info, visited, visited_by, ...map }) => map),
		}
		const parsed = parseBackupFile(JSON.stringify(legacy))

		const summary = await backupService.restoreBackup(parsed, congregationId)
		expect(summary).toEqual({ cities: 2, districts: 0, maps: 4, skippedMaps: 0 })

		const after = await readTerritory(congregationId)
		expect(after.cities.flatMap((c) => c.maps.map((m) => m.name)).sort()).toEqual(['Mapa 1', 'Mapa 2', 'Mapa 3', 'Mapa 4'])

		await backupService.restoreBackup(originalBackup, congregationId)
	})

	it('restores more maps than a single batch', async () => {
		const city = originalBackup.cities[0]
		const big: BackupData = {
			...originalBackup,
			cities: [city],
			districts: [],
			maps: Array.from({ length: 60 }, (_, index) => ({
				...originalBackup.maps[1],
				id: `big-${index}`,
				name: `Lote ${String(index).padStart(2, '0')}`,
				city_id: city.id,
			})),
		}

		const summary = await backupService.restoreBackup(big, congregationId)
		expect(summary.maps).toBe(60)
		const after = await readTerritory(congregationId)
		expect(after.mapIds).toHaveLength(60)

		await backupService.restoreBackup(originalBackup, congregationId)
	})

	it('skips maps without coordinates instead of failing the whole restore', async () => {
		const withMissingCoords: BackupData = {
			...originalBackup,
			maps: [...originalBackup.maps, { ...originalBackup.maps[1], id: 'no-coords', name: 'Sem GPS', lat: null, lng: null }],
		}

		const summary = await backupService.restoreBackup(withMissingCoords, congregationId)

		expect(summary).toEqual({ cities: 2, districts: 3, maps: 4, skippedMaps: 1 })
		expect((await readTerritory(congregationId)).mapIds).toHaveLength(4)
	})

	it('rolls back and keeps the current territory when the server rejects part of the backup', async () => {
		const before = await readTerritory(congregationId)
		// Bypasses file validation to force a server-side rejection after cities and districts were created
		const broken = {
			...originalBackup,
			maps: [...originalBackup.maps, { ...originalBackup.maps[0], id: 'broken', name: null }],
		} as unknown as BackupData

		await expect(backupService.restoreBackup(broken, congregationId)).rejects.toThrow()

		const after = await readTerritory(congregationId)
		expect(after.cities).toEqual(before.cities)
		expect(after.cityIds.sort()).toEqual(before.cityIds.sort())
		expect(after.mapIds.sort()).toEqual(before.mapIds.sort())
	})

	it('a publisher cannot restore, and the territory is left intact', async () => {
		const before = await readTerritory(congregationId)

		actAs(publisherEmail)
		await expect(backupService.restoreBackup(originalBackup, congregationId)).rejects.toThrow(/permission/i)

		const after = await readTerritory(congregationId)
		expect(after.cityIds.sort()).toEqual(before.cityIds.sort())
		expect(after.mapIds.sort()).toEqual(before.mapIds.sort())
	})

	it('a publisher cannot see another congregation data through a backup', async () => {
		actAs(publisherEmail)
		const backup = await backupService.fetchBackupData(otherCongregationId)
		expect(backup.cities).toHaveLength(0)
		expect(backup.maps).toHaveLength(0)
	})
})
