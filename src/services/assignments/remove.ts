import { api } from 'services/api/main'
import { RemoveAssignmentReq, RemoveAssignmentRes } from 'types/api/assignments'

export const remove = async (id: RemoveAssignmentReq) => {
	try {
		const { data } = await api.delete<RemoveAssignmentRes>(`/assignments/${id}`)

		if (!data) return false

		return data
	} catch (error) {
		return false
	}
}
