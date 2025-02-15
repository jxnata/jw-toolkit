import { RemovePublisherReq, RemovePublisherRes } from '@interfaces/api/publishers'
import { api } from '@services/api/main'

export const remove = async (id: RemovePublisherReq) => {
	try {
		const { data } = await api.delete<RemovePublisherRes>(`/publishers/${id}`)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
