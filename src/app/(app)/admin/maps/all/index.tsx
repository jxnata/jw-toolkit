import * as Location from 'expo-location'
import { Link, Stack } from 'expo-router'
import useMaps from 'hooks/swr/admin/useMaps'
import { useCallback, useEffect, useState } from 'react'
import { Marker } from 'react-native-maps'
import { colors } from 'themes'
import { getMapRegion } from 'utils/get-map-region'
import { getMarkerCoordinate } from 'utils/get-marker-coordinate'
import * as S from './styles'

const AllMaps = () => {
	const [location, setLocation] = useState(null)
	const { maps } = useMaps({ all: true })

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
				{/* <S.DetailsContainer>
					{!!map && (
						<S.Row>
							<S.Columm>
								<S.Paragraph>{map.name}</S.Paragraph>
								<S.ParagraphWrap numberOfLines={3} ellipsizeMode='tail'>
									{map.address}, {map.city.name}
								</S.ParagraphWrap>
								{typeof map.last_visited_by === 'object' ? (
									<S.Small>
										Visitado por {map.last_visited_by.name} em {formatDate(map.last_visited)}
									</S.Small>
								) : (
									<S.Small>Ainda não visitado</S.Small>
								)}
							</S.Columm>
						</S.Row>
					)}
				</S.DetailsContainer> */}
				<S.MapContainer>
					<S.Map showsUserLocation region={location}>
						{maps.map(map => (
							<Marker
								key={map._id}
								coordinate={getMarkerCoordinate(map.coordinates)}
								title={map.name}
								description={map.address}
							>
								<S.Ionicon
									name='location'
									color={
										map.assigned
											? map.assigned.permanent
												? colors.warning
												: colors.error
											: colors.success
									}
								/>
								<S.MarkerCallout tooltip>
									<Link href={{ pathname: `/admin/maps/${map._id}`, params: map }} asChild>
										<S.IconButton hitSlop={100}>
											<S.EditIcon name='eye-outline' />
										</S.IconButton>
									</Link>
									<S.Columm>
										<S.Paragraph>{map.name}</S.Paragraph>
										<S.ParagraphWrap numberOfLines={3} ellipsizeMode='tail'>
											{map.address}, {map.city.name}
										</S.ParagraphWrap>
										{map.assigned ? (
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
