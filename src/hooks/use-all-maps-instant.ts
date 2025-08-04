import { useSession } from '@/contexts/session-instantdb'
import db from '@/lib/db'

type Props = {
	search?: string
	enabled?: boolean
}

const useAllMaps = ({ search, enabled = true }: Props = {}) => {
	const { congregation } = useSession()

	const active = enabled && congregation

	const whereConditions: any = {
		congregation: congregation ? congregation.id : null,
	}

	if (search) {
		whereConditions.or = [
			{ name: { $like: `%${search}%` } },
			{ district: { $like: `%${search}%` } },
			{ address: { $like: `%${search}%` } }
		]
	}

	const { data, isLoading, error } = db.useQuery(
		active ? {
			maps: {
				$: {
					where: whereConditions,
					order: { serverCreatedAt: 'desc' }
				},
				city: {}
			}
		} : null
	)

	return {
		maps: data?.maps || [],
		loading: isLoading,
		error,
		mutate: () => { },
	}
}

export default useAllMaps