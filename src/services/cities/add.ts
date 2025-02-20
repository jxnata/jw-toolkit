import { AddCityReq, AddCityRes } from '@interfaces/api/cities'
import { api } from '@services/api/main'

export const add = async (req: AddCityReq) => {
	try {
		const { data } = await api.post<AddCityRes>('/cities', req)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
