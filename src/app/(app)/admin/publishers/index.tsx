import Input from '@components/Input'
import usePublishers from '@hooks/swr/admin/usePublishers'
import { Stack, useRouter } from 'expo-router'
import debounce from 'lodash/debounce'
import { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { firstLetter } from '@utils/first-letter'

import * as S from './styles'

const Publishers = () => {
	const router = useRouter()
	const [search, setSearch] = useState('')
	const { publishers, loading, mutate } = usePublishers({ search: search })

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/publishers/review')}>
					<S.Ionicon name='mail-unread-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[router]
	)

	const debouncedSearch = debounce(async term => {
		setSearch(term)
	}, 500)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Publicadores', headerRight: HeaderRight }} />
			<S.Content>
				<FlatList
					ListHeaderComponent={
						<Input
							autoCorrect={false}
							placeholder='Buscar um publicador...'
							onChangeText={debouncedSearch}
							clearButtonMode='always'
						/>
					}
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
									{item.level === 1 && (
										<S.Badge>
											<S.BadgeText>admin</S.BadgeText>
										</S.Badge>
									)}
									{item.level === 2 && (
										<S.Badge>
											<S.BadgeText>editor</S.BadgeText>
										</S.Badge>
									)}
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
