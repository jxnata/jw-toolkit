import Dropdown from '@/components/dropdown'
import Input from '@/components/input'
import MapItem from '@/components/map-item'
import SkeletonItem from '@/components/skeleton-item'
import useCities from '@/hooks/use-cities-instant'
import useMaps from '@/hooks/use-maps-instant'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { useLocation } from '@/hooks/useLocation'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Stack, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, RefreshControl, View } from 'react-native'

import { Controller, useForm } from 'react-hook-form'

const Maps = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const [searchCity, setSearchCity] = useState('')
	const [status, setStatus] = useState<'assigned' | 'unassigned' | ''>('')
	const [showFilter, setFilter] = useState(true)
	const { control, handleSubmit, reset } = useForm<{ search: string }>()
	const { colors } = useThemedColors()

	const { maps, loading, mutate, queryKey, loadMore, loadingMore, hasMore } = useMaps({
		search: searchTerm,
		city: searchCity,
		status,
		enabled: !!searchCity,
	})
	const { cities } = useCities()
	const { location } = useLocation()

	const citiesList = useMemo(() => [...cities.map(c => ({ label: c.name, value: c.id }))], [cities])

	useEffect(() => {
		if (cities.length > 0 && !searchCity) {
			setSearchCity(cities[0].id)
		}
	}, [cities, searchCity])

	const HeaderRight = useCallback(
		() => (
			<View className='flex-row'>
				<Pressable
					onPress={() =>
						router.push({ pathname: '/admin/maps/add', params: { query: JSON.stringify(queryKey) } })
					}
					className='mx-2'
				>
					<Ionicons name='add-circle-outline' size={24} color={colors.foreground} />
				</Pressable>
				<Pressable onPress={toggleFilter} className='mx-2'>
					<Ionicons name='funnel-outline' size={24} color={colors.foreground} />
				</Pressable>
			</View>
		),
		[queryKey, router, colors.foreground]
	)

	const ListHeaderComponent = () => {
		return (
			<View className='bg-background'>
				{showFilter && (
					<>
						<View className='flex-row gap-2.5 mb-2.5'>
							<View className='flex-1'>
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
							</View>
							<View className='flex-1'>
								<Dropdown
									placeholder='Cidade'
									options={citiesList}
									selectedValue={searchCity}
									onValueChange={filterCity}
								/>
							</View>
						</View>

						<View className='flex-row gap-2.5 mb-2.5'>
							<View className='flex-1'>
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
							</View>
							{searchTerm && (
								<Pressable onPress={handleClear} className='w-10 h-10 items-center justify-center'>
									<Ionicons name='close-outline' size={24} color={colors.foreground} />
								</Pressable>
							)}
							<Pressable
								onPress={handleSubmit(handleSearch)}
								className='w-10 h-10 items-center justify-center'
							>
								<Ionicons name='search-outline' size={24} color={colors.foreground} />
							</Pressable>
						</View>
					</>
				)}
			</View>
		)
	}

	const ListFooterComponent = () => {
		if (!loadingMore) return null
		return (
			<View className='py-2.5 items-center'>
				<ActivityIndicator size='small' color={colors.primary[600]} />
			</View>
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
		<View className='flex'>
			<Stack.Screen options={{ title: 'Mapas', headerRight: HeaderRight }} />
			<View className='flex p-2.5 w-full h-full bg-background'>
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
						keyExtractor={item => item.id}
						refreshControl={<RefreshControl onRefresh={mutate} refreshing={loading} />}
						contentContainerClassName='gap-2'
						showsVerticalScrollIndicator={false}
						renderItem={({ item }) => (
							<MapItem
								key={item.id}
								map={item}
								location={location}
								onPress={() =>
									router.push({
										pathname: `/admin/maps/${item.id}`,
										params: { data: JSON.stringify(item), query: JSON.stringify(queryKey) },
									})
								}
							/>
						)}
						stickyHeaderIndices={[0]}
						onEndReached={handleEndReached}
						onEndReachedThreshold={0.5}
					/>
				)}
			</View>
		</View>
	)
}

export default Maps
