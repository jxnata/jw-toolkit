import { Stack, useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { FlatList } from 'react-native'
import { firstLetter } from '@utils/first-letter'
import { database } from '@services/appwrite'
import useRequestPublishers from '@hooks/swr/admin/useRequestPublishers'

import * as S from './styles'

const Publishers = () => {
	const router = useRouter()
	const { publishers, loading, mutate } = useRequestPublishers()
	const [list, setList] = useState(publishers)

	const approve = useCallback(
		async (publisherId: string) => {
			try {
				setList(list.filter(p => p.$id !== publisherId))

				await database.updateDocument('production', 'publishers', publisherId, {
					approved: true,
				})
			} catch (err) {
				console.error('Failed to approve publisher:', err)
				mutate()
			}
		},
		[publishers, mutate]
	)

	const deny = useCallback(
		async (publisherId: string) => {
			try {
				setList(list.filter(p => p.$id !== publisherId))

				await database.updateDocument('production', 'publishers', publisherId, {
					approved: false,
				})
			} catch (err) {
				console.error('Failed to deny publisher:', err)
				mutate()
			}
		},
		[publishers, mutate]
	)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Solicitações' }} />
			<S.Content>
				<FlatList
					data={publishers}
					keyExtractor={item => item.$id}
					refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
					renderItem={({ item }) => (
						<S.MenuItem
							key={item.$id}
							onPress={() =>
								router.push({ pathname: `/admin/publishers/edit/${item.$id}`, params: item })
							}
						>
							<S.IconContainer>
								<S.Icon>{firstLetter(item.name)}</S.Icon>
							</S.IconContainer>
							<S.MenuContent>
								<S.MenuTitle>{item.name}</S.MenuTitle>
								<S.BadgeContainer>
									<S.IconButton onPress={() => approve(item.$id)}>
										<S.Ionicon name='checkmark-circle-outline' />
									</S.IconButton>
									<S.IconButton onPress={() => deny(item.$id)}>
										<S.Ionicon name='close-circle-outline' />
									</S.IconButton>
								</S.BadgeContainer>
							</S.MenuContent>
						</S.MenuItem>
					)}
				/>
			</S.Content>
		</S.Container>
	)
}

export default Publishers
