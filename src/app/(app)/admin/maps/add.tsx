import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import Input from '@/components/input'
import SelectLocation from '@/components/select-location'
import { STATUS_LIST } from '@/constants/content'
import { useSession } from '@/contexts/session-provider'
import useCities from '@/hooks/use-cities'
import { useLimitCheck } from '@/hooks/use-limit-check'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { AddMapReq } from '@/interfaces/api/maps'
import { error, success } from '@/messages/add'
import { mapsService } from '@/services/instantdb'
import { getCoordinates } from '@/utils/get-coordinates'
import { getMapRegion } from '@/utils/get-map-region'
import { setCoordinates } from '@/utils/set-coordinates'
import { Stack, router } from 'expo-router'
import { MapPinPlus, Save } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native'

const AddMap = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const { cities } = useCities()
	const { congregation } = useSession()
	const { checkMapLimit } = useLimitCheck()
	const { control, formState, handleSubmit, setValue } = useForm<AddMapReq>()
	const { colors } = useThemedColors()

	const coordinates = useWatch({ control, name: 'coordinates' })

	const citiesList = cities.map((c) => ({ label: c.name, value: c.id }))

	const toggleMap = () => {
		setModalVisible((old) => !old)
	}

	const save: SubmitHandler<AddMapReq> = async (data) => {
		if (!congregation) return

		if (!checkMapLimit()) {
			return
		}

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
				tag: data.tag,
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
		<View className="flex-1 bg-background">
			<Stack.Screen options={{ title: 'Novo Mapa' }} />
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerClassName="p-4 w-full">
					<Controller
						control={control}
						rules={{ required: true }}
						name="name"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label="Nome"
								placeholder="Nome do mapa"
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
						name="address"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label="Endereço"
								placeholder="Endereço"
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
						name="district"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label="Bairro"
								placeholder="Bairro"
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
						name="details"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label="Detalhes"
								placeholder="Detalhes ou observações"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								editable={!formState.isSubmitting}
							/>
						)}
					/>
					<View className="flex-row items-end gap-2">
						<View className="flex-1">
							<Controller
								control={control}
								rules={{ required: true }}
								name="coordinates"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										label="Coordenadas"
										placeholder="Coordenadas"
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
										editable={!formState.isSubmitting}
									/>
								)}
							/>
						</View>
						<TouchableOpacity onPress={toggleMap} className="mb-3 rounded-lg border border-border bg-card p-3">
							<MapPinPlus size={24} color={colors.primary[500]} />
						</TouchableOpacity>
					</View>
					<Controller
						control={control}
						rules={{ required: true }}
						name="city"
						render={({ field: { onChange, onBlur, value } }) => (
							<Dropdown
								label="Cidade"
								placeholder="Selecione uma cidade..."
								options={citiesList}
								selectedValue={value}
								onValueChange={onChange}
							/>
						)}
					/>
					<Controller
						control={control}
						name="tag"
						render={({ field: { onChange, onBlur, value } }) => (
							<Dropdown
								label="Status"
								placeholder="Selecione um status..."
								options={STATUS_LIST}
								selectedValue={value}
								onValueChange={onChange}
							/>
						)}
					/>

					<Modal animationType="slide" transparent visible={modalVisible} onRequestClose={toggleMap}>
						<SelectLocation
							onSelect={(coord) => setValue('coordinates', getCoordinates(coord))}
							onClose={toggleMap}
							initial={coordinates ? { coordinates: getMapRegion(setCoordinates(coordinates)) } : undefined}
						/>
					</Modal>
					<Button
						disabled={!formState.isValid}
						loading={formState.isSubmitting}
						onPress={handleSubmit(save)}
						className="mt-4"
						left={<Save size={16} color="#ffffff" />}>
						Salvar
					</Button>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	)
}

export default AddMap
