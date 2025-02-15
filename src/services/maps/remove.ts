import { RemoveMapReq, RemoveMapRes } from '@interfaces/api/maps'
import { api } from '@services/api/main'

export const remove = async (id: RemoveMapReq) => {
	try {
		const { data } = await api.delete<RemoveMapRes>(`/maps/${id}`)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
