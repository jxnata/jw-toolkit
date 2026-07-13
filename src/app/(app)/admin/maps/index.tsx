import Dropdown from '@/components/dropdown'
import Input from '@/components/input'
import MapGroupItem from '@/components/map-group-item'
import MapItem from '@/components/map-item'
import useCities from '@/hooks/use-cities'
import { useLocation } from '@/hooks/use-location'
import useMaps from '@/hooks/use-maps'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { mapsService } from '@/services/instantdb/maps-service'
import { toHex } from '@/utils/to-hex'
import { Stack, useRouter } from 'expo-router'
import { FilterIcon, ListChecks, PinIcon, PlusCircle, Search, SearchX, Settings2 } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { useDebounce } from 'use-debounce'

const Maps = () => {
	const router = useRouter()
	const [searchInput, setSearchInput] = useState('')
	const [searchCity, setSearchCity] = useState('')
	const [status, setStatus] = useState<'assigned' | 'unassigned' | 'no-visit' | ''>('')
	const [showFilter, setFilter] = useState(false)
	const [selectionMode, setSelectionMode] = useState(false)
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const { colors } = useThemedColors()

	const [debouncedSearchTerm] = useDebounce(searchInput, 500)

	const { cities } = useCities()
	const { location } = useLocation()

	const effectiveSearchCity = searchCity || cities[cities.length - 1]?.id || ''

	const { grouped, loading } = useMaps({
		search: debouncedSearchTerm,
		city: effectiveSearchCity,
		status,
		enabled: !!effectiveSearchCity,
	})

	const searching = searchInput !== debouncedSearchTerm || (loading && !!debouncedSearchTerm)

	const citiesList = cities.map((c) => ({ label: `${c.name} (${c.mapsCount})`, value: c.id }))
	const selectedCity = citiesList.find((c) => c.value === effectiveSearchCity)?.label

	const statusList = [
		{ label: 'Todos', value: '' },
		{ label: 'Designados', value: 'assigned' },
		{ label: 'Livres', value: 'unassigned' },
		{ label: 'Não visitar', value: 'no-visit' },
		{ label: 'Estudante', value: 'student' },
	]
	const selectedStatus = statusList.find((s) => s.value === status)?.label

	const enterSelectionMode = () => {
		setSelectionMode(true)
		setSelectedIds([])
	}

	const exitSelectionMode = () => {
		setSelectionMode(false)
		setSelectedIds([])
	}

	const toggleSelect = (id: string) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
	}

	const handleGroup = async () => {
		if (selectedIds.length < 2) return
		const groupCode = toHex(Date.now() + '' + Math.random())
		try {
			await mapsService.setGroupCode(selectedIds, groupCode)
			exitSelectionMode()
		} catch {
			Alert.alert('Erro', 'Não foi possível agrupar os mapas.')
		}
	}

	const handleOptions = () => {
		router.push('/admin/maps/options')
	}

	const HeaderRight = () =>
		selectionMode ? (
			<TouchableOpacity onPress={handleGroup} className="mx-2" disabled={selectedIds.length < 2}>
				<Text
					className="font-semibold text-base"
					style={{ color: selectedIds.length >= 2 ? colors.foreground : colors.foreground + '40' }}>
					Agrupar
				</Text>
			</TouchableOpacity>
		) : (
			<View className="flex-row">
				<TouchableOpacity onPress={() => router.push('/admin/maps/add')} className="mx-2">
					<PlusCircle size={24} color={colors.foreground} />
				</TouchableOpacity>
				<TouchableOpacity onPress={enterSelectionMode} className="mx-2">
					<ListChecks size={24} color={colors.foreground} />
				</TouchableOpacity>
				<TouchableOpacity onPress={handleOptions} className="mx-2">
					<Settings2 size={24} color={colors.foreground} />
				</TouchableOpacity>
			</View>
		)

	const HeaderLeft = () =>
		selectionMode ? (
			<TouchableOpacity onPress={exitSelectionMode} className="mx-2">
				<Text className="font-semibold text-base" style={{ color: colors.foreground }}>
					Cancelar
				</Text>
			</TouchableOpacity>
		) : null

	const filterCity = (city: string) => {
		setSearchInput('')
		setSearchCity(city)
	}

	const toggleFilter = () => {
		setFilter((old) => !old)
		if (searchInput) {
			setSearchInput('')
		}
	}

	return (
		<View className="flex-1">
			<Stack.Screen
				options={{
					title: 'Mapas',
					headerRight: HeaderRight,
					headerLeft: selectionMode ? HeaderLeft : undefined,
				}}
			/>
			<View className="h-full w-full bg-background">
				{!selectionMode ? (
					<View className="flex-row items-center justify-between px-4 py-2">
						<View className="flex-row gap-4">
							<Dropdown
								placeholder="Todos"
								options={statusList}
								selectedValue={status}
								onValueChange={setStatus}
								TriggerComponent={
									<View className="flex-row items-center gap-1">
										<FilterIcon size={16} color={colors.primary[600]} fill={colors.primary[600]} />
										<Text className="font-bold text-lg text-primary underline">{selectedStatus}</Text>
									</View>
								}
							/>
							<Dropdown
								placeholder="Cidade"
								options={citiesList}
								selectedValue={effectiveSearchCity}
								onValueChange={filterCity}
								TriggerComponent={
									<View className="flex-row items-center gap-1">
										<PinIcon size={16} color={colors.primary[600]} fill={colors.primary[600]} />
										<Text className="font-bold text-lg text-primary underline">{selectedCity}</Text>
									</View>
								}
							/>
						</View>
						<TouchableOpacity onPress={toggleFilter} className="mb-2 flex-row items-center gap-1">
							{showFilter ? (
								<SearchX size={16} color={colors.primary[600]} />
							) : (
								<Search size={16} color={colors.primary[600]} />
							)}
							<Text className="font-bold text-lg text-primary underline">{showFilter ? 'Fechar' : 'Buscar'}</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View className="flex-row items-center justify-between px-4 py-2">
						<Text className="font-bold text-lg text-primary">Selecione os mapas para agrupar:</Text>
					</View>
				)}
				{showFilter && !selectionMode && (
					<Animated.View entering={FadeIn} exiting={FadeOut} className="flex-row items-center gap-3 px-4">
						<View className="flex-1">
							<Input
								autoCorrect={false}
								placeholder="Buscar por nome ou bairro"
								onChangeText={setSearchInput}
								value={searchInput}
								clearButtonMode="always"
								returnKeyType="search"
							/>
						</View>
						{searching && <ActivityIndicator size="small" className='mb-3' color={colors.primary[600]} />}
					</Animated.View>
				)}

				<View className="flex-1">
					<FlatList
						ListFooterComponent={<View className="h-14" />}
						data={grouped}
						keyExtractor={(item) => item.group_code}
						showsVerticalScrollIndicator={false}
						keyboardDismissMode="none"
						ListEmptyComponent={
							<View className="flex-1 items-center justify-center py-8">
								<Text className="font-regular text-foreground opacity-80">Nenhum mapa encontrado</Text>
							</View>
						}
						renderItem={({ item }) =>
							item.maps.length > 1 ? (
								<MapGroupItem
									group={item}
									location={location}
									onPress={() => router.push(`/admin/maps/group/${item.group_code}`)}
								/>
							) : (
								<MapItem
									key={item.maps[0].id}
									map={item.maps[0]}
									location={location}
									selectionMode={selectionMode}
									selected={selectedIds.includes(item.maps[0].id)}
									onToggleSelect={toggleSelect}
									onPress={() =>
										router.push({
											pathname: `/admin/maps/${item.maps[0].id}`,
											params: { data: JSON.stringify(item.maps[0]) },
										})
									}
								/>
							)
						}
					/>
				</View>
			</View>
		</View>
	)
}

export default Maps
