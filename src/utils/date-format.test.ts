import { formatDate } from './date-format'

describe('formatDate', () => {
	it('returns a non-empty string for a valid timestamp string', () => {
		const result = formatDate('2024-01-15T10:30:00Z')
		expect(typeof result).toBe('string')
		expect(result.length).toBeGreaterThan(0)
	})

	it('returns a non-empty string for a valid numeric timestamp', () => {
		const result = formatDate(1705312200000)
		expect(typeof result).toBe('string')
		expect(result.length).toBeGreaterThan(0)
	})

	it('contains the year 2024 for a 2024 date', () => {
		const result = formatDate('2024-06-15T00:00:00Z')
		expect(result).toContain('2024')
	})

	it('returns Invalid Date string for an invalid input', () => {
		const result = formatDate('not-a-date')
		expect(result).toBe('Invalid Date')
	})
})
