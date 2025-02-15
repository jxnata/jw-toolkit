import { storage } from '@database'
import { AUTH_DATA, AUTH_PK, AUTH_TOKEN, AUTH_TYPE } from '@database/types/keys'

import { AuthStorage } from './types'

export const authStorage = {
	getAuth: () => {
		const token = storage.getString(AUTH_TOKEN)
		const private_key = storage.getString(AUTH_PK)
		const type = storage.getString(AUTH_TYPE)
		const data = storage.getString(AUTH_DATA)

		return { token, type, data, private_key } as AuthStorage
	},
	setAuth: (auth: AuthStorage) => {
		storage.set(AUTH_TOKEN, auth.token)
		storage.set(AUTH_TYPE, auth.type)
		storage.set(AUTH_DATA, auth.data)
		if (auth.private_key) {
			storage.set(AUTH_PK, auth?.private_key)
		}
	},
	clear: () => {
		storage.delete(AUTH_TOKEN)
		storage.delete(AUTH_TYPE)
		storage.delete(AUTH_DATA)
	},
}
