import Button from '@/components/button'
import useCheckbox from '@/hooks/use-checkbox'
import { useLocation } from '@/hooks/use-location'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { validCoordinates } from '@/utils/valid-coordinates'
import { X } from 'lucide-react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import MapView, { MapViewProps, Marker } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
	onSelect: (coord: [number, number]) => void
	onClose: () => void
	initial?: { coordinates: { latitude: number; longitude: number } }
}

const mapTypes = ['hybrid', 'standard', 'satellite', 'terrain']

const SelectLocation = ({ onSelect, onClose, initial }: Props) => {
	const mapRef = useRef<MapView>(null)
	const { colors } = useThemedColors()
	const { location } = useLocation()
	const { top, bottom } = useSafeAreaInsets()

	const [pin, setPin] = useState<[number, number]>(
		validCoordinates([initial?.coordinates?.latitude || 0, initial?.coordinates?.longitude || 0]) || [0, 0]
	)
	const { CheckboxComponent: MapOptions, selectedValues } = useCheckbox(mapTypes, ['hybrid'], true)

	const mapType = useMemo(() => selectedValues[0], [selectedValues])
	const marker = useMemo(() => getMarkerCoordinate(pin), [pin])

	const initialLocation = useMemo(() => {
		return {
			latitude: initial ? initial.coordinates.latitude : location?.latitude || 0,
			longitude: initial ? initial.coordinates.longitude : location?.longitude || 0,
		}
	}, [initial, location])

	const onSelectLocation = useCallback(
		(e: any) => {
			const coordinates: [number, number] = [e.nativeEvent.coordinate.latitude || 0, e.nativeEvent.coordinate.longitude || 0]
			setPin([e.nativeEvent.coordinate.latitude || 0, e.nativeEvent.coordinate.longitude || 0])
			onSelect(coordinates)
		},
		[onSelect]
	)

	useEffect(() => {
		if (!pin) return
		if (!mapRef.current) return
		if (pin.every((p) => p === 0)) return

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
		<View className="flex h-full w-full justify-end">
			<View className="flex w-full items-center rounded-[10px] bg-card">
				<View
					className="absolute left-3 z-10 items-center justify-center rounded-xl p-2"
					style={{ backgroundColor: colors.foreground, top: top + 10 }}>
					<MapOptions />
				</View>

				<Pressable
					onPress={onClose}
					className="absolute right-3 z-10 h-10 w-10 items-center justify-center rounded-xl"
					style={{ backgroundColor: colors.foreground, top: top + 10 }}>
					<X size={24} color={colors.background} />
				</Pressable>

				{initialLocation.latitude !== 0 && initialLocation.longitude !== 0 && (
					<MapView
						ref={mapRef}
						style={{ width: '100%', height: '100%' }}
						initialRegion={{
							latitude: initialLocation.latitude,
							longitude: initialLocation.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01,
						}}
						showsUserLocation
						showsMyLocationButton
						showsCompass
						mapType={mapType as MapViewProps['mapType']}
						onPress={onSelectLocation}>
						<Marker
							coordinate={{
								latitude: marker.latitude,
								longitude: marker.longitude,
							}}
						/>
					</MapView>
				)}

				{!!pin && (
					<View className="absolute w-full rounded-t-xl bg-card px-4 pt-4" style={{ bottom: 0, paddingBottom: bottom + 10 }}>
						<Text className="mb-3 text-center font-bold text-lg text-foreground">
							Toque no mapa para selecionar a localização
						</Text>
						<Button onPress={onClose}>Confirmar</Button>
					</View>
				)}
			</View>
		</View>
	)
}

export default SelectLocation
