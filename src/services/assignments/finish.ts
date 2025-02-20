import { FinishAssignmentReq, FinishAssignmentRes } from '@interfaces/api/assignments'
import { api } from '@services/api/main'

export const finish = async (id: string, body: FinishAssignmentReq) => {
	try {
		const { data } = await api.put<FinishAssignmentRes>(`/assignments/${id}/finish`, body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
