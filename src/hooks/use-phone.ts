import { useSession } from '@/contexts/session-provider'
import { Phone } from '@/interfaces'
import db from '@/lib/db'

const usePhone = (phoneId: string) => {
	const { congregation } = useSession()

	const active = !!phoneId && congregation

	const { data, isLoading, error } = db.useQuery(
		active
			? {
					phones: {
						$: {
							where: { id: phoneId, congregation: congregation.id },
							limit: 1,
						},
						assigned: {},
					},
				}
			: null
	)

	return {
		phone: (data?.phones?.[0] as Phone | undefined) ?? null,
		loading: isLoading,
		error,
	}
}

export default usePhone
