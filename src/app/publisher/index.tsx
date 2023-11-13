import AssignmentCard from 'components/AssignmentCard'
import { Stack, useRouter } from 'expo-router'
import useMyAssignments from 'hooks/publisher/useMyAssignments'
import { useCallback } from 'react'
import * as S from './styles'

const PublisherHome = () => {
	const router = useRouter()

	const { assigments, loading, mutate } = useMyAssignments()

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton>
					<S.Icon name='file-tray-full-outline' />
				</S.IconButton>
				<S.IconButton>
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
				{assigments.map((assigment) => (
					<AssignmentCard key={assigment._id} assignment={assigment} />
				))}
			</S.Content>
		</S.Container>
	)
}

export default PublisherHome
