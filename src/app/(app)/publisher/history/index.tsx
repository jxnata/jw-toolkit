import AssignmentCard from 'components/AssignmentItem'
import { Stack, router } from 'expo-router'
import useHistoryAssignments from 'hooks/swr/publisher/useHistoryAssignments'
import * as S from './styles'

const AssignmentHistory = () => {
	const { assigments, loading, mutate } = useHistoryAssignments()

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Histórico', presentation: 'modal' }} />
			<S.Content>
				<S.RefreshControl onRefresh={mutate} refreshing={loading} />
				{assigments.map(assignment => (
					<AssignmentCard
						key={assignment._id}
						assignment={assignment}
						onPress={() =>
							router.push({
								pathname: '/publisher/assignment',
								params: { data: JSON.stringify(assignment) },
							})
						}
					/>
				))}
				{!assigments.length && !loading && <S.Paragraph>Nenhuma designação no histórico</S.Paragraph>}
			</S.Content>
		</S.Container>
	)
}

export default AssignmentHistory
