
export const getMapRegion = (coordinates: [number, number]): { latitude: number; longitude: number } => {
	if (!coordinates) {
		coordinates = [0, 0]
	}
	if (coordinates.length < 2) {
		coordinates = [0, 0]
	}

	return {
		latitude: coordinates[0],
		longitude: coordinates[1],
	}
}
