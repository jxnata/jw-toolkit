import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import Input from '@/components/input'
import SelectLocation from '@/components/select-location'
import { STATUS_LIST } from '@/constants/content'
import useCities from '@/hooks/use-cities'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { EditMapReq } from '@/interfaces/api/maps'
import { error, success } from '@/messages/edit'
import { mapsService } from '@/services/instantdb'
import { getCoordinates } from '@/utils/get-coordinates'
import { getMapRegion } from '@/utils/get-map-region'
import { setCoordinates } from '@/utils/set-coordinates'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { MapPinPlus } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native'

const EditMap = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Map
	const { cities } = useCities()
	const citiesList = useMemo(() => cities.map(c => ({ label: c.name, value: c.id })), [cities])
	const { colors } = useThemedColors()
	const defaultValues: EditMapReq | undefined = useMemo(
		() =>
			params
				? {
						name: params.name,
						address: params.address,
						district: params.district,
						details: params.details,
						city: params.city.id,
						coordinates: getCoordinates([params.lat, params.lng]),
						tag: params.tag,
					}
				: undefined,
		[params]
	)

	const { control, formState, handleSubmit, setValue, watch } = useForm<EditMapReq>({ defaultValues })
	const coordinates = watch('coordinates')

	const toggleMap = () => {
		setModalVisible(old => !old)
	}

	const save: SubmitHandler<EditMapReq> = async data => {
		const [lat, lng] = setCoordinates(data.coordinates)

		if (lat === 0 || lng === 0) {
			error('mapa, coordenadas inválidas')
			return
		}

		try {
			await mapsService.updateMap(
				params.id,
				{
					name: data.name,
					address: data.address,
					district: data.district,
					details: data.details,
					lat,
					lng,
					tag: data.tag,
				},
				data.city ? { city: data.city } : undefined
			)

			success('mapa')

			router.back()
		} catch (err) {
			error('mapa')
			console.error('Failed to update map:', err)
		}
	}

	return (
		<View className='flex-1 bg-background'>
			<Stack.Screen options={{ title: 'Editar Mapa' }} />
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerClassName='p-3 w-full'>
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
					<View className='flex-row gap-2 items-end'>
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
						<TouchableOpacity
							onPress={toggleMap}
							className='mb-3 p-3 bg-card border border-border rounded-lg'
						>
							<MapPinPlus size={24} color={colors.primary[500]} />
						</TouchableOpacity>
					</View>
					<Controller
						control={control}
						rules={{ required: true }}
						name='city'
						render={({ field: { onChange, onBlur, value } }) => (
							<Dropdown
								label='Cidade'
								placeholder='Selecione uma cidade...'
								options={citiesList}
								selectedValue={value}
								onValueChange={onChange}
							/>
						)}
					/>
					<Controller
						control={control}
						rules={{ required: true }}
						name='tag'
						render={({ field: { onChange, onBlur, value } }) => (
							<Dropdown
								label='Status'
								placeholder='Selecione um status...'
								options={STATUS_LIST}
								selectedValue={value}
								onValueChange={onChange}
							/>
						)}
					/>
					<Modal animationType='slide' transparent visible={modalVisible} onRequestClose={toggleMap}>
						<SelectLocation
							onSelect={coord => setValue('coordinates', getCoordinates(coord))}
							onClose={toggleMap}
							initial={
								coordinates ? { coordinates: getMapRegion(setCoordinates(coordinates)) } : undefined
							}
						/>
					</Modal>
					<Button
						disabled={!formState.isValid}
						loading={formState.isSubmitting}
						onPress={handleSubmit(save)}
						className='mt-4'
					>
						Salvar
					</Button>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	)
}

export default EditMap
