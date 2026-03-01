import { normalizeUsername } from './normalize-username'

describe('normalizeUsername', () => {
	it('lowercases the string', () => {
		expect(normalizeUsername('HELLO')).toBe('hello')
	})

	it('removes spaces', () => {
		expect(normalizeUsername('John Doe')).toBe('johndoe')
	})

	it('removes accents/diacritics', () => {
		expect(normalizeUsername('José')).toBe('jose')
	})

	it('removes numbers and special characters', () => {
		expect(normalizeUsername('user123!')).toBe('user')
	})

	it('handles empty string', () => {
		expect(normalizeUsername('')).toBe('')
	})

	it('normalizes a typical Portuguese name', () => {
		expect(normalizeUsername('João Silva')).toBe('joaosilva')
	})
})
