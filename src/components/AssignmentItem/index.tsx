import { IAssignment } from 'types/models/Assignment'
import { formatDate } from 'utils/date-format'
import { mapImage } from 'utils/map-image'
import * as S from './styles'

interface AssignmentProps {
	assignment: IAssignment
	onPress?: () => void
	showPublisher?: boolean
}

const AssignmentCard = ({ assignment, showPublisher, onPress }: AssignmentProps) => {
	return (
		<S.Container onPress={onPress}>
			{assignment.permanent ? (
				<S.Small>Permanente</S.Small>
			) : (
				<S.Small>{formatDate(assignment.created_at)}</S.Small>
			)}
			<S.Column>
				<S.Image resizeMode='contain' source={{ uri: mapImage(assignment.map.coordinates) }} />
			</S.Column>
			<S.Column>
				<S.Paragraph>{assignment.map.name}</S.Paragraph>
				<S.ParagraphAddress>
					{assignment.map.address}, {assignment.map.city.name}
				</S.ParagraphAddress>
				{showPublisher && typeof assignment.publisher === 'object' && (
					<S.ParagraphAlt>Designado para {assignment.publisher.name}</S.ParagraphAlt>
				)}
			</S.Column>
		</S.Container>
	)
}

export default AssignmentCard
