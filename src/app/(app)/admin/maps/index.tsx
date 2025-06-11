import Dropdown from '@/components/Dropdown'
import Input from '@/components/Input'
import MapItem from '@/components/MapItem'
import SkeletonItem from '@/components/SkeletonItem'
import useCities from '@/hooks/useCities'
import { useLocation } from '@/hooks/useLocation'
import useMaps from '@/hooks/useMaps'
import { Stack, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList } from 'react-native'

import { Controller, useForm } from 'react-hook-form'
import * as S from './styles'

const Maps = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const [searchCity, setSearchCity] = useState('')
	const [status, setStatus] = useState<'assigned' | 'unassigned' | ''>('')
	const [showFilter, setFilter] = useState(true)
	const { control, handleSubmit, reset } = useForm<{ search: string }>()

	const { maps, loading, mutate, queryKey, loadMore, loadingMore, hasMore } = useMaps({
		search: searchTerm,
		city: searchCity,
		status,
		enabled: !!searchCity,
	})
	const { cities } = useCities()
	const { location } = useLocation()

	const citiesList = useMemo(() => [...cities.map(c => ({ label: c.name, value: c.$id }))], [cities])

	useEffect(() => {
		if (cities.length > 0 && !searchCity) {
			setSearchCity(cities[0].$id)
		}
	}, [cities, searchCity])

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton
					onPress={() =>
						router.push({ pathname: '/admin/maps/add', params: { query: JSON.stringify(queryKey) } })
					}
				>
					<S.Ionicon name='add-circle-outline' />
				</S.IconButton>
				<S.IconButton onPress={toggleFilter}>
					<S.Ionicon name='funnel-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[queryKey, router]
	)

	const ListHeaderComponent = () => {
		return (
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
								<Dropdown
									placeholder='Cidade'
									options={citiesList}
									selectedValue={searchCity}
									onValueChange={filterCity}
								/>
							</S.FilterItemsContainer>
						</S.FilterContainer>

						<S.FilterContainer>
							<S.SearchContainer>
								<Controller
									control={control}
									rules={{ required: true }}
									name='search'
									render={({ field: { onChange, onBlur, value } }) => (
										<Input
											autoCorrect={false}
											placeholder='Buscar por nome ou bairro'
											onChangeText={onChange}
											onBlur={onBlur}
											value={value}
											returnKeyType='search'
											onSubmitEditing={handleSubmit(handleSearch)}
											style={{ flex: 1, marginBottom: 0 }}
										/>
									)}
								/>
								{searchTerm && (
									<S.ClearButton onPress={handleClear}>
										<S.Ionicon name='close-outline' />
									</S.ClearButton>
								)}
								<S.SearchButton onPress={handleSubmit(handleSearch)}>
									<S.Ionicon name='search-outline' />
								</S.SearchButton>
							</S.SearchContainer>
						</S.FilterContainer>
					</>
				)}
			</>
		)
	}

	const ListFooterComponent = () => {
		if (!loadingMore) return null
		return (
			<S.LoadingContainer>
				<ActivityIndicator />
			</S.LoadingContainer>
		)
	}

	const handleSearch = (data: { search: string }) => {
		setSearchTerm(data.search)
	}

	const handleClear = () => {
		setSearchTerm('')
		reset()
	}

	const filterCity = (city: string) => {
		setSearchTerm('')
		setSearchCity(city)
	}

	const toggleFilter = () => {
		setFilter(old => !old)
	}

	const handleEndReached = () => {
		if (hasMore && !loadingMore) {
			loadMore()
		}
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Mapas', headerRight: HeaderRight }} />
			<S.Content>
				{loading && !maps.length ? (
					<FlatList
						data={Array.from({ length: 8 }, (_, index) => index + 1)}
						keyExtractor={item => String(item)}
						ListHeaderComponent={<ListHeaderComponent />}
						renderItem={() => <SkeletonItem height={100} />}
						stickyHeaderIndices={[0]}
					/>
				) : (
					<FlatList
						ListHeaderComponent={<ListHeaderComponent />}
						ListFooterComponent={<ListFooterComponent />}
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
											params: { data: JSON.stringify(item), query: JSON.stringify(queryKey) },
										})
									}
								/>
							</S.ListContainer>
						)}
						stickyHeaderIndices={[0]}
						onEndReached={handleEndReached}
						onEndReachedThreshold={0.5}
					/>
				)}
			</S.Content>
		</S.Container>
	)
}

export default Maps
