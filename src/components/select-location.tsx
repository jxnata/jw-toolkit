import Button from '@/components/button'
import { useThemedColors } from '@/hooks/use-themed-colors'
import useCheckbox from '@/hooks/useCheckbox'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { validCoordinates } from '@/utils/valid-coordinates'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, Pressable, View } from 'react-native'
import MapView, { MapViewProps, Marker } from 'react-native-maps'

const { height } = Dimensions.get('window')

type Props = {
	onSelect: (coord: [number, number]) => void
	onClose: () => void
	initial?: { coordinates: { latitude: number; longitude: number } }
}

const mapTypes = ['hybrid', 'standard', 'satellite', 'terrain']

const SelectLocation = ({ onSelect, onClose, initial }: Props) => {
	const mapRef = useRef<MapView>(null)
	const { colors } = useThemedColors()

	const [pin, setPin] = useState<[number, number]>(
		validCoordinates([initial?.coordinates?.latitude || 0, initial?.coordinates?.longitude || 0]) || [0, 0]
	)
	const { CheckboxComponent: MapOptions, selectedValues } = useCheckbox(mapTypes, ['hybrid'], true)

	const mapType = useMemo(() => selectedValues[0], [selectedValues])
	const marker = useMemo(() => getMarkerCoordinate(pin), [pin])

	const onSelectLocation = useCallback(
		(e: any) => {
			const coordinates: [number, number] = [
				e.nativeEvent.coordinate.latitude || 0,
				e.nativeEvent.coordinate.longitude || 0,
			]
			setPin([e.nativeEvent.coordinate.latitude || 0, e.nativeEvent.coordinate.longitude || 0])
			onSelect(coordinates)
		},
		[onSelect]
	)

	useEffect(() => {
		if (!pin) return
		if (!mapRef.current) return

		mapRef.current.animateToRegion(
			{
				latitude: pin[0],
				longitude: pin[1],
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			},
			500
		)
	}, [pin, mapRef])

	return (
		<View className='flex justify-end w-full h-full'>
			<View className='flex w-full items-center rounded-[10px] bg-card' style={{ height: height * 0.9 }}>
				<View
					className='absolute left-2.5 top-2.5 rounded-[10px] justify-center items-center p-[5px] z-10'
					style={{ backgroundColor: colors.foreground }}
				>
					<MapOptions />
				</View>

				<Pressable
					onPress={onClose}
					className='absolute right-2.5 top-2.5 items-center justify-center rounded-[10px] w-10 h-10 z-10'
					style={{ backgroundColor: colors.foreground }}
				>
					<Ionicons name='close-outline' size={24} color={colors.background} />
				</Pressable>

				{initial ? (
					<MapView
						ref={mapRef}
						style={{ width: '100%', height: '100%' }}
						initialRegion={{
							latitude: initial.coordinates.latitude,
							longitude: initial.coordinates.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01,
						}}
						mapType={mapType as MapViewProps['mapType']}
						onPress={onSelectLocation}
					>
						<Marker
							coordinate={{
								latitude: marker.latitude,
								longitude: marker.longitude,
							}}
						/>
					</MapView>
				) : (
					<View className='flex-1 items-center justify-center'>
						<ActivityIndicator color={colors.primary[600]} size='large' />
					</View>
				)}

				{!!pin && (
					<View className='absolute bottom-[30px] w-full px-2.5'>
						<Button onPress={onClose}>Confirmar</Button>
					</View>
				)}
			</View>
		</View>
	)
}

export default SelectLocation
