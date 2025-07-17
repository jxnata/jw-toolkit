import { useThemedColors } from '@/hooks/use-themed-colors'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { getPinColor } from '@/utils/get-pin-color'
import * as Location from 'expo-location'
import { AppleMaps, GoogleMaps } from 'expo-maps'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Platform, Text, View } from 'react-native'

import useAllMaps from '@/hooks/useAllMaps'

const AllMaps = () => {
	const [location, setLocation] = useState<any>()
	const params = useLocalSearchParams()
	const { initialMaps } = JSON.parse((params.maps as string) || '[]')
	const { maps, loading } = useAllMaps({ initialData: initialMaps })
	const { colors } = useThemedColors()

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
		<View className='flex'>
			<Stack.Screen options={{ title: 'Mapas da congregação' }} />
			<View className='flex w-full h-full bg-background'>
				<View className='flex-1'>{renderMap()}</View>
				{loading && (
					<View className='absolute inset-0 bg-background/80 items-center justify-center'>
						<View className='items-center'>
							<ActivityIndicator size='large' color={colors.primary[600]} />
							<Text className='text-xs text-foreground py-2.5 font-medium'>Carregando mapas...</Text>
						</View>
					</View>
				)}
			</View>
		</View>
	)
}

export default AllMaps
