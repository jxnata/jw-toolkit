import { ENCRYPT_STORAGE } from '@constants/env'
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV({
	id: 'main_storage',
	encryptionKey: ENCRYPT_STORAGE,
})

export const cache = new MMKV({
	id: 'cache_storage',
})

export const history = new MMKV({
	id: 'history_storage',
})
