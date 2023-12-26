import { api } from 'services/api/main'
import { AddCityReq, AddCityRes } from 'types/api/cities'

export const add = async (req: AddCityReq) => {
	try {
		const { data } = await api.post<AddCityRes>('/cities', req)

		if (!data) return false

		return data
	} catch (error) {
		return false
	}
}
