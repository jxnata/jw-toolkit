import { ExtraMap } from '@/interfaces'
import db from '@/lib/db'

const useExtraMaps = (mapId: string) => {
	const active = !!mapId

	const { data, isLoading, error } = db.useQuery(
		active
			? {
					extra_maps: {
						$: {
							where: { map: mapId },
						},
					},
				}
			: null
	)

	return {
		extraMaps: (data?.extra_maps as ExtraMap[]) || [],
		loading: isLoading,
		error,
	}
}

export default useExtraMaps
