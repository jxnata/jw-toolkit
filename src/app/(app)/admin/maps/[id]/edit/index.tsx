import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import IconButton from 'components/IconButton'
import Input from 'components/Input'
import SelectLocation from 'components/SelectLocation'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useCities from 'hooks/swr/admin/useCities'
import useMap from 'hooks/swr/admin/useMap'
import useMaps from 'hooks/swr/admin/useMaps'
import { error, success } from 'messages/edit'
import { useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Modal } from 'react-native'
import { edit } from 'services/maps/edit'
import { EditMapReq } from 'types/api/maps'
import { getCoordinates } from 'utils/get-coordinates'
import { setCoordinates } from 'utils/set-coordinates'

import * as S from './styles'

const EditMap = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const params: Partial<{ id: string }> = useLocalSearchParams()
	const { map, mutate } = useMap(params.id)
	const { mutate: mutateMaps } = useMaps({ search: '' })
	const { cities } = useCities()

	const citiesList = useMemo(() => cities.map(c => ({ label: c.name, value: c._id })), [cities])

	const defaultValues: EditMapReq = useMemo(
		() => ({
			name: map.name,
			address: map.address,
			details: map.details,
			city: map.city._id,
			coordinates: getCoordinates(map.coordinates),
		}),
		[map.address, map.city._id, map.coordinates, map.details, map.name]
	)

	const { control, formState, handleSubmit, setValue, getValues } = useForm<EditMapReq>({ defaultValues })

	const save: SubmitHandler<EditMapReq> = async data => {
		const [lat, lng] = setCoordinates(data.coordinates)

		if (lat === 0 && lng === 0) {
			error('mapa, coordenadas inválidas')
			return
		}

		const result = await edit(params.id, data)

		if (result) {
			success('mapa')
			mutate()
			mutateMaps()
			router.back()
			return
		}

		error('mapa')
	}

	const toggleMap = () => {
		setModalVisible(old => !old)
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Editar Mapa' }} />
			<S.Content>
				<Controller
					control={control}
					rules={{ required: true }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							placeholder='Nome do mapa'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							editable={!formState.isSubmitting}
						/>
					)}
				/>
				<Controller
					control={control}
					rules={{ required: true }}
					name='address'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							placeholder='Endereço'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							editable={!formState.isSubmitting}
						/>
					)}
				/>
				<Controller
					control={control}
					rules={{ required: false }}
					name='details'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							placeholder='Detalhes ou observações'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							editable={!formState.isSubmitting}
						/>
					)}
				/>
				<S.Row>
					<S.MaxWidth>
						<Controller
							control={control}
							rules={{ required: true }}
							name='coordinates'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									defaultValue={value}
									placeholder='Coordenadas'
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									editable={!formState.isSubmitting}
								/>
							)}
						/>
					</S.MaxWidth>
					<IconButton icon='locate-outline' onPress={toggleMap} />
				</S.Row>
				<Controller
					control={control}
					rules={{ required: true }}
					name='city'
					render={({ field: { onChange, onBlur, value } }) => (
						<Dropdown
							placeholder='Selecione uma cidade...'
							options={citiesList}
							selectedValue={value}
							onValueChange={onChange}
						/>
					)}
				/>
				<Modal animationType='slide' transparent visible={modalVisible} onRequestClose={toggleMap}>
					<SelectLocation
						onSelect={coord => setValue('coordinates', getCoordinates(coord))}
						onClose={toggleMap}
						initial={setCoordinates(getValues('coordinates'))}
					/>
				</Modal>
				<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
					Salvar
				</Button>
			</S.Content>
		</S.Container>
	)
}

export default EditMap
