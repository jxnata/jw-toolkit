import { api } from 'services/api/main'
import { RestoreAssignmentRes } from 'types/api/assignments'

export const restore = async () => {
	try {
		const { data } = await api.post<RestoreAssignmentRes>(`/assignments/restore`)

		if (!data) return false

		return true
	} catch (error) {
		return false
	}
}
