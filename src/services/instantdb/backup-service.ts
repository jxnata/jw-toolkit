import { BackupData, RestoreResult } from '@/interfaces'
import db from '@/lib/db'
import { BACKUP_VERSION } from '@/utils/validate-backup-file'
import { id } from '@instantdb/react-native'

const BATCH_LIMIT = 25

export type RestoreStep = 'cities' | 'districts' | 'maps' | 'phones' | 'cleanup'

export type RestoreProgress = (step: RestoreStep, done: number, total: number) => void

export const CLEANUP_FAILED_MESSAGE =
	'O backup foi restaurado, mas não foi possível remover todos os dados antigos. Verifique se há mapas duplicados.'

class BackupService {
	async fetchBackupData(congregationId: string): Promise<BackupData> {
		const { data } = await db.queryOnce({
			cities: {
				$: { where: { congregation: congregationId } },
			},
			districts: {
				$: { where: { 'city.congregation': congregationId } },
				city: {},
			},
			maps: {
				$: { where: { congregation: congregationId } },
				city: {},
			},
			phones: {
				$: { where: { congregation: congregationId } },
			},
		})

		const cities = (data.cities || []).map((city) => ({
			id: city.id,
			name: city.name,
		}))

		const districts = (data.districts || []).map((district) => ({
			id: district.id,
			name: district.name,
			city_id: district.city?.id ?? '',
		}))

		const maps = (data.maps || []).map((map) => ({
			id: map.id,
			name: map.name,
			address: map.address,
			details: map.details ?? null,
			district: map.district ?? '',
			lat: map.lat ?? null,
			lng: map.lng ?? null,
			tag: map.tag ?? null,
			group_code: map.group_code ?? null,
			found: map.found ?? null,
			found_info: map.found_info ?? null,
			visited: map.visited ?? null,
			visited_by: map.visited_by ?? null,
			city_id: map.city?.id ?? '',
		}))

		const phones = (data.phones || []).map((phone) => ({
			id: phone.id,
			number: phone.number,
			answered: phone.answered ?? null,
			answered_info: phone.answered_info ?? null,
			called: phone.called ?? null,
			called_by: phone.called_by ?? null,
		}))

		return {
			version: BACKUP_VERSION,
			congregation_id: congregationId,
			created_at: new Date().toISOString(),
			cities,
			districts,
			maps,
			phones,
		}
	}

	// Replaces all cities, districts and maps (and phones, for v1.2+ files) of the congregation with the backup content.
	// Files without a phones section (v1.0/v1.1) leave the current phones untouched.
	// New data is created before the old data is removed, so a failure never leaves the congregation empty.
	async restoreBackup(backup: BackupData, congregationId: string, onProgress?: RestoreProgress): Promise<RestoreResult> {
		const previous = await this.fetchEntityIds(congregationId)

		const createdCityIds: string[] = []
		const createdMapIds: string[] = []
		const createdPhoneIds: string[] = []
		const replacePhones = backup.phones !== undefined
		let result: RestoreResult

		try {
			const cityIdMap = await this.restoreCities(backup.cities, congregationId, createdCityIds, (done, total) =>
				onProgress?.('cities', done, total)
			)
			const districts = await this.restoreDistricts(backup.districts ?? [], cityIdMap, (done, total) =>
				onProgress?.('districts', done, total)
			)
			const maps = await this.restoreMaps(backup.maps, cityIdMap, congregationId, createdMapIds, (done, total) =>
				onProgress?.('maps', done, total)
			)
			const phones = replacePhones
				? await this.restorePhones(backup.phones ?? [], congregationId, createdPhoneIds, (done, total) =>
						onProgress?.('phones', done, total)
					)
				: null

			result = {
				cities: createdCityIds.length,
				districts,
				maps,
				skippedMaps: backup.maps.length - maps,
				phones,
			}
		} catch (error) {
			await this.rollback(createdMapIds, createdCityIds, createdPhoneIds)
			throw error
		}

		try {
			const oldPhoneIds = replacePhones ? previous.phoneIds : []
			const total = previous.mapIds.length + oldPhoneIds.length + previous.cityIds.length
			let removed = 0
			const progress = (done: number) => onProgress?.('cleanup', removed + done, total)
			await this.deleteEntities('maps', previous.mapIds, progress)
			removed += previous.mapIds.length
			await this.deleteEntities('phones', oldPhoneIds, progress)
			removed += oldPhoneIds.length
			// Deleting a city cascades to its districts
			await this.deleteEntities('cities', previous.cityIds, progress)
		} catch {
			throw new Error(CLEANUP_FAILED_MESSAGE)
		}

		return result
	}

	async fetchEntityIds(congregationId: string): Promise<{ cityIds: string[]; mapIds: string[]; phoneIds: string[] }> {
		const { data } = await db.queryOnce({
			cities: {
				$: { where: { congregation: congregationId }, fields: ['id'] },
			},
			maps: {
				$: { where: { congregation: congregationId }, fields: ['id'] },
			},
			phones: {
				$: { where: { congregation: congregationId }, fields: ['id'] },
			},
		})

		return {
			cityIds: (data.cities || []).map((city) => city.id),
			mapIds: (data.maps || []).map((map) => map.id),
			phoneIds: (data.phones || []).map((phone) => phone.id),
		}
	}

	async deleteEntities(
		entity: 'maps' | 'cities' | 'phones',
		ids: string[],
		onProgress?: (done: number, total: number) => void
	): Promise<void> {
		let done = 0
		for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
			const batch = ids.slice(i, i + BATCH_LIMIT).map((entityId) => db.tx[entity][entityId].delete())
			await db.transact(batch)
			done += batch.length
			onProgress?.(done, ids.length)
		}
	}

	async restoreCities(
		cities: BackupData['cities'],
		congregationId: string,
		createdIds: string[] = [],
		onProgress?: (done: number, total: number) => void
	): Promise<Record<string, string>> {
		const cityIdMap: Record<string, string> = {}

		for (let i = 0; i < cities.length; i += BATCH_LIMIT) {
			const batch = cities.slice(i, i + BATCH_LIMIT).map((city) => ({ oldId: city.id, newId: id(), name: city.name }))
			await db.transact(
				batch.map((city) => db.tx.cities[city.newId].update({ name: city.name }).link({ congregation: congregationId }))
			)
			for (const city of batch) {
				cityIdMap[city.oldId] = city.newId
				createdIds.push(city.newId)
			}
			onProgress?.(createdIds.length, cities.length)
		}

		return cityIdMap
	}

	async restoreDistricts(
		districts: BackupData['districts'],
		cityIdMap: Record<string, string>,
		onProgress?: (done: number, total: number) => void
	): Promise<number> {
		const validDistricts = districts.filter((district) => cityIdMap[district.city_id] !== undefined)

		let done = 0
		for (let i = 0; i < validDistricts.length; i += BATCH_LIMIT) {
			const batch = validDistricts.slice(i, i + BATCH_LIMIT)
			await db.transact(
				batch.map((district) => db.tx.districts[id()].update({ name: district.name }).link({ city: cityIdMap[district.city_id] }))
			)
			done += batch.length
			onProgress?.(done, validDistricts.length)
		}

		return done
	}

	async restoreMaps(
		maps: BackupData['maps'],
		cityIdMap: Record<string, string>,
		congregationId: string,
		createdIds: string[] = [],
		onProgress?: (done: number, total: number) => void
	): Promise<number> {
		// lat/lng are required by the schema, so a map without them would make the whole batch fail
		const validMaps = maps.filter((map) => cityIdMap[map.city_id] !== undefined && map.lat != null && map.lng != null)

		let done = 0
		for (let i = 0; i < validMaps.length; i += BATCH_LIMIT) {
			const batch = validMaps.slice(i, i + BATCH_LIMIT).map((map) => ({ ...map, newId: id() }))
			await db.transact(
				batch.map((map) =>
					db.tx.maps[map.newId]
						.update({
							name: map.name,
							address: map.address,
							details: map.details ?? undefined,
							district: map.district || undefined,
							lat: map.lat ?? undefined,
							lng: map.lng ?? undefined,
							tag: map.tag ?? undefined,
							group_code: map.group_code ?? undefined,
							found: map.found ?? undefined,
							found_info: map.found_info ?? undefined,
							visited: map.visited ?? undefined,
							visited_by: map.visited_by ?? undefined,
						})
						.link({ congregation: congregationId, city: cityIdMap[map.city_id] })
				)
			)
			createdIds.push(...batch.map((map) => map.newId))
			done += batch.length
			onProgress?.(done, validMaps.length)
		}

		return done
	}

	// Assignments are not part of the backup, so restored phones come back unassigned
	async restorePhones(
		phones: NonNullable<BackupData['phones']>,
		congregationId: string,
		createdIds: string[] = [],
		onProgress?: (done: number, total: number) => void
	): Promise<number> {
		let done = 0
		for (let i = 0; i < phones.length; i += BATCH_LIMIT) {
			const batch = phones.slice(i, i + BATCH_LIMIT).map((phone) => ({ ...phone, newId: id() }))
			await db.transact(
				batch.map((phone) =>
					db.tx.phones[phone.newId]
						.update({
							number: phone.number,
							answered: phone.answered ?? undefined,
							answered_info: phone.answered_info ?? undefined,
							called: phone.called ?? undefined,
							called_by: phone.called_by ?? undefined,
						})
						.link({ congregation: congregationId })
				)
			)
			createdIds.push(...batch.map((phone) => phone.newId))
			done += batch.length
			onProgress?.(done, phones.length)
		}

		return done
	}

	// Best effort: removes whatever a failed restore managed to create
	private async rollback(mapIds: string[], cityIds: string[], phoneIds: string[]): Promise<void> {
		try {
			await this.deleteEntities('maps', mapIds)
			await this.deleteEntities('phones', phoneIds)
			await this.deleteEntities('cities', cityIds)
		} catch {
			// The original error is more useful to the user than a rollback failure
		}
	}
}

export const backupService = new BackupService()
