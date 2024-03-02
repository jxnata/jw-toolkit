export const getMarkerCoordinate = (coordinates: [number, number]) => {
	if (!coordinates) {
		return { latitude: 0, longitude: 0 }
	}
	if (coordinates.length < 2) {
		return { latitude: 0, longitude: 0 }
	}

	const fixedCoord = coordinates.sort()
	return {
		latitude: fixedCoord[0],
		longitude: fixedCoord[1],
	}
}
