import { RestoreAssignmentRes } from '@interfaces/api/assignments'
import { api } from '@services/api/main'

export const restore = async () => {
	try {
		const { data } = await api.post<RestoreAssignmentRes>(`/assignments/restore`)

		if (!data) return false

		return true
	} catch {
		return false
	}
}
