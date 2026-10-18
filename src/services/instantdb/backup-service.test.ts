// Mock must be self-contained — no external variable references allowed in factory
import { BackupData } from '@/interfaces'
import db from '@/lib/db'
import { id } from '@instantdb/react-native'
import { backupService, CLEANUP_FAILED_MESSAGE } from './backup-service'

// Every tx operation is recorded as a plain object so tests can assert on what was sent to transact
jest.mock('@/lib/db', () => {
	const makeChain = (entity: string, entityId: string) => {
		const op: Record<string, unknown> = { entity, id: entityId }
		const chain: { op: typeof op; delete: jest.Mock; update: jest.Mock; link: jest.Mock } = {
			op,
			delete: jest.fn(() => {
				op.action = 'delete'
				return chain
			}),
			update: jest.fn((data: unknown) => {
				op.action = 'update'
				op.data = data
				return chain
			}),
			link: jest.fn((links: unknown) => {
				op.links = links
				return chain
			}),
		}
		return chain
	}
	return {
		__esModule: true,
		default: {
			queryOnce: jest.fn(),
			transact: jest.fn(),
			tx: new Proxy(
				{},
				{
					get(_, entity: string) {
						return new Proxy({}, { get: (__, entityId: string) => makeChain(entity, entityId) })
					},
				}
			),
		},
	}
})

jest.mock('@instantdb/react-native', () => ({
	id: jest.fn(),
}))

type Op = { entity: string; id: string; action?: string; data?: Record<string, unknown>; links?: Record<string, string> }

const mockDb = db as unknown as { queryOnce: jest.Mock; transact: jest.Mock }
const mockId = id as jest.Mock

// Flattens every transact call into the list of operations sent
const sentOps = (): Op[] => mockDb.transact.mock.calls.flatMap(([batch]) => batch.map((chain: { op: Op }) => chain.op))

let idCounter = 0

beforeEach(() => {
	jest.clearAllMocks()
	idCounter = 0
	mockId.mockImplementation(() => `new-id-${++idCounter}`)
	mockDb.transact.mockResolvedValue({})
})

const makeMap = (overrides: Partial<BackupData['maps'][number]> = {}): BackupData['maps'][number] => ({
	id: 'old-m1',
	name: 'Map A',
	address: '1 St',
	district: '',
	city_id: 'old-c1',
	details: null,
	lat: 1,
	lng: 2,
	tag: null,
	group_code: null,
	...overrides,
})

// ── fetchBackupData ──────────────────────────────────────────────────────────

describe('fetchBackupData', () => {
	const rawCities = [{ id: 'c1', name: 'Springfield' }]
	const rawDistricts = [
		{ id: 'd1', name: 'Centro', city: { id: 'c1' } },
		{ id: 'd2', name: 'Orphan', city: undefined },
	]
	const rawMaps = [
		{
			id: 'm1',
			name: 'Map A',
			address: '1 Main St',
			details: 'notes',
			district: 'D1',
			lat: 10,
			lng: 20,
			tag: 'tag1',
			group_code: 'g1',
			found: true,
			found_info: 'info',
			visited: '2026-01-01T00:00:00.000Z',
			visited_by: 'John',
			city: { id: 'c1' },
		},
		{
			id: 'm2',
			name: 'Map B',
			address: '2 Side St',
			city: undefined,
		},
	]

	beforeEach(() => {
		mockDb.queryOnce.mockResolvedValue({ data: { cities: rawCities, districts: rawDistricts, maps: rawMaps } })
	})

	it('queries cities, districts and maps scoped to the congregation', async () => {
		await backupService.fetchBackupData('cong-1')
		const query = mockDb.queryOnce.mock.calls[0][0]
		expect(query.cities.$.where).toEqual({ congregation: 'cong-1' })
		expect(query.districts.$.where).toEqual({ 'city.congregation': 'cong-1' })
		expect(query.maps.$.where).toEqual({ congregation: 'cong-1' })
	})

	it('maps cities to { id, name }', async () => {
		const result = await backupService.fetchBackupData('cong-1')
		expect(result.cities).toEqual([{ id: 'c1', name: 'Springfield' }])
	})

	it('maps districts to { id, name, city_id }', async () => {
		const result = await backupService.fetchBackupData('cong-1')
		expect(result.districts).toEqual([
			{ id: 'd1', name: 'Centro', city_id: 'c1' },
			{ id: 'd2', name: 'Orphan', city_id: '' },
		])
	})

	it('includes every map field, with null fallbacks', async () => {
		const result = await backupService.fetchBackupData('cong-1')
		expect(result.maps[0]).toEqual({
			id: 'm1',
			name: 'Map A',
			address: '1 Main St',
			details: 'notes',
			district: 'D1',
			lat: 10,
			lng: 20,
			tag: 'tag1',
			group_code: 'g1',
			found: true,
			found_info: 'info',
			visited: '2026-01-01T00:00:00.000Z',
			visited_by: 'John',
			city_id: 'c1',
		})
		expect(result.maps[1]).toEqual({
			id: 'm2',
			name: 'Map B',
			address: '2 Side St',
			details: null,
			district: '',
			lat: null,
			lng: null,
			tag: null,
			group_code: null,
			found: null,
			found_info: null,
			visited: null,
			visited_by: null,
			city_id: '',
		})
	})

	it("sets version = '1.1', congregation_id and created_at", async () => {
		const result = await backupService.fetchBackupData('cong-1')
		expect(result.version).toBe('1.1')
		expect(result.congregation_id).toBe('cong-1')
		expect(Number.isNaN(Date.parse(result.created_at))).toBe(false)
	})

	it('handles a congregation without data', async () => {
		mockDb.queryOnce.mockResolvedValue({ data: {} })
		const result = await backupService.fetchBackupData('cong-1')
		expect(result).toMatchObject({ cities: [], districts: [], maps: [] })
	})
})

// ── deleteEntities ───────────────────────────────────────────────────────────

describe('deleteEntities', () => {
	it('does not call transact when there is nothing to delete', async () => {
		await backupService.deleteEntities('maps', [])
		expect(mockDb.transact).not.toHaveBeenCalled()
	})

	it('splits 30 ids into 2 batches (25 + 5) with progress per batch', async () => {
		const ids = Array.from({ length: 30 }, (_, i) => `m${i}`)
		const onProgress = jest.fn()
		await backupService.deleteEntities('maps', ids, onProgress)
		expect(mockDb.transact).toHaveBeenCalledTimes(2)
		expect(mockDb.transact.mock.calls[0][0]).toHaveLength(25)
		expect(mockDb.transact.mock.calls[1][0]).toHaveLength(5)
		expect(onProgress).toHaveBeenNthCalledWith(1, 25, 30)
		expect(onProgress).toHaveBeenNthCalledWith(2, 30, 30)
		expect(sentOps().every((op) => op.entity === 'maps' && op.action === 'delete')).toBe(true)
	})
})

// ── restoreCities ────────────────────────────────────────────────────────────

describe('restoreCities', () => {
	const cities = [
		{ id: 'old-c1', name: 'City One' },
		{ id: 'old-c2', name: 'City Two' },
	]

	it('returns an oldId → newId map and records created ids', async () => {
		const created: string[] = []
		const cityIdMap = await backupService.restoreCities(cities, 'cong-1', created)
		expect(cityIdMap).toEqual({ 'old-c1': 'new-id-1', 'old-c2': 'new-id-2' })
		expect(created).toEqual(['new-id-1', 'new-id-2'])
	})

	it('links every city to the congregation in a single batch', async () => {
		await backupService.restoreCities(cities, 'cong-1')
		expect(mockDb.transact).toHaveBeenCalledTimes(1)
		expect(sentOps()).toEqual([
			{ entity: 'cities', id: 'new-id-1', action: 'update', data: { name: 'City One' }, links: { congregation: 'cong-1' } },
			{ entity: 'cities', id: 'new-id-2', action: 'update', data: { name: 'City Two' }, links: { congregation: 'cong-1' } },
		])
	})

	it('does not record ids of a batch that failed', async () => {
		const many = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `City ${i}` }))
		mockDb.transact.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('boom'))
		const created: string[] = []
		await expect(backupService.restoreCities(many, 'cong-1', created)).rejects.toThrow('boom')
		expect(created).toHaveLength(25)
	})
})

// ── restoreDistricts ─────────────────────────────────────────────────────────

describe('restoreDistricts', () => {
	it('links districts to the new city ids and skips unknown cities', async () => {
		const restored = await backupService.restoreDistricts(
			[
				{ id: 'old-d1', name: 'Centro', city_id: 'old-c1' },
				{ id: 'old-d2', name: 'Lost', city_id: 'missing' },
			],
			{ 'old-c1': 'new-c1' }
		)
		expect(restored).toBe(1)
		expect(sentOps()).toEqual([
			{ entity: 'districts', id: 'new-id-1', action: 'update', data: { name: 'Centro' }, links: { city: 'new-c1' } },
		])
	})
})

// ── restoreMaps ──────────────────────────────────────────────────────────────

describe('restoreMaps', () => {
	const cityIdMap = { 'old-c1': 'new-c1' }

	it('skips maps whose city_id has no entry in cityIdMap', async () => {
		const restored = await backupService.restoreMaps(
			[makeMap(), makeMap({ id: 'old-m2', city_id: 'unknown-city' })],
			cityIdMap,
			'cong-1'
		)
		expect(restored).toBe(1)
		expect(mockDb.transact).toHaveBeenCalledTimes(1)
		expect(mockDb.transact.mock.calls[0][0]).toHaveLength(1)
	})

	it('skips maps without coordinates, which the schema requires', async () => {
		const restored = await backupService.restoreMaps(
			[makeMap(), makeMap({ id: 'old-m2', lat: null }), makeMap({ id: 'old-m3', lng: null })],
			cityIdMap,
			'cong-1'
		)
		expect(restored).toBe(1)
		expect(sentOps()).toHaveLength(1)
	})

	it('keeps maps at coordinate 0', async () => {
		const restored = await backupService.restoreMaps([makeMap({ lat: 0, lng: 0 })], cityIdMap, 'cong-1')
		expect(restored).toBe(1)
	})

	it('restores every field and links congregation + new city', async () => {
		await backupService.restoreMaps(
			[
				makeMap({
					details: 'd',
					district: 'Centro',
					tag: 't',
					group_code: 'g',
					found: false,
					found_info: 'fi',
					visited: 1700000000000,
					visited_by: 'Ana',
				}),
			],
			cityIdMap,
			'cong-1'
		)
		expect(sentOps()[0]).toEqual({
			entity: 'maps',
			id: 'new-id-1',
			action: 'update',
			data: {
				name: 'Map A',
				address: '1 St',
				details: 'd',
				district: 'Centro',
				lat: 1,
				lng: 2,
				tag: 't',
				group_code: 'g',
				found: false,
				found_info: 'fi',
				visited: 1700000000000,
				visited_by: 'Ana',
			},
			links: { congregation: 'cong-1', city: 'new-c1' },
		})
	})

	it('converts null / empty optional fields to undefined', async () => {
		await backupService.restoreMaps([makeMap({ found: null, visited: null })], cityIdMap, 'cong-1')
		const { data } = sentOps()[0]
		expect(data).toMatchObject({ name: 'Map A', address: '1 St', lat: 1, lng: 2 })
		for (const key of ['details', 'district', 'tag', 'group_code', 'found', 'found_info', 'visited', 'visited_by']) {
			expect(data?.[key]).toBeUndefined()
		}
	})

	it('progress callback fires per batch', async () => {
		const manyMaps = Array.from({ length: 30 }, (_, i) => makeMap({ id: `old-m${i}` }))
		const onProgress = jest.fn()
		await backupService.restoreMaps(manyMaps, cityIdMap, 'cong-1', [], onProgress)
		expect(onProgress).toHaveBeenCalledTimes(2)
		expect(onProgress).toHaveBeenNthCalledWith(1, 25, 30)
		expect(onProgress).toHaveBeenNthCalledWith(2, 30, 30)
	})
})

// ── restoreBackup ────────────────────────────────────────────────────────────

describe('restoreBackup', () => {
	const backup: BackupData = {
		version: '1.1',
		congregation_id: 'cong-1',
		created_at: '2026-01-01T00:00:00.000Z',
		cities: [{ id: 'old-c1', name: 'City One' }],
		districts: [{ id: 'old-d1', name: 'Centro', city_id: 'old-c1' }],
		maps: [makeMap(), makeMap({ id: 'old-m2', city_id: '' })],
	}

	beforeEach(() => {
		mockDb.queryOnce.mockResolvedValue({
			data: { cities: [{ id: 'cur-c1' }], maps: [{ id: 'cur-m1' }, { id: 'cur-m2' }] },
		})
	})

	it('creates the new data before deleting the old data', async () => {
		await backupService.restoreBackup(backup, 'cong-1')
		expect(sentOps().map((op) => `${op.action}:${op.entity}:${op.id}`)).toEqual([
			'update:cities:new-id-1',
			'update:districts:new-id-2',
			'update:maps:new-id-3',
			'delete:maps:cur-m1',
			'delete:maps:cur-m2',
			'delete:cities:cur-c1',
		])
	})

	it('returns a summary including skipped maps', async () => {
		const result = await backupService.restoreBackup(backup, 'cong-1')
		expect(result).toEqual({ cities: 1, districts: 1, maps: 1, skippedMaps: 1 })
	})

	it('reports progress for every step', async () => {
		const onProgress = jest.fn()
		await backupService.restoreBackup(backup, 'cong-1', onProgress)
		expect(onProgress.mock.calls).toEqual([
			['cities', 1, 1],
			['districts', 1, 1],
			['maps', 1, 1],
			['cleanup', 2, 3],
			['cleanup', 3, 3],
		])
	})

	it('accepts v1.0 backups without districts', async () => {
		const { districts: _, ...legacy } = backup
		const result = await backupService.restoreBackup(legacy as BackupData, 'cong-1')
		expect(result.districts).toBe(0)
	})

	it('rolls back created data and keeps old data when creation fails', async () => {
		// cities ok, districts ok, maps fail
		mockDb.transact.mockResolvedValueOnce({}).mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('network'))
		await expect(backupService.restoreBackup(backup, 'cong-1')).rejects.toThrow('network')

		const deletes = sentOps().filter((op) => op.action === 'delete')
		// Only the created city is removed (cascading to its districts); current data is untouched
		expect(deletes.map((op) => `${op.entity}:${op.id}`)).toEqual(['cities:new-id-1'])
	})

	it('surfaces the original error even if rollback fails', async () => {
		mockDb.transact.mockRejectedValue(new Error('offline'))
		await expect(backupService.restoreBackup(backup, 'cong-1')).rejects.toThrow('offline')
	})

	it('throws a specific message when the old data cannot be removed', async () => {
		mockDb.transact
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce({})
			.mockRejectedValueOnce(new Error('boom'))
		await expect(backupService.restoreBackup(backup, 'cong-1')).rejects.toThrow(CLEANUP_FAILED_MESSAGE)
		// The restored data must not be rolled back at this point
		expect(sentOps().filter((op) => op.action === 'delete' && op.id.startsWith('new-'))).toHaveLength(0)
	})
})
