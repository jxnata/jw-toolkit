import { RemoveUserReq, RemoveUserRes } from '@interfaces/api/users'
import { api } from '@services/api/main'

export const remove = async (id: RemoveUserReq) => {
	try {
		const { data } = await api.delete<RemoveUserRes>(`/users/${id}`)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
