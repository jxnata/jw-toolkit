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
import { FlatList, Pressable, View } from 'react-native'
import { useDebounce } from 'use-debounce'

const Maps = () => {
	const router = useRouter()
	const [searchInput, setSearchInput] = useState('')
	const [searchCity, setSearchCity] = useState('')
	const [status, setStatus] = useState<'assigned' | 'unassigned' | ''>('')
	const [showFilter, setFilter] = useState(true)
	const { colors } = useThemedColors()

	const [debouncedSearchTerm] = useDebounce(searchInput, 500)

	const { maps, loading } = useMaps({
		search: debouncedSearchTerm,
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
				<Pressable onPress={() => router.push('/admin/maps/add')} className='mx-2'>
					<Ionicons name='add-circle-outline' size={24} color={colors.foreground} />
				</Pressable>
				<Pressable onPress={toggleFilter} className='mx-2'>
					<Ionicons name='funnel-outline' size={24} color={colors.foreground} />
				</Pressable>
			</View>
		),
		[router, colors.foreground]
	)

	const filterCity = (city: string) => {
		setSearchInput('')
		setSearchCity(city)
	}

	const toggleFilter = () => {
		setFilter(old => !old)
	}

	return (
		<View className='flex-1'>
			<Stack.Screen options={{ title: 'Mapas', headerRight: HeaderRight }} />
			<View className='p-3 w-full h-full bg-background'>
				{showFilter && (
					<View>
						<Input
							autoCorrect={false}
							placeholder='Buscar por nome ou bairro'
							onChangeText={setSearchInput}
							value={searchInput}
							clearButtonMode='always'
							returnKeyType='search'
						/>

						<View className='flex-row gap-2'>
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
					</View>
				)}

				<View className='flex-1'>
					{loading && !maps.length ? (
						<FlatList
							data={Array.from({ length: 8 }, (_, index) => index + 1)}
							keyExtractor={item => String(item)}
							renderItem={() => <SkeletonItem height={100} />}
							keyboardDismissMode='none'
						/>
					) : (
						<FlatList
							ListFooterComponent={<View className='h-14' />}
							data={maps}
							keyExtractor={item => item.id}
							showsVerticalScrollIndicator={false}
							keyboardDismissMode='none'
							renderItem={({ item }) => (
								<MapItem
									key={item.id}
									map={item}
									location={location}
									onPress={() =>
										router.push({
											pathname: `/admin/maps/${item.id}`,
											params: { data: JSON.stringify(item) },
										})
									}
								/>
							)}
						/>
					)}
				</View>
			</View>
		</View>
	)
}

export default Maps
