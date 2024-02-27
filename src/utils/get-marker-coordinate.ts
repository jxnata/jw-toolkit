export const getMarkerCoordinate = (coordinates: [number, number]) => {
	const fixedCoord = coordinates.sort()
	return {
		latitude: fixedCoord[0],
		longitude: fixedCoord[1],
	}
}
