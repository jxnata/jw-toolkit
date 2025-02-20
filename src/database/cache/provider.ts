import { cache, old_cache } from '@database/index'
import { CACHE } from '@database/types/keys'
import { Cache } from 'swr'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

// ----------------> deprecated <----------------

const map = new Map(JSON.parse(old_cache.getString(CACHE) || '[]'))

export function populateCache() {
	const appCache = JSON.stringify(Array.from(map.entries()))
	old_cache.set(CACHE, appCache)
}

export function cacheProvider() {
	return map as Cache
}

// --------------------------------------------->

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