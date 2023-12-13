import { Link } from 'expo-router'
import { IAssignment } from 'types/models/Assignment'
import { formatDate } from 'utils/date-format'
import { mapImage } from 'utils/map-image'
import * as S from './styles'

interface AssignmentProps {
	assignment: IAssignment
}

const AssignmentCard = ({ assignment }: AssignmentProps) => {
	return (
		<Link href={{ pathname: '/publisher/assignment', params: { data: JSON.stringify(assignment) } }} asChild>
			<S.Container>
				<S.Small>{formatDate(assignment.created_at)}</S.Small>
				<S.Column>
					<S.Image resizeMode='contain' source={{ uri: mapImage(assignment.map.coordinates) }} />
				</S.Column>
				<S.Column>
					<S.Paragraph>{assignment.map.name}</S.Paragraph>
					<S.Paragraph>{assignment.map.address}</S.Paragraph>
					<S.Paragraph>{assignment.map.city.name}</S.Paragraph>
				</S.Column>
			</S.Container>
		</Link>
	)
}

export default AssignmentCard
