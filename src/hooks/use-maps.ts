import { useSession } from '@/contexts/session-provider'
import { MAP_TAGS } from '@/constants/content'
import { Map } from '@/interfaces'
import db from '@/lib/db'
import { groupMaps } from '@/utils/group-maps'

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

	const whereConditions: any = {
		congregation: congregation!.id,
		tag: { $not: MAP_TAGS.NO_VISIT },
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
		whereConditions.tag = MAP_TAGS.NO_VISIT
	} else if (status === 'student') {
		whereConditions.tag = MAP_TAGS.STUDENT
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
				},
			}
			: null
	)

	const maps = (data?.maps as Map[]) || []

	return {
		maps,
		grouped: groupMaps(maps),
		loading: isLoading,
		error,
		total: maps.length,
		queryKey: ['maps', search, city, district, status, congregation],
	}
}

export default useMaps
