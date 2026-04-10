// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react-native";

const _schema = i.schema({
	entities: {
		$files: i.entity({
			path: i.string().unique().indexed(),
			url: i.string().optional(),
		}),
		$users: i.entity({
			email: i.string().unique().indexed().optional(),
			imageURL: i.string().optional(),
			type: i.string().optional(),
		}),
		cities: i.entity({
			name: i.string(),
		}),
		congregations: i.entity({
			enabled: i.boolean().optional(),
			name: i.string().indexed(),
		}),
		districts: i.entity({
			name: i.string(),
		}),
		maps: i.entity({
			address: i.string(),
			details: i.string().optional(),
			district: i.string().indexed().optional(),
			found: i.boolean().optional(),
			found_info: i.string().optional(),
			group_code: i.string().indexed().optional(),
			lat: i.number(),
			lng: i.number(),
			name: i.string().indexed(),
			tag: i.string().indexed().optional(),
			visited: i.date().indexed().optional(),
			visited_by: i.string().optional(),
		}),
		publishers: i.entity({
			approved: i.boolean().optional(),
			level: i.number(),
			name: i.string().indexed(),
		}),
		subscriptions: i.entity({
			subscribed: i.boolean().optional(),
		}),
	},
	links: {
		$usersLinkedPrimaryUser: {
			forward: {
				on: "$users",
				has: "one",
				label: "linkedPrimaryUser",
				onDelete: "cascade"
			},
			reverse: {
				on: "$users",
				has: "many",
				label: "linkedGuestUsers"
			}
		},
		citiesCongregation: {
			forward: {
				on: "cities",
				has: "one",
				label: "congregation",
				required: true,
				onDelete: "cascade"
			},
			reverse: {
				on: "congregations",
				has: "many",
				label: "cities"
			}
		},
		districtsCity: {
			forward: {
				on: "districts",
				has: "one",
				label: "city",
				required: true,
				onDelete: "cascade"
			},
			reverse: {
				on: "cities",
				has: "many",
				label: "districts"
			}
		},
		mapsAssigned: {
			forward: {
				on: "maps",
				has: "one",
				label: "assigned"
			},
			reverse: {
				on: "publishers",
				has: "many",
				label: "maps"
			}
		},
		mapsCity: {
			forward: {
				on: "maps",
				has: "one",
				label: "city",
				required: true,
				onDelete: "cascade"
			},
			reverse: {
				on: "cities",
				has: "many",
				label: "maps"
			}
		},
		mapsCongregation: {
			forward: {
				on: "maps",
				has: "one",
				label: "congregation",
				required: true,
				onDelete: "cascade"
			},
			reverse: {
				on: "congregations",
				has: "many",
				label: "maps"
			}
		},
		publishersCongregation: {
			forward: {
				on: "publishers",
				has: "one",
				label: "congregation",
				onDelete: "cascade"
			},
			reverse: {
				on: "congregations",
				has: "many",
				label: "publishers"
			}
		},
		publishersUser: {
			forward: {
				on: "publishers",
				has: "one",
				label: "user",
				required: true,
				onDelete: "cascade"
			},
			reverse: {
				on: "$users",
				has: "one",
				label: "publisher"
			}
		},
		subscriptionsCongregation: {
			forward: {
				on: "subscriptions",
				has: "one",
				label: "congregation",
				required: true,
				onDelete: "cascade"
			},
			reverse: {
				on: "congregations",
				has: "one",
				label: "subscription"
			}
		},
		subscriptionsUser: {
			forward: {
				on: "subscriptions",
				has: "one",
				label: "user"
			},
			reverse: {
				on: "$users",
				has: "one",
				label: "subscription"
			}
		}
	},
	rooms: {}
});

type _AppSchema = typeof _schema;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AppSchema extends _AppSchema { }
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
