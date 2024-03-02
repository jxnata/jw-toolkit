import sum from "lodash/sum"

export const validCoordinates = (coordinates: [number, number]) => {
	if (sum(coordinates) !== 0) {
		console.tron.log(sum(coordinates), coordinates)
		return coordinates
	}

	return undefined
}
