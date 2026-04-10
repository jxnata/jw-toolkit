import { useSession } from '@/contexts/session-provider'
import { Map } from '@/interfaces'
import db from '@/lib/db'
import { groupMaps, MapGroup } from '@/utils/group-maps'
import { useMemo } from 'react'

type Props = {
	enabled?: boolean
}

const useMyAssignments = ({ enabled = true }: Props = {}) => {
	const { publisher } = useSession()

	const active = enabled && publisher

	const whereConditions: any = {
		assigned: publisher ? publisher.id : null,
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
						assigned: {},
					},
				}
			: null
	)

	const assignments = useMemo<Map[]>(() => (data?.maps as Map[]) || [], [data?.maps])
	const grouped = useMemo<MapGroup[]>(() => groupMaps(assignments), [assignments])

	return {
		assignments,
		grouped,
		loading: isLoading,
		error,
		mutate: () => {},
	}
}

export default useMyAssignments
