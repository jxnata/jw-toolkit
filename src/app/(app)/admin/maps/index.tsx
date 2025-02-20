import Dropdown from '@components/Dropdown'
import Input from '@components/Input'
import MapItem from '@components/MapItem'
import useCities from '@hooks/swr/admin/useCities'
import useDistricts from '@hooks/swr/admin/useDistricts'
import useMaps from '@hooks/swr/admin/useMaps'
import { useLocation } from '@hooks/useLocation'
import { Stack, useRouter } from 'expo-router'
import debounce from 'lodash/debounce'
import { useCallback, useMemo, useState } from 'react'
import { FlatList } from 'react-native'

import * as S from './styles'
import React from 'react'

const Maps = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const [searchCity, setSearchCity] = useState('')
	const [searchDistrict, setSearchDistrict] = useState('')
	const [status, setStatus] = useState<'assigned' | 'unassigned' | ''>('')
	const [showFilter, setFilter] = useState(false)
	const { maps, loading, mutate } = useMaps({
		search: searchTerm,
		city: searchCity,
		district: searchDistrict,
		status,
	})
	const { list } = useDistricts(maps)
	const { cities } = useCities()
	const { location } = useLocation()

	const citiesList = useMemo(
		() => [{ label: 'Todos', value: '' }, ...cities.map(c => ({ label: c.name, value: c.$id }))],
		[cities]
	)

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/maps/add')}>
					<S.Ionicon name='add-circle-outline' />
				</S.IconButton>
				<S.IconButton onPress={() => router.push('/admin/maps/all')}>
					<S.Ionicon name='map-outline' />
				</S.IconButton>
				<S.IconButton onPress={toggleFilter}>
					<S.Ionicon name='funnel-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[router]
	)

	const debouncedSearch = debounce(async term => {
		setSearchTerm(term)
	}, 500)

	const filterCity = (city: string) => {
		setSearchTerm('')
		setSearchDistrict('')
		setSearchCity(city)
	}

	const filterDistrict = (district: string) => {
		setSearchTerm('')
		setSearchDistrict(district)
	}

	const toggleFilter = () => {
		setFilter(old => !old)
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Mapas', headerRight: HeaderRight }} />
			<S.Content>
				<FlatList
					ListHeaderComponent={
						<>
							{showFilter && (
								<>
									<S.FilterContainer>
										<S.FilterItemsContainer>
											<Dropdown
												placeholder='Todos'
												options={[
													{ label: 'Todos', value: '' },
													{ label: 'Designados', value: 'assigned' },
													{ label: 'Livres', value: 'unassigned' },
												]}
												selectedValue={status}
												onValueChange={setStatus}
											/>
										</S.FilterItemsContainer>
										<S.FilterItemsContainer>
											<Input
												autoCorrect={false}
												placeholder='Buscar um mapa...'
												onChangeText={debouncedSearch}
												clearButtonMode='always'
											/>
										</S.FilterItemsContainer>
									</S.FilterContainer>

									<S.FilterContainer>
										<S.FilterItemsContainer>
											<Dropdown
												placeholder='Cidade'
												options={citiesList}
												selectedValue={searchCity}
												onValueChange={filterCity}
											/>
										</S.FilterItemsContainer>
										<S.FilterItemsContainer>
											<Dropdown
												placeholder='Bairro'
												options={list}
												selectedValue={searchDistrict}
												onValueChange={filterDistrict}
												disabled={!searchCity}
											/>
										</S.FilterItemsContainer>
									</S.FilterContainer>
								</>
							)}
						</>
					}
					data={maps}
					keyExtractor={item => item.$id}
					refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
					renderItem={({ item }) => (
						<S.ListContainer>
							<MapItem
								key={item.$id}
								map={item}
								location={location}
								onPress={() =>
									router.push({
										pathname: `/admin/maps/${item.$id}`,
										params: { data: JSON.stringify(item) },
									})
								}
							/>
						</S.ListContainer>
					)}
					stickyHeaderIndices={[0]}
				/>
			</S.Content>
		</S.Container>
	)
}

export default Maps
