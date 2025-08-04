import { i } from '@instantdb/core'

const _schema = i.schema({
	entities: {
		$files: i.entity({
			path: i.string().unique().indexed(),
			url: i.string().optional(),
		}),
		$users: i.entity({
			email: i.string().unique().indexed().optional(),
		}),
		cities: i.entity({
			name: i.string(),
		}),
		congregations: i.entity({
			enabled: i.boolean().optional(),
			name: i.string(),
		}),
		districts: i.entity({
			name: i.string(),
		}),
		maps: i.entity({
			address: i.string(),
			details: i.string().optional(),
			district: i.string().optional(),
			found: i.boolean().optional(),
			lat: i.number(),
			lng: i.number(),
			name: i.string(),
			visited: i.date().optional(),
			visited_by: i.string().optional(),
		}),
		publishers: i.entity({
			approved: i.boolean().optional(),
			level: i.number(),
			name: i.string(),
		}),
	},
	links: {
		citiesCongregation: {
			forward: {
				on: 'cities',
				has: 'one',
				label: 'congregation',
				required: true,
				onDelete: 'cascade',
			},
			reverse: {
				on: 'congregations',
				has: 'many',
				label: 'cities',
			},
		},
		districtsCity: {
			forward: {
				on: 'districts',
				has: 'one',
				label: 'city',
				required: true,
				onDelete: 'cascade',
			},
			reverse: {
				on: 'cities',
				has: 'many',
				label: 'districts',
			},
		},
		mapsAssigned: {
			forward: {
				on: 'maps',
				has: 'one',
				label: 'assigned',
			},
			reverse: {
				on: 'publishers',
				has: 'many',
				label: 'maps',
			},
		},
		mapsCity: {
			forward: {
				on: 'maps',
				has: 'one',
				label: 'city',
				required: true,
				onDelete: 'cascade',
			},
			reverse: {
				on: 'cities',
				has: 'many',
				label: 'maps',
			},
		},
		mapsCongregation: {
			forward: {
				on: 'maps',
				has: 'one',
				label: 'congregation',
				required: true,
				onDelete: 'cascade',
			},
			reverse: {
				on: 'congregations',
				has: 'many',
				label: 'maps',
			},
		},
		publishersCongregation: {
			forward: {
				on: 'publishers',
				has: 'one',
				label: 'congregation',
				required: true,
				onDelete: 'cascade',
			},
			reverse: {
				on: 'congregations',
				has: 'many',
				label: 'publishers',
			},
		},
		publishersUser: {
			forward: {
				on: 'publishers',
				has: 'one',
				label: 'user',
				required: true,
				onDelete: 'cascade',
			},
			reverse: {
				on: '$users',
				has: 'one',
				label: 'publisher',
			},
		},
	},
	rooms: {},
})

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, prettier/prettier
interface AppSchema extends _AppSchema { }
const schema: AppSchema = _schema

export type { AppSchema }
export default schema
