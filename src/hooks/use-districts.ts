import { useSession } from '@/contexts/session-provider'
import db from '@/lib/db'

type Props = {
	cityId?: string
	search?: string
	enabled?: boolean
}

const useDistricts = ({ cityId, search, enabled = true }: Props = {}) => {
	const { congregation } = useSession()

	const active = enabled && congregation

	const whereConditions: any = {}

	if (cityId) {
		whereConditions.city = { id: cityId }
	} else {
		whereConditions.city = { congregation: congregation ? congregation.id : null }
	}

	if (search) {
		whereConditions.name = { $like: `%${search}%` }
	}

	const { data, isLoading, error } = db.useQuery(
		active
			? {
					districts: {
						$: {
							where: whereConditions,
							order: { serverCreatedAt: 'desc' },
						},
					},
				}
			: null
	)

	return {
		districts: data?.districts || [],
		loading: isLoading,
		error,
		mutate: () => {},
	}
}

export default useDistricts
