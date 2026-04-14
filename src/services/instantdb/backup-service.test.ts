// Mock must be self-contained — no external variable references allowed in factory
jest.mock('@/lib/db', () => {
	const makeChain = () => {
		const chain: Record<string, jest.Mock> = {}
		chain.delete = jest.fn(() => chain)
		chain.update = jest.fn(() => chain)
		chain.link = jest.fn(() => chain)
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
					get() {
						return new Proxy(
							{},
							{
								get() {
									return makeChain()
								},
							},
						)
					},
				},
			),
		},
	}
})

jest.mock('@instantdb/react-native', () => ({
	id: jest.fn(),
}))

import db from '@/lib/db'
import { id } from '@instantdb/react-native'
import { backupService } from './backup-service'

const mockDb = db as unknown as { queryOnce: jest.Mock; transact: jest.Mock }
const mockId = id as jest.Mock

let idCounter = 0

beforeEach(() => {
	jest.clearAllMocks()
	idCounter = 0
	mockId.mockImplementation(() => `new-id-${++idCounter}`)
	mockDb.transact.mockResolvedValue({})
})

// ── fetchBackupData ──────────────────────────────────────────────────────────

describe('fetchBackupData', () => {
	const rawCities = [{ id: 'c1', name: 'Springfield' }]
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
			city: { id: 'c1' },
		},
		{
			id: 'm2',
			name: 'Map B',
			address: '2 Side St',
			details: undefined,
			district: undefined,
			lat: undefined,
			lng: undefined,
			tag: undefined,
			group_code: undefined,
			city: undefined,
		},
	]

	beforeEach(() => {
		mockDb.queryOnce.mockResolvedValue({ data: { cities: rawCities, maps: rawMaps } })
	})

	it('maps cities to { id, name }', async () => {
		const result = await backupService.fetchBackupData('cong-1')
		expect(result.cities).toEqual([{ id: 'c1', name: 'Springfield' }])
	})

	it('maps maps to correct shape including null fallbacks', async () => {
		const result = await backupService.fetchBackupData('cong-1')
		expect(result.maps[0]).toMatchObject({
			id: 'm1',
			name: 'Map A',
			address: '1 Main St',
			details: 'notes',
			district: 'D1',
			lat: 10,
			lng: 20,
			tag: 'tag1',
			group_code: 'g1',
			city_id: 'c1',
		})
		expect(result.maps[1]).toMatchObject({
			id: 'm2',
			details: null,
			district: '',
			lat: null,
			lng: null,
			tag: null,
			group_code: null,
			city_id: '',
		})
	})

	it("sets version = '1.0' and congregation_id", async () => {
		const result = await backupService.fetchBackupData('cong-1')
		expect(result.version).toBe('1.0')
		expect(result.congregation_id).toBe('cong-1')
	})
})

// ── deleteAllMaps ────────────────────────────────────────────────────────────

describe('deleteAllMaps', () => {
	it('does not call transact when maps array is empty', async () => {
		mockDb.queryOnce.mockResolvedValue({ data: { maps: [] } })
		await backupService.deleteAllMaps('cong-1')
		expect(mockDb.transact).not.toHaveBeenCalled()
	})

	it('splits 30 maps into 2 batches (25 + 5)', async () => {
		const maps = Array.from({ length: 30 }, (_, i) => ({ id: `m${i}` }))
		mockDb.queryOnce.mockResolvedValue({ data: { maps } })
		await backupService.deleteAllMaps('cong-1')
		expect(mockDb.transact).toHaveBeenCalledTimes(2)
		expect(mockDb.transact.mock.calls[0][0]).toHaveLength(25)
		expect(mockDb.transact.mock.calls[1][0]).toHaveLength(5)
	})

	it('progress callback called with (25, 30) then (30, 30)', async () => {
		const maps = Array.from({ length: 30 }, (_, i) => ({ id: `m${i}` }))
		mockDb.queryOnce.mockResolvedValue({ data: { maps } })
		const onProgress = jest.fn()
		await backupService.deleteAllMaps('cong-1', onProgress)
		expect(onProgress).toHaveBeenCalledTimes(2)
		expect(onProgress).toHaveBeenNthCalledWith(1, 25, 30)
		expect(onProgress).toHaveBeenNthCalledWith(2, 30, 30)
	})
})

// ── deleteAllCities ──────────────────────────────────────────────────────────

describe('deleteAllCities', () => {
	it('respects batch limit of 25', async () => {
		const cities = Array.from({ length: 27 }, (_, i) => ({ id: `c${i}` }))
		mockDb.queryOnce.mockResolvedValue({ data: { cities } })
		await backupService.deleteAllCities('cong-1')
		expect(mockDb.transact).toHaveBeenCalledTimes(2)
		expect(mockDb.transact.mock.calls[0][0]).toHaveLength(25)
		expect(mockDb.transact.mock.calls[1][0]).toHaveLength(2)
	})
})

// ── restoreCities ────────────────────────────────────────────────────────────

describe('restoreCities', () => {
	const cities = [
		{ id: 'old-c1', name: 'City One' },
		{ id: 'old-c2', name: 'City Two' },
	]

	it('returned map has one entry per city (oldId → newId)', async () => {
		const cityIdMap = await backupService.restoreCities(cities, 'cong-1')
		expect(Object.keys(cityIdMap)).toHaveLength(2)
		expect(cityIdMap['old-c1']).toBe('new-id-1')
		expect(cityIdMap['old-c2']).toBe('new-id-2')
	})

	it('calls transact once for two cities (within batch limit)', async () => {
		await backupService.restoreCities(cities, 'cong-1')
		expect(mockDb.transact).toHaveBeenCalledTimes(1)
	})
})

// ── restoreMaps ──────────────────────────────────────────────────────────────

describe('restoreMaps', () => {
	const cityIdMap = { 'old-c1': 'new-c1' }
	const maps = [
		{
			id: 'old-m1',
			name: 'Map A',
			address: '1 St',
			district: '',
			city_id: 'old-c1',
			details: null,
			lat: null,
			lng: null,
			tag: null,
			group_code: null,
		},
		{
			id: 'old-m2',
			name: 'Map B',
			address: '2 St',
			district: '',
			city_id: 'unknown-city',
			details: null,
			lat: null,
			lng: null,
			tag: null,
			group_code: null,
		},
	]

	it('skips maps whose city_id has no entry in cityIdMap', async () => {
		await backupService.restoreMaps(maps, cityIdMap, 'cong-1')
		expect(mockDb.transact).toHaveBeenCalledTimes(1)
		expect(mockDb.transact.mock.calls[0][0]).toHaveLength(1)
	})

	it('generates new IDs for every restored map', async () => {
		await backupService.restoreMaps(maps, cityIdMap, 'cong-1')
		expect(mockId).toHaveBeenCalledTimes(1)
	})

	it('progress callback fires per batch', async () => {
		const manyMaps = Array.from({ length: 30 }, (_, i) => ({
			id: `old-m${i}`,
			name: `Map ${i}`,
			address: `${i} St`,
			district: '',
			city_id: 'old-c1',
			details: null,
			lat: null,
			lng: null,
			tag: null,
			group_code: null,
		}))
		const onProgress = jest.fn()
		await backupService.restoreMaps(manyMaps, cityIdMap, 'cong-1', onProgress)
		expect(onProgress).toHaveBeenCalledTimes(2)
		expect(onProgress).toHaveBeenNthCalledWith(1, 25, 30)
		expect(onProgress).toHaveBeenNthCalledWith(2, 30, 30)
	})
})
