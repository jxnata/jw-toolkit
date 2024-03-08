import { LocationObjectCoords } from 'expo-location'
import { IAssignment } from 'types/models/Assignment'
import { formatDate } from 'utils/date-format'
import { getLocationDistance } from 'utils/get-location-distance'
import { mapImage } from 'utils/map-image'
import * as S from './styles'

interface AssignmentProps {
	assignment: IAssignment
	location: LocationObjectCoords
	onPress?: () => void
	showPublisher?: boolean
}

const AssignmentItem = ({ assignment, showPublisher, location, onPress }: AssignmentProps) => {
	const coordinates: [number, number] = typeof assignment.map !== 'string' ? assignment.map.coordinates : [0, 0]
	const distance = getLocationDistance(location, coordinates)

	return (
		<S.Container onPress={onPress}>
			{assignment.permanent ? (
				<S.Small>Permanente</S.Small>
			) : (
				<S.Small>{formatDate(assignment.created_at)}</S.Small>
			)}
			<S.Column>
				<S.Image resizeMode='contain' source={{ uri: mapImage(coordinates) }} />
			</S.Column>
			{typeof assignment.map !== 'string' && (
				<S.Column>
					<S.Paragraph>{assignment.map.name}</S.Paragraph>
					<S.ParagraphAddress>
						{assignment.map.address}, {assignment.map.city.name}
					</S.ParagraphAddress>
					{showPublisher && typeof assignment.publisher === 'object' && (
						<S.ParagraphAlt>Designado para {assignment.publisher.name}</S.ParagraphAlt>
					)}
				</S.Column>
			)}
			<S.Distance>
				<S.DistanceText>{distance}</S.DistanceText>
			</S.Distance>
		</S.Container>
	)
}

export default AssignmentItem
