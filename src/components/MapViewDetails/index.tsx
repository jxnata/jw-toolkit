import { formatDate } from '@utils/date-format'
import { mapImage } from '@utils/map-image'
import { useMemo } from 'react'

import { firstName } from '@utils/first-name'
import { Models } from 'react-native-appwrite'
import * as S from './styles'

interface MapProps {
	map: Models.Document
	showImage?: boolean
}

const MapViewDetails = ({ map, showImage }: MapProps) => {
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
		<S.Container>
			{showImage && (
				<S.Column>
					<S.Image resizeMode='contain' source={{ uri: mapImage(map.coordinates) }} />
				</S.Column>
			)}
			<S.Column>
				<S.Paragraph>
					{map.city.name} - {map.name}
				</S.Paragraph>
				<S.Paragraph numberOfLines={2} ellipsizeMode='tail'>
					{map.address}
				</S.Paragraph>
				<S.Paragraph numberOfLines={1} ellipsizeMode='tail'>
					{map.district}
				</S.Paragraph>
				{!!map.details && <S.Paragraph>{map.details}</S.Paragraph>}
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
		</S.Container>
	)
}

export default MapViewDetails
