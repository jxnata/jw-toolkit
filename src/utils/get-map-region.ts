import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export const getMapRegion = (coordinates: [number, number], delta?: number) => {
	if (!delta) {
		delta = 0.1
	}
	const fixedCoord = coordinates.sort()

	return {
		latitude: fixedCoord[0],
		longitude: fixedCoord[1],
		latitudeDelta: delta,
		longitudeDelta: delta * (width / height),
	}
}
