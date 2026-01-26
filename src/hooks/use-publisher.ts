import db from '@/lib/db'

type Props = {
	publisherId?: string
	userId?: string
	enabled?: boolean
}

const usePublisher = ({ publisherId, userId, enabled = true }: Props = {}) => {
	let whereCondition: any = {}

	if (publisherId) {
		whereCondition.id = publisherId
	} else if (userId) {
		whereCondition['user.id'] = userId
	}

	const query = {
		publishers: {
			$: {
				where: whereCondition,
				limit: 1,
			},
			congregation: {},
			user: {},
			maps: {
				city: {},
				congregation: {},
			},
		},
	}

	const { data, isLoading, error } = db.useQuery(enabled ? query : null)

	return {
		publisher: data?.publishers[0] || null,
		loading: isLoading,
		error,
	}
}

export default usePublisher
