import { api } from 'services/api/main'
import { EditCityReq, EditCityRes } from 'types/api/cities'

export const edit = async (id: string, body: EditCityReq) => {
	try {
		const { data } = await api.put<EditCityRes>(`/cities/${id}`, body)

		if (!data) return false

		return data
	} catch (error) {
		return false
	}
}
