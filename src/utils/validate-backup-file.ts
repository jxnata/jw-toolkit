import { BackupData } from '@/interfaces'

export function validateBackupFile(data: unknown): data is BackupData {
	if (!data || typeof data !== 'object') return false
	const d = data as Record<string, unknown>
	if (typeof d.congregation_id !== 'string') return false
	if (typeof d.version !== 'string') return false
	if (!Array.isArray(d.cities)) return false
	if (!Array.isArray(d.maps)) return false
	for (const city of d.cities) {
		if (!city || typeof city !== 'object') return false
		if (typeof city.id !== 'string' || typeof city.name !== 'string') return false
	}
	for (const map of d.maps) {
		if (!map || typeof map !== 'object') return false
		if (
			typeof map.id !== 'string' ||
			typeof map.city_id !== 'string' ||
			typeof map.name !== 'string' ||
			typeof map.address !== 'string'
		)
			return false
	}
	return true
}
