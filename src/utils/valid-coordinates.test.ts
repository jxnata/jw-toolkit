import { validCoordinates } from './valid-coordinates'

describe('validCoordinates', () => {
	it('returns the coordinates when they are non-zero', () => {
		const coords: [number, number] = [-23.5, -46.6]
		expect(validCoordinates(coords)).toEqual(coords)
	})

	it('returns undefined when both coordinates are zero', () => {
		expect(validCoordinates([0, 0])).toBeUndefined()
	})

	it('returns coordinates when only one value is non-zero', () => {
		expect(validCoordinates([0, 10])).toEqual([0, 10])
	})

	it('returns coordinates when sum is non-zero (e.g. -10 + 10 = 0 is excluded)', () => {
		// sum([−10, 10]) = 0 → treated as invalid
		expect(validCoordinates([-10, 10])).toBeUndefined()
	})
})
