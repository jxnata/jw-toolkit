import { IAssignment } from 'types/Assignment'
import * as S from './styles'

interface AssignmentProps {
	assignment: IAssignment
}

const AssignmentCard = (props: AssignmentProps) => {
	return (
		<S.Container>
			<S.Card>
				<S.Small>12/11/2023</S.Small>
				<S.Column>
					<S.Image source={{ uri: 'https://i.stack.imgur.com/daU8B.jpg' }} />
				</S.Column>
				<S.Column>
					<S.Paragraph>Mapa Nº 102</S.Paragraph>
					<S.Paragraph>Rua Antonio Banderas, 46</S.Paragraph>
					<S.Paragraph>Centro</S.Paragraph>
					<S.Paragraph>Irecê, BA</S.Paragraph>
				</S.Column>
			</S.Card>
		</S.Container>
	)
}

export default AssignmentCard
