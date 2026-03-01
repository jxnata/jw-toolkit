import { ExtraMapLocal } from '@/interfaces/api/maps'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { getCoordinates } from '@/utils/get-coordinates'
import { getMapRegion } from '@/utils/get-map-region'
import { setCoordinates } from '@/utils/set-coordinates'
import { MapPinPlus } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import Button from './button'
import Input from './input'
import SelectLocation from './select-location'
import SheetModal from './sheet-modal'

type FormData = {
	address: string
	details?: string
	coordinates: string
}

type Props = {
	visible: boolean
	onClose: () => void
	onSave: (data: ExtraMapLocal) => void
	initialData?: ExtraMapLocal
}

const ExtraMapFormModal = ({ visible, onClose, onSave, initialData }: Props) => {
	const [locationModalVisible, setLocationModalVisible] = useState(false)
	const { colors } = useThemedColors()

	const defaultValues: FormData | undefined = initialData
		? {
				address: initialData.address,
				details: initialData.details,
				coordinates: getCoordinates([initialData.lat, initialData.lng]),
			}
		: undefined

	const { control, formState, handleSubmit, setValue, watch, reset } = useForm<FormData>({ defaultValues })
	const coordinates = watch('coordinates')

	const toggleLocationMap = () => {
		setLocationModalVisible((old) => !old)
	}

	const save: SubmitHandler<FormData> = (data) => {
		const [lat, lng] = setCoordinates(data.coordinates)

		if (lat === 0 && lng === 0) return

		onSave({
			id: initialData?.id || Math.random().toString(36).substring(2, 15),
			address: data.address,
			details: data.details,
			lat,
			lng,
		})

		reset()
		onClose()
	}

	return (
		<SheetModal
			visible={visible}
			onClose={onClose}
			title={initialData ? 'Editar Mapa Adicional' : 'Novo Mapa Adicional'}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
				<ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerClassName="p-6">
					<Controller
						control={control}
						rules={{ required: true }}
						name="address"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label="Endereço"
								placeholder="Endereço do mapa adicional"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
							/>
						)}
					/>
					<Controller
						control={control}
						name="details"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label="Detalhes"
								placeholder="Detalhes ou observações"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
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
									/>
								)}
							/>
						</View>
						<TouchableOpacity onPress={toggleLocationMap} className="mb-3 rounded-lg border border-border bg-card p-3">
							<MapPinPlus size={24} color={colors.primary[500]} />
						</TouchableOpacity>
					</View>
					<Modal animationType="slide" transparent visible={locationModalVisible} onRequestClose={toggleLocationMap}>
						<SelectLocation
							onSelect={(coord) => setValue('coordinates', getCoordinates(coord))}
							onClose={toggleLocationMap}
							initial={coordinates ? { coordinates: getMapRegion(setCoordinates(coordinates)) } : undefined}
						/>
					</Modal>
					<Button disabled={!formState.isValid} onPress={handleSubmit(save)} className="mt-4">
						Salvar
					</Button>
				</ScrollView>
			</KeyboardAvoidingView>
		</SheetModal>
	)
}

export default ExtraMapFormModal
