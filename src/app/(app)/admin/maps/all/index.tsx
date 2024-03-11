import * as Location from 'expo-location'
import { Link, Stack } from 'expo-router'
import useAllMaps from 'hooks/swr/admin/useAllMaps'
import { useCallback, useEffect, useState } from 'react'
import { Marker } from 'react-native-maps'
import { getMapRegion } from 'utils/get-map-region'
import { getMarkerCoordinate } from 'utils/get-marker-coordinate'
import { getPinColor } from 'utils/get-pin-color'

import * as S from './styles'

const AllMaps = () => {
	const [location, setLocation] = useState(null)
	const { maps } = useAllMaps()

	const getLocation = useCallback(async () => {
		const { status } = await Location.requestForegroundPermissionsAsync()
		if (status !== 'granted') return

		const { coords } = await Location.getCurrentPositionAsync({})
		setLocation(getMapRegion([coords.latitude, coords.longitude], 0.5))
	}, [])

	useEffect(() => {
		getLocation()
	}, [getLocation])

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Mapas da congregação' }} />
			<S.Content>
				<S.MapContainer>
					<S.Map showsUserLocation region={location}>
						{maps.map(map => (
							<Marker
								key={map._id}
								coordinate={getMarkerCoordinate(map.coordinates)}
								title={map.name}
								description={map.address}
								pinColor={getPinColor(!map.last_assignment?.finished)}
							>
								<S.MarkerCallout tooltip>
									<Link href={{ pathname: `/admin/maps/${map._id}`, params: map }} asChild>
										<S.IconButton hitSlop={50}>
											<S.EditIcon name='eye-outline' />
										</S.IconButton>
									</Link>
									<S.Columm>
										<S.Paragraph>{map.name}</S.Paragraph>
										<S.ParagraphWrap numberOfLines={3} ellipsizeMode='tail'>
											{map.address}, {map.city.name}
										</S.ParagraphWrap>
										{map.last_assignment?.finished ? (
											<S.Small>Mapa designado</S.Small>
										) : (
											<Link
												href={{ pathname: '/admin/assignments/add', params: { map: map._id } }}
											>
												<S.AssignLink>DESIGNAR</S.AssignLink>
											</Link>
										)}
									</S.Columm>
								</S.MarkerCallout>
							</Marker>
						))}
					</S.Map>
				</S.MapContainer>
			</S.Content>
		</S.Container>
	)
}

export default AllMaps
