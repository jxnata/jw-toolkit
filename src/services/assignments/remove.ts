import { RemoveAssignmentReq, RemoveAssignmentRes } from '@interfaces/api/assignments'
import { api } from '@services/api/main'

export const remove = async (id: RemoveAssignmentReq) => {
	try {
		const { data } = await api.delete<RemoveAssignmentRes>(`/assignments/${id}`)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
