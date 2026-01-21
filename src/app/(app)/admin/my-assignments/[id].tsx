import AssignmentMapCard from '@/components/assignment-card'
import AssignmentControls from '@/components/assignment-controls'
import useAssignment from '@/hooks/use-assignment'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'

import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { ArrowLeft } from 'lucide-react-native'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const AssigmentDetails = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Map
	const [showFinish, setShowFinish] = useState(false)
	const { assignment } = useAssignment(params.id)
	const router = useRouter()
	const { colors } = useThemedColors()

	const toggleModal = () => {
		setShowFinish((old) => !old)
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

	const region = getMapRegion([assignment.lat, assignment.lng])
	const marker = getMarkerCoordinate([assignment.lat, assignment.lng])

	return (
		<View className="flex">
			<Stack.Screen options={{ presentation: 'modal' }} />
			{assignment && (
				<View className="flex h-full w-full">
					<TouchableOpacity
						onPress={router.back}
						className="absolute left-3 top-4 z-10 h-12 w-12 items-center justify-center rounded-lg bg-card">
						<ArrowLeft size={24} color={colors.foreground} />
					</TouchableOpacity>

					<MapView
						style={{ width: '100%', height: '100%' }}
						initialRegion={{
							latitude: region.latitude,
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

					{showFinish ? (
						<AssignmentMapCard assignment={assignment} onCancel={toggleModal} />
					) : (
						<AssignmentControls assignment={assignment} onFinish={toggleModal} />
					)}
				</View>
			)}
		</View>
	)
}

export default AssigmentDetails
