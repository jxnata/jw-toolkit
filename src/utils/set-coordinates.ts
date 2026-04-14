import compact from 'lodash/compact'

export const setCoordinates = (text: string): [number, number] => {
	let str = (text || '').trim()

	if (!str) return [0, 0]

	if (str.includes('http')) {
		const atPos = str.indexOf('/@')
		const qPos = str.indexOf('?q=')

		if (atPos !== -1) {
			str = str.substring(atPos)
		} else if (qPos !== -1) {
			str = str.substring(qPos + 3)
		}
	}

	const cleaned = str.replace(/[^\d,\-.]/g, '')

	// Standard format: -11.2999817,-41.8700088
	const standardMatch = cleaned.match(/^(-?\d+\.\d+),(-?\d+\.\d+)/)
	if (standardMatch) {
		return [parseFloat(standardMatch[1]), parseFloat(standardMatch[2])]
	}

	// Comma-as-decimal format: -11,2999817,-41,8700088
	const commaDecimalMatch = cleaned.match(/^(-?\d+),(\d+),(-?\d+),(\d+)/)
	if (commaDecimalMatch) {
		const lat = parseFloat(`${commaDecimalMatch[1]}.${commaDecimalMatch[2]}`)
		const lng = parseFloat(`${commaDecimalMatch[3]}.${commaDecimalMatch[4]}`)
		if (!isNaN(lat) && !isNaN(lng)) {
			return [lat, lng]
		}
	}

	// Fallback: split by comma (handles integer coords and mixed formats)
	const parts = compact(cleaned.split(','))
	if (parts.length >= 2) {
		const lat = parseFloat(parts[0])
		const lng = parseFloat(parts[1])
		if (!isNaN(lat) && !isNaN(lng)) {
			return [lat, lng]
		}
	}

	return [0, 0]
}
