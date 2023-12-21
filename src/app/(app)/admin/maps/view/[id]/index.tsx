import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import { Stack, useLocalSearchParams } from 'expo-router'
import useAssignments from 'hooks/swr/admin/useAssignments'
import useMap from 'hooks/swr/admin/useMap'
import usePublishers from 'hooks/swr/admin/usePublishers'
import { error, success } from 'messages/add'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Dimensions } from 'react-native'
import { Marker } from 'react-native-maps'
import QRCode from 'react-native-qrcode-svg'
import { add } from 'services/assignments/add'
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
			mutateAssignments()
			return
		}

		error('designação')
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: params.name }} />
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
									{typeof map.last_visited_by === 'object' ? (
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
											<S.Paragraph>{assignments[0].publisher?.name}</S.Paragraph>
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
