import {
	LocationAccuracy,
	LocationObjectCoords,
	getCurrentPositionAsync,
	getForegroundPermissionsAsync,
	requestForegroundPermissionsAsync,
} from 'expo-location'
import { createContext, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'

interface LocationContextData {
	location: LocationObjectCoords | null
	isLoading: boolean
	error: string | null
	getLocation: () => Promise<void>
	hasPermission: boolean
	permissionChecked: boolean
	canAskAgain: boolean
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
	const [permissionChecked, setPermissionChecked] = useState(false)
	const [canAskAgain, setCanAskAgain] = useState(true)
	const requesting = useRef(false)
	const hasLocation = useRef(false)

	// Single entry point for the system permission dialog, so screens never request it concurrently.
	// With `ask` false it only reads the current status, without opening the dialog.
	const syncLocation = async (ask: boolean) => {
		if (requesting.current) return
		requesting.current = true

		try {
			const permission = ask ? await requestForegroundPermissionsAsync() : await getForegroundPermissionsAsync()

			setHasPermission(permission.granted)
			setCanAskAgain(permission.canAskAgain)
			setPermissionChecked(true)
			setError(permission.granted ? null : 'Permissão de localização negada')

			if (!permission.granted) return
			if (!ask && hasLocation.current) return

			setIsLoading(true)

			const { coords } = await getCurrentPositionAsync({
				accuracy: LocationAccuracy.High,
			})

			hasLocation.current = true
			setLocation(coords)
		} catch (err) {
			setPermissionChecked(true)
			setError('Erro ao obter localização')
			console.error('Location error:', err)
		} finally {
			setIsLoading(false)
			requesting.current = false
		}
	}

	const getLocation = () => syncLocation(true)

	useEffect(() => {
		const load = async () => {
			await syncLocation(true)
		}
		load()

		// The permission can change while the app is in background (system settings, one-time grants).
		const subscription = AppState.addEventListener('change', (state) => {
			if (state === 'active') syncLocation(false)
		})

		return () => subscription.remove()
	}, [])

	return (
		<LocationContext.Provider
			value={{
				location,
				isLoading,
				error,
				getLocation,
				hasPermission,
				permissionChecked,
				canAskAgain,
			}}>
			{children}
		</LocationContext.Provider>
	)
}
