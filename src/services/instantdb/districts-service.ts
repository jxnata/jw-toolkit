import { District } from '@/interfaces'
import db from '@/lib/db'
import { id } from '@instantdb/react-native'

export interface CreateDistrictInput {
	name: string
	cityId: string
}

class DistrictsService {
	async createDistrict(input: CreateDistrictInput): Promise<string> {
		const districtId = id()
		const districtData = {
			name: input.name,
		}

		await db.transact(db.tx.districts[districtId].update(districtData).link({ city: input.cityId }))
		return districtId
	}

	async updateDistrict(districtId: string, updates: Partial<District>): Promise<void> {
		await db.transact(db.tx.districts[districtId].update(updates))
	}

	async getDistrict(districtId: string): Promise<District | null> {
		const { data } = await db.queryOnce({
			districts: {
				$: {
					where: { id: districtId },
				},
				city: {
					congregation: {},
				},
			},
		})
		return data.districts[0] as District | null
	}

	async deleteDistrict(districtId: string): Promise<void> {
		await db.transact(db.tx.districts[districtId].delete())
	}
}

export const districtsService = new DistrictsService()
