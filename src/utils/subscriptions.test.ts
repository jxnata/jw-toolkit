import { identifierToSubscription } from './subscriptions'

describe('identifierToSubscription', () => {
	it("'dev.jxnata.jwtoolkit.monthly' returns 'monthly'", () => {
		expect(identifierToSubscription('dev.jxnata.jwtoolkit.monthly')).toBe('monthly')
	})

	it("'pro:monthly' returns 'monthly'", () => {
		expect(identifierToSubscription('pro:monthly')).toBe('monthly')
	})

	it("'dev.jxnata.jwtoolkit.yearly' returns 'yearly'", () => {
		expect(identifierToSubscription('dev.jxnata.jwtoolkit.yearly')).toBe('yearly')
	})

	it("'pro:yearly' returns 'yearly'", () => {
		expect(identifierToSubscription('pro:yearly')).toBe('yearly')
	})

	it('unknown identifier returns null', () => {
		expect(identifierToSubscription('unknown.product.id')).toBeNull()
	})

	it('empty string returns null', () => {
		expect(identifierToSubscription('')).toBeNull()
	})

	it("uppercase 'PRO:MONTHLY' returns 'monthly' (case-insensitive)", () => {
		expect(identifierToSubscription('PRO:MONTHLY')).toBe('monthly')
	})
})
