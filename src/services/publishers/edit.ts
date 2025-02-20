import { EditPublisherReq, EditPublisherRes } from '@interfaces/api/publishers'
import { api } from '@services/api/main'

export const edit = async (id: string, body: EditPublisherReq) => {
	try {
		const { data } = await api.put<EditPublisherRes>(`/publishers/${id}`, body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
