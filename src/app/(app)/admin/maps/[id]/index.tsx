import AssignmentCode from 'components/AssignmentCode'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import MapViewDetails from 'components/MapViewDetails'
import { JW_TOOLKIT_API } from 'constants/urls'
import { useSession } from 'contexts/Auth'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useAssignments from 'hooks/swr/admin/useAssignments'
import useMap from 'hooks/swr/admin/useMap'
import useMaps from 'hooks/swr/admin/useMaps'
import usePublishers from 'hooks/swr/admin/usePublishers'
import { error, success } from 'messages/add'
import { error as removeError, success as removeSuccess } from 'messages/delete'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { Marker } from 'react-native-maps'
import { add } from 'services/assignments/add'
import { remove } from 'services/maps/remove'
import { AddAssignmentReq } from 'types/api/assignments'
import { PageParams } from 'types/app'
import { IUser } from 'types/models/User'
import { getAssignmentMessage } from 'utils/get-assignment-message'
import { getExpiration } from 'utils/get-expiration'
import { getMapRegion } from 'utils/get-map-region'
import { getMarkerCoordinate } from 'utils/get-marker-coordinate'
import { signMessage } from 'utils/sign-message'

import * as S from './styles'

const ViewMap = () => {
	const [qr, setQr] = useState<string>()
	const { session } = useSession<IUser>()
	const { id }: Partial<PageParams> = useLocalSearchParams()
	const { map, mutate } = useMap(id)
	const { assignments, mutate: mutateAssignments } = useAssignments({ map: id })
	const { mutate: mutateMaps } = useMaps({ search: '' })
	const { publishers } = usePublishers({ all: true })
	const { control, formState, handleSubmit } = useForm<AddAssignmentReq>({ defaultValues: { map: id } })

	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p._id })), [publishers])
	const region = getMapRegion(map ? map.coordinates : [0, 0], 0.01)
	const marker = getMarkerCoordinate(map ? map.coordinates : [0, 0])

	const generateQR = useCallback(async () => {
		const expiration = getExpiration(10)

		const qrMessage = getAssignmentMessage(id, session.data._id, expiration.toString())

		const signature = await signMessage(qrMessage, session.private_key)
		const qrCodeUrl = `${JW_TOOLKIT_API}/launch/assignments/accept?user=${session.data._id}&map=${id}&expiration=${expiration}&signature=${signature}`

		setQr(qrCodeUrl)
	}, [session, id])

	const save: SubmitHandler<AddAssignmentReq> = async data => {
		const result = await add(data)

		if (result) {
			success('designação')
			mutate()
			mutateMaps()
			mutateAssignments()
			return
		}

		error('designação')
	}

	const deleteMap = useCallback(async () => {
		const result = await remove(id)

		if (result) {
			removeSuccess('mapa')
			mutate()
			mutateMaps()
			router.back()
			return
		}

		removeError('mapa')
	}, [id, mutate, mutateMaps])

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
				<S.IconButton onPress={() => router.replace(`/admin/maps/${id}/edit`)}>
					<S.Ionicon name='create-outline' />
				</S.IconButton>
				<S.IconButton onPress={showDeleteAlert}>
					<S.Ionicon name='trash-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[id, showDeleteAlert]
	)

	useEffect(() => {
		if (session && id) {
			generateQR()
		}
	}, [session, id, generateQR])

	return (
		<S.Container>
			<Stack.Screen options={{ title: map ? map.name : '', headerRight: HeaderRight }} />
			<S.Content>
				<S.DetailsContainer>
					{!!map && (
						<>
							<S.RowCenter>
								{assignments.length === 0 && (
									<S.Columm>
										<AssignmentCode data={qr} />
									</S.Columm>
								)}
								<MapViewDetails map={map} />
							</S.RowCenter>
							{assignments.length === 0 ? (
								<S.Columm>
									<S.Label>Designar mapa</S.Label>
									<Controller
										control={control}
										rules={{ required: true }}
										name='publisher'
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
										{typeof assignments[0].publisher === 'object' && (
											<S.ParagraphSpace>{assignments[0].publisher?.name}</S.ParagraphSpace>
										)}
									</S.Columm>
								</S.Row>
							)}
						</>
					)}
				</S.DetailsContainer>
				{!!map && (
					<S.MapContainer>
						<S.Map region={region}>
							<Marker key={map._id} coordinate={marker} title={map.name} description={map.address} />
						</S.Map>
					</S.MapContainer>
				)}
			</S.Content>
		</S.Container>
	)
}

export default ViewMap
