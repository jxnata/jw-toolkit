import { formatVisitResult } from './format-visit-result'

describe('formatVisitResult', () => {
	it('found without info', () => {
		expect(formatVisitResult(true, null)).toBe('Encontrado')
	})

	it('found with info', () => {
		expect(formatVisitResult(true, 'Encontrou o surdo')).toBe('Encontrado - Encontrou o surdo')
	})

	it('not found without reason', () => {
		expect(formatVisitResult(false, undefined)).toBe('Não encontrado')
	})

	it('not found with a known reason', () => {
		expect(formatVisitResult(false, 'Mudou-se')).toBe('Não encontrado - Mudou-se')
	})

	it('not found ignores a stale found info from a previous visit', () => {
		expect(formatVisitResult(false, 'Encontrou o surdo')).toBe('Não encontrado')
	})

	it('missing found flag is treated as not found', () => {
		expect(formatVisitResult(null, 'Faleceu')).toBe('Não encontrado - Faleceu')
	})
})
