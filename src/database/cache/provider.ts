import { cache } from '@database/index'
import { CACHE } from '@database/types/keys'
import { Cache } from 'swr'

const map = new Map(JSON.parse(cache.getString(CACHE) || '[]'))

export function populateCache() {
	const appCache = JSON.stringify(Array.from(map.entries()))
	cache.set(CACHE, appCache)
}

export function cacheProvider() {
	return map as Cache
}
