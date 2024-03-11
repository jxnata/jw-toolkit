import { api } from 'services/api/main'
import { RemoveMapReq, RemoveMapRes } from 'types/api/maps'

export const remove = async (id: RemoveMapReq) => {
	try {
		const { data } = await api.delete<RemoveMapRes>(`/maps/${id}`)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
