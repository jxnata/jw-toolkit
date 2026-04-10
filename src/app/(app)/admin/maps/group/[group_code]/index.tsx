import MapItem from '@/components/map-item'
import SheetModal from '@/components/sheet-modal'
import { useSession } from '@/contexts/session-provider'
import useGroupMaps from '@/hooks/use-group-maps'
import { useLocation } from '@/hooks/use-location'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import db from '@/lib/db'
import { mapsService } from '@/services/instantdb/maps-service'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Minus, PlusCircle } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'

const GroupDetail = () => {
	const { group_code } = useLocalSearchParams<{ group_code: string }>()
	const router = useRouter()
	const { colors } = useThemedColors()
	const { congregation } = useSession()
	const { location } = useLocation()
	const [modalVisible, setModalVisible] = useState(false)

	const { maps } = useGroupMaps(group_code)

	const cityId = maps[0]?.city?.id

	const { data: ungroupedData } = db.useQuery(
		congregation && cityId && modalVisible
			? {
					maps: {
						$: {
							where: {
								congregation: congregation.id,
								city: cityId,
								group_code: { $isNull: true },
							},
						},
						city: {},
						assigned: {},
					},
				}
			: null
	)

	const ungroupedMaps = (ungroupedData?.maps as Map[]) || []

	const handleRemove = useCallback(
		async (mapId: string) => {
			try {
				if (maps.length <= 2) {
					await mapsService.dissolveGroup(group_code)
					router.back()
				} else {
					await mapsService.removeFromGroup(mapId)
				}
			} catch {
				Alert.alert('Erro', 'Não foi possível remover o mapa do grupo.')
			}
		},
		[maps.length, group_code, router]
	)

	const handleAddMap = useCallback(
		async (mapId: string) => {
			try {
				await mapsService.setGroupCode([mapId], group_code)
				setModalVisible(false)
			} catch {
				Alert.alert('Erro', 'Não foi possível adicionar o mapa ao grupo.')
			}
		},
		[group_code]
	)

	const HeaderRight = useCallback(
		() => (
			<TouchableOpacity onPress={() => setModalVisible(true)} className="mx-2">
				<PlusCircle size={24} color={colors.foreground} />
			</TouchableOpacity>
		),
		[colors.foreground]
	)

	return (
		<View className="flex-1">
			<Stack.Screen
				options={{
					title: `${maps.length} mapas`,
					headerRight: HeaderRight,
				}}
			/>
			<View className="h-full w-full bg-background p-4">
				<FlatList
					ListFooterComponent={<View className="h-14" />}
					data={maps}
					keyExtractor={(item) => item.id}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={
						<View className="flex-1 items-center justify-center py-8">
							<Text className="font-regular text-foreground opacity-80">Nenhum mapa no grupo</Text>
						</View>
					}
					renderItem={({ item }) => (
						<View className="flex-row items-center gap-2">
							<View className="flex-1">
								<MapItem
									map={item}
									location={location}
									onPress={() =>
										router.push({
											pathname: `/admin/maps/${item.id}`,
											params: { data: JSON.stringify(item) },
										})
									}
								/>
							</View>
							<TouchableOpacity
								onPress={() => handleRemove(item.id)}
								className="mb-2 rounded-full p-2"
								style={{ backgroundColor: colors.danger[500] + '20' }}>
								<Minus size={18} color={colors.danger[500]} />
							</TouchableOpacity>
						</View>
					)}
				/>
			</View>

			<SheetModal title="Adicionar mapa" visible={modalVisible} onClose={() => setModalVisible(false)}>
				<FlatList
					data={ungroupedMaps}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16 }}
					ListEmptyComponent={
						<View className="flex-1 items-center justify-center py-8">
							<Text className="font-regular text-foreground opacity-80">Nenhum mapa disponível</Text>
						</View>
					}
					renderItem={({ item }) => (
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => handleAddMap(item.id)}
							className="mb-2 rounded-xl border border-border bg-card p-3">
							<Text className="font-medium text-foreground">
								{item.city.name} - {item.name}
							</Text>
							<Text className="font-regular text-sm text-foreground opacity-60">{item.address}</Text>
						</TouchableOpacity>
					)}
				/>
			</SheetModal>
		</View>
	)
}

export default GroupDetail
