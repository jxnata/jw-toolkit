import AssignmentControls from '@components/AssignmentControls'
import AssignmentMapCard from '@components/AssignmentMapCard'
import useAssignment from '@hooks/swr/admin/useAssignment'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { MapMarker, Marker } from 'react-native-maps'
import { getMapRegion } from '@utils/get-map-region'
import { getMarkerCoordinate } from '@utils/get-marker-coordinate'

import * as S from './styles'

const AssigmentDetails = () => {
	const { id } = useLocalSearchParams()
	const router = useRouter()
	const markerRef = useRef<MapMarker>(null)
	const [showFinish, setShowFinish] = useState(false)
	const { assignment } = useAssignment(id as string)

	const onMapReady = () => {
		if (markerRef && markerRef.current && markerRef.current.showCallout) {
			setTimeout(markerRef.current.showCallout, 1000)
		}
	}

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

	const region = typeof assignment.map === 'string' ? undefined : getMapRegion(assignment.map.coordinates)
	const marker = typeof assignment.map === 'string' ? undefined : getMarkerCoordinate(assignment.map.coordinates)

	return (
		<S.Container>
			<Stack.Screen options={{ presentation: 'modal' }} />
			{typeof assignment.map !== 'string' && (
				<S.Content>
					<S.CloseButton onPress={router.back}>
						<S.Icon name='arrow-back' />
					</S.CloseButton>
					<S.Map region={region} onMapReady={onMapReady} showsUserLocation>
						<Marker
							ref={markerRef}
							key={assignment.map.$id}
							coordinate={marker}
							title={assignment.map.name}
							description={assignment.map.address}
						/>
					</S.Map>
					{!assignment.finished && (
						<>
							{showFinish ? (
								<AssignmentMapCard assignment={assignment} onCancel={toggleModal} />
							) : (
								<AssignmentControls assignment={assignment} onFinish={toggleModal} />
							)}
						</>
					)}
				</S.Content>
			)}
		</S.Container>
	)
}

export default AssigmentDetails
