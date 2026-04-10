import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import MapItem from '@/components/map-item'
import SheetModal from '@/components/sheet-modal'
import { useSession } from '@/contexts/session-provider'
import useGroupMaps from '@/hooks/use-group-maps'
import { useLocation } from '@/hooks/use-location'
import usePublishers from '@/hooks/use-publishers'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import db from '@/lib/db'
import { mapsService } from '@/services/instantdb/maps-service'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Minus, PlusCircle } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

const GroupDetail = () => {
	const { group_code } = useLocalSearchParams<{ group_code: string }>()
	const router = useRouter()
	const { colors } = useThemedColors()
	const { congregation } = useSession()
	const { location } = useLocation()
	const [modalVisible, setModalVisible] = useState(false)
	const [editMode, setEditMode] = useState(false)

	const { maps } = useGroupMaps(group_code)
	const { publishers } = usePublishers()
	const publisherList = publishers.map((p) => ({ label: p.name, value: p.id }))

	const { control, formState, handleSubmit, reset } = useForm<{ assigned: string }>({
		defaultValues: { assigned: '' },
	})

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
	const assignedMaps = maps.filter((m) => !!m.assigned)
	const hasAssigned = assignedMaps.length > 0

	const handleRemove = async (mapId: string) => {
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
	}

	const handleUnassign = async () => {
		try {
			if (!assignedMaps.length) return
			const assignedMapsData = assignedMaps.map((m) => ({ id: m.id, assigned: m.assigned!.id }))

			await mapsService.unassignMaps(assignedMapsData)

			reset()

			Toast.show({
				type: 'success',
				text1: 'Sucesso',
				text2: 'Designações removidas com sucesso',
			})
		} catch {
			Toast.show({
				type: 'error',
				text1: 'Erro',
				text2: 'Não foi possível remover as designações.',
			})
		}
	}

	const handleAddMap = async (mapId: string) => {
		try {
			await mapsService.setGroupCode([mapId], group_code)
			setModalVisible(false)
		} catch {
			Alert.alert('Erro', 'Não foi possível adicionar o mapa ao grupo.')
		}
	}

	const assign: SubmitHandler<{ assigned: string }> = async (data) => {
		try {
			const mapIds = maps.map((m) => m.id)
			await mapsService.assignMaps(mapIds, data.assigned)
			reset()
		} catch {
			Alert.alert('Erro', 'Não foi possível designar os mapas.')
		}
	}

	const enterEditMode = () => {
		setEditMode(true)
	}

	const exitEditMode = () => {
		setEditMode(false)
	}

	const HeaderRight = () =>
		editMode ? (
			<TouchableOpacity onPress={() => setModalVisible(true)} className="mx-2">
				<PlusCircle size={24} color={colors.foreground} />
			</TouchableOpacity>
		) : (
			<TouchableOpacity onPress={enterEditMode} className="mx-2">
				<Text className="font-semibold text-base" style={{ color: colors.foreground }}>
					Editar
				</Text>
			</TouchableOpacity>
		)

	const HeaderLeft = () =>
		editMode ? (
			<TouchableOpacity onPress={exitEditMode} className="mx-2">
				<Text className="font-semibold text-base" style={{ color: colors.foreground }}>
					Cancelar
				</Text>
			</TouchableOpacity>
		) : null

	return (
		<View className="flex-1">
			<Stack.Screen
				options={{
					title: `Grupo de mapas`,
					headerRight: HeaderRight,
					headerLeft: editMode ? HeaderLeft : undefined,
				}}
			/>
			<View className="flex-1 bg-background pt-4">
				<Text className="px-4 pb-4 pt-2 font-bold text-primary">Mapas do grupo {group_code.toUpperCase()}:</Text>
				<FlatList
					ListFooterComponent={<View className="h-4" />}
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
							{editMode && (
								<TouchableOpacity
									onPress={() => handleRemove(item.id)}
									className="mb-2 mr-2 rounded-full p-2"
									style={{ backgroundColor: colors.danger[500] + '20' }}>
									<Minus size={18} color={colors.danger[500]} />
								</TouchableOpacity>
							)}
						</View>
					)}
				/>
			</View>
			<View className="rounded-t-2xl bg-card px-4 pb-8 pt-4">
				<Text className="py-2 font-medium text-foreground">Designar para:</Text>
				<Controller
					control={control}
					rules={{ required: true }}
					name="assigned"
					render={({ field: { onChange, value } }) => (
						<Dropdown
							placeholder="Selecione um publicador..."
							options={publisherList}
							selectedValue={value}
							onValueChange={onChange}
						/>
					)}
				/>
				<View className="mt-2 flex-row gap-2">
					<View className="flex-1">
						<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(assign)}>
							Designar
						</Button>
					</View>
					{hasAssigned && (
						<View className="flex-1">
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => handleUnassign()}
								className="h-14 items-center justify-center rounded-xl border border-danger-500 bg-card">
								<Text className="font-medium text-foreground">Remover designações</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
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
