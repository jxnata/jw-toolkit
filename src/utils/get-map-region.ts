import { isValidCoordinate } from './is-valid-coordinate'

export const getMapRegion = (coordinates: [number, number]): { latitude: number; longitude: number } => {
	if (!coordinates) {
		coordinates = [0, 0]
	}
	if (coordinates.length < 2) {
		coordinates = [0, 0]
	}
	if (!isValidCoordinate(coordinates[0], coordinates[1])) {
		coordinates = [0, 0]
	}

	return {
		latitude: coordinates[0],
		longitude: coordinates[1],
	}
}
