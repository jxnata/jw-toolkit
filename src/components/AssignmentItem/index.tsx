import { LocationObjectCoords } from 'expo-location'
import { getLocationDistance } from '@utils/get-location-distance'
import { mapImage } from '@utils/map-image'

import * as S from './styles'
import { Models } from 'react-native-appwrite'

interface AssignmentProps {
	map: Models.Document
	location: LocationObjectCoords | null
	onPress?: () => void
	showPublisher?: boolean
}

const AssignmentItem = ({ map, location, onPress }: AssignmentProps) => {
	const coordinates: [number, number] = [map.lat, map.lng]
	const distance = getLocationDistance(location, coordinates)

	return (
		<S.Container onPress={onPress}>
			<S.Column>
				<S.Image resizeMode='contain' source={{ uri: mapImage(coordinates) }} />
			</S.Column>
			<S.Column>
				<S.Paragraph>{map.assigned.name}</S.Paragraph>
				<S.ParagraphAddress>
					{map.name} - {map.address}, {map.city.name}
				</S.ParagraphAddress>
			</S.Column>
			<S.Distance>
				<S.DistanceText>{distance}</S.DistanceText>
			</S.Distance>
		</S.Container>
	)
}

export default AssignmentItem
