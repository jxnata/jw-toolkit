import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useAssignments from 'hooks/swr/admin/useAssignments'
import useMap from 'hooks/swr/admin/useMap'
import useMaps from 'hooks/swr/admin/useMaps'
import usePublishers from 'hooks/swr/admin/usePublishers'
import { error, success } from 'messages/add'
import { error as removeError, success as removeSuccess } from 'messages/delete'
import { useCallback, useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, Dimensions } from 'react-native'
import { Marker } from 'react-native-maps'
import QRCode from 'react-native-qrcode-svg'
import { add } from 'services/assignments/add'
import { remove } from 'services/maps/remove'
import { AddAssignmentReq } from 'types/api/assignments'
import { IMap } from 'types/models/Map'
import { formatDate } from 'utils/date-format'
import { getMapRegion } from 'utils/get-map-region'
import { getMarkerCoordinate } from 'utils/get-marker-coordinate'
import * as S from './styles'

const qrSize = Dimensions.get('screen').width / 4

const ViewMap = () => {
	const params: Partial<IMap> = useLocalSearchParams()
	const { map, mutate } = useMap(params._id)
	const { assignments, mutate: mutateAssignments } = useAssignments({ map: params._id })
	const { mutate: mutateMaps } = useMaps({ search: '' })
	const { publishers } = usePublishers({ all: true })
	const { control, formState, handleSubmit } = useForm<AddAssignmentReq>({ defaultValues: { map: params._id } })

	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p._id })), [publishers])
	const region = getMapRegion(map ? map.coordinates : [0, 0])
	const marker = getMarkerCoordinate(map ? map.coordinates : [0, 0])

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

	const deleteMap = async () => {
		const result = await remove(params._id)

		if (result) {
			removeSuccess('mapa')
			mutate()
			mutateMaps()
			router.back()
			return
		}

		removeError('mapa')
	}

	const showDeleteAlert = () =>
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
		)

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.replace(`/admin/maps/${params._id}/edit`)}>
					<S.Ionicon name='create-outline' />
				</S.IconButton>
				<S.IconButton onPress={showDeleteAlert}>
					<S.Ionicon name='trash-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[]
	)

	return (
		<S.Container>
			<Stack.Screen options={{ title: params.name, headerRight: HeaderRight }} />
			<S.Content>
				<S.DetailsContainer>
					{!!map && (
						<>
							<S.Row>
								<S.Columm>
									<QRCode size={qrSize} value={params._id} />
								</S.Columm>
								<S.Columm>
									<S.Paragraph>{map.name}</S.Paragraph>
									<S.ParagraphWrap numberOfLines={3} ellipsizeMode='tail'>
										{map.address}, {map.city.name}
									</S.ParagraphWrap>
									{!!map.last_visited_by && typeof map.last_visited_by === 'object' ? (
										<S.Small>
											Visitado por {map.last_visited_by.name} em {formatDate(map.last_visited)}
										</S.Small>
									) : (
										<S.Small>Ainda não visitado</S.Small>
									)}
								</S.Columm>
							</S.Row>
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
				<S.MapContainer>
					<S.Map region={region}>
						<Marker key={params._id} coordinate={marker} title={params.name} description={params.address} />
					</S.Map>
				</S.MapContainer>
			</S.Content>
		</S.Container>
	)
}

export default ViewMap
