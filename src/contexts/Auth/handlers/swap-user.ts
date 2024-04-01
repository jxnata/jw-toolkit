import { authStorage } from 'database/auth'
import get from 'lodash/get'
import { swap } from 'services/users/swap'
import { IPublisher, IVinculatedPublisher } from 'types/models/Publisher'

import { ISession } from '../types'

export type SwapHandlerUser = {
	currentUser: string
	setSession: (session: ISession<IVinculatedPublisher>) => void
}

export const swapHandlerUser = async ({ setSession, currentUser }: SwapHandlerUser) => {
	const authorized = await swap()

	if (!authorized) throw new Error('Not authorized')

	authStorage.clear()

	const publisher: IPublisher = get(authorized, 'publisher', undefined)
	const token: string = get(authorized, 'token', undefined)

	if (!publisher || !token) throw new Error('Invalid response data')

	authStorage.setAuth({ type: 'publisher', token, data: JSON.stringify({ ...publisher, user: currentUser }) })

	setSession({
		data: { ...publisher, user: currentUser },
		token,
		type: 'publisher',
	})
}
