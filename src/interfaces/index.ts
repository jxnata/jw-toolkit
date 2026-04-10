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
