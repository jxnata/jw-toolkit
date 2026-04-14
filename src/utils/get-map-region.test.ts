import { getMapRegion } from './get-map-region'

describe('getMapRegion', () => {
	it('returns latitude and longitude from a valid [lat, lng] tuple', () => {
		expect(getMapRegion([10.5, 20.3])).toEqual({ latitude: 10.5, longitude: 20.3 })
	})

	it('returns { latitude: 0, longitude: 0 } for null input', () => {
		expect(getMapRegion(null as unknown as [number, number])).toEqual({ latitude: 0, longitude: 0 })
	})

	it('returns { latitude: 0, longitude: 0 } when array has fewer than 2 elements', () => {
		expect(getMapRegion([1] as unknown as [number, number])).toEqual({ latitude: 0, longitude: 0 })
	})
})
