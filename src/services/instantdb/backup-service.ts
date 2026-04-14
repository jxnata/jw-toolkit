import { BackupData } from '@/interfaces'
import db from '@/lib/db'
import { id } from '@instantdb/react-native'

const BATCH_LIMIT = 25

class BackupService {
	async fetchBackupData(congregationId: string): Promise<BackupData> {
		const { data } = await db.queryOnce({
			cities: {
				$: { where: { congregation: congregationId } },
			},
			maps: {
				$: { where: { congregation: congregationId } },
				city: {},
			},
		})

		const cities = (data.cities || []).map((city) => ({
			id: city.id,
			name: city.name,
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
			city_id: map.city?.id ?? '',
		}))

		return {
			version: '1.0',
			congregation_id: congregationId,
			created_at: new Date().toISOString(),
			cities,
			maps,
		}
	}

	async deleteAllMaps(
		congregationId: string,
		onProgress?: (done: number, total: number) => void,
	): Promise<void> {
		const { data } = await db.queryOnce({
			maps: {
				$: { where: { congregation: congregationId } },
			},
		})

		const maps = data.maps || []
		if (maps.length === 0) return

		let done = 0
		for (let i = 0; i < maps.length; i += BATCH_LIMIT) {
			const batch = maps.slice(i, i + BATCH_LIMIT).map((map) => db.tx.maps[map.id].delete())
			await db.transact(batch)
			done += batch.length
			onProgress?.(done, maps.length)
		}
	}

	async deleteAllCities(congregationId: string): Promise<void> {
		const { data } = await db.queryOnce({
			cities: {
				$: { where: { congregation: congregationId } },
			},
		})

		const cities = data.cities || []
		if (cities.length === 0) return

		for (let i = 0; i < cities.length; i += BATCH_LIMIT) {
			const batch = cities.slice(i, i + BATCH_LIMIT).map((city) => db.tx.cities[city.id].delete())
			await db.transact(batch)
		}
	}

	async restoreCities(
		cities: BackupData['cities'],
		congregationId: string,
	): Promise<Record<string, string>> {
		const cityIdMap: Record<string, string> = {}

		for (let i = 0; i < cities.length; i += BATCH_LIMIT) {
			const batch = cities.slice(i, i + BATCH_LIMIT)
			const transactions = batch.map((city) => {
				const newId = id()
				cityIdMap[city.id] = newId
				return db.tx.cities[newId].update({ name: city.name }).link({ congregation: congregationId })
			})
			await db.transact(transactions)
		}

		return cityIdMap
	}

	async restoreMaps(
		maps: BackupData['maps'],
		cityIdMap: Record<string, string>,
		congregationId: string,
		onProgress?: (done: number, total: number) => void,
	): Promise<void> {
		const validMaps = maps.filter((map) => cityIdMap[map.city_id] !== undefined)

		let done = 0
		for (let i = 0; i < validMaps.length; i += BATCH_LIMIT) {
			const batch = validMaps.slice(i, i + BATCH_LIMIT)
			const transactions = batch.map((map) => {
				const newId = id()
				const newCityId = cityIdMap[map.city_id]
				return db.tx.maps[newId]
					.update({
						name: map.name,
						address: map.address,
						details: map.details ?? undefined,
						district: map.district || undefined,
						lat: map.lat ?? undefined,
						lng: map.lng ?? undefined,
						tag: map.tag ?? undefined,
						group_code: map.group_code ?? undefined,
					})
					.link({ congregation: congregationId, city: newCityId })
			})
			await db.transact(transactions)
			done += batch.length
			onProgress?.(done, validMaps.length)
		}
	}
}

export const backupService = new BackupService()
