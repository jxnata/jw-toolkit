import { api } from 'services/api/main'
import { RemoveUserReq, RemoveUserRes } from 'types/api/users'

export const remove = async (id: RemoveUserReq) => {
	try {
		const { data } = await api.delete<RemoveUserRes>(`/users/${id}`)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
