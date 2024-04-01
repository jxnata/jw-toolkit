import { authStorage } from 'database/auth'
import { IUser } from 'types/models/User'
import { adminAuth } from 'utils/admin-auth'

import { ISession } from '../types'

export type AuthHandlerUser = {
	user: string
	pass: string
	congregation?: string
	setSession: (session: ISession<IUser>) => void
}

export const authHandlerAdmin = async ({ user, pass, congregation, setSession }: AuthHandlerUser) => {
	const authorized = await adminAuth({ username: user, password: pass, congregation })

	if (!authorized) throw new Error('authorization failed')

	authStorage.setAuth({
		type: 'admin',
		token: authorized.token,
		data: JSON.stringify(authorized.user),
		private_key: authorized.private_key,
	})

	setSession({
		data: authorized.user,
		token: authorized.token,
		private_key: authorized.private_key,
		type: 'admin',
	})
}
