import { api } from "@/lib/api"


export const identifierToSubscription = (identifier: string) => {
	switch (identifier) {
		case 'dev.jxnata.jwtoolkit.monthly':
			return 'monthly'
		case 'dev.jxnata.jwtoolkit.yearly':
			return 'yearly'
		default:
			return null
	}
}

export const patchSubscription = async (refreshToken: string) => {
	try {
		const { data } = await api.patch<{ is_pro: boolean }>('/subscription/check', {}, {
			headers: {
				token: refreshToken,
			},
		})

		return data.is_pro
	} catch (error) {
		console.error('Error patching subscription', error)
		return false
	}
}
