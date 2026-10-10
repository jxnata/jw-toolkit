import { isValidCoordinate } from './is-valid-coordinate'

describe('isValidCoordinate', () => {
	it('accepts finite coordinates inside the valid range', () => {
		expect(isValidCoordinate(-23.5, -46.6)).toBe(true)
		expect(isValidCoordinate(0, 0)).toBe(true)
	})

	it('rejects null, undefined and non-numeric values', () => {
		expect(isValidCoordinate(null, -46.6)).toBe(false)
		expect(isValidCoordinate(-23.5, undefined)).toBe(false)
		expect(isValidCoordinate('-23.5', '-46.6')).toBe(false)
	})

	it('rejects NaN and infinite values', () => {
		expect(isValidCoordinate(NaN, -46.6)).toBe(false)
		expect(isValidCoordinate(-23.5, Infinity)).toBe(false)
	})

	it('rejects coordinates outside the valid range', () => {
		expect(isValidCoordinate(91, 0)).toBe(false)
		expect(isValidCoordinate(0, -181)).toBe(false)
	})
})
