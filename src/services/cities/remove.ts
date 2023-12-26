import { api } from 'services/api/main'
import { RemoveCityReq, RemoveCityRes } from 'types/api/cities'

export const remove = async (id: RemoveCityReq) => {
	try {
		const { data } = await api.delete<RemoveCityRes>(`/cities/${id}`)

		if (!data) return false

		return data
	} catch (error) {
		return false
	}
}
