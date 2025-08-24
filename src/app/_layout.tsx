import { Loading } from '@/components/loading'
import '../../global.css'

import { LimitGuard } from '@/components/limit-guard'
import { ONESIGNAL_APP_ID, REVENUECAT_APPLE_API_KEY, REVENUECAT_GOOGLE_API_KEY } from '@/constants/env'
import { fonts } from '@/constants/fonts'
import { configToast } from '@/constants/toast'
import { LocationProvider } from '@/contexts/location-provider'
import { SessionProvider, useSession } from '@/contexts/session-provider'
import { SubscriptionProvider } from '@/contexts/subscription-provider'
import { ThemeProvider } from '@/contexts/theme-provider'
import { storage } from '@/database'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { Platform, useColorScheme } from 'react-native'
import { useMMKVListener } from 'react-native-mmkv'
import { OneSignal } from 'react-native-onesignal'
import Purchases from 'react-native-purchases'
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
		OneSignal.initialize(ONESIGNAL_APP_ID)
		OneSignal.Notifications.requestPermission(true)

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

	if (!isLoaded) return null

	return (
		<SafeAreaProvider onLayout={handleOnLayout}>
			<QueryClientProvider client={queryClient}>
				<SessionProvider>
					<SubscriptionProvider>
						<LimitGuard checkMaps={false} checkPublishers={false}>
							<ThemeProvider>
								<LocationProvider>
									<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
									<RootNavigator />
								</LocationProvider>
							</ThemeProvider>
						</LimitGuard>
					</SubscriptionProvider>
				</SessionProvider>
			</QueryClientProvider>
			<Toast position='bottom' config={config} />
		</SafeAreaProvider>
	)
}

function RootNavigator() {
	const { loading, current, congregation } = useSession()
	const [initialized, setInitialized] = useState(storage.getBoolean('initialized'))
	const { colors } = useThemedColors()

	useMMKVListener(key => {
		if (key === 'initialized') {
			setInitialized(!!storage.getBoolean('initialized'))
		}
	}, storage)

	if (loading) {
		return <Loading />
	}

	return (
		<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
			{/* <Stack.Protected guard={!initialized}>
				<Stack.Screen name="onboarding" />
			</Stack.Protected> */}

			<Stack.Protected guard={!!current}>
				<Stack.Screen name='(app)' />
			</Stack.Protected>

			<Stack.Screen name='sign-in' />
		</Stack>
	)
}
