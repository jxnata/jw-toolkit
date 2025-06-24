import AssignmentMapCard from '@/components/assignment-card'
import AssignmentControls from '@/components/assignment-controls'
import useAssignment from '@/hooks/useAssignment'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { AppleMaps, GoogleMaps } from 'expo-maps'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'

import { useThemedColors } from '@/hooks/use-themed-colors'
import { useLocation } from '@/hooks/useLocation'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ActivityIndicator, Platform, TouchableOpacity, View } from 'react-native'
import { Models } from 'react-native-appwrite'

const AssigmentDetails = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const [showFinish, setShowFinish] = useState(false)
	const { assignment } = useAssignment(params.$id as string, params as Models.Document)
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
			{typeof assignment.map !== 'string' && (
				<View className='flex w-full h-full'>
					<TouchableOpacity
						onPress={router.back}
						className='absolute top-4 left-3 z-10 w-12 h-12 items-center justify-center rounded-lg bg-card'
					>
						<Ionicons name='arrow-back' size={24} color={colors.foreground} />
					</TouchableOpacity>

					{Platform.OS === 'ios' ? (
						<AppleMaps.View
							cameraPosition={region}
							style={{ width: '100%', height: '100%' }}
							markers={[{ coordinates: marker, title: assignment.name }]}
						/>
					) : (
						<GoogleMaps.View
							cameraPosition={region}
							style={{ width: '100%', height: '100%' }}
							markers={[
								{
									coordinates: marker,
									title: assignment.name,
									snippet: assignment.address,
									showCallout: true,
								},
							]}
							userLocation={{
								followUserLocation: true,
								coordinates: { latitude: location?.latitude, longitude: location?.longitude },
							}}
						/>
					)}

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
