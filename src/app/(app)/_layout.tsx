import LocationRequest from '@components/LocationRequest'
import { useSession } from '@contexts/session'
import theme from '@themes/index'
import { useForegroundPermissions } from 'expo-location'
import { Redirect, Stack } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { OneSignal } from 'react-native-onesignal'

export default function Layout() {
	const scheme = useColorScheme()
	const { current } = useSession()
	const [status] = useForegroundPermissions()

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
				headerStyle: { backgroundColor: theme[scheme || 'light'].background },
				headerShadowVisible: false,
				headerTintColor: theme[scheme || 'light'].text,
				headerTitleStyle: { fontFamily: 'urbanist-bold' },
				headerBackButtonDisplayMode: 'generic',
				headerTitleAlign: 'center',
				contentStyle: { backgroundColor: theme[scheme || 'light'].background },
			}}
		>
			<Stack.Screen name='admin/me/index' options={{ presentation: 'modal' }} />
			<Stack.Screen name='publisher/me/index' options={{ presentation: 'modal' }} />
			<Stack.Screen
				name='publisher/assignment/[id]/index'
				options={{ presentation: 'modal', headerShown: false }}
			/>
			<Stack.Screen
				name='admin/my-assignments/view/[id]/index'
				options={{ presentation: 'modal', headerShown: false }}
			/>
		</Stack>
	)
}
