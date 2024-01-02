import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export const getMapRegion = (coordinates: [number, number], delta?: number) => {
	if (!delta) {
		delta = 0.1
	}
	return {
		latitude: coordinates[0],
		longitude: coordinates[1],
		latitudeDelta: delta,
		longitudeDelta: delta * (width / height),
	}
}
