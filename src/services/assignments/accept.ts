import { api } from 'services/api/main'
import { AcceptAssignmentReq, AcceptAssignmentRes } from 'types/api/assignments'

export const accept = async (body: AcceptAssignmentReq) => {
	try {
		const { data } = await api.post<AcceptAssignmentRes>(`/assignments/accept`, body)

		return data
	} catch (error) {
		return false
	}
}
