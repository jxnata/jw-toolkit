import { VinculateUserReq, VinculateUserRes } from '@interfaces/api/users'
import { api } from '@services/api/main'

export const vinculate = async (publisher: string) => {
	try {
		const { data } = await api.post<VinculateUserRes>('/users/vinculate', { publisher } as VinculateUserReq)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
