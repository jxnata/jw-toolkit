import AssignmentItem from 'components/AssignmentItem'
import { Stack, router } from 'expo-router'
import useHistoryAssignments from 'hooks/swr/publisher/useHistoryAssignments'
import { useLocation } from 'hooks/useLocation'

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
						key={assignment._id}
						assignment={assignment}
						location={location}
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
