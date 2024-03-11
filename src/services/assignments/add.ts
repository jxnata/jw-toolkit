import { api } from 'services/api/main'
import { AddAssignmentReq, AddAssignmentRes } from 'types/api/assignments'

export const add = async (req: AddAssignmentReq) => {
	try {
		const { data } = await api.post<AddAssignmentRes>('/assignments', req)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
