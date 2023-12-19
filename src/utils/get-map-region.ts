import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export const getMapRegion = (coordinates: [number, number]) => {
	return {
		latitude: coordinates[0],
		longitude: coordinates[1],
		latitudeDelta: 0.01,
		longitudeDelta: 0.01 * (width / height),
	}
}
