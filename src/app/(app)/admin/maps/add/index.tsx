import Button from '@components/Button'
import Dropdown from '@components/Dropdown'
import IconButton from '@components/IconButton'
import Input from '@components/Input'
import SelectLocation from '@components/SelectLocation'
import useCities from '@hooks/swr/admin/useCities'
import useMaps from '@hooks/swr/admin/useMaps'
import useResume from '@hooks/swr/admin/useResume'
import { AddMapReq } from '@interfaces/api/maps'
import { Stack, router } from 'expo-router'
import { error, success } from '@messages/add'
import { useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Modal } from 'react-native'
import { getCoordinates } from '@utils/get-coordinates'
import { setCoordinates } from '@utils/set-coordinates'
import { useSession } from '@contexts/Auth'
import { database } from '@services/appwrite'
import { ID, Permission, Role } from 'react-native-appwrite'

import * as S from './styles'

const AddMap = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const { cities } = useCities()
	const { mutate } = useMaps()
	const { congregation } = useSession()
	const { control, formState, handleSubmit, setValue, getValues } = useForm<AddMapReq>()

	const citiesList = useMemo(() => cities.map(c => ({ label: c.name, value: c.$id })), [cities])

	const save: SubmitHandler<AddMapReq> = async data => {
		if (!congregation) return
		const [lat, lng] = setCoordinates(data.coordinates)

		if (lat === 0 && lng === 0) {
			error('mapa, coordenadas inválidas')
			return
		}

		try {
			await database.createDocument(
				'production',
				'maps',
				ID.unique(),
				{
					name: data.name,
					address: data.address,
					district: data.district,
					details: data.details,
					lat,
					lng,
					city: data.city,
					congregation: congregation.id,
				},
				[
					Permission.read(Role.label(congregation.id)),
					Permission.update(Role.label(congregation.id)),
					Permission.delete(Role.label(congregation.id)),
				]
			)
			success('mapa')
			mutate()
			router.back()
		} catch (err) {
			error('mapa')
			console.error('Failed to create map:', err)
		}
	}

	const toggleMap = () => {
		setModalVisible(old => !old)
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Novo Mapa' }} />
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

export default AddMap
