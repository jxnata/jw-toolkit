import { api } from 'services/api/main'
import { FinishAssignmentReq, FinishAssignmentRes } from 'types/api/assignments'

export const finish = async (id: string, body: FinishAssignmentReq) => {
	try {
		const { data } = await api.put<FinishAssignmentRes>(`/assignments/${id}/finish`, body)

		if (!data) return false

		return data
	} catch (error) {
		return false
	}
}
