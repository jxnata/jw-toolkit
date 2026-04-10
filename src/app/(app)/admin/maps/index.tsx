import Dropdown from '@/components/dropdown'
import Input from '@/components/input'
import MapItem from '@/components/map-item'
import useCities from '@/hooks/use-cities'
import { useLocation } from '@/hooks/use-location'
import useMaps from '@/hooks/use-maps'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { mapsService } from '@/services/instantdb/maps-service'
import { toHex } from '@/utils/to-hex'
import { Stack, useRouter } from 'expo-router'
import { Funnel, PlusCircle } from 'lucide-react-native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated'
import { useDebounce } from 'use-debounce'

const Maps = () => {
	const router = useRouter()
	const [searchInput, setSearchInput] = useState('')
	const [searchCity, setSearchCity] = useState('')
	const [status, setStatus] = useState<'assigned' | 'unassigned' | 'no-visit' | ''>('')
	const [showFilter, setFilter] = useState(true)
	const [selectionMode, setSelectionMode] = useState(false)
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const { colors } = useThemedColors()

	const [debouncedSearchTerm] = useDebounce(searchInput, 500)

	const { maps } = useMaps({
		search: debouncedSearchTerm,
		city: searchCity,
		status,
		enabled: !!searchCity,
	})

	const { cities } = useCities()
	const { location } = useLocation()

	const citiesList = useMemo(() => [...cities.map((c) => ({ label: c.name, value: c.id }))], [cities])

	useEffect(() => {
		if (cities.length > 0 && !searchCity) {
			setSearchCity(cities[cities.length - 1].id)
		}
	}, [cities, searchCity])

	const enterSelectionMode = useCallback(() => {
		setSelectionMode(true)
		setSelectedIds([])
	}, [])

	const exitSelectionMode = useCallback(() => {
		setSelectionMode(false)
		setSelectedIds([])
	}, [])

	const toggleSelect = useCallback((id: string) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
	}, [])

	const handleGroup = useCallback(async () => {
		if (selectedIds.length < 2) return
		const groupCode = toHex(Date.now() + '' + Math.random())
		try {
			await mapsService.setGroupCode(selectedIds, groupCode)
			exitSelectionMode()
		} catch {
			Alert.alert('Erro', 'Não foi possível agrupar os mapas.')
		}
	}, [selectedIds, exitSelectionMode])

	const HeaderRight = useCallback(
		() =>
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
					<TouchableOpacity onPress={toggleFilter} className="mx-2">
						<Funnel size={24} color={colors.foreground} />
					</TouchableOpacity>
					<TouchableOpacity onPress={enterSelectionMode} className="mx-2">
						<Text className="font-semibold text-base" style={{ color: colors.foreground }}>
							Selecionar
						</Text>
					</TouchableOpacity>
				</View>
			),
		[router, colors.foreground, selectionMode, selectedIds.length, handleGroup, enterSelectionMode]
	)

	const HeaderLeft = useCallback(
		() =>
			selectionMode ? (
				<TouchableOpacity onPress={exitSelectionMode} className="mx-2">
					<Text className="font-semibold text-base" style={{ color: colors.foreground }}>
						Cancelar
					</Text>
				</TouchableOpacity>
			) : null,
		[selectionMode, exitSelectionMode, colors.foreground]
	)

	const filterCity = (city: string) => {
		setSearchInput('')
		setSearchCity(city)
	}

	const toggleFilter = () => {
		setFilter((old) => !old)
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
			<View className="h-full w-full bg-background p-4">
				{showFilter && !selectionMode && (
					<Animated.View entering={SlideInUp} exiting={SlideOutUp}>
						<Input
							autoCorrect={false}
							placeholder="Buscar por nome ou bairro"
							onChangeText={setSearchInput}
							value={searchInput}
							clearButtonMode="always"
							returnKeyType="search"
						/>

						<View className="flex-row gap-2">
							<View className="flex-1">
								<Dropdown
									placeholder="Todos"
									options={[
										{ label: 'Todos', value: '' },
										{ label: 'Designados', value: 'assigned' },
										{ label: 'Livres', value: 'unassigned' },
										{ label: 'Não visitar', value: 'no-visit' },
										{ label: 'Estudante', value: 'student' },
									]}
									selectedValue={status}
									onValueChange={setStatus}
								/>
							</View>
							<View className="flex-1">
								<Dropdown placeholder="Cidade" options={citiesList} selectedValue={searchCity} onValueChange={filterCity} />
							</View>
						</View>
					</Animated.View>
				)}

				<View className="flex-1">
					<FlatList
						ListFooterComponent={<View className="h-14" />}
						data={maps}
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
						keyboardDismissMode="none"
						ListEmptyComponent={
							<View className="flex-1 items-center justify-center py-8">
								<Text className="font-regular text-foreground opacity-80">Nenhum mapa encontrado</Text>
							</View>
						}
						renderItem={({ item }) => (
							<MapItem
								key={item.id}
								map={item}
								location={location}
								selectionMode={selectionMode}
								selected={selectedIds.includes(item.id)}
								onToggleSelect={toggleSelect}
								onPress={() =>
									router.push({
										pathname: `/admin/maps/${item.id}`,
										params: { data: JSON.stringify(item) },
									})
								}
							/>
						)}
					/>
				</View>
			</View>
		</View>
	)
}

export default Maps
