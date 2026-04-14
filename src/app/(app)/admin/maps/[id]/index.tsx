import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import PersonalAnnotation from '@/components/personal-annotation'
import { MAP_STATUS_LABELS, STATUS_NAME } from '@/constants/content'
import useGroupMaps from '@/hooks/use-group-maps'
import useMap from '@/hooks/use-map'
import usePublishers from '@/hooks/use-publishers'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { AddAssignmentReq } from '@/interfaces/api/assignments'
import { error, success } from '@/messages/add'
import { error as removeError, success as removeSuccess } from '@/messages/delete'
import { mapsService } from '@/services/instantdb'
import { formatDate } from '@/utils/date-format'
import { firstName } from '@/utils/first-name'
import { getBadgeColor } from '@/utils/get-badge-color'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Pencil, Trash } from 'lucide-react-native'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const screenHeight = Dimensions.get('window').height

const ViewMap = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Map
	const { map } = useMap({ mapId: params.id })
	const { maps: groupMaps } = useGroupMaps(map?.group_code || '')
	const { publishers } = usePublishers()
	const { colors } = useThemedColors()

	const publisherList = publishers.map((p) => ({ label: p.name, value: p.id }))
	const region = getMapRegion(map ? [map.lat, map.lng] : [0, 0])
	const marker = getMarkerCoordinate(map ? [map.lat, map.lng] : [0, 0])

	const { control, formState, handleSubmit, reset } = useForm<AddAssignmentReq>({
		defaultValues: { assigned: typeof params.assigned === 'object' ? params.assigned!.id : params.assigned },
	})

	useEffect(() => {
		if (map) {
			const assignedId = typeof map.assigned === 'object' ? (map.assigned?.id ?? '') : (map.assigned ?? '')
			reset({ assigned: assignedId })
		}
	}, [map, reset])

	const found = !!(map?.visited && map.found)

	const save: SubmitHandler<AddAssignmentReq> = async (data) => {
		try {
			if (map?.group_code && groupMaps.length > 0) {
				const groupMapIds = groupMaps.map((m) => m.id)
				await mapsService.assignMaps(groupMapIds, data.assigned!)
				success(`${groupMapIds.length} mapas designados`)
			} else {
				await mapsService.assignMap(params.id, data.assigned)
				success('designação')
			}

			router.back()
		} catch (err) {
			error('designação')
			console.error('Failed to update map (assigned):', err)
		}
	}

	const deleteMap = async () => {
		try {
			await mapsService.deleteMap(params.id)

			removeSuccess('maps')
			router.back()
		} catch (err) {
			removeError('maps')
			console.error('Failed to delete map:', err)
		}
	}

	const showDeleteAlert = () =>
		Alert.alert('Excluir', 'Deseja excluir o mapa e todas as designações relacionadas? Essa opção não pode ser revertida.', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'Sim, excluir',
				onPress: () => deleteMap(),
				style: 'default',
			},
		])

	const HeaderRight = () => (
		<View className="flex-row">
			<TouchableOpacity
				onPress={() =>
					router.replace({
						pathname: `/admin/maps/${params.id}/edit`,
						params: { data: JSON.stringify(map) },
					})
				}
				disabled={!map}
				className="mx-2">
				<Pencil size={24} color={colors.foreground} />
			</TouchableOpacity>
			<TouchableOpacity onPress={showDeleteAlert} className="mx-2">
				<Trash size={24} color={colors.foreground} />
			</TouchableOpacity>
		</View>
	)

	return (
		<View className="flex-1">
			<Stack.Screen options={{ title: map ? map.name : '', headerRight: HeaderRight }} />

			{!!map && (
				<MapView
					style={StyleSheet.absoluteFill}
					initialRegion={{
						latitude: region.latitude - 0.003,
						longitude: region.longitude,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
					}}>
					<Marker
						coordinate={{
							latitude: marker.latitude,
							longitude: marker.longitude,
						}}
						title={map.name}
					/>
				</MapView>
			)}

			<View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-card" style={{ maxHeight: screenHeight * 0.6 }}>
				<ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-8 pt-4">
					{!!map && (
						<>
							{/* Header: name, city, status badge */}
							<View className="mb-3 flex-row items-start justify-between">
								<View className="flex-1 pr-2">
									<Text className="font-bold text-lg text-foreground">
										{map.city?.name} - {map.name}
									</Text>
									{!!map.address && (
										<Text className="mt-0.5 font-regular text-sm text-foreground opacity-70">{map.address}</Text>
									)}
									{!!map.district && (
										<Text className="mt-0.5 font-regular text-sm text-foreground opacity-70">{map.district}</Text>
									)}
								</View>
								<View className="flex-col items-end gap-1">
									{map.assigned ? (
										<View className="rounded bg-primary-600 px-2 py-0.5">
											<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.ASSIGNED}</Text>
										</View>
									) : (
										<View className="rounded bg-success px-2 py-0.5">
											<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.FREE}</Text>
										</View>
									)}
									{!!map.tag && (
										<View className={`${getBadgeColor(map.tag)} rounded px-2 py-0.5`}>
											<Text className="font-semibold text-xs text-white">
												{STATUS_NAME[map.tag as keyof typeof STATUS_NAME]}
											</Text>
										</View>
									)}
								</View>
							</View>

							{/* Visit info */}
							{!!map.visited ? (
								<View className="mb-3">
									<Text className="font-regular text-sm text-foreground opacity-70">
										Visitado {map.visited_by ? `por ${firstName(map.visited_by)} ` : ''}em {formatDate(map.visited)}
									</Text>
									{found ? (
										<Text className="font-semibold text-xs text-success">
											Encontrado {!!map.found_info && '- ' + map.found_info}
										</Text>
									) : (
										<Text className="font-semibold text-xs text-primary-600">Não encontrado</Text>
									)}
								</View>
							) : (
								<Text className="mb-3 font-regular text-sm text-foreground opacity-70">Ainda não visitado</Text>
							)}

							{/* Extra details */}
							{!!map.details && <Text className="mb-3 font-regular text-sm text-foreground opacity-70">{map.details}</Text>}

							{/* Group info */}
							{!!map.group_code && (
								<Text className="mb-3 font-medium text-sm text-foreground">
									Grupo {map.group_code.toUpperCase()} · {groupMaps.length} mapas serão designados
								</Text>
							)}

							{/* Personal annotation */}
							<PersonalAnnotation map={map} />

							{/* Assignment */}
							<View className="mt-1">
								<Text className="py-2 font-medium text-foreground">Designar para:</Text>
								<Controller
									control={control}
									name="assigned"
									render={({ field: { onChange, value } }) => (
										<Dropdown
											placeholder="Selecione um publicador..."
											options={publisherList}
											selectedValue={value}
											onValueChange={onChange}
											disabled={map.tag === 'nao-visitar'}
										/>
									)}
								/>
								{map.tag === 'nao-visitar' && (
									<Text className="py-2 font-medium text-danger-500">
										Não é possível designar esse mapa pois está marcado como &quot;não visitar&quot;.
									</Text>
								)}
								<View className="mt-2">
									<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
										Salvar designação
									</Button>
								</View>
							</View>
						</>
					)}
				</ScrollView>
			</View>
		</View>
	)
}

export default ViewMap
