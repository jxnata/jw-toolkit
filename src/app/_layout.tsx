import '../../global.css'
import { Loading } from '@/components/loading'

import { REVENUECAT_APPLE_API_KEY, REVENUECAT_GOOGLE_API_KEY } from '@/constants/env'
import { fonts } from '@/constants/fonts'
import { configToast } from '@/constants/toast'
import { fetchRemoteConfig } from '@/lib/remote-config'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import Purchases from 'react-native-purchases'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import * as Sentry from '@sentry/react-native';

// Lazy so the module (and with it `@/lib/db`, which calls InstantDB's `init()`
// at import time) is only evaluated once the remote config gate below has
// resolved — never before it.
const AppRoot = lazy(() => import('@/components/root-navigator'))

Sentry.init({
	dsn: 'https://b3f1252c3b65e3b3b3d1117702468e2b@o4511332744953856.ingest.us.sentry.io/4511726084161536',
	sendDefaultPii: true,
	enabled: !__DEV__,
});

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

function Layout() {
	const [isLoaded] = useFonts(fonts)
	const [configReady, setConfigReady] = useState(false)
	const config = configToast()

	const handleOnLayout = async () => {
		if (isLoaded && configReady) await SplashScreen.hideAsync()
	}

	useEffect(() => {
		fetchRemoteConfig().finally(() => setConfigReady(true))
	}, [])

	useEffect(() => {
		Purchases.setLogLevel(Purchases.LOG_LEVEL.ERROR)
		if (Platform.OS === 'ios') {
			Purchases.configure({ apiKey: REVENUECAT_APPLE_API_KEY })
		} else if (Platform.OS === 'android') {
			Purchases.configure({ apiKey: REVENUECAT_GOOGLE_API_KEY })

			GoogleSignin.configure({
				webClientId: '561014260561-1hiq7gqjerul4lmhdl8lqpth3bs50ktk.apps.googleusercontent.com',
				offlineAccess: true,
			})
		}

		// @ts-ignore
		globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true
	}, [])

	if (!isLoaded || !configReady) return null

	return (
		<SafeAreaProvider onLayout={handleOnLayout}>
			<QueryClientProvider client={queryClient}>
				<Suspense fallback={<Loading />}>
					<AppRoot />
				</Suspense>
			</QueryClientProvider>
			<Toast position="bottom" config={config} />
		</SafeAreaProvider>
	)
}

export default Sentry.wrap(Layout)
