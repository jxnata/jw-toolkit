import type { InstantRules } from '@instantdb/react-native'

const rules = {
	$files: {
		allow: {
			view: 'true',
			create: 'isOwner',
			update: 'isOwner',
			delete: 'isOwner',
		},
		bind: ['isOwner', "auth.id != null && data.path.startsWith(auth.id + '/')"],
	},
	cities: {
		allow: {
			view: 'isInCongregation',
			create: 'isAdmin',
			update: 'isAdmin',
			delete: 'isAdmin',
		},
		bind: [
			'isAdmin',
			"auth.id in data.ref('congregation.publishers.user.id') && 1 in auth.ref('$user.publisher.level')",
			'isInCongregation',
			"auth.id in data.ref('congregation.publishers.user.id')",
		],
	},
	congregations: {
		allow: {
			view: 'isInCongregation',
			create: 'false', // Only system can create congregations
			update: 'isAdmin',
			delete: 'false',
		},
		bind: [
			'isAdmin',
			"auth.id in data.ref('publishers.user.id') && 1 in auth.ref('$user.publisher.level')",
			'isInCongregation',
			"auth.id in data.ref('publishers.user.id')",
		],
	},
	districts: {
		allow: {
			view: 'isInCongregation',
			create: 'isAdmin',
			update: 'isAdmin',
			delete: 'isAdmin',
		},
		bind: [
			'isAdmin',
			"auth.id in data.ref('city.congregation.publishers.user.id') && 1 in auth.ref('$user.publisher.level')",
			'isInCongregation',
			"auth.id in data.ref('city.congregation.publishers.user.id')",
		],
	},
	maps: {
		allow: {
			view: 'isInCongregation',
			create: 'isAdmin',
			update: 'isAdminOrAssignedPublisher',
			delete: 'isAdmin',
		},
		bind: [
			'isAdmin',
			"auth.id in data.ref('congregation.publishers.user.id') && 1 in auth.ref('$user.publisher.level')",
			'isInCongregation',
			"auth.id in data.ref('congregation.publishers.user.id')",
			'isAdminOrAssignedPublisher',
			"auth.id in data.ref('congregation.publishers.user.id') && (1 in auth.ref('$user.publisher.level') || auth.id in data.ref('assigned.user.id'))",
		],
	},
	publishers: {
		allow: {
			view: 'isInSameCongregationOrSelf',
			create: 'true', // Anyone can request to be a publisher
			update: 'isAdminOrSelf',
			delete: 'isAdmin',
		},
		bind: [
			'isAdmin',
			"auth.id in data.ref('congregation.publishers.user.id') && 1 in auth.ref('$user.publisher.level')",
			'isInSameCongregationOrSelf',
			"auth.id in data.ref('congregation.publishers.user.id') || auth.id in data.ref('user.id')",
			'isAdminOrSelf',
			"(auth.id in data.ref('congregation.publishers.user.id') && 1 in auth.ref('$user.publisher.level')) || auth.id in data.ref('user.id')",
		],
	},
} satisfies InstantRules

export default rules
