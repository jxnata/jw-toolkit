import { EditCityReq, EditCityRes } from '@interfaces/api/cities'
import { api } from '@services/api/main'

export const edit = async (id: string, body: EditCityReq) => {
	try {
		const { data } = await api.put<EditCityRes>(`/cities/${id}`, body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
