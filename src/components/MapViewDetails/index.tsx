import { useMemo } from 'react'
import { IMap } from 'types/models/Map'
import { formatDate } from 'utils/date-format'
import { mapImage } from 'utils/map-image'
import * as S from './styles'

interface MapProps {
	map: IMap
	showImage?: boolean
}

const MapViewDetails = ({ map, showImage }: MapProps) => {
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
				{!!map.details && <S.Paragraph>{map.details}</S.Paragraph>}
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
		</S.Container>
	)
}

export default MapViewDetails
