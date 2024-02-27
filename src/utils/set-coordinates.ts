import compact from 'lodash/compact';

export const setCoordinates = (text: string): [number, number] => {
	let str = text

	if (text.includes('http')) {
		const pos = text.indexOf('/@')
		str = text.substring(pos)
	}

	const cleaned = str.replace(/[^\d,\-.]/g, '')

	const [latitudeStr = '', longitudeStr = ''] = compact(cleaned.split(','));

	const latitude = parseFloat(latitudeStr.trim()) || 0;
	const longitude = parseFloat(longitudeStr.trim()) || 0;

	return [latitude, longitude]
}
