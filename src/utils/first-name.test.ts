import { firstName } from './first-name'

describe('firstName', () => {
	it('returns the first word from a full name', () => {
		expect(firstName('John Doe')).toBe('John')
	})

	it('returns the single name when there is no space', () => {
		expect(firstName('John')).toBe('John')
	})

	it('returns empty string for empty input', () => {
		expect(firstName('')).toBe('')
	})

	it('works with multiple-word names', () => {
		expect(firstName('Maria da Silva Santos')).toBe('Maria')
	})
})
