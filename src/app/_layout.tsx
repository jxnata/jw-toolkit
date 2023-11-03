import { Stack } from 'expo-router/stack'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'styled-components/native'
import { dark, light } from 'themes'

export default function Layout() {
	const scheme = useColorScheme()

	return (
		<SafeAreaProvider>
			<ThemeProvider theme={scheme === 'dark' ? dark : light}>
				<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
				<Stack
					screenOptions={{
						headerTransparent: true,
						headerTintColor: { dark, light }[scheme].text,
						headerTitleStyle: { fontWeight: 'bold' },
					}}
				/>
			</ThemeProvider>
		</SafeAreaProvider>
	)
}
