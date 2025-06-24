import Button from '@/components/button'
import { useThemedColors } from '@/hooks/use-themed-colors'
import useCheckbox from '@/hooks/useCheckbox'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { validCoordinates } from '@/utils/valid-coordinates'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AppleMaps, Coordinates, GoogleMaps } from 'expo-maps'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, Platform, Pressable, View } from 'react-native'

const { height } = Dimensions.get('window')

type Props = {
	onSelect: (coord: [number, number]) => void
	onClose: () => void
	initial?: any
}

const mapTypes =
	Platform.OS === 'ios'
		? [AppleMaps.MapType.HYBRID, AppleMaps.MapType.STANDARD, AppleMaps.MapType.IMAGERY]
		: [
				GoogleMaps.MapType.HYBRID,
				GoogleMaps.MapType.NORMAL,
				GoogleMaps.MapType.SATELLITE,
				GoogleMaps.MapType.TERRAIN,
			]

const SelectLocation = ({ onSelect, onClose, initial }: Props) => {
	const mapRef = useRef<AppleMaps.MapView | GoogleMaps.MapView>(null)
	const { colors } = useThemedColors()

	const [pin, setPin] = useState<[number, number]>(
		validCoordinates([initial?.coordinates?.latitude || 0, initial?.coordinates?.longitude || 0]) || [0, 0]
	)
	const { CheckboxComponent: MapOptions, selectedValues } = useCheckbox(mapTypes, ['HYBRID'], true)

	const mapType = useMemo(() => selectedValues[0], [selectedValues])
	const marker = useMemo(() => getMarkerCoordinate(pin), [pin])

	const onSelectLocation = useCallback(
		(e: { coordinates: Coordinates }) => {
			const coordinates: [number, number] = [e.coordinates.latitude || 0, e.coordinates.longitude || 0]
			setPin([e.coordinates.latitude || 0, e.coordinates.longitude || 0])
			onSelect(coordinates)
		},
		[onSelect]
	)

	useEffect(() => {
		if (!pin) return
		if (!mapRef.current) return

		mapRef.current.setCameraPosition({ coordinates: getMapRegion(pin) as Coordinates, duration: 500, zoom: 17 })
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
					<>
						{Platform.OS === 'ios' ? (
							<AppleMaps.View
								cameraPosition={initial}
								style={{ width: '100%', height: '100%' }}
								markers={[{ coordinates: marker }]}
								onMapClick={onSelectLocation}
								properties={{ mapType: mapType as AppleMaps.MapType }}
							/>
						) : (
							<GoogleMaps.View
								cameraPosition={initial}
								style={{ width: '100%', height: '100%' }}
								markers={[{ coordinates: marker }]}
								onMapClick={onSelectLocation}
								properties={{ mapType: mapType as GoogleMaps.MapType }}
							/>
						)}
					</>
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
