import get from 'lodash/get'
import { api } from 'services/api/main'
import { AdminAuthRequest } from 'types/auth/admin'
import { IUser } from 'types/models/User'

import { normalizeUsername } from './normalize-username'

export const adminAuth = async ({ username, password, congregation }: AdminAuthRequest) => {
	try {
		const authResult = await api.post('/auth/users', {
			username: normalizeUsername(username),
			password,
			congregation,
		})

		const user: IUser = get(authResult, 'data.user', undefined)
		const token: string = get(authResult, 'data.token', undefined)
		const private_key: string = get(authResult, 'data.private_key', undefined)

		if (!!user && !!token && !!private_key) {
			return { user, token, private_key }
		}

		return false
	} catch {
		return false
	}
}
