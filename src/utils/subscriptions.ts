import { api } from "@/lib/api"


export const identifierToSubscription = (identifier: string) => {
	const normalized = identifier.toLowerCase()
	const map: Record<string, 'monthly' | 'yearly'> = {
		'dev.jxnata.jwtoolkit.monthly': 'monthly',
		'pro:monthly': 'monthly',
		'dev.jxnata.jwtoolkit.yearly': 'yearly',
		'pro:yearly': 'yearly',
	}

	return map[normalized] ?? null
}

export const patchSubscription = async (refreshToken: string) => {
	try {
		if (!api.defaults.baseURL) return { isPro: false, expired: false }

		const { data } = await api.patch<{ is_pro: boolean, expired: boolean }>('/subscription/check', {}, {
			headers: {
				token: refreshToken,
			},
		})

		return { isPro: data.is_pro, expired: data.expired }
	} catch (error) {
		console.error('Error patching subscription', error)
		return { isPro: false, expired: false }
	}
}
