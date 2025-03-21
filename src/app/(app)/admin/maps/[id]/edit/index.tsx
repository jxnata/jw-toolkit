import Button from '@components/Button'
import Dropdown from '@components/Dropdown'
import IconButton from '@components/IconButton'
import Input from '@components/Input'
import SelectLocation from '@components/SelectLocation'
import useCities from '@hooks/useCities'
import useMap from '@hooks/useMap'
import useMaps from '@hooks/useMaps'
import { EditMapReq } from '@interfaces/api/maps'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { error, success } from '@messages/edit'
import { useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Modal } from 'react-native'
import { getCoordinates } from '@utils/get-coordinates'
import { setCoordinates } from '@utils/set-coordinates'
import { database } from '@services/appwrite'
import { Models } from 'react-native-appwrite'

import * as S from './styles'

const EditMap = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const [modalVisible, setModalVisible] = useState(false)
	const { mutate } = useMap(params.$id)
	const { mutate: mutateMaps } = useMaps({ search: '' })
	const { cities } = useCities()

	const citiesList = useMemo(() => cities.map(c => ({ label: c.name, value: c.$id })), [cities])

	const defaultValues: EditMapReq | undefined = useMemo(
		() =>
			params
				? {
						name: params.name,
						address: params.address,
						district: params.district,
						details: params.details,
						city: params.city.$id,
						coordinates: getCoordinates([params.lat, params.lng]),
					}
				: undefined,
		[params]
	)

	const { control, formState, handleSubmit, setValue, getValues } = useForm<EditMapReq>({ defaultValues })

	const save: SubmitHandler<EditMapReq> = async data => {
		const [lat, lng] = setCoordinates(data.coordinates)

		if (lat === 0 || lng === 0) {
			error('mapa, coordenadas inválidas')
			return
		}

		try {
			await database.updateDocument('production', 'maps', params.$id, {
				name: data.name,
				address: data.address,
				district: data.district,
				details: data.details,
				city: data.city,
				lat,
				lng,
			})

			success('mapa')
			mutate()
			mutateMaps()
			router.back()
		} catch (err) {
			error('mapa')
			console.error('Failed to update map:', err)
		}
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
					rules={{ required: true }}
					name='district'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							placeholder='Bairro'
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
					{/* <IconButton icon='locate-outline' onPress={toggleMap} /> */}
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
				{/* <Modal animationType='slide' transparent visible={modalVisible} onRequestClose={toggleMap}>
					<SelectLocation
						onSelect={coord => setValue('coordinates', getCoordinates(coord))}
						onClose={toggleMap}
						initial={setCoordinates(getValues('coordinates'))}
					/>
				</Modal> */}
				<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
					Salvar
				</Button>
			</S.Content>
		</S.Container>
	)
}

export default EditMap
