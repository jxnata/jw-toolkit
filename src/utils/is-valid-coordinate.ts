export const isValidCoordinate = (latitude: unknown, longitude: unknown): boolean => {
	if (typeof latitude !== 'number' || typeof longitude !== 'number') return false
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false

	return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
}
