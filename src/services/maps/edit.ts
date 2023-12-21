import { api } from 'services/api/main'
import { EditMapReq, EditMapRes } from 'types/api/maps'

export const edit = async (id: string, body: EditMapReq) => {
	try {
		const { data } = await api.put<EditMapRes>(`/maps/${id}`, body)

		if (!data) return false

		return data
	} catch (error) {
		return false
	}
}
