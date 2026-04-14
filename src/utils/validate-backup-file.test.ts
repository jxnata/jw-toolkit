import { validateBackupFile } from './validate-backup-file'

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
})
