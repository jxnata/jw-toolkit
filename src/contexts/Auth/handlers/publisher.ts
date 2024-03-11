import { authStorage } from 'database/auth'
import { IPublisher } from 'types/models/Publisher'
import { publisherAuth } from 'utils/publisher-auth'

import { ISession } from '../types'

export type AuthHandlerPublisher = {
	user: string
	pass: string
	setSession: (session: ISession<IPublisher>) => void
}

export const authHandlerPublisher = async ({ user, pass, setSession }: AuthHandlerPublisher) => {
	const authorized = await publisherAuth({ username: user, passcode: pass })

	if (!authorized) return false

	authStorage.setAuth({ type: 'publisher', token: authorized.token, data: JSON.stringify(authorized.publisher) })

	setSession({
		data: authorized.publisher,
		token: authorized.token,
		type: 'publisher',
	})
}
