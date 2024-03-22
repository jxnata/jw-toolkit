export const getMarkerCoordinate = (coordinates: [number, number]) => {
	if (!coordinates) {
		return { latitude: 0, longitude: 0 }
	}
	if (coordinates.length < 2) {
		return { latitude: 0, longitude: 0 }
	}

	return {
		latitude: coordinates[0],
		longitude: coordinates[1],
	}
}
