import { useSession } from '@/contexts/session-instantdb'
import db from '@/lib/db'

const useAssignment = (assignmentId: string) => {
	const { congregation } = useSession()

	const active = !!assignmentId && congregation

	const { data, isLoading, error } = db.useQuery(
		active ? {
			maps: {
				$: {
					where: {
						id: assignmentId,
						congregation: congregation ? congregation.id : null
					}
				}
			}
		} : null
	)

	return {
		assignment: data?.maps[0] || null,
		loading: isLoading,
		error,
	}
}

export default useAssignment 