import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import MapViewDetails from '@/components/map-view-details'
import { useThemedColors } from '@/hooks/use-themed-colors'
import useMap from '@/hooks/useMap'
import usePublishers from '@/hooks/usePublishers'
import { AddAssignmentReq } from '@/interfaces/api/assignments'
import { error, success } from '@/messages/add'
import { error as removeError, success as removeSuccess } from '@/messages/delete'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useQueryClient } from '@tanstack/react-query'
import { AppleMaps, GoogleMaps } from 'expo-maps'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, Platform, Pressable, Text, View } from 'react-native'
import { OneSignal } from 'react-native-onesignal'

import { database } from '@/services/appwrite'
import { Models } from 'react-native-appwrite'

const ViewMap = () => {
	const { data, query } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const queryKey = JSON.parse((query as string) || '[]') as string[]
	const { map, mutate, refetching } = useMap(params.$id, params)
	const { publishers, mutate: mutatePublishers } = usePublishers()
	const { control, formState, handleSubmit } = useForm<AddAssignmentReq>({
		defaultValues: { assigned: params.assigned },
	})
	const queryClient = useQueryClient()
	const { colors } = useThemedColors()

	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p.$id })), [publishers])
	const region = getMapRegion(map ? [map.lat, map.lng] : [0, 0])
	const marker = getMarkerCoordinate(map ? [map.lat, map.lng] : [0, 0])

	const save: SubmitHandler<AddAssignmentReq> = async data => {
		try {
			const updatedMap = await database.updateDocument('production', 'maps', params.$id, {
				assigned: data.assigned,
			})

			queryClient.setQueryData(queryKey, (oldData: any) => {
				if (!oldData?.documents) return oldData
				return {
					...oldData,
					documents: oldData.documents.map((doc: Models.Document) =>
						doc.$id === updatedMap.$id ? updatedMap : doc
					),
				}
			})

			queryClient.setQueryData(['map', updatedMap.$id], updatedMap)

			success('designação')
			router.back()
		} catch (err) {
			error('designação')
			console.error('Failed to update map (assigned):', err)
		}
	}

	const deleteMap = useCallback(async () => {
		try {
			await database.deleteDocument('production', 'maps', params.$id)

			removeSuccess('maps')
			mutate()
			router.back()
		} catch (err) {
			removeError('maps')
			console.error('Failed to delete map:', err)
		}
	}, [params.$id, mutate])

	const showDeleteAlert = useCallback(
		() =>
			Alert.alert(
				'Excluir',
				'Deseja excluir o mapa e todas as designações relacionadas? Essa opção não pode ser revertida.',
				[
					{
						text: 'Cancelar',
						style: 'cancel',
					},
					{
						text: 'Sim, excluir',
						onPress: () => deleteMap(),
						style: 'default',
					},
				]
			),
		[deleteMap]
	)

	const HeaderRight = useCallback(
		() => (
			<View className='flex-row'>
				<Pressable onPress={() => mutate()} className='mx-2'>
					{refetching ? (
						<ActivityIndicator size='small' color={colors.primary[600]} />
					) : (
						<Ionicons name='refresh' size={24} color={colors.foreground} />
					)}
				</Pressable>
				<Pressable
					onPress={() =>
						router.replace({
							pathname: `/admin/maps/${params.$id}/edit`,
							params: { data: JSON.stringify(map) },
						})
					}
					disabled={!map}
					className='mx-2'
				>
					<Ionicons name='create-outline' size={24} color={colors.foreground} />
				</Pressable>
				<Pressable onPress={showDeleteAlert} className='mx-2'>
					<Ionicons name='trash-outline' size={24} color={colors.foreground} />
				</Pressable>
			</View>
		),
		[mutate, refetching, map, showDeleteAlert, params.$id, colors]
	)

	useEffect(() => {
		OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
			event.preventDefault()
			mutate()
		})
	}, [mutate])

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: map ? map.name : '', headerRight: HeaderRight }} />
			<View className='flex w-full h-full bg-background'>
				<View className='p-2.5'>
					{!!map && (
						<>
							<MapViewDetails map={map} />
							{!map.assigned ? (
								<View>
									<Text className='text-xs text-foreground py-2 font-medium'>Designar mapa</Text>
									<Controller
										control={control}
										rules={{ required: true }}
										name='assigned'
										render={({ field: { onChange, onBlur, value } }) => (
											<Dropdown
												placeholder='Selecione um publicador...'
												options={publisherList}
												selectedValue={value}
												onValueChange={onChange}
												onRefresh={mutatePublishers}
											/>
										)}
									/>
									<View className='mt-2'>
										{formState.isValid && (
											<Button
												disabled={!formState.isValid}
												loading={formState.isSubmitting}
												onPress={handleSubmit(save)}
											>
												Designar
											</Button>
										)}
									</View>
								</View>
							) : (
								<View className='flex-row items-baseline mt-2 ml-2'>
									<View>
										<Text className='text-sm text-foreground font-medium'>Designado para:</Text>
									</View>
									<View className='ml-2.5'>
										{typeof map.assigned === 'object' && (
											<Text className='text-[15px] text-foreground font-medium'>
												{map.assigned.name}
											</Text>
										)}
									</View>
								</View>
							)}
						</>
					)}
				</View>
				{!!map && (
					<View className='flex-1 m-2.5 rounded-lg overflow-hidden'>
						{Platform.OS === 'ios' ? (
							<AppleMaps.View
								cameraPosition={region}
								style={{ width: '100%', height: '100%' }}
								markers={[{ coordinates: marker, title: map.name }]}
							/>
						) : (
							<GoogleMaps.View
								cameraPosition={region}
								style={{ width: '100%', height: '100%' }}
								markers={[{ coordinates: marker, title: map.name }]}
							/>
						)}
					</View>
				)}
			</View>
		</View>
	)
}

export default ViewMap
