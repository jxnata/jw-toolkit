import { api } from 'services/api/main'
import { ResetPublisherReq, ResetPublisherRes } from 'types/api/publishers'

export const reset = async (id: ResetPublisherReq) => {
	try {
		const { data } = await api.put<ResetPublisherRes>(`/publishers/reset/${id}`)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
