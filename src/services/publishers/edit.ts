import { api } from 'services/api/main'
import { EditPublisherReq, EditPublisherRes } from 'types/api/publishers'

export const edit = async (id: string, body: EditPublisherReq) => {
	try {
		const { data } = await api.put<EditPublisherRes>(`/publishers/${id}`, body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
