import LocationRequest from 'components/LocationRequest'
import { useSession } from 'contexts/Auth'
import { useForegroundPermissions } from 'expo-location'
import { Redirect, Stack } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import theme from 'themes'

export default function Layout() {
	const scheme = useColorScheme()
	const { session } = useSession()
	const [status] = useForegroundPermissions()

	useEffect(() => {
		if (session) OneSignal.login(session.data._id)
	}, [session])

	if (!session) {
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
				headerStyle: {
					backgroundColor: theme[scheme].background,
				},
				headerShadowVisible: false,
				headerTintColor: theme[scheme].text,
				headerTitleStyle: { fontFamily: 'urbanist-bold' },
				headerBackTitleVisible: false,
				headerTitleAlign: 'center',
				contentStyle: { backgroundColor: theme[scheme].background },
			}}
		>
			<Stack.Screen name='admin/me/index' options={{ presentation: 'modal' }} />
			<Stack.Screen name='publisher/me/index' options={{ presentation: 'modal' }} />
			<Stack.Screen name='publisher/history/index' options={{ presentation: 'modal' }} />
			<Stack.Screen name='publisher/assignment/index' options={{ presentation: 'modal', headerShown: false }} />
		</Stack>
	)
}
