import { LocationAccuracy, LocationObjectCoords, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location'
import { createContext, useEffect, useState } from 'react'

interface LocationContextData {
	location: LocationObjectCoords | null
	isLoading: boolean
	error: string | null
	getLocation: () => Promise<void>
	hasPermission: boolean
}

export const LocationContext = createContext<LocationContextData>({} as LocationContextData)

interface LocationProviderProps {
	children: React.ReactNode
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
	const [location, setLocation] = useState<LocationObjectCoords | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [hasPermission, setHasPermission] = useState(false)

	const getLocation = async () => {
		try {
			setIsLoading(true)
			setError(null)

			const { status } = await requestForegroundPermissionsAsync()

			if (status !== 'granted') {
				setHasPermission(false)
				setError('Permissão de localização negada')
				return
			}

			setHasPermission(true)

			const { coords } = await getCurrentPositionAsync({
				accuracy: LocationAccuracy.High,
			})

			setLocation(coords)
		} catch (err) {
			setError('Erro ao obter localização')
			console.error('Location error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		const load = async () => {
			await getLocation()
		}
		load()
	}, [])

	return (
		<LocationContext.Provider
			value={{
				location,
				isLoading,
				error,
				getLocation,
				hasPermission,
			}}>
			{children}
		</LocationContext.Provider>
	)
}
