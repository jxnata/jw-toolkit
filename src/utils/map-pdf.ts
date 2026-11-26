import { STATUS_NAME } from '@/constants/content'
import { Map } from '@/interfaces'
import { formatDate } from '@/utils/date-format'
import { isValidCoordinate } from '@/utils/is-valid-coordinate'

const escapeHtml = (value: unknown) =>
	String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')

const row = (label: string, value: unknown) => (value ? `<p><span class="label">${label}:</span> ${escapeHtml(value)}</p>` : '')

const visitInfo = (map: Map) => {
	if (!map.visited) return 'Ainda não visitado'

	const by = map.visited_by ? ` por ${map.visited_by}` : ''
	const found = map.found ? `Encontrado${map.found_info ? ` - ${map.found_info}` : ''}` : 'Não encontrado'

	return `Visitado${by} em ${formatDate(map.visited)} (${found})`
}

export const mapPdfFileName = (map: Map) => {
	const title = [map.city?.name, map.name].filter(Boolean).join(' - ') || 'Mapa'
	return `Mapa ${title}`.replace(/[\\/:*?"<>|]/g, '-')
}

export const buildMapPdfHtml = (map: Map, congregationName?: string) => {
	const hasCoordinates = isValidCoordinate(map.lat, map.lng)
	const googleMapsLink = hasCoordinates ? `https://www.google.com/maps?q=${map.lat},${map.lng}` : null
	const tag = map.tag ? STATUS_NAME[map.tag as keyof typeof STATUS_NAME] || map.tag : null
	const title = [map.city?.name, map.name].filter(Boolean).join(' - ')

	return `
		<html>
		<head>
			<meta charset="utf-8" />
			<style>
				body { font-family: Arial, sans-serif; padding: 24px; color: #333; }
				h1 { margin: 0 0 4px; font-size: 22px; }
				.subtitle { margin: 0 0 16px; color: #666; font-size: 14px; }
				.card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; page-break-inside: avoid; }
				.card p { margin: 6px 0; font-size: 14px; color: #444; }
				.label { font-weight: bold; color: #333; }
				.badge { display: inline-block; margin-bottom: 8px; padding: 2px 8px; border-radius: 4px; background: #bf616a; color: #fff; font-size: 12px; font-weight: bold; }
				a { color: #1a73e8; text-decoration: none; word-break: break-all; }
				.footer { margin-top: 16px; font-size: 11px; color: #999; }
			</style>
		</head>
		<body>
			<h1>${escapeHtml(title)}</h1>
			${congregationName ? `<p class="subtitle">${escapeHtml(congregationName)}</p>` : ''}
			<div class="card">
				${tag ? `<span class="badge">${escapeHtml(tag)}</span>` : ''}
				${row('Endereço', map.address)}
				${row('Bairro', map.district)}
				${row('Observações', map.details)}
				${row('Grupo', map.group_code?.toUpperCase())}
				${row('Última visita', visitInfo(map))}
				${hasCoordinates ? row('Coordenadas', `${map.lat}, ${map.lng}`) : ''}
				${googleMapsLink ? `<p><span class="label">Localização:</span> <a href="${googleMapsLink}">${googleMapsLink}</a></p>` : ''}
			</div>
			<p class="footer">Gerado em ${escapeHtml(formatDate(Date.now()))}</p>
		</body>
		</html>
	`
}
