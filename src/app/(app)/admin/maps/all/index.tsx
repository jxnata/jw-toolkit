import useAllMaps from '@/hooks/use-all-maps'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { getMapRegion } from '@/utils/get-map-region'
import { getPinColor } from '@/utils/get-pin-color'
import * as Location from 'expo-location'
import { router, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const AllMaps = () => {
	const [location, setLocation] = useState<any>()
	const { maps, loading } = useAllMaps()
	const { colors } = useThemedColors()

	useEffect(() => {
		const getLocation = async () => {
			const { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') return

			const { coords } = await Location.getCurrentPositionAsync({})
			setLocation(getMapRegion([coords.latitude, coords.longitude]))
		}

		getLocation()
	}, [])

	const renderMap = () => {
		if (!location) return null

		return (
			<MapView
				style={{ width: '100%', height: '100%' }}
				initialRegion={{
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
				showsUserLocation={true}
				followsUserLocation={true}>
				{maps.map((map: any) => (
					<Marker
						key={map.id}
						coordinate={{
							latitude: map.lat,
							longitude: map.lng,
						}}
						title={map.name}
						description={`${map.address}, ${map.city.name}`}
						pinColor={getPinColor(map.assigned)}
						onCalloutPress={() => {
							if (!map.last_assignment?.finished) {
								router.push({
									pathname: `/admin/maps/${map.id}`,
									params: { data: JSON.stringify(map) },
								})
							}
						}}
					/>
				))}
			</MapView>
		)
	}

	return (
		<View className="flex">
			<Stack.Screen options={{ title: 'Mapas da congregação' }} />
			<View className="flex h-full w-full bg-background">
				<View className="flex-1">{renderMap()}</View>
				{loading && (
					<View className="bg-background/80 absolute inset-0 items-center justify-center">
						<View className="items-center">
							<ActivityIndicator size="large" color={colors.primary[600]} />
							<Text className="py-2.5 font-medium text-xs text-foreground">Carregando mapas...</Text>
						</View>
					</View>
				)}
			</View>
		</View>
	)
}

export default AllMaps
