import '../../polyfills'

import { ONESIGNAL_APP_ID } from '@constants/env'
import { fonts } from '@constants/fonts'
import { configToast } from '@constants/toast'
import { SessionProvider } from '@contexts/Auth'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { ThemeProvider } from 'styled-components/native'
import { SWRConfig } from 'swr'
import theme from '@themes/index'
import { QueryClient } from '@tanstack/react-query'
import { clientPersister } from '@database/cache/provider'

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
		OneSignal.initialize(ONESIGNAL_APP_ID)
		OneSignal.Notifications.requestPermission(true)
	}, [])

	if (!isLoaded) return null

	return (
		<SafeAreaProvider onLayout={handleOnLayout}>
			<PersistQueryClientProvider client={queryClient} persistOptions={{ persister: clientPersister }}>
				<SessionProvider>
					<ThemeProvider theme={theme[scheme || 'light']}>
						<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
						<SWRConfig>
							<Slot />
						</SWRConfig>
					</ThemeProvider>
				</SessionProvider>
			</PersistQueryClientProvider>
			<Toast position='bottom' config={config} />
		</SafeAreaProvider>
	)
}
