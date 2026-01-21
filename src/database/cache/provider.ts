import { cache } from '@/database/index'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const clientStorage = {
	setItem: (key: string, value: boolean | string | number | Uint8Array<ArrayBufferLike>) => {
		cache.set(key, value as any)
	},
	getItem: (key: string) => {
		const value = cache.getString(key)
		return value === undefined ? null : value
	},
	removeItem: (key: string) => {
		cache.remove(key)
	},
}

export const clientPersister = createAsyncStoragePersister({ storage: clientStorage })
