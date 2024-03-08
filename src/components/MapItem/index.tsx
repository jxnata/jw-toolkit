import { LocationObjectCoords } from 'expo-location'
import { IMap } from 'types/models/Map'
import { formatDate } from 'utils/date-format'
import { getLocationDistance } from 'utils/get-location-distance'
import { mapImage } from 'utils/map-image'
import * as S from './styles'

interface MapProps {
	map: IMap
	location: LocationObjectCoords
	onPress: () => void
}

const MapItem = ({ map, location, onPress }: MapProps) => {
	const distance = getLocationDistance(location, map.coordinates)

	return (
		<S.Container onPress={onPress}>
			{!!map.assigned ? (
				<S.StatusAssigned>
					<S.AssignedText>DESIGNADO</S.AssignedText>
				</S.StatusAssigned>
			) : (
				<S.StatusUnassigned>
					<S.UnassignedText>LIVRE</S.UnassignedText>
				</S.StatusUnassigned>
			)}
			<S.Column>
				<S.Image resizeMode='contain' source={{ uri: mapImage(map.coordinates) }} />
			</S.Column>
			<S.Column>
				<S.Paragraph>{map.name}</S.Paragraph>
				<S.Paragraph numberOfLines={2} ellipsizeMode='tail'>
					{map.address}, {map.city.name}
				</S.Paragraph>
				{!!map.last_visited_by && typeof map.last_visited_by === 'object' ? (
					<S.Small>
						Visitado por {map.last_visited_by.name} em {formatDate(map.last_visited)}
					</S.Small>
				) : (
					<S.Small>Ainda não visitado</S.Small>
				)}
			</S.Column>
			<S.Distance>
				<S.DistanceText>{distance}</S.DistanceText>
			</S.Distance>
		</S.Container>
	)
}

export default MapItem
