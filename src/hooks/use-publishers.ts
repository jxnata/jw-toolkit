import { useSession } from '@/contexts/session-provider'
import db from '@/lib/db'

type Props = {
	search?: string
}

const usePublishers = ({ search }: Props = { search: '' }) => {
	const { congregation } = useSession()

	const { data, isLoading, error } = db.useQuery(
		congregation ? {
			publishers: {
				$: {
					where: {
						approved: true,
						...(search && {
							name: { $like: `%${search}%` },
						}),
					},
					order: { serverCreatedAt: 'desc' },
					limit: 1000,
				},
			}
		} : null
	)

	return {
		publishers: data?.publishers || [],
		loading: isLoading,
		error,
		mutate: () => { },
	}
}

export default usePublishers
