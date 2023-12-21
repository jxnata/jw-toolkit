import Input from 'components/Input'
import MapItem from 'components/MapItem'
import { Stack, useRouter } from 'expo-router'
import useMaps from 'hooks/swr/admin/useMaps'
import debounce from 'lodash/debounce'
import { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import * as S from './styles'

const Maps = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const { maps, loading, mutate } = useMaps({ search: searchTerm })

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/maps/add')}>
					<S.Ionicon name='add-circle-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[]
	)

	const debouncedSearch = debounce(async term => {
		setSearchTerm(term)
	}, 500)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Mapas', headerRight: HeaderRight }} />
			<S.Content>
				<FlatList
					ListHeaderComponent={
						<Input
							autoCorrect={false}
							placeholder='Buscar um mapa...'
							onChangeText={debouncedSearch}
							clearButtonMode='always'
						/>
					}
					data={maps}
					keyExtractor={item => item._id}
					refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
					renderItem={({ item }) => (
						<MapItem
							key={item._id}
							map={item}
							onPress={() => router.push({ pathname: `/admin/maps/view/${item._id}`, params: item })}
						/>
					)}
				/>
			</S.Content>
		</S.Container>
	)
}

export default Maps
