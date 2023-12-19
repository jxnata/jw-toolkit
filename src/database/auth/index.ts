import { storage } from 'database'
import { AuthStorage } from './types'

export const authStorage = {
	getAuth: () => {
		const token = storage.getString('auth.token')
		const type = storage.getString('auth.type')
		const data = storage.getString('auth.data')

		return { token, type, data } as AuthStorage
	},
	setAuth: (auth: AuthStorage) => {
		storage.set('auth.token', auth.token)
		storage.set('auth.type', auth.type)
		storage.set('auth.data', auth.data)
	},
	clear: () => {
		storage.delete('auth.token')
		storage.delete('auth.type')
		storage.delete('auth.data')
	},
}
