import { Map } from '@/interfaces'
import db from '@/lib/db'
import { id } from '@instantdb/react-native'

export interface CreateMapInput {
	name: string
	address: string
	lat: number
	lng: number
	details?: string
	district?: string
	found?: boolean
	visited?: Date
	visited_by?: string
	cityId: string
	congregationId: string
	assignedId?: string
	tag?: string
}

export interface MapResponse {
	data: Map | null
	error: string | null
}

export interface MapsResponse {
	data: Map[] | null
	error: string | null
}

class MapsService {
	async createMap(input: CreateMapInput): Promise<string> {
		const mapId = id()
		const mapData: Omit<Map, 'id' | 'congregation' | 'city' | 'assigned'> = {
			name: input.name,
			address: input.address,
			lat: input.lat,
			lng: input.lng,
			details: input.details,
			district: input.district,
			found: input.found,
			visited: input.visited?.toISOString(),
			visited_by: input.visited_by,
			tag: input.tag,
		}

		const links: Record<string, string> = {
			city: input.cityId,
			congregation: input.congregationId,
		}

		if (input.assignedId) {
			links.assigned = input.assignedId
		}

		await db.transact(db.tx.maps[mapId].update(mapData).link(links))
		return mapId
	}

	async updateMap(mapId: string, updates: Partial<Map>, links?: Record<string, string>): Promise<void> {
		await db.transact(db.tx.maps[mapId].update(updates).link(links || {}))
	}

	async assignMap(mapId: string, publisherId: string | null): Promise<void> {
		if (publisherId) {
			await db.transact(db.tx.maps[mapId].link({ assigned: publisherId }))
		}
	}

	async unassignMap(mapId: string, publisherId: string): Promise<void> {
		await db.transact(db.tx.maps[mapId].unlink({ assigned: publisherId }))
	}

	async unassignAllMaps(congregationId: string): Promise<void> {
		const batchLimit = 25

		const { data } = await db.queryOnce({
			maps: {
				$: {
					where: {
						congregation: congregationId,
						assigned: { $isNull: false },
					},
				},
				assigned: {},
			},
		})

		const assignedMaps = data.maps || []

		if (assignedMaps.length === 0) {
			return
		}

		const batches = []

		for (let i = 0; i < assignedMaps.length; i += batchLimit) {
			const batch = assignedMaps.slice(i, i + batchLimit).map((map) => {
				return db.tx.maps[map.id].unlink({ assigned: map.assigned!.id })
			})
			batches.push(batch)
		}

		for (const batch of batches) {
			await db.transact(batch)
		}
	}

	async getMap(mapId: string): Promise<Map | null> {
		const { data } = await db.queryOnce({
			maps: {
				$: {
					where: { id: mapId },
				},
			},
		})
		return (data.maps?.[0] as Map) ?? null
	}

	async deleteMap(mapId: string): Promise<void> {
		await db.transact(db.tx.maps[mapId].delete())
	}
}

export const mapsService = new MapsService()
