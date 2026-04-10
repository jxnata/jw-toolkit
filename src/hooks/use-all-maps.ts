import { useSession } from '@/contexts/session-provider'
import db from '@/lib/db'

type Props = {
	search?: string
	enabled?: boolean
}

const useAllMaps = ({ search, enabled = true }: Props = {}) => {
	const { congregation } = useSession()

	const active = enabled && congregation

	const whereConditions: any = {
		congregation: congregation!.id,
	}

	if (search) {
		whereConditions.or = [
			{ name: { $ilike: `%${search}%` } },
			{ district: { $ilike: `%${search}%` } },
			{ address: { $ilike: `%${search}%` } },
		]
	}

	const { data, isLoading, error } = db.useQuery(
		active
			? {
					maps: {
						$: {
							where: whereConditions,
							order: { serverCreatedAt: 'desc' },
						},
						city: {},
					},
				}
			: null
	)

	return {
		maps: data?.maps || [],
		loading: isLoading,
		error,
	}
}

export default useAllMaps
