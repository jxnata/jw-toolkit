import { Loading } from '@/components/loading'
import LocationRequest from '@/components/location-request'
import { useSession } from '@/contexts/session-provider'
import { useLocation } from '@/hooks/use-location'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { NativeStackNavigationOptions, Stack } from 'expo-router'
import { View } from 'react-native'

export default function Layout() {
	const { congregation, current, type, pending } = useSession()
	const { hasPermission, permissionChecked } = useLocation()
	const { colors } = useThemedColors()

	const screenOptions: NativeStackNavigationOptions = {
		headerStyle: { backgroundColor: colors.background },
		headerShadowVisible: false,
		headerTintColor: colors.foreground,
		headerTitleStyle: { fontFamily: 'urbanist-bold' },
		headerBackButtonDisplayMode: 'generic',
		headerTitleAlign: 'center',
		contentStyle: { backgroundColor: colors.background },
	}

	if (!current || !permissionChecked) return <Loading />

	// The Stack must stay mounted once rendered: swapping it for the permission screen and mounting it
	// again crashes react-native-screens on Android ("The specified child already has a parent").
	return (
		<View className="flex-1">
			<Stack screenOptions={screenOptions}>
				<Stack.Protected guard={!!congregation && type === 'publisher' && !pending}>
					<Stack.Screen options={{ headerShown: false }} name="publisher" />
				</Stack.Protected>

				<Stack.Protected guard={pending}>
					<Stack.Screen options={{ headerShown: false }} name="pending" />
				</Stack.Protected>

				<Stack.Protected guard={!!congregation && type === 'admin'}>
					<Stack.Screen options={{ headerShown: false }} name="admin" />
				</Stack.Protected>

				<Stack.Screen name="select-congregation" options={{ ...screenOptions, presentation: 'modal' }} />
				<Stack.Screen name="limit-alert" options={{ ...screenOptions, presentation: 'modal' }} />
				<Stack.Screen name="privacy-policy" options={{ ...screenOptions, presentation: 'modal' }} />
				<Stack.Screen name="edit-profile" options={{ ...screenOptions, presentation: 'modal' }} />
				<Stack.Screen name="privacy-blocked" options={{ ...screenOptions, presentation: 'modal' }} />
				<Stack.Screen name="subscription" options={{ ...screenOptions, presentation: 'modal' }} />
			</Stack>

			{!hasPermission && (
				<View className="absolute inset-0 bg-background">
					<LocationRequest />
				</View>
			)}
		</View>
	)
}
