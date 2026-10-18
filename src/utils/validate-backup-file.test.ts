import { INVALID_BACKUP_MESSAGE, parseBackupFile, validateBackupFile } from './validate-backup-file'

const validBackup = {
	version: '1.0',
	congregation_id: 'cong-123',
	created_at: '2026-01-01T00:00:00Z',
	cities: [{ id: 'city-1', name: 'Springfield' }],
	maps: [{ id: 'map-1', name: 'Map A', address: '123 Main St', district: 'D1', city_id: 'city-1' }],
}

describe('validateBackupFile', () => {
	it('valid BackupData object returns true', () => {
		expect(validateBackupFile(validBackup)).toBe(true)
	})

	it('null input returns false', () => {
		expect(validateBackupFile(null)).toBe(false)
	})

	it('string input returns false', () => {
		expect(validateBackupFile('backup')).toBe(false)
	})

	it('number input returns false', () => {
		expect(validateBackupFile(42)).toBe(false)
	})

	it('missing congregation_id field returns false', () => {
		const { congregation_id: _, ...rest } = validBackup
		expect(validateBackupFile(rest)).toBe(false)
	})

	it('congregation_id as non-string returns false', () => {
		expect(validateBackupFile({ ...validBackup, congregation_id: 123 })).toBe(false)
	})

	it('missing version field returns false', () => {
		const { version: _, ...rest } = validBackup
		expect(validateBackupFile(rest)).toBe(false)
	})

	it('missing cities array returns false', () => {
		const { cities: _, ...rest } = validBackup
		expect(validateBackupFile(rest)).toBe(false)
	})

	it('cities containing a non-object entry returns false', () => {
		expect(validateBackupFile({ ...validBackup, cities: ['not-an-object'] })).toBe(false)
	})

	it('city with missing id returns false', () => {
		expect(validateBackupFile({ ...validBackup, cities: [{ name: 'Springfield' }] })).toBe(false)
	})

	it('city with missing name returns false', () => {
		expect(validateBackupFile({ ...validBackup, cities: [{ id: 'city-1' }] })).toBe(false)
	})

	it('missing maps array returns false', () => {
		const { maps: _, ...rest } = validBackup
		expect(validateBackupFile(rest)).toBe(false)
	})

	it('map with missing id returns false', () => {
		const badMap = { name: 'Map A', address: '123 Main St', city_id: 'city-1' }
		expect(validateBackupFile({ ...validBackup, maps: [badMap] })).toBe(false)
	})

	it('map with missing city_id returns false', () => {
		const badMap = { id: 'map-1', name: 'Map A', address: '123 Main St' }
		expect(validateBackupFile({ ...validBackup, maps: [badMap] })).toBe(false)
	})

	it('map with missing name returns false', () => {
		const badMap = { id: 'map-1', address: '123 Main St', city_id: 'city-1' }
		expect(validateBackupFile({ ...validBackup, maps: [badMap] })).toBe(false)
	})

	it('map with missing address returns false', () => {
		const badMap = { id: 'map-1', name: 'Map A', city_id: 'city-1' }
		expect(validateBackupFile({ ...validBackup, maps: [badMap] })).toBe(false)
	})

	it('empty cities and maps arrays returns true (valid empty backup)', () => {
		expect(validateBackupFile({ ...validBackup, cities: [], maps: [] })).toBe(true)
	})

	it('accepts any 1.x version', () => {
		expect(validateBackupFile({ ...validBackup, version: '1.1' })).toBe(true)
		expect(validateBackupFile({ ...validBackup, version: '1.9' })).toBe(true)
	})

	it('rejects an unsupported major version', () => {
		expect(validateBackupFile({ ...validBackup, version: '2.0' })).toBe(false)
		expect(validateBackupFile({ ...validBackup, version: 'abc' })).toBe(false)
	})

	it('accepts v1.1 districts', () => {
		const districts = [{ id: 'd1', name: 'Centro', city_id: 'city-1' }]
		expect(validateBackupFile({ ...validBackup, version: '1.1', districts })).toBe(true)
	})

	it('districts that is not an array returns false', () => {
		expect(validateBackupFile({ ...validBackup, districts: {} })).toBe(false)
	})

	it('district with missing city_id returns false', () => {
		expect(validateBackupFile({ ...validBackup, districts: [{ id: 'd1', name: 'Centro' }] })).toBe(false)
	})

	it('accepts maps with every optional field filled or null', () => {
		const full = {
			...validBackup.maps[0],
			details: 'x',
			lat: -23.5,
			lng: -46.6,
			tag: 't',
			group_code: 'g',
			found: true,
			found_info: 'fi',
			visited: '2026-01-01T00:00:00.000Z',
			visited_by: 'Ana',
		}
		const nulls = {
			...validBackup.maps[0],
			details: null,
			lat: null,
			lng: null,
			tag: null,
			group_code: null,
			found: null,
			found_info: null,
			visited: null,
			visited_by: null,
		}
		expect(validateBackupFile({ ...validBackup, maps: [full, nulls, { ...full, visited: 1700000000000 }] })).toBe(true)
	})

	it.each([
		['lat', '10'],
		['lng', true],
		['details', 1],
		['district', 1],
		['tag', {}],
		['group_code', []],
		['found', 'yes'],
		['found_info', 1],
		['visited', true],
		['visited_by', 1],
	])('map with invalid %s type returns false', (field, value) => {
		expect(validateBackupFile({ ...validBackup, maps: [{ ...validBackup.maps[0], [field]: value }] })).toBe(false)
	})
})

describe('parseBackupFile', () => {
	it('parses a valid backup and defaults districts to an empty array', () => {
		const result = parseBackupFile(JSON.stringify(validBackup))
		expect(result).toEqual({ ...validBackup, districts: [] })
	})

	it('keeps districts when present', () => {
		const districts = [{ id: 'd1', name: 'Centro', city_id: 'city-1' }]
		expect(parseBackupFile(JSON.stringify({ ...validBackup, districts })).districts).toEqual(districts)
	})

	it('throws a user-facing message for malformed JSON', () => {
		expect(() => parseBackupFile('{not json')).toThrow(INVALID_BACKUP_MESSAGE)
	})

	it('throws a user-facing message for JSON that is not a backup', () => {
		expect(() => parseBackupFile('{"foo": 1}')).toThrow(INVALID_BACKUP_MESSAGE)
	})
})
