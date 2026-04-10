import { getLocationDistance } from './get-location-distance'
import { LocationObjectCoords } from 'expo-location'

const makeCoords = (lat: number, lng: number): LocationObjectCoords => ({
	latitude: lat,
	longitude: lng,
	altitude: null,
	accuracy: null,
	altitudeAccuracy: null,
	heading: null,
	speed: null,
})

describe('getLocationDistance', () => {
	it('returns undefined when from is null', () => {
		expect(getLocationDistance(null, [-23.5, -46.6])).toBeUndefined()
	})

	it('returns undefined when to array is short', () => {
		 
		expect(getLocationDistance(makeCoords(0, 0), [1] as any)).toBeUndefined()
	})

	it('returns distance in meters for short distances', () => {
		const from = makeCoords(-23.5505, -46.6333)
		const to: [number, number] = [-23.5510, -46.6333] // ~55m apart
		const result = getLocationDistance(from, to)
		expect(result).toMatch(/^\d+m$/)
	})

	it('returns distance in km for long distances', () => {
		const from = makeCoords(-23.5505, -46.6333) // São Paulo
		const to: [number, number] = [-22.9068, -43.1729] // Rio de Janeiro (~357km)
		const result = getLocationDistance(from, to)
		expect(result).toMatch(/^\d+(\.\d)?km$/)
	})

	it('returns 0m for same location', () => {
		const from = makeCoords(-23.5505, -46.6333)
		const to: [number, number] = [-23.5505, -46.6333]
		const result = getLocationDistance(from, to)
		expect(result).toBe('0m')
	})
})
