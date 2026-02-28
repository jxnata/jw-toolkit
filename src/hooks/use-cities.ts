import { useSession } from '@/contexts/session-provider'
import db from '@/lib/db'

type Props = {
	search?: string
	enabled?: boolean
}

const useCities = ({ search, enabled = true }: Props = {}) => {
	const { congregation } = useSession()

	const active = enabled && congregation

	const whereConditions: any = {
		congregation: congregation!.id,
	}

	if (search) {
		whereConditions.name = { $like: `%${search}%` }
	}

	const { data, isLoading, error } = db.useQuery(
		active
			? {
					cities: {
						$: {
							where: whereConditions,
							order: { serverCreatedAt: 'desc' },
						},
					},
				}
			: null
	)

	return {
		cities: data?.cities || [],
		loading: isLoading,
		error,
		mutate: () => {},
	}
}

export default useCities
