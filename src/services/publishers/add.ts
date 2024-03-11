import { api } from 'services/api/main'
import { AddPublisherReq, AddPublisherRes } from 'types/api/publishers'

export const add = async (body: AddPublisherReq) => {
	try {
		const { data } = await api.post<AddPublisherRes>('/publishers', body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
