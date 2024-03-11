import { api } from 'services/api/main'
import { EditAssignmentReq, EditAssignmentRes } from 'types/api/assignments'

export const edit = async (id: string, body: EditAssignmentReq) => {
	try {
		const { data } = await api.put<EditAssignmentRes>(`/assignments/${id}`, body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
