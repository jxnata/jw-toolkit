import db from '@/lib/db'
import { id } from '@instantdb/react-native'

export interface CreateExtraMapInput {
	address: string
	lat: number
	lng: number
	details?: string
	mapId: string
}

class ExtraMapsService {
	async createExtraMap(input: CreateExtraMapInput): Promise<void> {
		await db.transact(
			db.tx.extra_maps[id()]
				.update({
					address: input.address,
					lat: input.lat,
					lng: input.lng,
					details: input.details,
				})
				.link({ map: input.mapId })
		)
	}

	async updateExtraMap(extraMapId: string, updates: { address?: string; lat?: number; lng?: number; details?: string }): Promise<void> {
		await db.transact(db.tx.extra_maps[extraMapId].update(updates))
	}

	async deleteExtraMap(extraMapId: string): Promise<void> {
		await db.transact(db.tx.extra_maps[extraMapId].delete())
	}
}

export const extraMapsService = new ExtraMapsService()
