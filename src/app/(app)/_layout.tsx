import LocationRequest from '@/components/location-request'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { useForegroundPermissions } from 'expo-location'
import { Stack } from 'expo-router'

export default function Layout() {
	const [status] = useForegroundPermissions()
	const { colors } = useThemedColors()

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
			<Stack.Screen name='index' />
			<Stack.Screen name='admin/me' options={{ presentation: 'modal' }} />
			<Stack.Screen name='publisher/me' options={{ presentation: 'modal' }} />
			<Stack.Screen name='publisher/assignment/[id]' options={{ presentation: 'modal', headerShown: false }} />
			<Stack.Screen name='admin/my-assignments/[id]' options={{ presentation: 'modal', headerShown: false }} />
			<Stack.Screen name='select-congregation' options={{ presentation: 'modal' }} />
		</Stack>
	)
}
