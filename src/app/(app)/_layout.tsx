import { Loading } from '@/components/loading'
import LocationRequest from '@/components/location-request'
import { useSession } from '@/contexts/session-provider'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { useForegroundPermissions } from 'expo-location'
import { Stack } from 'expo-router'
import { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient'

export default function Layout() {
	const { congregation, current, type } = useSession()
	const [status] = useForegroundPermissions()
	const { colors } = useThemedColors()

	const screenOptions: ExtendedStackNavigationOptions = {
		headerStyle: { backgroundColor: colors.background },
		headerShadowVisible: false,
		headerTintColor: colors.foreground,
		headerTitleStyle: { fontFamily: 'urbanist-bold' },
		headerBackButtonDisplayMode: 'generic',
		headerTitleAlign: 'center',
		contentStyle: { backgroundColor: colors.background },
	}

	if (!current) return <Loading />

	if (status) {
		if (!status.granted) {
			return <LocationRequest />
		}
	}

	return (
		<Stack screenOptions={screenOptions}>
			<Stack.Protected guard={!!congregation && type === 'publisher'}>
				<Stack.Screen options={{ headerShown: false }} name="publisher" />
			</Stack.Protected>

			<Stack.Protected guard={!!congregation && type === 'admin'}>
				<Stack.Screen options={{ headerShown: false }} name="admin" />
			</Stack.Protected>

			<Stack.Screen name="select-congregation" options={{ ...screenOptions, presentation: 'modal' }} />
			<Stack.Screen name="limit-alert" options={{ ...screenOptions, presentation: 'modal' }} />
			<Stack.Screen name="privacy-policy" options={{ ...screenOptions, presentation: 'modal' }} />
			<Stack.Screen name="privacy-blocked" options={{ ...screenOptions, presentation: 'modal' }} />
			<Stack.Screen name="subscription" options={{ ...screenOptions, presentation: 'modal' }} />
		</Stack>
	)
}
