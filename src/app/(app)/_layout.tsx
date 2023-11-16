import LocationRequest from 'components/LocationRequest'
import { useSession } from 'contexts/Auth'
import { useForegroundPermissions } from 'expo-location'
import { Redirect, Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { dark, light } from 'themes'

export default function Layout() {
	const scheme = useColorScheme()
	const { session } = useSession()
	const [status, requestPermission] = useForegroundPermissions()

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
					backgroundColor: { dark, light }[scheme].background,
				},
				headerShadowVisible: false,
				headerTintColor: { dark, light }[scheme].text,
				headerTitleStyle: { fontFamily: 'urbanist-bold' },
				headerBackTitleVisible: false,
				headerTitleAlign: 'center',
			}}
		>
			<Stack.Screen name='publisher/me/index' options={{ presentation: 'modal' }} />
			<Stack.Screen name='publisher/assignment/index' options={{ presentation: 'modal', headerShown: false }} />
		</Stack>
	)
}
