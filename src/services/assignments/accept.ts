import { AcceptAssignmentReq, AcceptAssignmentRes } from '@interfaces/api/assignments'
import { api } from '@services/api/main'

export const accept = async (body: AcceptAssignmentReq) => {
	try {
		const { data } = await api.post<AcceptAssignmentRes>(`/assignments/accept`, body)

		return data
	} catch {
		return false
	}
}
