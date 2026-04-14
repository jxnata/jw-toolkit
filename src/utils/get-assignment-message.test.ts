import { getAssignmentMessage } from './get-assignment-message'

describe('getAssignmentMessage', () => {
	it('returns map-user-expiration format', () => {
		expect(getAssignmentMessage('Map A', 'John', '2026-12-31')).toBe('Map A-John-2026-12-31')
	})

	it('with empty strings returns "--"', () => {
		expect(getAssignmentMessage('', '', '')).toBe('--')
	})
})
