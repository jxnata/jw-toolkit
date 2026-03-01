import { getExpiration } from './get-expiration'

describe('getExpiration', () => {
	it('returns a timestamp in the future for positive minutes', () => {
		const before = Date.now()
		const result = getExpiration(30)
		const after = Date.now()

		const expectedMin = before + 30 * 60 * 1000
		const expectedMax = after + 30 * 60 * 1000

		expect(result).toBeGreaterThanOrEqual(expectedMin)
		expect(result).toBeLessThanOrEqual(expectedMax)
	})

	it('returns a past timestamp for negative minutes', () => {
		const before = Date.now()
		const result = getExpiration(-60)
		expect(result).toBeLessThan(before)
	})

	it('returns approximately current time for 0 minutes', () => {
		const before = Date.now()
		const result = getExpiration(0)
		const after = Date.now()

		expect(result).toBeGreaterThanOrEqual(before)
		expect(result).toBeLessThanOrEqual(after)
	})

	it('returns a number', () => {
		expect(typeof getExpiration(10)).toBe('number')
	})
})
