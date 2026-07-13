import '../../global.css'
import { Loading } from '@/components/loading'

import { LimitGuard } from '@/components/limit-guard'
import { REVENUECAT_APPLE_API_KEY, REVENUECAT_GOOGLE_API_KEY } from '@/constants/env'
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
import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { Platform, useColorScheme } from 'react-native'
import { useMMKVListener } from 'react-native-mmkv'
import Purchases from 'react-native-purchases'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import * as Sentry from '@sentry/react-native';

Sentry.init({
	dsn: 'https://b3f1252c3b65e3b3b3d1117702468e2b@o4511332744953856.ingest.us.sentry.io/4511726084161536',
	sendDefaultPii: true,
	enabled: !__DEV__,
});

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

function Layout() {
	const scheme = useColorScheme()
	const [isLoaded] = useFonts(fonts)
	const config = configToast()

	const handleOnLayout = async () => {
		if (isLoaded) await SplashScreen.hideAsync()
	}

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

	if (!isLoaded) return null

	return (
		<SafeAreaProvider onLayout={handleOnLayout}>
			<QueryClientProvider client={queryClient}>
				<SessionProvider>
					<SubscriptionProvider>
						<LimitGuard checkMaps={false} checkPublishers={false}>
							<LocationProvider>
								<ThemeProvider>
									<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
									<RootNavigator />
								</ThemeProvider>
							</LocationProvider>
						</LimitGuard>
					</SubscriptionProvider>
				</SessionProvider>
			</QueryClientProvider>
			<Toast position="bottom" config={config} />
		</SafeAreaProvider>
	)
}

export default Sentry.wrap(Layout)

function RootNavigator() {
	const { loading, current } = useSession()
	const [, setInitialized] = useState(storage.getBoolean('initialized'))
	const { colors } = useThemedColors()
	const scheme = useColorScheme()

	useMMKVListener((key) => {
		if (key === 'initialized') {
			setInitialized(!!storage.getBoolean('initialized'))
		}
	}, storage)

	if (loading) {
		return <Loading />
	}

	const navigationTheme = {
		...(scheme === 'dark' ? DarkTheme : DefaultTheme),
		colors: {
			...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
			primary: colors.primary[600],
			background: colors.background,
			card: colors.card,
			text: colors.foreground,
			border: colors.border,
		},
	}

	return (
		<NavigationThemeProvider value={navigationTheme}>
			<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
				{/* <Stack.Protected guard={!initialized}>
					<Stack.Screen name="onboarding" />
				</Stack.Protected> */}

				<Stack.Protected guard={!!current}>
					<Stack.Screen name="(app)" />
				</Stack.Protected>

				<Stack.Screen name="sign-in" />
			</Stack>
		</NavigationThemeProvider>
	)
}
