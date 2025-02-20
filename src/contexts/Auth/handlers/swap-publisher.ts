import { authStorage } from '@database/auth'
import { IUser } from '@interfaces/models/User'
import get from 'lodash/get'
import { swap } from '@services/publishers/swap'

import { ISession } from '../types'

export type SwapHandlerPublisher = {
	setSession: (session: ISession<IUser>) => void
}

export const swapHandlerPublisher = async ({ setSession }: SwapHandlerPublisher) => {
	const authorized = await swap()

	if (!authorized) throw new Error('Not authorized')

	authStorage.clear()

	const user: IUser = get(authorized, 'user', undefined)
	const token: string = get(authorized, 'token', undefined)
	const private_key: string = get(authorized, 'private_key', undefined)

	if (!user && !token && !private_key) throw new Error('Invalid response data')

	authStorage.setAuth({ type: 'admin', token, data: JSON.stringify(user), private_key })

	setSession({
		data: user,
		token,
		type: 'admin',
		private_key,
	})
}
