// All dependencies are mocked to plain functions, so useLimits() can be called directly
import { useSession } from '@/contexts/session-provider'
import { useSubscription } from '@/hooks/use-subscription'
import db from '@/lib/db'
import { useLimits } from './use-limits'

jest.mock('@/constants/env', () => ({
	FREE_LIMITS: { maps: '3', publishers: '2', phones: '4' },
}))

jest.mock('@/contexts/session-provider', () => ({
	useSession: jest.fn(),
}))

jest.mock('@/hooks/use-subscription', () => ({
	useSubscription: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
	__esModule: true,
	default: {
		useQuery: jest.fn(),
	},
}))

const mockUseSession = useSession as jest.Mock
const mockUseSubscription = useSubscription as jest.Mock
const mockUseQuery = db.useQuery as jest.Mock

const congregation = { id: 'cong-1', name: 'Test Congregation' }

function useSetup({
	subscribed = false,
	cong = congregation as typeof congregation | null,
	maps = [] as unknown[],
	publishers = [] as unknown[],
	phones = [] as unknown[],
} = {}) {
	mockUseSession.mockReturnValue({ congregation: cong })
	mockUseSubscription.mockReturnValue({ subscribed })
	mockUseQuery
		.mockReturnValueOnce({ data: { maps } })
		.mockReturnValueOnce({ data: { publishers } })
		.mockReturnValueOnce({ data: { phones } })
	return useLimits()
}

beforeEach(() => {
	jest.clearAllMocks()
})

// ── Subscribed user ──────────────────────────────────────────────────────────

describe('subscribed user', () => {
	it('mapsReached = false even when mapsCount > FREE_LIMITS.maps', () => {
		const result = useSetup({ subscribed: true, maps: [{}, {}, {}, {}] })
		expect(result.mapsReached).toBe(false)
	})

	it('publishersReached = false even when publishersCount > FREE_LIMITS.publishers', () => {
		const result = useSetup({ subscribed: true, publishers: [{}, {}, {}] })
		expect(result.publishersReached).toBe(false)
	})

	it('anyLimitReached = false', () => {
		const result = useSetup({ subscribed: true, maps: [{}, {}, {}, {}], publishers: [{}, {}, {}] })
		expect(result.anyLimitReached).toBe(false)
	})

	it('counts are still correctly returned', () => {
		const result = useSetup({ subscribed: true, maps: [{}, {}], publishers: [{}], phones: [{}, {}, {}] })
		expect(result.mapsCount).toBe(2)
		expect(result.publishersCount).toBe(1)
		expect(result.phonesCount).toBe(3)
	})

	it('phonesReached = false even when phonesCount > FREE_LIMITS.phones', () => {
		const result = useSetup({ subscribed: true, phones: [{}, {}, {}, {}, {}] })
		expect(result.phonesReached).toBe(false)
		expect(result.anyLimitReached).toBe(false)
	})
})

// ── Free user ────────────────────────────────────────────────────────────────

describe('free user', () => {
	it('0 maps and 0 publishers: all reached flags false', () => {
		const result = useSetup({ subscribed: false, maps: [], publishers: [] })
		expect(result.mapsReached).toBe(false)
		expect(result.publishersReached).toBe(false)
		expect(result.anyLimitReached).toBe(false)
	})

	it('mapsCount === FREE_LIMITS.maps (3): mapsReached = true', () => {
		const result = useSetup({ subscribed: false, maps: [{}, {}, {}] })
		expect(result.mapsReached).toBe(true)
	})

	it('mapsCount < FREE_LIMITS.maps (2 < 3): mapsReached = false', () => {
		const result = useSetup({ subscribed: false, maps: [{}, {}] })
		expect(result.mapsReached).toBe(false)
	})

	it('publishersCount > FREE_LIMITS.publishers: publishersReached = true, anyLimitReached = true', () => {
		const result = useSetup({ subscribed: false, publishers: [{}, {}, {}] })
		expect(result.publishersReached).toBe(true)
		expect(result.anyLimitReached).toBe(true)
	})

	it('phonesCount < FREE_LIMITS.phones (3 < 4): phonesReached = false', () => {
		const result = useSetup({ subscribed: false, phones: [{}, {}, {}] })
		expect(result.phonesReached).toBe(false)
		expect(result.anyLimitReached).toBe(false)
	})

	it('phonesCount === FREE_LIMITS.phones (4): phonesReached = true, anyLimitReached = true', () => {
		const result = useSetup({ subscribed: false, phones: [{}, {}, {}, {}] })
		expect(result.phonesReached).toBe(true)
		expect(result.anyLimitReached).toBe(true)
	})

	it('phones limit is independent from the maps limit', () => {
		const result = useSetup({ subscribed: false, maps: [{}, {}], phones: [{}, {}, {}] })
		expect(result.mapsReached).toBe(false)
		expect(result.phonesReached).toBe(false)
	})
})

// ── No congregation ──────────────────────────────────────────────────────────

describe('no congregation', () => {
	it('mapsCount = 0, publishersCount = 0, no limits reached', () => {
		mockUseSession.mockReturnValue({ congregation: null })
		mockUseSubscription.mockReturnValue({ subscribed: false })
		mockUseQuery
			.mockReturnValueOnce({ data: null })
			.mockReturnValueOnce({ data: null })
			.mockReturnValueOnce({ data: null })
		const result = useLimits()
		expect(result.mapsCount).toBe(0)
		expect(result.publishersCount).toBe(0)
		expect(result.phonesCount).toBe(0)
		expect(result.mapsReached).toBe(false)
		expect(result.publishersReached).toBe(false)
		expect(result.phonesReached).toBe(false)
		expect(result.anyLimitReached).toBe(false)
	})
})
