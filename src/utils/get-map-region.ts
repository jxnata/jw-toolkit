
export const getMapRegion = (coordinates: [number, number]): any => {
	if (!coordinates) {
		coordinates = [0, 0]
	}
	if (coordinates.length < 2) {
		coordinates = [0, 0]
	}

	return {
		coordinates: {
			latitude: coordinates[0],
			longitude: coordinates[1],
		},
		zoom: 17,
	}
}
