import * as Location from 'expo-location'
import { Link, Stack } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Marker, Region } from 'react-native-maps'
import { getMapRegion } from '@utils/get-map-region'
import { getMarkerCoordinate } from '@utils/get-marker-coordinate'
import { getPinColor } from '@utils/get-pin-color'

import * as S from './styles'
import useMaps from '@hooks/swr/admin/useMaps'

const AllMaps = () => {
	const [location, setLocation] = useState<Region>()
	const { maps, loading } = useMaps()

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
								key={map.$id}
								coordinate={getMarkerCoordinate([map.lat, map.lng])}
								title={map.name}
								description={map.address}
								pinColor={getPinColor(map.assigned)}
							>
								<S.MarkerCallout tooltip>
									<S.Columm>
										<S.Paragraph>{map.name}</S.Paragraph>
										<S.ParagraphWrap numberOfLines={3} ellipsizeMode='tail'>
											{map.address}, {map.city.name}
										</S.ParagraphWrap>
										{map.last_assignment?.finished ? (
											<S.Small>Mapa designado</S.Small>
										) : (
											<Link
												href={{
													pathname: `/admin/maps/${map.$id}`,
													params: { data: JSON.stringify(map) },
												}}
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
				{loading && (
					<S.LoadingContainer>
						<S.LoadingContent>
							<S.Loading />
							<S.Label>Carregando mapas...</S.Label>
						</S.LoadingContent>
					</S.LoadingContainer>
				)}
			</S.Content>
		</S.Container>
	)
}

export default AllMaps
