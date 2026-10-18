import { InstaQLEntity } from '@instantdb/react-native'
import { AppSchema } from './schema'

type Congregation = InstaQLEntity<AppSchema, 'congregations'>
type City = InstaQLEntity<AppSchema, 'cities'> & {
	congregation: Congregation
}
type District = InstaQLEntity<AppSchema, 'districts'> & {
	city: City
}
type Map = InstaQLEntity<AppSchema, 'maps'> & {
	assigned: Publisher | null
	congregation: Congregation
	city: City
}
type Publisher = InstaQLEntity<AppSchema, 'publishers'> & {
	congregation: Congregation
}
type User = InstaQLEntity<AppSchema, '$users'> & {
	congregation: Congregation
}

export type { City, Congregation, District, Map, Publisher, User }

export interface BackupData {
	version: string
	congregation_id: string
	created_at: string
	cities: { id: string; name: string }[]
	// Added in v1.1 — absent in v1.0 files
	districts: { id: string; name: string; city_id: string }[]
	maps: {
		id: string
		name: string
		address: string
		details: string | null
		district: string
		lat: number | null
		lng: number | null
		tag: string | null
		group_code: string | null
		// Added in v1.1 — absent in v1.0 files
		found?: boolean | null
		found_info?: string | null
		visited?: string | number | null
		visited_by?: string | null
		city_id: string
	}[]
}

export interface RestoreResult {
	cities: number
	districts: number
	maps: number
	skippedMaps: number
}
