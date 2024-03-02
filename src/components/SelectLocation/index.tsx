import Button from 'components/Button'
import { getCurrentPositionAsync } from 'expo-location'
import useCheckbox from 'hooks/useCheckbox'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapView, { LatLng, MapMarker, MapPressEvent, MapType, Marker, Region } from 'react-native-maps'
import { getMapRegion } from 'utils/get-map-region'
import { getMarkerCoordinate } from 'utils/get-marker-coordinate'
import { validCoordinates } from 'utils/valid-coordinates'
import * as S from './styles'

type Props = {
	onSelect: (coord: [number, number]) => void
	onClose: () => void
	initial?: [number, number]
}

const SelectLocation = ({ onSelect, onClose, initial }: Props) => {
	const markerRef = useRef<MapMarker>(null)
	const mapRef = useRef<MapView>(null)
	const [pin, setPin] = useState<[number, number]>(validCoordinates(initial))
	const [initialLocation, setInitialLocation] = useState<Region>()
	const { CheckboxComponent: MapOptions, selectedValues } = useCheckbox(['standard', 'satellite'], ['standard'], true)

	const mapType: MapType = useMemo(() => selectedValues[0], [selectedValues]) as 'standard' | 'satellite'
	const marker: LatLng = useMemo(() => getMarkerCoordinate(pin), [pin])

	const onSelectLocation = useCallback((e: MapPressEvent) => {
		const coordinates: [number, number] = [e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude]
		setPin(coordinates)
		onSelect(coordinates)
	}, [])

	const getInitialLocation = async () => {
		if (pin) {
			setInitialLocation(getMapRegion(pin, 0.001))
			return
		}
		const location = await getCurrentPositionAsync()
		const region = getMapRegion([location.coords.latitude, location.coords.longitude])
		setInitialLocation(region)
	}

	useEffect(() => {
		getInitialLocation()
	}, [])

	useEffect(() => {
		if (!pin) return
		if (!mapRef.current) return

		mapRef.current.animateToRegion(getMapRegion(pin, 0.001), 500)
	}, [pin, mapRef])

	return (
		<S.Container>
			<S.Content>
				<S.MapType>
					<MapOptions />
				</S.MapType>
				<S.CloseButton onPress={onClose}>
					<S.Icon name='close-outline' />
				</S.CloseButton>
				{!!initialLocation ? (
					<S.Map
						ref={mapRef}
						initialRegion={initialLocation}
						onPress={onSelectLocation}
						mapType={mapType}
						showsUserLocation
					>
						<Marker ref={markerRef} coordinate={marker} />
					</S.Map>
				) : (
					<S.LoadingContainer>
						<S.Loading />
					</S.LoadingContainer>
				)}
				{!!pin && (
					<S.ButtonContainer>
						<Button onPress={onClose}>Confirmar</Button>
					</S.ButtonContainer>
				)}
			</S.Content>
		</S.Container>
	)
}

export default SelectLocation
