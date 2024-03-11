import { api } from 'services/api/main'
import { RemovePublisherReq, RemovePublisherRes } from 'types/api/publishers'

export const remove = async (id: RemovePublisherReq) => {
	try {
		const { data } = await api.delete<RemovePublisherRes>(`/publishers/${id}`)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
