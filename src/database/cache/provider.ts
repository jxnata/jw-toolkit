import { cache } from 'database'
import { Cache } from 'swr'

const map = new Map(JSON.parse(cache.getString('app-cache') || '[]'))

export function populateCache() {
	const appCache = JSON.stringify(Array.from(map.entries()))
	cache.set('app-cache', appCache)
}

export function cacheProvider() {
	return map as Cache
}
