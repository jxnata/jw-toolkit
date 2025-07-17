import '../../global.css'

import { fonts } from '@/constants/fonts'
import { configToast } from '@/constants/toast'
import { SessionProvider } from '@/contexts/session'
import { ThemeProvider } from '@/contexts/theme'
import { clientPersister } from '@/database/cache/provider'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import Constants from 'expo-constants'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect } from 'react'
import { Platform, useColorScheme } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

if (__DEV__) require('../../reactotron')

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function Layout() {
	const scheme = useColorScheme()
	const [isLoaded] = useFonts(fonts)
	const config = configToast(scheme || 'light')

	const handleOnLayout = useCallback(async () => {
		if (isLoaded) await SplashScreen.hideAsync()
	}, [isLoaded])

	useEffect(() => {
		OneSignal.initialize(Constants.expoConfig!.extra!.oneSignalAppId)
		OneSignal.Notifications.requestPermission(true)
		if (Platform.OS === 'android') {
			GoogleSignin.configure({
				webClientId: '561014260561-1hiq7gqjerul4lmhdl8lqpth3bs50ktk.apps.googleusercontent.com',
				offlineAccess: true,
			})
		}

		// @ts-ignore
		globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true
	}, [])

	if (!isLoaded) return null

	return (
		<SafeAreaProvider onLayout={handleOnLayout}>
			<PersistQueryClientProvider client={queryClient} persistOptions={{ persister: clientPersister }}>
				<SessionProvider>
					<ThemeProvider>
						<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
						<Slot />
					</ThemeProvider>
				</SessionProvider>
			</PersistQueryClientProvider>
			<Toast position='bottom' config={config} />
		</SafeAreaProvider>
	)
}
