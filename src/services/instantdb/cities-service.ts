import { City } from '@/interfaces'
import db from '@/lib/db'
import { id } from '@instantdb/react-native'

export interface CreateCityInput {
	name: string
	congregationId: string
}

class CitiesService {
	async createCity(input: CreateCityInput): Promise<void> {
		const cityData = {
			name: input.name,
		}

		await db.transact(db.tx.cities[id()].update(cityData).link({ congregation: input.congregationId }))
	}

	async updateCity(cityId: string, updates: Partial<City>): Promise<void> {
		await db.transact(db.tx.cities[cityId].update(updates))
	}

	async getCity(cityId: string): Promise<City | null> {
		const { data } = await db.queryOnce({
			cities: {
				$: {
					where: { id: cityId },
				},
				congregation: {},
			},
		})
		return (data.cities?.[0] as City) ?? null
	}

	async deleteCity(cityId: string): Promise<void> {
		await db.transact(db.tx.cities[cityId].delete())
	}
}

export const citiesService = new CitiesService()
