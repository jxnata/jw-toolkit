import { getBadgeColor } from './get-badge-color'

describe('getBadgeColor', () => {
	it('returns bg-primary for estudante tag', () => {
		expect(getBadgeColor('estudante')).toBe('bg-primary')
	})

	it('returns bg-border for mudou-se tag', () => {
		expect(getBadgeColor('mudou-se')).toBe('bg-border')
	})

	it('returns bg-danger-500 for nao-visitar tag', () => {
		expect(getBadgeColor('nao-visitar')).toBe('bg-danger-500')
	})

	it('returns bg-border as fallback for unknown tags', () => {
		expect(getBadgeColor('unknown-tag')).toBe('bg-border')
	})

	it('returns bg-border as fallback for empty string', () => {
		expect(getBadgeColor('')).toBe('bg-border')
	})
})
