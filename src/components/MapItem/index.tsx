import { IMap } from '@interfaces/models/Map'
import { LocationObjectCoords } from 'expo-location'
import { useMemo } from 'react'
import { formatDate } from '@utils/date-format'
import { getLocationDistance } from '@utils/get-location-distance'
import { mapImage } from '@utils/map-image'

import * as S from './styles'

interface MapProps {
	map: IMap
	location: LocationObjectCoords
	onPress: () => void
}

const MapItem = ({ map, location, onPress }: MapProps) => {
	const distance = getLocationDistance(location, map.coordinates)

	const found = useMemo(() => {
		if (map) {
			if (map.last_assignment) {
				if (map.last_assignment.found) {
					return true
				}
			}
		}

		return false
	}, [map])

	return (
		<S.Container onPress={onPress}>
			{map.assigned ? (
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
				<S.Paragraph>
					{map.city.name} - {map.name}
				</S.Paragraph>
				<S.Paragraph numberOfLines={2} ellipsizeMode='tail'>
					{map.address}
				</S.Paragraph>
				{!!map.last_visited_by && typeof map.last_visited_by === 'object' ? (
					<S.Column>
						<S.Small>
							{map.last_visited_by.name} em {formatDate(map.last_visited)}
						</S.Small>
						{found ? <S.Found>Encontrado</S.Found> : <S.NotFound>Não encontrado</S.NotFound>}
					</S.Column>
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
