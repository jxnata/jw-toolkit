import { firstLetter } from './first-letter'

describe('firstLetter', () => {
	it('must return the first letter in uppercase', () => {
		const result = firstLetter('hello')
		expect(result).toBe('H')
	})

	it('must return empty for empty strings', () => {
		const result = firstLetter('')
		expect(result).toBe('')
	})
})
