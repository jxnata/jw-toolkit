import { isPendingPublisher } from './is-pending-publisher'

const congregation = { id: 'cong-1' }

describe('isPendingPublisher', () => {
	it('returns true for a publisher not approved yet', () => {
		expect(isPendingPublisher({ level: 3, approved: false, congregation })).toBe(true)
	})

	it('returns true when approved is missing', () => {
		expect(isPendingPublisher({ level: 3, congregation })).toBe(true)
		expect(isPendingPublisher({ level: 3, approved: null, congregation })).toBe(true)
	})

	it('returns false for an approved publisher', () => {
		expect(isPendingPublisher({ level: 3, approved: true, congregation })).toBe(false)
	})

	it('returns false for admins, even without approved', () => {
		expect(isPendingPublisher({ level: 1, congregation })).toBe(false)
		expect(isPendingPublisher({ level: 1, approved: false, congregation })).toBe(false)
	})

	it('returns false without a congregation', () => {
		expect(isPendingPublisher({ level: 3, approved: false })).toBe(false)
		expect(isPendingPublisher({ level: 3, approved: false, congregation: null })).toBe(false)
	})

	it('returns false without a publisher', () => {
		expect(isPendingPublisher(null)).toBe(false)
		expect(isPendingPublisher(undefined)).toBe(false)
	})
})
