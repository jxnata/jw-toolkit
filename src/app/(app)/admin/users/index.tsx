import useUsers from '@hooks/swr/admin/useUsers'
import { Stack, useRouter } from 'expo-router'
import { useCallback } from 'react'
import { FlatList } from 'react-native'
import { firstLetter } from '@utils/first-letter'

import * as S from './styles'

const Users = () => {
	const router = useRouter()
	const { users, loading, mutate } = useUsers()

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/users/add')}>
					<S.Ionicon name='add-circle-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[router]
	)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Administradores', headerRight: HeaderRight }} />
			<S.Content>
				<FlatList
					data={users}
					keyExtractor={item => item._id}
					refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
					renderItem={({ item }) => (
						<S.MenuItem
							key={item._id}
							onPress={() => router.push({ pathname: `/admin/users/edit/${item._id}`, params: item })}
						>
							<S.IconContainer>
								<S.Icon>{firstLetter(item.name)}</S.Icon>
							</S.IconContainer>
							<S.MenuContent>
								<S.MenuTitle>{item.name}</S.MenuTitle>
							</S.MenuContent>
						</S.MenuItem>
					)}
				/>
			</S.Content>
		</S.Container>
	)
}

export default Users
