import { useQuery } from '@tanstack/react-query'
import { getLocationDistance } from '@utils/get-location-distance'
import { mapImage } from '@utils/map-image'
import { LocationObjectCoords } from 'expo-location'

import { formatDate } from '@utils/date-format'
import { firstName } from '@utils/first-name'
import { useMemo } from 'react'
import { Models } from 'react-native-appwrite'
import * as S from './styles'

interface AssignmentProps {
	map: Models.Document
	location: LocationObjectCoords | null
	onPress?: () => void
	hidePublisher?: boolean
}

const AssignmentItem = ({ map, location, hidePublisher, onPress }: AssignmentProps) => {
	const coordinates: [number, number] = [map.lat, map.lng]

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

	const { data: distance } = useQuery({
		queryKey: ['distance', location?.latitude, location?.longitude, coordinates[0], coordinates[1]],
		queryFn: () => getLocationDistance(location, coordinates),
		enabled: !!location,
	})

	return (
		<S.Container onPress={onPress}>
			<S.Column>
				<S.Image resizeMode='contain' source={{ uri: mapImage(coordinates) }} />
			</S.Column>
			<S.Column>
				{map.assigned && !hidePublisher && <S.Paragraph>{map.assigned.name}</S.Paragraph>}
				<S.ParagraphAddress>
					{map.name} - {map.address}, {map.city.name}
				</S.ParagraphAddress>
				{!!map.visited ? (
					<S.Column>
						<S.Small>
							Visitado {map.visited_by ? `por ${firstName(map.visited_by)} ` : ''}em{' '}
							{formatDate(map.visited)}
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

export default AssignmentItem
