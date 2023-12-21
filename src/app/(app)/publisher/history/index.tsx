import AssignmentCard from 'components/AssignmentItem'
import { Stack } from 'expo-router'
import useHistoryAssignments from 'hooks/swr/publisher/useHistoryAssignments'
import * as S from './styles'

const AssignmentHistory = () => {
	const { assigments, loading, mutate } = useHistoryAssignments()

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Histórico', presentation: 'modal' }} />
			<S.Content>
				<S.RefreshControl onRefresh={mutate} refreshing={loading} />
				{assigments.map(assigment => (
					<AssignmentCard key={assigment._id} assignment={assigment} />
				))}
				{!assigments.length && !loading && <S.Paragraph>Nenhuma designação no histórico</S.Paragraph>}
			</S.Content>
		</S.Container>
	)
}

export default AssignmentHistory
