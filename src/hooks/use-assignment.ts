import { useSession } from '@/contexts/session-provider'
import db from '@/lib/db'

const useAssignment = (assignmentId: string) => {
	const { congregation } = useSession()

	const active = !!assignmentId && congregation

	const { data, isLoading, error } = db.useQuery(
		active
			? {
					maps: {
						$: {
							where: {
								id: assignmentId,
								congregation: congregation!.id,
							},
						},
						city: {},
						assigned: {},
						extra_maps: {},
					},
				}
			: null
	)

	return {
		assignment: data?.maps?.[0] || null,
		loading: isLoading,
		error,
	}
}

export default useAssignment
