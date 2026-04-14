import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack } from 'expo-router'
import { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient'

export default function AdminLayout() {
	const { colors } = useThemedColors()

	const screenOptions: ExtendedStackNavigationOptions = {
		headerShadowVisible: false,
		headerStyle: { backgroundColor: colors.background },
		headerTintColor: colors.foreground,
		headerTitleStyle: { fontFamily: 'urbanist-bold' },
		headerBackButtonDisplayMode: 'generic',
		headerTitleAlign: 'center',
		contentStyle: { backgroundColor: colors.background },
	}

	return (
		<Stack screenOptions={screenOptions}>
			<Stack.Screen name="index" />
			<Stack.Screen name="me" options={{ presentation: 'modal' }} />
			<Stack.Screen name="cities/index" />
			<Stack.Screen name="cities/add" />
			<Stack.Screen name="cities/edit/[id]" />
			<Stack.Screen name="publishers/index" />
			<Stack.Screen name="publishers/review" />
			<Stack.Screen name="publishers/edit/[id]" />
			<Stack.Screen name="my-assignments/index" />
			<Stack.Screen name="my-assignments/group/[group_code]/index" />
			<Stack.Screen
				name="my-assignments/[id]"
				options={{ presentation: 'modal', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }}
			/>
			<Stack.Screen name="my-assignments/finish" options={{ presentation: 'modal' }} />
			<Stack.Screen name="maps/index" />
			<Stack.Screen name="maps/add" />
			<Stack.Screen name="maps/options" options={{ presentation: 'modal' }} />
			<Stack.Screen name="maps/group/[group_code]/index" />
			<Stack.Screen name="maps/[id]/index" options={{ headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
			<Stack.Screen name="maps/[id]/edit/index" />
			<Stack.Screen name="export/index" />
		</Stack>
	)
}
