import { IAssignment } from 'types/models/Assignment'
import * as S from './styles'

interface AssignmentProps {
	assignment: IAssignment
}

const AssignmentMapCard = ({ assignment }: AssignmentProps) => {
	return (
		<S.Container>
			<S.Content>
				<S.Paragraph>Quando terminar a visita, finalize escolhendo uma das opções abaixo.</S.Paragraph>
				<S.Title>Encontrou alguém?</S.Title>
				<S.ButtonGroup>
					<S.ButtonPositive>
						<S.ButtonTitle>Sim</S.ButtonTitle>
					</S.ButtonPositive>
					<S.ButtonNegative>
						<S.ButtonTitle>Não</S.ButtonTitle>
					</S.ButtonNegative>
				</S.ButtonGroup>
			</S.Content>
		</S.Container>
	)
}

export default AssignmentMapCard
