import AssignmentItem from 'components/AssignmentItem'
import { Stack, useRouter } from 'expo-router'
import useMyAssignments from 'hooks/swr/publisher/useMyAssignments'
import { useLocation } from 'hooks/useLocation'
import { useCallback, useEffect } from 'react'
import { OneSignal } from 'react-native-onesignal'

import * as S from './styles'

const PublisherHome = () => {
	const router = useRouter()
	const { location } = useLocation()
	const { assigments, loading, mutate } = useMyAssignments()

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/publisher/history')}>
					<S.Icon name='file-tray-full-outline' />
				</S.IconButton>
				<S.IconButton onPress={() => router.push('/publisher/me')}>
					<S.Icon name='person-circle-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[router]
	)

	useEffect(() => {
		OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
			event.preventDefault()
			mutate()
			event.getNotification().display()
		})
	}, [mutate])

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Designações', headerRight: HeaderRight }} />
			<S.Content>
				<S.RefreshControl onRefresh={mutate} refreshing={loading} />
				{assigments.map(assignment => (
					<AssignmentItem
						key={assignment._id}
						assignment={assignment}
						location={location}
						onPress={() => router.push(`/publisher/assignment/${assignment._id}`)}
					/>
				))}
				{!assigments.length && !loading && <S.Paragraph>Nenhuma designação</S.Paragraph>}
			</S.Content>
		</S.Container>
	)
}

export default PublisherHome
