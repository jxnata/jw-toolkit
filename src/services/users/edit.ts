import { EditUserReq, EditUserRes } from '@interfaces/api/users'
import { api } from '@services/api/main'

export const edit = async (id: string, body: EditUserReq) => {
	try {
		const { data } = await api.put<EditUserRes>(`/users/${id}`, body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
