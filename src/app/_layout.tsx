import { fonts } from 'constants/fonts'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router/stack'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'styled-components/native'
import { dark, light } from 'themes'

SplashScreen.preventAutoHideAsync()

export default function Layout() {
	const scheme = useColorScheme()
	const [isLoaded] = useFonts(fonts)

	const handleOnLayout = useCallback(async () => {
		if (isLoaded) await SplashScreen.hideAsync()
	}, [isLoaded])

	if (!isLoaded) return null

	return (
		<SafeAreaProvider onLayout={handleOnLayout}>
			<ThemeProvider theme={scheme === 'dark' ? dark : light}>
				<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
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
				/>
			</ThemeProvider>
		</SafeAreaProvider>
	)
}
