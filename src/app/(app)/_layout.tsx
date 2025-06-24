import LocationRequest from '@/components/location-request'
import { useSession } from '@/contexts/session'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { useForegroundPermissions } from 'expo-location'
import { Redirect, Stack } from 'expo-router'
import { useEffect } from 'react'
import { OneSignal } from 'react-native-onesignal'

export default function Layout() {
	const { current } = useSession()
	const [status] = useForegroundPermissions()
	const { colors } = useThemedColors()

	useEffect(() => {
		if (current) OneSignal.login(current.$id)
	}, [current])

	if (!current) {
		return <Redirect href='/sign-in' />
	}

	if (status) {
		if (!status.granted) {
			return <LocationRequest />
		}
	}

	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: colors.background },
				headerShadowVisible: false,
				headerTintColor: colors.foreground,
				headerTitleStyle: { fontFamily: 'urbanist-bold' },
				headerBackButtonDisplayMode: 'generic',
				headerTitleAlign: 'center',
				contentStyle: { backgroundColor: colors.background },
			}}
		>
			<Stack.Screen name='admin/me' options={{ presentation: 'modal' }} />
			<Stack.Screen name='publisher/me' options={{ presentation: 'modal' }} />
			<Stack.Screen name='publisher/assignment/[id]' options={{ presentation: 'modal', headerShown: false }} />
			<Stack.Screen name='admin/my-assignments/[id]' options={{ presentation: 'modal', headerShown: false }} />
		</Stack>
	)
}
