import { IAssignment } from 'types/models/Assignment'
import { formatDate } from 'utils/date-format'
import { mapImage } from 'utils/map-image'
import * as S from './styles'

interface AssignmentProps {
	assignment: IAssignment
}

const AssignmentCard = ({ assignment }: AssignmentProps) => {
	return (
		<S.Container>
			<S.Small>{formatDate(assignment.created_at)}</S.Small>
			<S.Column>
				<S.Image resizeMode='contain' source={{ uri: mapImage(assignment.map.coordinates) }} />
			</S.Column>
			<S.Column>
				<S.Paragraph>{assignment.map.name}</S.Paragraph>
				<S.Paragraph>
					{assignment.map.address.street}, {assignment.map.address.number}
				</S.Paragraph>
				<S.Paragraph>{assignment.map.address.district}</S.Paragraph>
				<S.Paragraph>{assignment.map.address.city}</S.Paragraph>
			</S.Column>
		</S.Container>
	)
}

export default AssignmentCard
