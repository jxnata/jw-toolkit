import sum from 'lodash/sum'

export const validCoordinates = (coordinates: [number, number]) => {
	if (sum(coordinates) !== 0) {
		return coordinates
	}

	return undefined
}
