import { BackupData } from '@/interfaces'

export const BACKUP_VERSION = '1.1'
export const INVALID_BACKUP_MESSAGE = 'Arquivo de backup inválido'

// Any 1.x file can be restored; a new major version means an incompatible format
const SUPPORTED_VERSION = /^1\.\d+$/

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object'

const isOptional = (value: unknown, type: 'string' | 'number' | 'boolean') => value === undefined || value === null || typeof value === type

export function validateBackupFile(data: unknown): data is BackupData {
	if (!isObject(data)) return false
	if (typeof data.congregation_id !== 'string') return false
	if (typeof data.version !== 'string' || !SUPPORTED_VERSION.test(data.version)) return false
	if (!Array.isArray(data.cities)) return false
	if (!Array.isArray(data.maps)) return false
	if (data.districts !== undefined && !Array.isArray(data.districts)) return false

	for (const city of data.cities) {
		if (!isObject(city)) return false
		if (typeof city.id !== 'string' || typeof city.name !== 'string') return false
	}

	for (const district of data.districts ?? []) {
		if (!isObject(district)) return false
		if (typeof district.id !== 'string' || typeof district.name !== 'string' || typeof district.city_id !== 'string') return false
	}

	for (const map of data.maps) {
		if (!isObject(map)) return false
		if (
			typeof map.id !== 'string' ||
			typeof map.city_id !== 'string' ||
			typeof map.name !== 'string' ||
			typeof map.address !== 'string'
		)
			return false
		if (
			!isOptional(map.details, 'string') ||
			!isOptional(map.district, 'string') ||
			!isOptional(map.lat, 'number') ||
			!isOptional(map.lng, 'number') ||
			!isOptional(map.tag, 'string') ||
			!isOptional(map.group_code, 'string') ||
			!isOptional(map.found, 'boolean') ||
			!isOptional(map.found_info, 'string') ||
			!isOptional(map.visited_by, 'string')
		)
			return false
		if (!isOptional(map.visited, 'string') && typeof map.visited !== 'number') return false
	}

	return true
}

// Parses the raw file content, throwing a user-facing message for anything that is not a valid backup
export function parseBackupFile(raw: string): BackupData {
	let parsed: unknown
	try {
		parsed = JSON.parse(raw)
	} catch {
		throw new Error(INVALID_BACKUP_MESSAGE)
	}

	if (!validateBackupFile(parsed)) {
		throw new Error(INVALID_BACKUP_MESSAGE)
	}

	return { ...parsed, districts: parsed.districts ?? [] }
}
