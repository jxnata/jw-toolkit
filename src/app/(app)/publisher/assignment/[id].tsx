import AssignmentControls from '@/components/assignment-controls'
import useAssignment from '@/hooks/use-assignment'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { ActivityIndicator, Pressable, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const AssigmentDetails = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Map
	const router = useRouter()
	const { colors } = useThemedColors()
	const { assignment } = useAssignment(params.id)

	const onFinish = () => {
		router.push({
			pathname: '/publisher/assignment/finish',
			params: { assignmentId: assignment?.id, assignmentName: assignment?.assigned?.name },
		})
	}

	if (!assignment) {
		return (
			<View className="flex">
				<Stack.Screen options={{ presentation: 'modal' }} />
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color={colors.primary[600]} />
				</View>
			</View>
		)
	}

	const HeaderLeft = () => (
		<View className="flex-row">
			<Pressable onPress={router.back} className="p-2">
				<ArrowLeft color={colors.foreground} />
			</Pressable>
		</View>
	)

	const region = getMapRegion([assignment.lat, assignment.lng])
	const marker = getMarkerCoordinate([assignment.lat, assignment.lng])

	return (
		<View className="flex">
			<Stack.Screen options={{ title: assignment.name || 'Designação', headerLeft: HeaderLeft }} />
			{assignment && (
				<View className="flex h-full w-full">
					<MapView
						style={{ width: '100%', height: '100%' }}
						initialRegion={{
							latitude: region.latitude - 0.003,
							longitude: region.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01,
						}}
						showsUserLocation={true}>
						<Marker
							coordinate={{
								latitude: marker.latitude,
								longitude: marker.longitude,
							}}
							title={assignment.name}
							description={assignment.address}
						/>
					</MapView>

					<AssignmentControls assignment={assignment} onFinish={onFinish} />
				</View>
			)}
		</View>
	)
}

export default AssigmentDetails
