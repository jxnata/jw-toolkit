import { instant } from '@/database/index'
import AsyncStorage from '@react-native-async-storage/async-storage'
import InstantStore from './instant-store'

jest.mock('@/database/index', () => {
	const data = new Map<string, string | boolean>()
	return {
		__esModule: true,
		instant: {
			set: jest.fn((key: string, value: string | boolean) => data.set(key, value)),
			getString: jest.fn((key: string) => data.get(key)),
			contains: jest.fn((key: string) => data.has(key)),
			remove: jest.fn((key: string) => data.delete(key)),
			getAllKeys: jest.fn(() => [...data.keys()]),
			clearAll: jest.fn(() => data.clear()),
		},
	}
})

jest.mock('@instantdb/react-native', () => ({
	StoreInterface: class {},
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
	__esModule: true,
	default: {
		getAllKeys: jest.fn(),
		getItem: jest.fn(),
		multiRemove: jest.fn(),
	},
}))

const legacy = AsyncStorage as jest.Mocked<typeof AsyncStorage>
const PREFIX = 'instant_app_5_kv_'

const mockLegacy = (entries: Record<string, string>) => {
	legacy.getAllKeys.mockResolvedValue(Object.keys(entries))
	legacy.getItem.mockImplementation(async (key: string) => entries[key] ?? null)
	legacy.multiRemove.mockResolvedValue(undefined)
}

describe('InstantStore', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		instant.clearAll()
		mockLegacy({})
	})

	it('persists and reads values through MMKV', async () => {
		const store = new InstantStore('app', 'kv')

		await store.multiSet([
			['a', { n: 1 }],
			['b', [1, 2]],
		])

		expect(await store.getItem('a')).toEqual({ n: 1 })
		expect(await store.getItem('b')).toEqual([1, 2])
		expect(await store.getItem('missing')).toBeNull()
		expect((await store.getAllKeys()).sort()).toEqual(['a', 'b'])

		await store.removeItem('a')
		expect(await store.getItem('a')).toBeNull()
	})

	it('only lists keys of its own store', async () => {
		const kv = new InstantStore('app', 'kv')
		const querySubs = new InstantStore('app', 'querySubs')

		await kv.multiSet([['currentUser', { id: '1' }]])
		await querySubs.multiSet([['hash', { q: {} }]])

		expect(await kv.getAllKeys()).toEqual(['currentUser'])
		expect(await querySubs.getAllKeys()).toEqual(['hash'])
	})

	it('moves the data left in AsyncStorage and frees it', async () => {
		mockLegacy({
			[`${PREFIX}currentUser`]: JSON.stringify({ id: '1' }),
			[`${PREFIX}pendingMutations`]: JSON.stringify([]),
			'instant_app_5_querySubs_hash': JSON.stringify({ q: {} }),
			'other-key': 'x',
		})
		const store = new InstantStore('app', 'kv')

		expect(await store.getItem('currentUser')).toEqual({ id: '1' })
		expect((await store.getAllKeys()).sort()).toEqual(['currentUser', 'pendingMutations'])
		expect(legacy.multiRemove).toHaveBeenCalledWith([`${PREFIX}currentUser`, `${PREFIX}pendingMutations`])
	})

	it('migrates only once', async () => {
		mockLegacy({ [`${PREFIX}currentUser`]: JSON.stringify({ id: '1' }) })

		await new InstantStore('app', 'kv').getItem('currentUser')
		await new InstantStore('app', 'kv').getItem('currentUser')

		expect(legacy.getAllKeys).toHaveBeenCalledTimes(1)
	})

	it('does not overwrite newer MMKV data with the legacy value', async () => {
		instant.set(`${PREFIX}currentUser`, JSON.stringify({ id: 'new' }))
		mockLegacy({ [`${PREFIX}currentUser`]: JSON.stringify({ id: 'old' }) })

		expect(await new InstantStore('app', 'kv').getItem('currentUser')).toEqual({ id: 'new' })
	})

	it('skips unreadable legacy entries and keeps the rest', async () => {
		mockLegacy({
			[`${PREFIX}big`]: 'x',
			[`${PREFIX}currentUser`]: JSON.stringify({ id: '1' }),
		})
		legacy.getItem.mockImplementation(async (key: string) => {
			if (key === `${PREFIX}big`) throw new Error('Row too big to fit into CursorWindow')
			return JSON.stringify({ id: '1' })
		})
		const store = new InstantStore('app', 'kv')

		expect(await store.getItem('currentUser')).toEqual({ id: '1' })
		expect(await store.getItem('big')).toBeNull()
	})

	it('keeps working and retries later when AsyncStorage fails', async () => {
		legacy.getAllKeys.mockRejectedValue(new Error('database or disk is full (code 13 SQLITE_FULL)'))
		const store = new InstantStore('app', 'kv')

		await store.multiSet([['a', 1]])
		expect(await store.getItem('a')).toBe(1)

		mockLegacy({ [`${PREFIX}currentUser`]: JSON.stringify({ id: '1' }) })
		expect(await new InstantStore('app', 'kv').getItem('currentUser')).toEqual({ id: '1' })
	})
})
