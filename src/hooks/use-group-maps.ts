import { useSession } from '@/contexts/session-provider'
import { Map } from '@/interfaces'
import db from '@/lib/db'

const useGroupMaps = (groupCode: string) => {
	const { congregation } = useSession()

	const { data, isLoading, error } = db.useQuery(
		congregation
			? {
					maps: {
						$: {
							where: {
								congregation: congregation.id,
								group_code: groupCode,
							},
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
		loading: isLoading,
		error,
	}
}

export default useGroupMaps
