import { Loading } from '@/components/loading'
import LocationRequest from '@/components/location-request'
import { useSession } from '@/contexts/session-provider'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { useForegroundPermissions } from 'expo-location'
import { Stack } from 'expo-router'
import { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient'

export default function Layout() {
	const { congregation, current } = useSession()
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

	if (!congregation)
		return (
			<Stack screenOptions={screenOptions}>
				<Stack.Screen name="select-congregation" options={{ presentation: 'modal' }} />
				<Stack.Screen name="add-congregation" options={{ presentation: 'modal' }} />
			</Stack>
		)

	return (
		<Stack screenOptions={screenOptions}>
			<Stack.Screen name="index" />
			<Stack.Screen name="admin/me" options={{ presentation: 'modal' }} />
			<Stack.Screen name="publisher/me" options={{ presentation: 'modal' }} />
			<Stack.Screen name="publisher/assignment/[id]" options={{ presentation: 'modal', headerShown: false }} />
			<Stack.Screen name="publisher/assignment/finish" options={{ presentation: 'modal', headerShown: false }} />
			<Stack.Screen name="admin/my-assignments/[id]" options={{ presentation: 'modal', headerShown: false }} />
			<Stack.Screen name="select-congregation" options={{ presentation: 'modal' }} />
			<Stack.Screen name="limit-alert" options={{ presentation: 'modal' }} />
			<Stack.Screen name="privacy-policy" options={{ presentation: 'modal' }} />
			<Stack.Screen name="privacy-blocked" options={{ presentation: 'modal' }} />
		</Stack>
	)
}
