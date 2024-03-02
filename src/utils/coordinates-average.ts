export const coordinatesAverage = (markers: [number, number][]): [number, number] => {
	const totalMarkers = markers.length
	const averageCoordinate = markers.reduce(
		(acc, marker) => ({
			latitude: acc.latitude + marker[0],
			longitude: acc.longitude + marker[1],
		}),
		{ latitude: 0, longitude: 0 }
	)

	return [averageCoordinate.latitude / totalMarkers, averageCoordinate.longitude / totalMarkers]
}
