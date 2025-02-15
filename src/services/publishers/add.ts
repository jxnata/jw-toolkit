import { AddPublisherReq, AddPublisherRes } from '@interfaces/api/publishers'
import { api } from '@services/api/main'

export const add = async (body: AddPublisherReq) => {
	try {
		const { data } = await api.post<AddPublisherRes>('/publishers', body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
