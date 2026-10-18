import { Congregation } from '@/interfaces'
import db from '@/lib/db'
import { id } from '@instantdb/react-native'

export interface CreateCongregationInput {
	name: string
	enabled?: boolean
	creatorId: string
}

class CongregationsService {
	async createCongregation(input: CreateCongregationInput): Promise<string> {
		const congregationId = id()
		const congregationData: Omit<Congregation, 'id'> = {
			name: input.name,
			enabled: input.enabled,
		}

		// The creator is the only user allowed to become the first admin of the congregation (see instant.perms.ts)
		await db.transact(db.tx.congregations[congregationId].update(congregationData).link({ creator: input.creatorId }))
		return congregationId
	}

	async isCreator(congregationId: string, userId: string): Promise<boolean> {
		const { data } = await db.queryOnce({
			congregations: {
				$: { where: { id: congregationId } },
				creator: {},
			},
		})
		return data.congregations[0]?.creator?.id === userId
	}

	async updateCongregation(congregationId: string, updates: Partial<Congregation>): Promise<void> {
		await db.transact(db.tx.congregations[congregationId].update(updates))
	}

	async getCongregation(congregationId: string): Promise<Congregation | null> {
		const { data } = await db.queryOnce({
			congregations: {
				$: {
					where: { id: congregationId },
				},
			},
		})
		return data.congregations[0] || null
	}

	async deleteCongregation(congregationId: string): Promise<void> {
		await db.transact(db.tx.congregations[congregationId].delete())
	}
}

export const congregationsService = new CongregationsService()
