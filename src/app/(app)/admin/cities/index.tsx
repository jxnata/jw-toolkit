import Input from '@components/Input'
import useCities from '@hooks/useCities'
import { Stack, useRouter } from 'expo-router'
import debounce from 'lodash/debounce'
import { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { firstLetter } from '@utils/first-letter'
import SkeletonItem from '@components/SkeletonItem'

import * as S from './styles'

const Cities = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const { cities, loading, mutate } = useCities({ search: searchTerm })

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/cities/add')}>
					<S.Ionicon name='add-circle-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[router]
	)

	const debouncedSearch = debounce(async term => {
		setSearchTerm(term)
	}, 500)

	const ListHeaderComponent = () => {
		return (
			<Input
				autoCorrect={false}
				placeholder='Buscar uma cidade...'
				onChangeText={debouncedSearch}
				clearButtonMode='always'
			/>
		)
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Cidades', headerRight: HeaderRight }} />
			<S.Content>
				{loading && !cities.length ? (
					<FlatList
						data={[1, 2, 3, 4, 5]}
						keyExtractor={item => String(item)}
						ListHeaderComponent={<ListHeaderComponent />}
						renderItem={() => <SkeletonItem />}
					/>
				) : (
					<FlatList
						ListHeaderComponent={<ListHeaderComponent />}
						data={cities}
						keyExtractor={item => item.$id}
						refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
						renderItem={({ item }) => (
							<S.MenuItem
								key={item.$id}
								onPress={() =>
									router.push({
										pathname: `/admin/cities/edit/${item.$id}`,
										params: { data: JSON.stringify(item) },
									})
								}
							>
								<S.IconContainer>
									<S.Icon>{firstLetter(item.name)}</S.Icon>
								</S.IconContainer>
								<S.MenuTitle>{item.name}</S.MenuTitle>
							</S.MenuItem>
						)}
					/>
				)}
			</S.Content>
		</S.Container>
	)
}

export default Cities
