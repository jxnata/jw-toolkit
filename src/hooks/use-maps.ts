import { useSession } from '@/contexts/session-provider'
import { Map } from '@/interfaces'
import db from '@/lib/db'

type Props = {
	search?: string
	city?: string
	district?: string
	status?: 'assigned' | 'unassigned' | 'no-visit' | 'student' | ''
	enabled?: boolean
	limit?: number
	offset?: number
}

const useMaps = (
	props: Props = {
		search: '',
		district: '',
		status: '',
		city: '',
		enabled: true,
		limit: 10,
		offset: 0,
	}
) => {
	const { search = '', district = '', status = '', city = '', enabled = true } = props

	const { congregation } = useSession()

	const active = !!(enabled && congregation)

	// Build where conditions
	const whereConditions: any = {
		congregation: congregation!.id,
		tag: { $not: 'nao-visitar' },
	}

	if (search) {
		whereConditions.or = [
			{ name: { $ilike: `%${search}%` } },
			{ district: { $ilike: `%${search}%` } },
			{ 'assigned.name': { $ilike: `%${search}%` } },
		]
	}

	if (city) {
		whereConditions.city = city
	}

	if (district) {
		whereConditions.district = district
	}

	if (status === 'assigned') {
		whereConditions.assigned = { $isNull: false }
	} else if (status === 'unassigned') {
		whereConditions.assigned = { $isNull: true }
	} else if (status === 'no-visit') {
		whereConditions.tag = 'nao-visitar'
	} else if (status === 'student') {
		whereConditions.tag = 'estudante'
	}

	const { data, isLoading, error } = db.useQuery(
		active
			? {
				maps: {
					$: {
						where: whereConditions,
						order: { visited: 'asc' },
					},
					city: {},
					assigned: {},
					extra_maps: {},
				},
			}
			: null
	)

	return {
		maps: (data?.maps as Map[]) || [],
		loading: isLoading,
		error,
		mutate: () => { },
		loadMore: () => { },
		loadingMore: false,
		hasMore: false,
		total: data?.maps?.length || 0,
		queryKey: ['maps', search, city, district, status, congregation],
	}
}

export default useMaps
