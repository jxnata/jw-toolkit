import AssignmentMapCard from 'components/AssignmentMapCard'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useRef } from 'react'
import { MapMarker, Marker } from 'react-native-maps'
import { IAssignment } from 'types/models/Assignment'
import { getAddressString } from 'utils/get-address-string'
import { getMapRegion } from 'utils/get-map-region'
import { getMarkerCoordinate } from 'utils/get-marker-coordinate'
import * as S from './styles'

const AssigmentDetails = () => {
	const { data } = useLocalSearchParams<{ data: string }>()
	const router = useRouter()
	const markerRef = useRef<MapMarker>(null)

	const assignment: IAssignment = JSON.parse(data)
	const region = getMapRegion(assignment.map.coordinates)
	const marker = getMarkerCoordinate(assignment.map.coordinates)
	const address = getAddressString(assignment.map.address)

	const onMapReady = () => {
		if (markerRef && markerRef.current && markerRef.current.showCallout) {
			setTimeout(markerRef.current.showCallout, 1000)
		}
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
						description={address}
					/>
				</S.Map>
				{!assignment.finished && <AssignmentMapCard assignment={assignment} />}
			</S.Content>
		</S.Container>
	)
}

export default AssigmentDetails
