import { storage } from '@/database'
import * as Sentry from '@sentry/react-native'
import { fetchRemoteConfig, resolveInstantConfig } from './remote-config'

jest.mock('@sentry/react-native', () => ({
	captureException: jest.fn(),
	addBreadcrumb: jest.fn(),
}))

jest.mock('@/database', () => ({
	storage: { getString: jest.fn(), set: jest.fn() },
}))

jest.mock('@/constants/env', () => ({
	INSTANT_APP_ID: 'build-time-app',
	REMOTE_CONFIG_URL: 'https://config.example/lsmaps.json',
}))

const mockCaptureException = Sentry.captureException as jest.Mock
const mockAddBreadcrumb = Sentry.addBreadcrumb as jest.Mock
const mockGetString = storage.getString as jest.Mock
const mockSet = storage.set as jest.Mock
const mockFetch = jest.fn()

function respond(status: number, body: string) {
	mockFetch.mockResolvedValueOnce({ ok: status >= 200 && status < 300, status, text: async () => body })
}

beforeEach(() => {
	jest.clearAllMocks()
	globalThis.fetch = mockFetch as unknown as typeof fetch
})

describe('fetchRemoteConfig', () => {
	it('caches a valid config', async () => {
		respond(200, JSON.stringify({ version: 2, backend: 'cloud', appId: 'app-123' }))

		await fetchRemoteConfig()

		expect(mockSet).toHaveBeenCalledWith('remote_config', expect.stringContaining('"appId":"app-123"'))
		expect(mockCaptureException).not.toHaveBeenCalled()
	})

	it.each([
		['a canceled request', 'fetch failed: Fetch request has been canceled'],
		['an offline device', 'fetch failed: UnexpectedException: The Internet connection appears to be offline.'],
	])('leaves a breadcrumb instead of reporting %s', async (_label, message) => {
		mockFetch.mockRejectedValueOnce(new Error(message))

		await expect(fetchRemoteConfig()).resolves.toBeUndefined()

		expect(mockCaptureException).not.toHaveBeenCalled()
		expect(mockAddBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({ category: 'remote-config-fetch' }))
		expect(mockSet).not.toHaveBeenCalled()
	})

	it('does not report a 504 from the config host', async () => {
		respond(504, 'Gateway Timeout')

		await fetchRemoteConfig()

		expect(mockCaptureException).not.toHaveBeenCalled()
		expect(mockAddBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({ data: { status: 504 } }))
		expect(mockSet).not.toHaveBeenCalled()
	})

	it('does not report an empty body', async () => {
		respond(200, '')

		await fetchRemoteConfig()

		expect(mockCaptureException).not.toHaveBeenCalled()
		expect(mockAddBreadcrumb).toHaveBeenCalled()
		expect(mockSet).not.toHaveBeenCalled()
	})

	it('does not report a body cut off mid-read', async () => {
		mockFetch.mockResolvedValueOnce({ ok: true, status: 200, text: jest.fn().mockRejectedValue(new Error('fetch failed')) })

		await fetchRemoteConfig()

		expect(mockCaptureException).not.toHaveBeenCalled()
		expect(mockSet).not.toHaveBeenCalled()
	})

	it.each([
		['a 404', 404, 'Not Found'],
		['a config without appId', 200, JSON.stringify({ version: 1 })],
		['a non-JSON body', 200, '<html></html>'],
	])('still reports %s', async (_label, status, body) => {
		respond(status, body)

		await fetchRemoteConfig()

		expect(mockCaptureException).toHaveBeenCalledWith(expect.any(Error), { tags: { context: 'remote-config-fetch' } })
		expect(mockSet).not.toHaveBeenCalled()
	})
})

describe('resolveInstantConfig', () => {
	it('uses the cached remote config', () => {
		mockGetString.mockReturnValueOnce(
			JSON.stringify({ appId: 'remote-app', apiURI: 'https://db.example', websocketURI: 'wss://db.example/runtime/session' })
		)

		expect(resolveInstantConfig()).toEqual({
			appId: 'remote-app',
			apiURI: 'https://db.example',
			websocketURI: 'wss://db.example/runtime/session',
		})
	})

	it('falls back to the build-time appId without a cache', () => {
		mockGetString.mockReturnValueOnce(undefined)

		expect(resolveInstantConfig()).toEqual({ appId: 'build-time-app' })
	})
})
