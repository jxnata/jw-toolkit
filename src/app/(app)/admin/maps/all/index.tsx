import * as Location from 'expo-location'
import { router, Stack } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { AppleMaps, GoogleMaps } from 'expo-maps'
import { getMapRegion } from '@utils/get-map-region'
import { getMarkerCoordinate } from '@utils/get-marker-coordinate'
import { getPinColor } from '@utils/get-pin-color'

import * as S from './styles'
import useMaps from '@hooks/useMaps'

const AllMaps = () => {
	const [location, setLocation] = useState<any>()
	const { maps, loading } = useMaps()

	const getLocation = useCallback(async () => {
		const { status } = await Location.requestForegroundPermissionsAsync()
		if (status !== 'granted') return

		const { coords } = await Location.getCurrentPositionAsync({})
		setLocation(getMapRegion([coords.latitude, coords.longitude]))
	}, [])

	useEffect(() => {
		getLocation()
	}, [getLocation])

	const renderMap = () => {
		if (!location) return null

		const markers = maps.map(map => ({
			coordinates: getMarkerCoordinate([map.lat, map.lng]),
			title: map.name,
			description: map.address,
			tintColor: getPinColor(map.assigned),
			onCalloutPress: () => {
				if (!map.last_assignment?.finished) {
					router.push({
						pathname: `/admin/maps/${map.$id}`,
						params: { data: JSON.stringify(map) },
					})
				}
			},
			callout: {
				title: map.name,
				description: `${map.address}, ${map.city.name}`,
				actions: map.last_assignment?.finished ? [] : [{ title: 'DESIGNAR' }],
			},
		}))

		if (Platform.OS === 'ios') {
			return (
				<AppleMaps.View cameraPosition={location} style={{ width: '100%', height: '100%' }} markers={markers} />
			)
		}

		return (
			<GoogleMaps.View
				userLocation={{
					followUserLocation: true,
					coordinates: { latitude: location.latitude, longitude: location.longitude },
				}}
				cameraPosition={location}
				style={{ width: '100%', height: '100%' }}
				markers={markers}
			/>
		)
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Mapas da congregação' }} />
			<S.Content>
				<S.MapContainer>{renderMap()}</S.MapContainer>
				{loading && (
					<S.LoadingContainer>
						<S.LoadingContent>
							<S.Loading />
							<S.Label>Carregando mapas...</S.Label>
						</S.LoadingContent>
					</S.LoadingContainer>
				)}
			</S.Content>
		</S.Container>
	)
}

export default AllMaps
