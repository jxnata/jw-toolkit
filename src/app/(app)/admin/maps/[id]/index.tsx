import Button from '@components/Button'
import Dropdown from '@components/Dropdown'
import MapViewDetails from '@components/MapViewDetails'
import useMap from '@hooks/useMap'
import useMaps from '@hooks/useMaps'
import usePublishers from '@hooks/usePublishers'
import { AddAssignmentReq } from '@interfaces/api/assignments'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { error, success } from '@messages/add'
import { error as removeError, success as removeSuccess } from '@messages/delete'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, Platform } from 'react-native'
import { AppleMaps, GoogleMaps } from 'expo-maps'
import { OneSignal } from 'react-native-onesignal'
import { getMapRegion } from '@utils/get-map-region'
import { getMarkerCoordinate } from '@utils/get-marker-coordinate'

import * as S from './styles'
import React from 'react'
import { Models } from 'react-native-appwrite'
import { database } from '@services/appwrite'

const ViewMap = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const { map, mutate } = useMap(params.$id)
	const { mutate: mutateMaps } = useMaps({ search: '' })
	const { publishers } = usePublishers()
	const { control, formState, handleSubmit } = useForm<AddAssignmentReq>({
		defaultValues: { assigned: params.assigned },
	})

	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p.$id })), [publishers])
	const region = getMapRegion(map ? [map.lat, map.lng] : [0, 0])
	const marker = getMarkerCoordinate(map ? [map.lat, map.lng] : [0, 0])

	const save: SubmitHandler<AddAssignmentReq> = async data => {
		try {
			await database.updateDocument('production', 'maps', params.$id, {
				assigned: data.assigned,
			})

			success('designação')
			mutate()
			mutateMaps()
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
			<S.HeaderContainer>
				<S.IconButton
					onPress={() =>
						router.replace({
							pathname: `/admin/maps/${params.$id}/edit`,
							params: { data: JSON.stringify(map) },
						})
					}
					disabled={!map}
				>
					<S.Ionicon name='create-outline' />
				</S.IconButton>
				<S.IconButton onPress={showDeleteAlert}>
					<S.Ionicon name='trash-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[params.$id, showDeleteAlert, map]
	)

	useEffect(() => {
		OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
			event.preventDefault()
			mutate()
		})
	}, [mutate])

	return (
		<S.Container>
			<Stack.Screen options={{ title: map ? map.name : '', headerRight: HeaderRight }} />
			<S.Content>
				<S.DetailsContainer>
					{!!map && (
						<>
							<MapViewDetails map={map} />
							{!map.assigned ? (
								<S.Columm>
									<S.Label>Designar mapa</S.Label>
									<Controller
										control={control}
										rules={{ required: true }}
										name='assigned'
										render={({ field: { onChange, onBlur, value } }) => (
											<Dropdown
												placeholder='Selecione uma publicador...'
												options={publisherList}
												selectedValue={value}
												onValueChange={onChange}
											/>
										)}
									/>
									<S.Row>
										{formState.isValid && (
											<Button
												disabled={!formState.isValid}
												loading={formState.isSubmitting}
												onPress={handleSubmit(save)}
											>
												Designar
											</Button>
										)}
									</S.Row>
								</S.Columm>
							) : (
								<S.Row>
									<S.Columm>
										<S.Label>Designado para:</S.Label>
									</S.Columm>
									<S.Columm>
										{typeof map.assigned === 'object' && (
											<S.ParagraphSpace>{map.assigned.name}</S.ParagraphSpace>
										)}
									</S.Columm>
								</S.Row>
							)}
						</>
					)}
				</S.DetailsContainer>
				{!!map && (
					<S.MapContainer>
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
					</S.MapContainer>
				)}
			</S.Content>
		</S.Container>
	)
}

export default ViewMap
