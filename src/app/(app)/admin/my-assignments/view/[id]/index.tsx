import AssignmentControls from '@components/AssignmentControls'
import AssignmentMapCard from '@components/AssignmentMapCard'
import useAssignment from '@hooks/useAssignment'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { AppleMaps, GoogleMaps } from 'expo-maps'
import { getMapRegion } from '@utils/get-map-region'
import { getMarkerCoordinate } from '@utils/get-marker-coordinate'

import * as S from './styles'
import { Models } from 'react-native-appwrite'
import React from 'react'
import { Platform } from 'react-native'
import { useLocation } from '@hooks/useLocation'

const AssigmentDetails = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const [showFinish, setShowFinish] = useState(false)
	const { assignment } = useAssignment(params.id as string, params as Models.Document)
	const router = useRouter()
	const { location } = useLocation()

	const toggleModal = () => {
		setShowFinish(old => !old)
	}

	if (!assignment) {
		return (
			<S.Container>
				<Stack.Screen options={{ presentation: 'modal' }} />
				<S.LoadingContainer>
					<S.Loading />
				</S.LoadingContainer>
			</S.Container>
		)
	}

	const region = getMapRegion([assignment.lat, assignment.lng])
	const marker = getMarkerCoordinate([assignment.lat, assignment.lng])

	return (
		<S.Container>
			<Stack.Screen options={{ presentation: 'modal' }} />
			{typeof assignment.map !== 'string' && (
				<S.Content>
					<S.CloseButton onPress={router.back}>
						<S.Icon name='arrow-back' />
					</S.CloseButton>

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
				</S.Content>
			)}
		</S.Container>
	)
}

export default AssigmentDetails
