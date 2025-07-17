import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import Input from '@/components/input'
import useCities from '@/hooks/useCities'
import { EditMapReq } from '@/interfaces/api/maps'
import { error, success } from '@/messages/edit'
import { database } from '@/services/appwrite'
import { getCoordinates } from '@/utils/get-coordinates'
import { setCoordinates } from '@/utils/set-coordinates'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Models } from 'react-native-appwrite'

import { useQueryClient } from '@tanstack/react-query'

const EditMap = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const { cities } = useCities()
	const queryClient = useQueryClient()
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

	const { control, formState, handleSubmit } = useForm<EditMapReq>({ defaultValues })

	const save: SubmitHandler<EditMapReq> = async data => {
		const [lat, lng] = setCoordinates(data.coordinates)

		if (lat === 0 || lng === 0) {
			error('mapa, coordenadas inválidas')
			return
		}

		try {
			const updatedMap = await database.updateDocument('production', 'maps', params.$id, {
				name: data.name,
				address: data.address,
				district: data.district,
				details: data.details,
				city: data.city,
				lat,
				lng,
			})

			success('mapa')

			queryClient.setQueryData(['map', updatedMap.$id], updatedMap)

			router.back()
		} catch (err) {
			error('mapa')
			console.error('Failed to update map:', err)
		}
	}

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Editar Mapa' }} />
			<View className='flex p-2.5 w-full h-full bg-background'>
				<Controller
					control={control}
					rules={{ required: true }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label='Nome'
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
							label='Endereço'
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
							label='Bairro'
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
							label='Detalhes'
							placeholder='Detalhes ou observações'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							editable={!formState.isSubmitting}
						/>
					)}
				/>
				<View className='flex-row gap-2'>
					<View className='flex-1'>
						<Controller
							control={control}
							rules={{ required: true }}
							name='coordinates'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									label='Coordenadas'
									defaultValue={value}
									placeholder='Coordenadas'
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									editable={!formState.isSubmitting}
								/>
							)}
						/>
					</View>
					{/* <IconButton icon='locate-outline' onPress={toggleMap} /> */}
				</View>
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
			</View>
		</View>
	)
}

export default EditMap
