import useMyAssignments from '@hooks/useMyAssignments'
import { useRouter } from 'expo-router'
import { error, success } from '@messages/edit'
import { useState } from 'react'

import * as S from './styles'
import { ExecutionMethod, Models } from 'react-native-appwrite'
import { functions } from '@services/appwrite'

interface AssignmentProps {
	assignment: Models.Document
	onCancel: () => void
}

const AssignmentMapCard = ({ assignment, onCancel }: AssignmentProps) => {
	const router = useRouter()
	const { mutate } = useMyAssignments()
	const [loading, setLoading] = useState(false)

	const save = async (found: boolean) => {
		setLoading(true)
		try {
			const result = await functions.createExecution(
				'finish-map',
				JSON.stringify({ $id: assignment.$id, found }),
				false,
				undefined,
				ExecutionMethod.POST
			)

			if (result.responseStatusCode !== 200) {
				error('designação')
				return
			}

			success('designação')
			mutate()
			router.back()
		} finally {
			setLoading(false)
		}
	}

	const saveFound = () => save(true)
	const saveNotFound = () => save(false)

	return (
		<S.Container>
			<S.Content>
				<S.CloseButton onPress={onCancel} disabled={loading}>
					<S.Ionicon name='close-circle-outline' />
				</S.CloseButton>
				<S.Title>Encontrou alguém?</S.Title>
				<S.ButtonGroup>
					<S.ButtonPositive onPress={saveFound} disabled={loading}>
						<S.ButtonTitlePositive>{loading ? 'Salvando...' : 'Sim'}</S.ButtonTitlePositive>
					</S.ButtonPositive>
					<S.ButtonNegative onPress={saveNotFound} disabled={loading}>
						<S.ButtonTitleNegative>{loading ? 'Salvando...' : 'Não'}</S.ButtonTitleNegative>
					</S.ButtonNegative>
				</S.ButtonGroup>
			</S.Content>
		</S.Container>
	)
}

export default AssignmentMapCard
