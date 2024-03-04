export const getExpiration = (minutes: number) => {
	const currentDate = new Date()

	const futureDate = new Date(currentDate.getTime() + minutes * 60 * 1000)

	const timestamp = futureDate.getTime()

	return timestamp
}
