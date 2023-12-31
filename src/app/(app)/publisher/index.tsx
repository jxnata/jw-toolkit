import AssignmentCard from 'components/AssignmentItem'
import { Stack, useRouter } from 'expo-router'
import useMyAssignments from 'hooks/swr/publisher/useMyAssignments'
import { useCallback } from 'react'
import * as S from './styles'

const PublisherHome = () => {
	const router = useRouter()

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
		[]
	)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Designações', headerRight: HeaderRight }} />
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
				{!assigments.length && !loading && <S.Paragraph>Nenhuma designação</S.Paragraph>}
			</S.Content>
		</S.Container>
	)
}

export default PublisherHome
