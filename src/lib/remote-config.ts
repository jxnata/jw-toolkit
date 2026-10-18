import { INSTANT_APP_ID, REMOTE_CONFIG_URL } from '@/constants/env'
import { storage } from '@/database'
import * as Sentry from '@sentry/react-native'

const STORAGE_KEY = 'remote_config'
const FETCH_TIMEOUT_MS = 2500

export interface RemoteConfig {
	version: number
	backend: string
	appId: string
	apiURI?: string
	websocketURI?: string
	message?: string
}

/**
 * Only the fields the InstantDB client actually accepts, resolved from the
 * cached remote config or the build-time default.
 */
export interface InstantConfig {
	appId: string
	apiURI?: string
	websocketURI?: string
}

function parseRemoteConfig(raw: unknown): RemoteConfig | null {
	if (!raw || typeof raw !== 'object') return null

	const data = raw as Record<string, unknown>
	if (typeof data.appId !== 'string' || data.appId.length === 0) return null

	return {
		version: typeof data.version === 'number' ? data.version : 0,
		backend: typeof data.backend === 'string' ? data.backend : 'cloud',
		appId: data.appId,
		apiURI: typeof data.apiURI === 'string' ? data.apiURI : undefined,
		websocketURI: typeof data.websocketURI === 'string' ? data.websocketURI : undefined,
		message: typeof data.message === 'string' ? data.message : undefined,
	}
}

export function getCachedConfig(): RemoteConfig | null {
	try {
		const raw = storage.getString(STORAGE_KEY)
		if (!raw) return null
		return parseRemoteConfig(JSON.parse(raw))
	} catch (error) {
		Sentry.captureException(error, { tags: { context: 'remote-config-cache' } })
		return null
	}
}

/**
 * Connectivity noise: the device is offline, the request outlived our own
 * timeout (the abort surfaces as "Fetch request has been canceled"), or the
 * config host answered with a 5xx / an empty body. None of it is actionable
 * and the app already falls back to the cached config, so it only leaves a
 * breadcrumb instead of opening a Sentry issue.
 */
function skipRemoteConfig(reason: string, data?: Record<string, unknown>): void {
	Sentry.addBreadcrumb({ category: 'remote-config-fetch', message: reason, level: 'warning', data })
}

/**
 * Fetches the connection config the app should use for InstantDB and caches
 * it locally. Never rejects: the boot sequence awaits this, so any failure
 * (network, timeout, malformed response) is swallowed, leaving the previously
 * cached config (or the build-time default) in place. Only unexpected
 * failures (4xx, a body that isn't a valid config) are reported to Sentry.
 */
export async function fetchRemoteConfig(): Promise<void> {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

	try {
		let response: Response
		let body: string
		try {
			response = await fetch(REMOTE_CONFIG_URL, { signal: controller.signal })
			// Read inside the same guard: the body can still be cut off by the timeout or a dropped connection.
			body = await response.text()
		} catch (error) {
			skipRemoteConfig('Remote config request did not complete', { error: `${error}` })
			return
		}

		if (response.status >= 500) {
			skipRemoteConfig('Remote config host unavailable', { status: response.status })
			return
		}
		if (!response.ok) throw new Error(`Remote config request failed with status ${response.status}`)

		if (body.trim().length === 0) {
			skipRemoteConfig('Remote config response was empty', { status: response.status })
			return
		}

		const config = parseRemoteConfig(JSON.parse(body))
		if (!config) throw new Error('Remote config response is missing a valid appId')

		storage.set(STORAGE_KEY, JSON.stringify(config))
	} catch (error) {
		Sentry.captureException(error, { tags: { context: 'remote-config-fetch' } })
	} finally {
		clearTimeout(timeout)
	}
}

/**
 * Resolves the config InstantDB should initialize with: the cached remote
 * config when available, otherwise the build-time default appId with no
 * custom apiURI/websocketURI (i.e. InstantDB's own cloud).
 */
export function resolveInstantConfig(): InstantConfig {
	const cached = getCachedConfig()
	if (cached) {
		return { appId: cached.appId, apiURI: cached.apiURI, websocketURI: cached.websocketURI }
	}

	return { appId: INSTANT_APP_ID! }
}
