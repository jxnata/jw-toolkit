import useAllMaps from '@/hooks/use-all-maps'
import { useLocation } from '@/hooks/use-location'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { coordinatesAverage } from '@/utils/coordinates-average'
import { getPinColor } from '@/utils/get-pin-color'
import { isValidCoordinate } from '@/utils/is-valid-coordinate'
import { router, Stack } from 'expo-router'
import { ActivityIndicator, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const AllMaps = () => {
	const { maps, loading } = useAllMaps()
	const { location, isLoading: loadingLocation } = useLocation()
	const { colors } = useThemedColors()

	// Maps saved without a position (null or 0,0) would crash the native marker.
	const markers = maps.filter((map: any) => isValidCoordinate(map.lat, map.lng) && (map.lat !== 0 || map.lng !== 0))

	const getCenter = () => {
		if (location) return { latitude: location.latitude, longitude: location.longitude }
		if (loadingLocation || loading || markers.length === 0) return null

		// Without the user position (GPS off, timeout), center on the congregation maps instead of showing nothing.
		const [latitude, longitude] = coordinatesAverage(markers.map((map: any) => [map.lat, map.lng]))

		return { latitude, longitude }
	}

	const center = getCenter()
	const waiting = loading || (!center && loadingLocation)

	const renderMap = () => {
		if (!center) return null

		return (
			<MapView
				style={{ width: '100%', height: '100%' }}
				initialRegion={{
					latitude: center.latitude,
					longitude: center.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
				showsUserLocation={true}
				followsUserLocation={true}>
				{markers.map((map: any) => (
					<Marker
						key={map.id}
						coordinate={{
							latitude: map.lat,
							longitude: map.lng,
						}}
						title={map.name}
						description={[map.address, map.city?.name].filter(Boolean).join(', ')}
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
				{!center && !waiting && (
					<View className="absolute inset-0 items-center justify-center px-6">
						<Text className="text-center font-medium text-sm text-foreground">
							Não foi possível obter sua localização e não há mapas com posição definida para exibir.
						</Text>
					</View>
				)}
				{waiting && (
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
