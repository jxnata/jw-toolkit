export const setCoordinates = (text: string) => {
	const cleaned = text.replace(/[^\d,\-.]/g, '')

	const [latitudeStr = '', longitudeStr = ''] = cleaned.split(',');

	const latitude = parseFloat(latitudeStr.trim()) || 0;
	const longitude = parseFloat(longitudeStr.trim()) || 0;

	return [latitude, longitude]
}
