export const formatDate = (timestamp: string | number) => {
	const date = new Date(timestamp)

	return date.toLocaleDateString()
}
