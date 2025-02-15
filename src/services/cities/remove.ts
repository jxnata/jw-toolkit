import { RemoveCityReq, RemoveCityRes } from '@interfaces/api/cities'
import { api } from '@services/api/main'

export const remove = async (id: RemoveCityReq) => {
	try {
		const { data } = await api.delete<RemoveCityRes>(`/cities/${id}`)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
