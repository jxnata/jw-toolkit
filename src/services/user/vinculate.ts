import { api } from 'services/api/main'
import { VinculateUserReq, VinculateUserRes } from 'types/api/users'

export const vinculate = async (publisher: string) => {
	try {
		const { data } = await api.post<VinculateUserRes>('/users/vinculate', { publisher } as VinculateUserReq)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
