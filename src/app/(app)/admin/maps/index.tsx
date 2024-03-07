import Dropdown from 'components/Dropdown'
import Input from 'components/Input'
import MapItem from 'components/MapItem'
import { Stack, useRouter } from 'expo-router'
import useCities from 'hooks/swr/admin/useCities'
import useMaps from 'hooks/swr/admin/useMaps'
import debounce from 'lodash/debounce'
import { useCallback, useMemo, useState } from 'react'
import { FlatList } from 'react-native'
import * as S from './styles'

const Maps = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const [searchCity, setSearchCity] = useState('')
	const { maps, loading, mutate, next } = useMaps({ search: searchCity || searchTerm })
	const { cities } = useCities()

	const citiesList = useMemo(
		() => [{ label: 'Todos', value: null }, ...cities.map(c => ({ label: c.name, value: c._id }))],
		[cities]
	)

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/maps/all')}>
					<S.Ionicon name='map-outline' />
				</S.IconButton>
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

	const filterCity = city => {
		setSearchTerm('')
		setSearchCity(city)
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Mapas', headerRight: HeaderRight }} />
			<S.Content>
				<FlatList
					ListHeaderComponent={
						<S.FilterContainer>
							<S.FilterItemsContainer>
								<Input
									autoCorrect={false}
									placeholder='Buscar um mapa...'
									onChangeText={debouncedSearch}
									clearButtonMode='always'
								/>
							</S.FilterItemsContainer>
							<S.FilterItemsContainer>
								<Dropdown
									placeholder='Cidade'
									options={citiesList}
									selectedValue={searchCity}
									onValueChange={filterCity}
								/>
							</S.FilterItemsContainer>
						</S.FilterContainer>
					}
					data={maps}
					keyExtractor={item => item._id}
					refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
					renderItem={({ item }) => (
						<S.ListContainer>
							<MapItem
								key={item._id}
								map={item}
								onPress={() => router.push({ pathname: `/admin/maps/${item._id}`, params: item })}
							/>
						</S.ListContainer>
					)}
					onEndReached={next}
					stickyHeaderIndices={[0]}
				/>
			</S.Content>
		</S.Container>
	)
}

export default Maps
