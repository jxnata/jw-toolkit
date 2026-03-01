import { getPinColor } from './get-pin-color'

describe('getPinColor', () => {
	it('returns red when map is assigned', () => {
		expect(getPinColor(true)).toBe('red')
	})

	it('returns green when map is not assigned', () => {
		expect(getPinColor(false)).toBe('green')
	})
})
