import { Map as MapInterface } from '@/interfaces'
import { buildMapPdfHtml, mapPdfFileName } from './map-pdf'

jest.mock('expo-application', () => ({ nativeApplicationVersion: '1.0.0' }))

const makeMap = (overrides: Partial<Record<string, unknown>> = {}): MapInterface =>
	({
		id: 'm1',
		name: 'Casa 12',
		address: 'Rua A, 100',
		district: 'Centro',
		details: null,
		lat: -23.5,
		lng: -46.6,
		tag: null,
		group_code: null,
		visited: null,
		visited_by: null,
		found: null,
		found_info: null,
		city: { id: 'c1', name: 'Campinas' },
		assigned: null,
		...overrides,
	}) as unknown as MapInterface

describe('buildMapPdfHtml', () => {
	it('includes title, congregation, address, district and Google Maps link', () => {
		const html = buildMapPdfHtml(makeMap(), 'Congregação Norte')
		expect(html).toContain('Campinas - Casa 12')
		expect(html).toContain('Congregação Norte')
		expect(html).toContain('Rua A, 100')
		expect(html).toContain('Centro')
		expect(html).toContain('https://www.google.com/maps?q=-23.5,-46.6')
		expect(html).toContain('Ainda não visitado')
	})

	it('omits the location link when coordinates are invalid', () => {
		const html = buildMapPdfHtml(makeMap({ lat: Number.NaN, lng: undefined }))
		expect(html).not.toContain('google.com/maps')
		expect(html).not.toContain('Coordenadas')
	})

	it('escapes user content', () => {
		const html = buildMapPdfHtml(makeMap({ details: '<script>alert("x")</script>' }))
		expect(html).not.toContain('<script>')
		expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
	})

	it('shows tag label, group and visit info', () => {
		const html = buildMapPdfHtml(
			makeMap({
				tag: 'estudante',
				group_code: 'ab1',
				visited: Date.UTC(2026, 0, 10, 12),
				visited_by: 'João Silva',
				found: true,
				found_info: 'Atendeu a esposa',
			})
		)
		expect(html).toContain('Estudante')
		expect(html).toContain('AB1')
		expect(html).toContain('Visitado por João Silva em')
		expect(html).toContain('Encontrado - Atendeu a esposa')
	})

	it('shows not found when visited without finding', () => {
		const html = buildMapPdfHtml(makeMap({ visited: Date.UTC(2026, 0, 10, 12), found: false }))
		expect(html).toContain('Não encontrado')
	})
})

describe('mapPdfFileName', () => {
	it('builds a name from city and map name', () => {
		expect(mapPdfFileName(makeMap())).toBe('Mapa Campinas - Casa 12')
	})

	it('replaces characters that are invalid in file names', () => {
		expect(mapPdfFileName(makeMap({ name: 'Casa 1/2', city: null }))).toBe('Mapa Casa 1-2')
	})
})
