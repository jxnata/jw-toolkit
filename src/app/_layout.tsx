import { fonts } from 'constants/fonts'
import { SessionProvider } from 'contexts/Auth'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import Reactotron from 'reactotron-react-native'
import mmkvPlugin from 'reactotron-react-native-mmkv'
import { ThemeProvider } from 'styled-components/native'
import { dark, light } from 'themes'
import { storage } from '../database'

console.tron = Reactotron.configure({ host: '192.168.0.102' }).useReactNative().use(mmkvPlugin({ storage })).connect()

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
			<SessionProvider>
				<ThemeProvider theme={scheme === 'dark' ? dark : light}>
					<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
					<Slot />
				</ThemeProvider>
			</SessionProvider>
			<Toast position='bottom' />
		</SafeAreaProvider>
	)
}
