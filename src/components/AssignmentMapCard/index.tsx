import { useRouter } from 'expo-router/src/hooks'
import useMyAssignments from 'hooks/swr/publisher/useMyAssignments'
import { error, success } from 'messages/edit'
import { finish } from 'services/assignments/finish'
import { IAssignment } from 'types/models/Assignment'
import * as S from './styles'

interface AssignmentProps {
	assignment: IAssignment
	onCancel: () => void
}

const AssignmentMapCard = ({ assignment, onCancel }: AssignmentProps) => {
	const router = useRouter()
	const { mutate } = useMyAssignments()

	const save = async (found: boolean) => {
		const result = await finish(assignment._id, { found })

		if (result) {
			success('designação')
			mutate()
			router.back()
			return
		}

		error('designação')
	}

	const saveFound = () => save(true)
	const saveNotFound = () => save(true)

	return (
		<S.Container>
			<S.Content>
				<S.CloseButton icon='close-circle-outline' onPress={onCancel} />
				<S.Title>Encontrou alguém?</S.Title>
				<S.Paragraph>Ao escolher uma opção, você termina sua designação.</S.Paragraph>
				<S.ButtonGroup>
					<S.ButtonPositive onPress={saveFound}>
						<S.ButtonTitlePositive>Sim</S.ButtonTitlePositive>
					</S.ButtonPositive>
					<S.ButtonNegative onPress={saveNotFound}>
						<S.ButtonTitleNegative>Não</S.ButtonTitleNegative>
					</S.ButtonNegative>
				</S.ButtonGroup>
			</S.Content>
		</S.Container>
	)
}

export default AssignmentMapCard
