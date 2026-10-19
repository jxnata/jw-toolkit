export const TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY

export const ENCRYPT_STORAGE = process.env.EXPO_PUBLIC_ENCRYPT_STORAGE

export const INSTANT_APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID

export const REVENUECAT_APPLE_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY

export const REVENUECAT_GOOGLE_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY

export const FREE_LIMITS = {
	maps: process.env.EXPO_PUBLIC_LIMIT_MAPS,
	publishers: process.env.EXPO_PUBLIC_LIMIT_PUBLISHERS,
}

/**
 * Serves the InstantDB connection details (appId/apiURI/websocketURI) the app
 * should use, fetched at startup so backend migrations (e.g. selfhosted
 * InstantDB) don't require a store review. See `@/lib/remote-config`.
 */
export const REMOTE_CONFIG_URL = `https://config.jxnata.dev/${__DEV__ ? 'dev' : 'prod'}/lsmaps.json`
