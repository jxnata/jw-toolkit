import Button from '@components/Button'
import useCheckbox from '@hooks/useCheckbox'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppleMaps, Coordinates, GoogleMaps } from 'expo-maps'
import { getMapRegion } from '@utils/get-map-region'
import { getMarkerCoordinate } from '@utils/get-marker-coordinate'
import { validCoordinates } from '@utils/valid-coordinates'

import * as S from './styles'
import React from 'react'
import { Platform } from 'react-native'

type Props = {
	onSelect: (coord: [number, number]) => void
	onClose: () => void
	initial?: AppleMaps.CameraPosition | GoogleMaps.CameraPosition
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
		<S.Container>
			<S.Content>
				<S.MapType>
					<MapOptions />
				</S.MapType>
				<S.CloseButton onPress={onClose}>
					<S.Icon name='close-outline' />
				</S.CloseButton>
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
