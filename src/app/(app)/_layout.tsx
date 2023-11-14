import { useSession } from 'contexts/Auth'
import { Redirect, Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { dark, light } from 'themes'

export default function Layout() {
	const scheme = useColorScheme()
	const { session } = useSession()

	if (!session) {
		return <Redirect href='/sign-in' />
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
		</Stack>
	)
}
