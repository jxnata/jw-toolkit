import AssignmentMapCard from '@/components/assignment-card'
import AssignmentControls from '@/components/assignment-controls'
import useAssignment from '@/hooks/use-assignment-instant'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'

import { useThemedColors } from '@/hooks/use-themed-colors'
import { useLocation } from '@/hooks/useLocation'
import { Map } from '@/interfaces'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const AssigmentDetails = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Map
	const [showFinish, setShowFinish] = useState(false)
	const { assignment } = useAssignment(params.id)
	const router = useRouter()
	const { location } = useLocation()
	const { colors } = useThemedColors()

	const toggleModal = () => {
		setShowFinish(old => !old)
	}

	if (!assignment) {
		return (
			<View className='flex'>
				<Stack.Screen options={{ presentation: 'modal' }} />
				<View className='flex-1 justify-center items-center'>
					<ActivityIndicator size='large' color={colors.primary[600]} />
				</View>
			</View>
		)
	}

	const region = getMapRegion([assignment.lat, assignment.lng])
	const marker = getMarkerCoordinate([assignment.lat, assignment.lng])

	return (
		<View className='flex'>
			<Stack.Screen options={{ presentation: 'modal' }} />
			{assignment && (
				<View className='flex w-full h-full'>
					<TouchableOpacity
						onPress={router.back}
						className='absolute top-4 left-3 z-10 w-12 h-12 items-center justify-center rounded-lg bg-card'
					>
						<Ionicons name='arrow-back' size={24} color={colors.foreground} />
					</TouchableOpacity>

					<MapView
						style={{ width: '100%', height: '100%' }}
						initialRegion={{
							latitude: region.latitude,
							longitude: region.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01,
						}}
						showsUserLocation={true}
						followsUserLocation={true}
					>
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
