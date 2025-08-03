import { useSession } from '@/contexts/session-instantdb'
import db from '@/lib/db'

type Props = {
	enabled?: boolean
}

const useRequestPublishers = ({ enabled = true }: Props = {}) => {
	const { congregation } = useSession()

	const active = enabled && congregation

	const { data, isLoading, error } = db.useQuery(
		active ? {
			publishers: {
				$: {
					where: {
						congregation: congregation ? congregation.id : null,
						approved: false, // Only unapproved publishers
					},
					order: { serverCreatedAt: 'desc' },
				},
			}
		} : null
	)

	return {
		requestPublishers: data?.publishers || [],
		loading: isLoading,
		error,
		mutate: () => { },
	}
}

export default useRequestPublishers