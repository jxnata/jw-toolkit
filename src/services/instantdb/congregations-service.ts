import { Congregation } from '@/interfaces'
import db from '@/lib/db'
import { id } from '@instantdb/react-native'

export interface CreateCongregationInput {
	name: string
	enabled?: boolean
}

export interface CongregationResponse {
	data: Congregation | null
	error: string | null
}

export interface CongregationsResponse {
	data: Congregation[] | null
	error: string | null
}

class CongregationsService {
	async createCongregation(input: CreateCongregationInput): Promise<void> {
		const congregationData: Omit<Congregation, 'id'> = {
			name: input.name,
			enabled: input.enabled,
		}

		await db.transact(db.tx.congregations[id()].update(congregationData))
	}

	async updateCongregation(congregationId: string, updates: Partial<Congregation>): Promise<void> {
		await db.transact(db.tx.congregations[congregationId].update(updates))
	}

	async getCongregation(congregationId: string): Promise<Congregation | null> {
		const { data } = await db.queryOnce({
			congregations: {
				$: {
					where: { id: congregationId }
				}
			}
		})
		return data.congregations[0] || null
	}

	async deleteCongregation(congregationId: string): Promise<void> {
		await db.transact(db.tx.congregations[congregationId].delete())
	}
}

export const congregationsService = new CongregationsService() 