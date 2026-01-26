import { ENCRYPT_STORAGE } from '@/constants/env'
import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV({
	id: 'main_storage',
	encryptionKey: ENCRYPT_STORAGE,
})

export const old_cache = createMMKV({
	id: 'cache_storage',
})

export const cache = createMMKV({
	id: 'cache_storage',
})

export const history = createMMKV({
	id: 'history_storage',
})
