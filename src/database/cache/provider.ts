import { cache } from '@database/index'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const clientStorage = {
	setItem: (key: string, value: boolean | string | number | Uint8Array<ArrayBufferLike>) => {
		cache.set(key, value)
	},
	getItem: (key: string) => {
		const value = cache.getString(key)
		return value === undefined ? null : value
	},
	removeItem: (key: string) => {
		cache.delete(key)
	},
}

export const clientPersister = createSyncStoragePersister({ storage: clientStorage })
