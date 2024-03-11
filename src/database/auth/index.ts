import { storage } from 'database'

import { AuthStorage } from './types'

export const authStorage = {
	getAuth: () => {
		const token = storage.getString('auth.token')
		const private_key = storage.getString('auth.private_key')
		const type = storage.getString('auth.type')
		const data = storage.getString('auth.data')

		return { token, type, data, private_key } as AuthStorage
	},
	setAuth: (auth: AuthStorage) => {
		storage.set('auth.token', auth.token)
		storage.set('auth.type', auth.type)
		storage.set('auth.data', auth.data)
		if (auth.private_key) {
			storage.set('auth.private_key', auth?.private_key)
		}
	},
	clear: () => {
		storage.delete('auth.token')
		storage.delete('auth.type')
		storage.delete('auth.data')
	},
}
