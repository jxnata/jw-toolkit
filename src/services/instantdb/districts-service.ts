import { District } from '@/interfaces'
import db from '@/lib/db'
import { id } from '@instantdb/react-native'

export interface CreateDistrictInput {
	name: string
	cityId: string
}

export interface DistrictResponse {
	data: District | null
	error: string | null
}

export interface DistrictsResponse {
	data: District[] | null
	error: string | null
}

class DistrictsService {
	async createDistrict(input: CreateDistrictInput): Promise<void> {
		const districtData = {
			name: input.name,
		}

		await db.transact(db.tx.districts[id()].update(districtData).link({ city: input.cityId }))
	}

	async updateDistrict(districtId: string, updates: Partial<District>): Promise<void> {
		await db.transact(db.tx.districts[districtId].update(updates))
	}

	async getDistrict(districtId: string): Promise<District | null> {
		const { data } = await db.queryOnce({
			districts: {
				$: {
					where: { id: districtId }
				},
				city: {
					congregation: {}
				}
			}
		})
		return data.districts[0] as District | null
	}

	async deleteDistrict(districtId: string): Promise<void> {
		await db.transact(db.tx.districts[districtId].delete())
	}
}

export const districtsService = new DistrictsService() 