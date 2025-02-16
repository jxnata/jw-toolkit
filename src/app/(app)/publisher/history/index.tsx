import AssignmentItem from '@components/AssignmentItem'
import useHistoryAssignments from '@hooks/swr/publisher/useHistoryAssignments'
import { useLocation } from '@hooks/useLocation'
import { Stack, router } from 'expo-router'

import * as S from './styles'

const AssignmentHistory = () => {
	const { assigments, loading, mutate } = useHistoryAssignments()
	const { location } = useLocation()

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Histórico', presentation: 'modal' }} />
			<S.Content>
				<S.RefreshControl onRefresh={mutate} refreshing={loading} />
				{assigments.map(assignment => (
					<AssignmentItem
						key={assignment.$id}
						assignment={assignment}
						location={location}
						onPress={() => router.push(`/publisher/assignment/${assignment.$id}`)}
					/>
				))}
				{!assigments.length && !loading && <S.Paragraph>Nenhuma designação no histórico</S.Paragraph>}
			</S.Content>
		</S.Container>
	)
}

export default AssignmentHistory
