import { useSession } from '@/contexts/session-provider'
import { Phone } from '@/interfaces'
import db from '@/lib/db'

const useMyPhones = () => {
	const { publisher } = useSession()

	const { data, isLoading, error } = db.useQuery(
		publisher
			? {
					phones: {
						$: {
							where: { assigned: publisher.id },
							order: { serverCreatedAt: 'desc' },
						},
						assigned: {},
					},
				}
			: null
	)

	return {
		phones: (data?.phones as Phone[]) || [],
		loading: isLoading,
		error,
	}
}

export default useMyPhones
