import { api } from 'services/api/main'
import { SwapPublisherRes } from 'types/auth/publisher'

export const swap = async () => {
	try {
		const { data } = await api.post<SwapPublisherRes>('/auth/swap-publisher')

		if (!data) return false

		return data
	} catch {
		return false
	}
}
