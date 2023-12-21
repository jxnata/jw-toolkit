import { IMap } from 'types/models/Map'
import { formatDate } from 'utils/date-format'
import { mapImage } from 'utils/map-image'
import * as S from './styles'

interface MapProps {
	map: IMap
	onPress: () => void
}

const MapItem = ({ map, onPress }: MapProps) => {
	return (
		<S.Container onPress={onPress}>
			<S.Column>
				<S.Image resizeMode='contain' source={{ uri: mapImage(map.coordinates) }} />
			</S.Column>
			<S.Column>
				<S.Paragraph>{map.name}</S.Paragraph>
				<S.Paragraph numberOfLines={2} ellipsizeMode='tail'>
					{map.address}, {map.city.name}
				</S.Paragraph>
				{typeof map.last_visited_by === 'object' ? (
					<S.Small>
						Visitado por {map.last_visited_by.name} em {formatDate(map.last_visited)}
					</S.Small>
				) : (
					<S.Small>Ainda não visitado</S.Small>
				)}
			</S.Column>
		</S.Container>
	)
}

export default MapItem
