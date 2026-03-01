import { firstLetter } from './first-letter'

describe('firstLetter', () => {
	it('returns the first letter of a word uppercased', () => {
		expect(firstLetter('hello')).toBe('H')
	})

	it('returns uppercase when first letter is already uppercase', () => {
		expect(firstLetter('World')).toBe('W')
	})

	it('works with a single character', () => {
		expect(firstLetter('a')).toBe('A')
	})

	it('returns empty string for empty input', () => {
		expect(firstLetter('')).toBe('')
	})

	it('works with multi-word strings (only first letter of string)', () => {
		expect(firstLetter('John Doe')).toBe('J')
	})
})
