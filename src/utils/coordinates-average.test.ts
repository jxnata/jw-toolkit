import { coordinatesAverage } from './coordinates-average'

describe('coordinatesAverage', () => {
	it('returns the same coordinate for a single point', () => {
		expect(coordinatesAverage([[10, 20]])).toEqual([10, 20])
	})

	it('averages two coordinate pairs', () => {
		expect(coordinatesAverage([[0, 0], [10, 20]])).toEqual([5, 10])
	})

	it('averages multiple coordinate pairs', () => {
		const result = coordinatesAverage([[0, 0], [6, 12], [12, 24]])
		expect(result[0]).toBeCloseTo(6)
		expect(result[1]).toBeCloseTo(12)
	})

	it('handles negative coordinates', () => {
		const result = coordinatesAverage([[-10, -20], [10, 20]])
		expect(result).toEqual([0, 0])
	})
})
