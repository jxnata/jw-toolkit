import { getMarkerCoordinate } from './get-marker-coordinate'

describe('getMarkerCoordinate', () => {
	it('converts [lat, lng] tuple to {latitude, longitude} object', () => {
		expect(getMarkerCoordinate([-23.5, -46.6])).toEqual({
			latitude: -23.5,
			longitude: -46.6,
		})
	})

	it('returns zero coordinates for null-like input', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(getMarkerCoordinate(null as any)).toEqual({ latitude: 0, longitude: 0 })
	})

	it('returns zero coordinates for short array', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(getMarkerCoordinate([1] as any)).toEqual({ latitude: 0, longitude: 0 })
	})

	it('handles zero coordinates', () => {
		expect(getMarkerCoordinate([0, 0])).toEqual({ latitude: 0, longitude: 0 })
	})
})
