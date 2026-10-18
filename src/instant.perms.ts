import type { InstantRules } from '@instantdb/react-native'
import type { AppSchema } from './interfaces/schema'

// Notes on how InstantDB evaluates these rules (verified in src/instant.perms.integration.test.ts):
// - `allow.link.<label>` replaces the `update` rule for that link, and links made from the reverse side use the same rule
// - `data` is the state before the transaction and `newData` the state after it; on create both are the new entity
// - Has-one links show up as fields (`data.congregation` is an id), so `data.x == newData.x` means "not moving"
// - Replacing a has-one link does not check `unlink`, so every `link` rule must be strict on its own
// - A user has a single publisher, so `auth.ref('$user.publisher.*')` describes the current user's role

const IS_ADMIN = "1 in auth.ref('$user.publisher.level')"
const IS_APPROVED = "true in auth.ref('$user.publisher.approved')"

const rules = {
	$default: {
		allow: {
			$default: 'false',
		},
	},
	attrs: {
		allow: {
			create: 'false',
		},
	},
	$rateLimits: {
		// Each congregation creation consumes 2 tokens (the rule is checked twice per transaction): 3 per user per day
		createCongregation: {
			limits: [{ capacity: 6, refill: { amount: 6, period: '24 hours' } }],
		},
	},
	congregations: {
		bind: {
			isAdminOfCongregation: `auth.id != null && auth.id in data.ref('publishers.user.id') && ${IS_ADMIN}`,
			// The creator is set once, when the congregation is created, and must be the current user
			isSettingSelfAsCreator: 'auth.id != null && linkedData.id == auth.id && data.creator == auth.id',
			// Admins may only rename the congregation; `enabled` is not theirs to toggle
			changesOnlyName: "request.modifiedFields.all(field, field in ['name'])",
		},
		allow: {
			// Public so users can search for a congregation to join; holds no personal data
			view: 'true',
			create: "auth.id != null && auth.id in data.ref('creator.id') && rateLimit.createCongregation.limit(auth.id)",
			update: 'isAdminOfCongregation && changesOnlyName',
			delete: 'false',
			link: {
				creator: 'isSettingSelfAsCreator',
			},
			unlink: {
				creator: 'false',
			},
		},
	},
	publishers: {
		bind: {
			isSelf: "auth.id != null && auth.id in data.ref('user.id')",
			isAdminOfCongregation: `auth.id != null && auth.id in data.ref('congregation.publishers.user.id') && ${IS_ADMIN}`,
			isApprovedMember: `auth.id != null && auth.id in data.ref('congregation.publishers.user.id') && ${IS_APPROVED}`,
			// A user may: keep their role, reset it to a pending publisher, or become admin of a congregation they created
			isAllowedSelfRoleChange:
				"(newData.level == data.level && newData.approved == data.approved) || (newData.level == 3 && newData.approved != true) || (newData.level == 1 && newData.approved == true && auth.id in data.ref('congregation.creator.id'))",
			// Joining is only possible as a pending publisher, unless the user created the congregation
			canJoinCongregation:
				"auth.id != null && data.user == auth.id && ((newData.level == 3 && newData.approved != true) || auth.id in linkedData.ref('creator.id'))",
		},
		allow: {
			view: 'isSelf || isApprovedMember',
			create: "auth.id != null && auth.id in data.ref('user.id') && data.level == 3 && data.approved != true",
			update: 'isAdminOfCongregation || (isSelf && isAllowedSelfRoleChange)',
			delete: 'isAdminOfCongregation',
			link: {
				// A publisher belongs to the user who created it, forever
				user: 'auth.id != null && linkedData.id == auth.id && data.user == auth.id',
				congregation: 'canJoinCongregation',
			},
			unlink: {
				user: 'false',
				congregation: 'isSelf || isAdminOfCongregation',
			},
		},
	},
	cities: {
		bind: {
			isApprovedMember: `auth.id != null && auth.id in data.ref('congregation.publishers.user.id') && ${IS_APPROVED}`,
			isAdminOfCongregation: `auth.id != null && auth.id in data.ref('congregation.publishers.user.id') && ${IS_ADMIN}`,
		},
		allow: {
			view: 'isApprovedMember',
			create: 'isAdminOfCongregation',
			update: 'isAdminOfCongregation',
			delete: 'isAdminOfCongregation',
			link: {
				// Cities never move between congregations
				congregation: `auth.id != null && auth.id in linkedData.ref('publishers.user.id') && ${IS_ADMIN} && data.congregation == newData.congregation`,
			},
			unlink: {
				congregation: 'false',
			},
		},
	},
	districts: {
		bind: {
			isApprovedMember: `auth.id != null && auth.id in data.ref('city.congregation.publishers.user.id') && ${IS_APPROVED}`,
			isAdminOfCongregation: `auth.id != null && auth.id in data.ref('city.congregation.publishers.user.id') && ${IS_ADMIN}`,
		},
		allow: {
			view: 'isApprovedMember',
			create: 'isAdminOfCongregation',
			update: 'isAdminOfCongregation',
			delete: 'isAdminOfCongregation',
			link: {
				city: `auth.id != null && auth.id in linkedData.ref('congregation.publishers.user.id') && ${IS_ADMIN} && (data.city == newData.city || data.ref('city.congregation.id') == linkedData.ref('congregation.id'))`,
			},
			unlink: {
				city: 'false',
			},
		},
	},
	maps: {
		bind: {
			isApprovedMember: `auth.id != null && auth.id in data.ref('congregation.publishers.user.id') && ${IS_APPROVED}`,
			isAdminOfCongregation: `auth.id != null && auth.id in data.ref('congregation.publishers.user.id') && ${IS_ADMIN}`,
			isAssignedPublisher: "auth.id != null && auth.id in data.ref('assigned.user.id')",
			// The assigned publisher may only record the visit result
			changesOnlyVisitFields: "request.modifiedFields.all(field, field in ['found', 'found_info', 'visited', 'visited_by'])",
			// The linked city / publisher belongs to the congregation of the map
			isSameCongregation: "newData.congregation in linkedData.ref('congregation.id')",
		},
		allow: {
			view: 'isApprovedMember',
			create: 'isAdminOfCongregation',
			update: 'isAdminOfCongregation || (isApprovedMember && isAssignedPublisher && changesOnlyVisitFields)',
			delete: 'isAdminOfCongregation',
			link: {
				congregation: `auth.id != null && auth.id in linkedData.ref('publishers.user.id') && ${IS_ADMIN} && data.congregation == newData.congregation`,
				city: `auth.id != null && auth.id in linkedData.ref('congregation.publishers.user.id') && ${IS_ADMIN} && isSameCongregation`,
				assigned: `auth.id != null && auth.id in linkedData.ref('congregation.publishers.user.id') && ${IS_ADMIN} && isSameCongregation`,
			},
			unlink: {
				congregation: 'false',
				city: 'false',
				assigned: 'isAdminOfCongregation || isAssignedPublisher',
			},
		},
	},
	$users: {
		bind: {
			isSelf: 'auth.id != null && auth.id == data.id',
			isAdminOfUserCongregation: `auth.id != null && auth.id in data.ref('publisher.congregation.publishers.user.id') && ${IS_ADMIN}`,
		},
		allow: {
			view: 'isSelf || isAdminOfUserCongregation',
			create: 'isSelf',
			delete: 'false',
			update: 'isSelf',
		},
	},
	$files: {
		bind: {
			isOwner: "auth.id != null && data.path.startsWith(auth.id + '/')",
		},
		allow: {
			view: 'isOwner',
			create: 'isOwner',
			delete: 'isOwner',
			update: 'isOwner',
		},
	},
	subscriptions: {
		allow: {
			view: 'false',
			create: 'false',
			delete: 'false',
			update: 'false',
		},
	},
} satisfies InstantRules<AppSchema>

export default rules
