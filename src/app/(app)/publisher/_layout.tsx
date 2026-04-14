import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack } from 'expo-router'
import { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient'

export default function PublisherLayout() {
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

	return (
		<Stack screenOptions={screenOptions}>
			<Stack.Screen name="index" />
			<Stack.Screen name="me" options={{ presentation: 'modal' }} />
			<Stack.Screen
				name="assignment/[id]"
				options={{ presentation: 'modal', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }}
			/>
			<Stack.Screen
				name="assignment/finish"
				options={{ presentation: 'modal', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }}
			/>
		</Stack>
	)
}
