import { AddAssignmentReq, AddAssignmentRes } from '@interfaces/api/assignments'
import { api } from '@services/api/main'

export const add = async (req: AddAssignmentReq) => {
	try {
		const { data } = await api.post<AddAssignmentRes>('/assignments', req)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
