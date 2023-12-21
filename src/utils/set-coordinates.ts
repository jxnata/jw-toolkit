export const setCoordinates = (text: string) => {
	const [latitudeStr = '', longitudeStr = ''] = text.split(',');

	const latitude = parseFloat(latitudeStr.trim()) || 0;
	const longitude = parseFloat(longitudeStr.trim()) || 0;

	return [latitude, longitude]
}
