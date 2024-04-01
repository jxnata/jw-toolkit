import '../../polyfills'

import { ONESIGNAL_APP_ID } from 'constants/env'
import { fonts } from 'constants/fonts'
import { configToast } from 'constants/toast'
import { SessionProvider } from 'contexts/Auth'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import Reactotron from 'reactotron-react-native'
import mmkvPlugin from 'reactotron-react-native-mmkv'
import { ThemeProvider } from 'styled-components/native'
import { SWRConfig } from 'swr'
import theme from 'themes'

import { storage } from '../database'

if (__DEV__) {
	console.tron = Reactotron.configure({ host: '192.168.0.4' }).useReactNative().use(mmkvPlugin({ storage })).connect()
}

SplashScreen.preventAutoHideAsync()

export default function Layout() {
	const scheme = useColorScheme()
	const [isLoaded] = useFonts(fonts)
	const config = configToast(scheme)

	const handleOnLayout = useCallback(async () => {
		if (isLoaded) await SplashScreen.hideAsync()
	}, [isLoaded])

	useEffect(() => {
		OneSignal.initialize(ONESIGNAL_APP_ID)
		OneSignal.Notifications.requestPermission(true)
	}, [])

	if (!isLoaded) return null

	return (
		<SafeAreaProvider onLayout={handleOnLayout}>
			<SessionProvider>
				<ThemeProvider theme={theme[scheme]}>
					<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
					<SWRConfig>
						<Slot />
					</SWRConfig>
				</ThemeProvider>
			</SessionProvider>
			<Toast position='bottom' config={config} />
		</SafeAreaProvider>
	)
}
