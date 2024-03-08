import { LocationObjectCoords } from "expo-location";
import getDistance from 'geolib/es/getDistance';
import { getMarkerCoordinate } from "./get-marker-coordinate";

export const getLocationDistance = (from: LocationObjectCoords, to: [number, number]) => {
	if (!to) return
	if (to.length < 2) return
	if (!from) return

	const fixedTo = getMarkerCoordinate(to.sort())

	const total = getDistance(from, fixedTo)

	let distance = total
	let unit = 'm'

	if (total > 999) {
		distance = Number((total / 1000).toFixed(1))
		unit = 'km'
	}

	return `${distance}${unit}`
}
