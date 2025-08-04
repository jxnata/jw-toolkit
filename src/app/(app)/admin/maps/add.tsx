import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import IconButton from '@/components/icon-button'
import Input from '@/components/input'
import SelectLocation from '@/components/select-location'
import { useSession } from '@/contexts/session-instantdb'
import useCities from '@/hooks/use-cities-instant'
import { AddMapReq } from '@/interfaces/api/maps'
import { error, success } from '@/messages/add'
import { mapsService } from '@/services/instantdb'
import { getCoordinates } from '@/utils/get-coordinates'
import { getMapRegion } from '@/utils/get-map-region'
import { setCoordinates } from '@/utils/set-coordinates'
import { Stack, router } from 'expo-router'
import { Save } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Modal, View } from 'react-native'

const AddMap = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const { cities } = useCities()
	const { congregation } = useSession()
	const { control, formState, handleSubmit, setValue, getValues } = useForm<AddMapReq>()

	const citiesList = useMemo(() => cities.map(c => ({ label: c.name, value: c.id })), [cities])

	const toggleMap = () => {
		setModalVisible(old => !old)
	}

	const save: SubmitHandler<AddMapReq> = async data => {
		if (!congregation) return
		const [lat, lng] = setCoordinates(data.coordinates)

		if (lat === 0 && lng === 0) {
			error('mapa, coordenadas inválidas')
			return
		}

		try {
			await mapsService.createMap({
				name: data.name,
				address: data.address,
				district: data.district,
				details: data.details,
				lat,
				lng,
				cityId: data.city,
				congregationId: congregation.id,
			})

			success('mapa')
			router.back()
		} catch (err) {
			error('mapa')
			console.error('Failed to create map:', err)
		}
	}

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Novo Mapa' }} />
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
									placeholder='Coordenadas'
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									editable={!formState.isSubmitting}
								/>
							)}
						/>
					</View>
					<IconButton icon='locate-outline' onPress={toggleMap} />
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
				<Modal animationType='slide' transparent visible={modalVisible} onRequestClose={toggleMap}>
					<SelectLocation
						onSelect={coord => setValue('coordinates', getCoordinates(coord))}
						onClose={toggleMap}
						initial={{ coordinates: getMapRegion(setCoordinates(getValues('coordinates'))) }}
					/>
				</Modal>
				<Button
					disabled={!formState.isValid}
					loading={formState.isSubmitting}
					onPress={handleSubmit(save)}
					className='mt-4'
					left={<Save size={16} color='#ffffff' />}
				>
					Salvar
				</Button>
			</View>
		</View>
	)
}

export default AddMap
