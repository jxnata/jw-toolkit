import { isOfflineError } from './is-offline-error'

describe('isOfflineError', () => {
	it('detects queryOnce offline rejection', () => {
		expect(isOfflineError(new Error("We can't run `queryOnce`, because the device is offline."))).toBe(true)
	})

	it('detects queryOnce timeout', () => {
		expect(isOfflineError(new Error('Query timed out'))).toBe(true)
	})

	it('accepts string errors', () => {
		expect(isOfflineError('Query timed out')).toBe(true)
	})

	it('ignores other errors', () => {
		expect(isOfflineError(new Error('Permission denied'))).toBe(false)
		expect(isOfflineError(null)).toBe(false)
		expect(isOfflineError(undefined)).toBe(false)
		expect(isOfflineError({ message: 'Query timed out' })).toBe(false)
	})
})
