import { LocationObjectCoords } from 'expo-location'
import getDistance from 'geolib/es/getDistance'

import { getMarkerCoordinate } from './get-marker-coordinate'

const METER_TO_KM_THRESHOLD = 999

export const getLocationDistance = (from: LocationObjectCoords | null, to: [number, number]) => {
	if (!to) return
	if (to.length < 2) return
	if (!from) return

	const fixedTo = getMarkerCoordinate(to)

	const total = getDistance(from, fixedTo)

	let distance = total
	let unit = 'm'

	if (total > METER_TO_KM_THRESHOLD) {
		distance = Number((total / 1000).toFixed(1))
		unit = 'km'
	}

	return `${distance}${unit}`
}
