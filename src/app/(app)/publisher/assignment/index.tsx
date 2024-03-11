import AssignmentControls from 'components/AssignmentControls'
import AssignmentMapCard from 'components/AssignmentMapCard'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { MapMarker, Marker } from 'react-native-maps'
import { IAssignment } from 'types/models/Assignment'
import { getMapRegion } from 'utils/get-map-region'
import { getMarkerCoordinate } from 'utils/get-marker-coordinate'

import * as S from './styles'

const AssigmentDetails = () => {
	const { data } = useLocalSearchParams<{ data: string }>()
	const router = useRouter()
	const markerRef = useRef<MapMarker>(null)
	const [showFinish, setShowFinish] = useState(false)

	const assignment: IAssignment = JSON.parse(data)

	if (typeof assignment.map === 'string') return <></>

	const region = getMapRegion(assignment.map.coordinates)
	const marker = getMarkerCoordinate(assignment.map.coordinates)

	const onMapReady = () => {
		if (markerRef && markerRef.current && markerRef.current.showCallout) {
			setTimeout(markerRef.current.showCallout, 1000)
		}
	}

	const toggleModal = () => {
		setShowFinish(old => !old)
	}

	return (
		<S.Container>
			<Stack.Screen options={{ presentation: 'modal' }} />
			<S.Content>
				<S.CloseButton onPress={router.back}>
					<S.Icon name='close-outline' />
				</S.CloseButton>
				<S.Map region={region} onMapReady={onMapReady} showsUserLocation>
					<Marker
						ref={markerRef}
						key={assignment.map._id}
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
		</S.Container>
	)
}

export default AssigmentDetails
