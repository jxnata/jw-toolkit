import Button from '@/components/Button'
import Dropdown from '@/components/Dropdown'
import Input from '@/components/Input'
import { useSession } from '@/contexts/session'
import useCities from '@/hooks/useCities'
import { AddMapReq } from '@/interfaces/api/maps'
import { error, success } from '@/messages/add'
import { database } from '@/services/appwrite'
import { setCoordinates } from '@/utils/set-coordinates'
import { updateMapsCache } from '@/utils/update-maps-cache'
import { useQueryClient } from '@tanstack/react-query'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ID, Permission, Role } from 'react-native-appwrite'

import * as S from './styles'

const AddMap = () => {
	const { query } = useLocalSearchParams()
	const queryKey = JSON.parse((query as string) || '[]')
	const { cities } = useCities()
	const { congregation } = useSession()
	const { control, formState, handleSubmit } = useForm<AddMapReq>()
	const queryClient = useQueryClient()

	const citiesList = useMemo(() => cities.map(c => ({ label: c.name, value: c.$id })), [cities])

	const save: SubmitHandler<AddMapReq> = async data => {
		if (!congregation) return
		const [lat, lng] = setCoordinates(data.coordinates)

		if (lat === 0 && lng === 0) {
			error('mapa, coordenadas inválidas')
			return
		}

		try {
			const newMap = await database.createDocument(
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

			// Update the React Query cache
			updateMapsCache(queryClient, queryKey, newMap)

			success('mapa')
			router.back()
		} catch (err) {
			error('mapa')
			console.error('Failed to create map:', err)
		}
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
						initial={getMapRegion(setCoordinates(getValues('coordinates')))}
					/>
				</Modal> */}
				<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
					Salvar
				</Button>
			</S.Content>
		</S.Container>
	)
}

export default AddMap
