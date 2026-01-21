import { useSession } from '@/contexts/session-provider'
import { Map } from '@/interfaces'
import db from '@/lib/db'

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

	return {
		assignments: (data?.maps as Map[]) || [],
		loading: isLoading,
		error,
		mutate: () => {},
	}
}

export default useMyAssignments
