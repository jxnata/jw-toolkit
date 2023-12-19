import { Stack, useRouter } from 'expo-router'
import usePublishers from 'hooks/swr/admin/usePublishers'
import { useCallback } from 'react'
import { firstLetter } from 'utils/first-letter'
import * as S from './styles'

const Publishers = () => {
	const router = useRouter()
	const { publishers, loading, mutate } = usePublishers()

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/publishers/add')}>
					<S.Ionicon name='add-circle-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[]
	)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Publicadores', headerRight: HeaderRight }} />
			<S.Content>
				<S.RefreshControl onRefresh={mutate} refreshing={loading} />
				{publishers.map(publisher => (
					<S.MenuItem key={publisher._id}>
						<S.IconContainer>
							<S.Icon>{firstLetter(publisher.name)}</S.Icon>
						</S.IconContainer>
						<S.MenuTitle>{publisher.name}</S.MenuTitle>
					</S.MenuItem>
				))}
			</S.Content>
		</S.Container>
	)
}

export default Publishers
