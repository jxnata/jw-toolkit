import { Loading } from '@/components/loading'
import { LimitGuard } from '@/components/limit-guard'
import { LocationProvider } from '@/contexts/location-provider'
import { SessionProvider, useSession } from '@/contexts/session-provider'
import { SubscriptionProvider } from '@/contexts/subscription-provider'
import { ThemeProvider } from '@/contexts/theme-provider'
import { storage } from '@/database'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { useMMKVListener } from 'react-native-mmkv'

/**
 * Everything below the root layout that reaches `@/lib/db`. Loaded lazily by
 * the root layout so InstantDB's `init()` only runs after the remote config
 * has been fetched.
 */
export default function AppRoot() {
	const scheme = useColorScheme()

	return (
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
	)
}

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
