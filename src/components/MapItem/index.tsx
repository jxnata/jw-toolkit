import { useQuery } from '@tanstack/react-query'
import { formatDate } from '@utils/date-format'
import { getLocationDistance } from '@utils/get-location-distance'
import { mapImage } from '@utils/map-image'
import { LocationObjectCoords } from 'expo-location'
import { useMemo } from 'react'

import { firstName } from '@utils/first-name'
import { Models } from 'react-native-appwrite'
import * as S from './styles'

interface MapProps {
	map: Models.Document
	location: LocationObjectCoords | null
	onPress: () => void
}

const MapItem = ({ map, location, onPress }: MapProps) => {
	const { data: distance } = useQuery({
		queryKey: ['distance', location?.latitude, location?.longitude, map.lat, map.lng],
		queryFn: () => getLocationDistance(location, [map.lat, map.lng]),
		enabled: !!location,
	})

	const found = useMemo(() => {
		if (map) {
			if (map.visited) {
				if (map.found) {
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
				<S.Image resizeMode='contain' source={{ uri: mapImage([map.lat, map.lng]) }} />
			</S.Column>
			<S.Column>
				<S.Paragraph>
					{map.city.name} - {map.name}
				</S.Paragraph>
				<S.Paragraph numberOfLines={2} ellipsizeMode='tail'>
					{map.address}
				</S.Paragraph>
				{!!map.visited ? (
					<S.Column>
						Visitado {map.visited_by ? `por ${firstName(map.visited_by)} ` : ''}em {formatDate(map.visited)}
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
