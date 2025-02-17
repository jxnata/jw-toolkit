import { Dimensions } from 'react-native'
import { Region } from 'react-native-maps'
const { height, width } = Dimensions.get('window')

export const getMapRegion = (coordinates: [number, number], delta?: number) => {
	if (!coordinates) {
		coordinates = [0, 0]
	}
	if (coordinates.length < 2) {
		coordinates = [0, 0]
	}
	if (!delta) {
		delta = 0.1
	}

	return {
		latitude: coordinates[0],
		longitude: coordinates[1],
		latitudeDelta: delta,
		longitudeDelta: delta * (width / height),
	} as Region
}
