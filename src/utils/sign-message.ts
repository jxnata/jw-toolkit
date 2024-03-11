import '../../polyfills'

import { privateKeyToAccount } from 'viem/accounts'

export const signMessage = async (message: string, pk: string) => {
	const account = privateKeyToAccount(pk as `0x${string}`)
	const signature = await account.signMessage({
		message,
	})

	return signature
}
