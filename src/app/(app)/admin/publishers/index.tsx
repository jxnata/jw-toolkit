import Input from 'components/Input'
import { Stack, useRouter } from 'expo-router'
import usePublishers from 'hooks/swr/admin/usePublishers'
import debounce from 'lodash/debounce'
import { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { firstLetter } from 'utils/first-letter'

import * as S from './styles'

const Publishers = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const { publishers, loading, mutate } = usePublishers({ all: true, search: searchTerm })

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/publishers/add')}>
					<S.Ionicon name='add-circle-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[router]
	)

	const debouncedSearch = debounce(async term => {
		setSearchTerm(term)
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
					keyExtractor={item => item._id}
					refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
					renderItem={({ item }) => (
						<S.MenuItem
							key={item._id}
							onPress={() =>
								router.push({ pathname: `/admin/publishers/edit/${item._id}`, params: item })
							}
						>
							<S.IconContainer>
								<S.Icon>{firstLetter(item.name)}</S.Icon>
							</S.IconContainer>
							<S.MenuContent>
								<S.MenuTitle>{item.name}</S.MenuTitle>
								<S.BadgeContainer>
									{item.privileges.map(p => (
										<S.Badge key={p}>
											<S.BadgeText>{p.toUpperCase()}</S.BadgeText>
										</S.Badge>
									))}
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
