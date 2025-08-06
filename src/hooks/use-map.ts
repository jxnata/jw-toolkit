import { useSession } from '@/contexts/session-provider'
import { Map } from '@/interfaces'
import db from '@/lib/db'

type Props = {
	mapId: string
	enabled?: boolean
}

const useMap = ({ mapId, enabled = true }: Props) => {
	const { congregation } = useSession()

	const active = enabled && congregation

	const { isLoading, error, data } = db.useQuery(active ? {
		maps: {
			$: {
				where: { id: mapId, congregation: congregation.id },
				limit: 1,
			},
			city: {},
			assigned: {},
		}
	} : null)

	return {
		map: data?.maps?.[0] as Map | null,
		loading: isLoading,
		error,
	}
}

export default useMap