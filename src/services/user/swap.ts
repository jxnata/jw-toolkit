import { api } from 'services/api/main'
import { SwapAdminRes } from 'types/auth/admin'

export const swap = async () => {
	try {
		const { data } = await api.post<SwapAdminRes>('/auth/swap-user')

		if (!data) return false

		return data
	} catch {
		return false
	}
}
