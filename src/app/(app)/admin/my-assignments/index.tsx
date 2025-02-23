import AssignmentItem from '@components/AssignmentItem'
import useMyAssignments from '@hooks/useMyAssignments'
import { useLocation } from '@hooks/useLocation'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { OneSignal } from 'react-native-onesignal'

import * as S from './styles'

const MyAssignments = () => {
	const router = useRouter()
	const { location } = useLocation()
	const { assignments, loading, mutate } = useMyAssignments()

	useEffect(() => {
		OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
			event.preventDefault()
			mutate()
			event.getNotification().display()
		})
	}, [mutate])

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Minhas designações' }} />
			<S.Content>
				<S.RefreshControl onRefresh={mutate} refreshing={loading} />
				{assignments.map(assignment => (
					<AssignmentItem
						key={assignment.$id}
						map={assignment}
						location={location}
						onPress={() =>
							router.push({
								pathname: `/admin/my-assignments/view/${assignment.$id}`,
								params: {
									data: JSON.stringify({ ...assignment }),
								},
							})
						}
					/>
				))}
				{!assignments.length && !loading && <S.Paragraph>Nenhuma designação</S.Paragraph>}
			</S.Content>
		</S.Container>
	)
}

export default MyAssignments
