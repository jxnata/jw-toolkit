import {
	LocationAccuracy,
	LocationObjectCoords,
	getCurrentPositionAsync,
	requestForegroundPermissionsAsync,
} from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

export const useLocation = () => {
	const [location, setLocation] = useState<LocationObjectCoords>(null)

	const getLocation = useCallback(async () => {
		const { status } = await requestForegroundPermissionsAsync()

		if (status !== 'granted') return

		const { coords } = await getCurrentPositionAsync({ accuracy: LocationAccuracy.High })

		setLocation(coords)
	}, [])

	useEffect(() => {
		getLocation()
	}, [getLocation])

	return {
		location,
	}
}
