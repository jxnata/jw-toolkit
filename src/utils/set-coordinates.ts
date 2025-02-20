import compact from 'lodash/compact'

export const setCoordinates = (text: string): [number, number] => {
	let str = text || '0,0'

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

	const [latitudeStr = '', longitudeStr = ''] = compact(cleaned.split(','))

	const latitude = parseFloat(latitudeStr.trim()) || 0
	const longitude = parseFloat(longitudeStr.trim()) || 0

	return [latitude, longitude]
}
