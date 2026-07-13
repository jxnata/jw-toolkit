import { useSession } from '@/contexts/session-provider'
import db from '@/lib/db'

type Props = {
	search?: string
	enabled?: boolean
}

const useCities = ({ search, enabled = true }: Props = {}) => {
	const { congregation } = useSession()

	const active = enabled && congregation

	const whereConditions: any = {
		congregation: congregation!.id,
	}

	if (search) {
		whereConditions.name = { $ilike: `%${search}%` }
	}

	const { data, isLoading, error } = db.useQuery(
		active
			? {
					cities: {
						$: {
							where: whereConditions,
							order: { serverCreatedAt: 'desc' },
						},
					},
				}
			: null
	)

	// only fetch the minimal fields needed to count maps per city, avoiding a heavy full-map query
	const { data: mapsCountData } = db.useQuery(
		active
			? {
					maps: {
						$: { where: { congregation: congregation!.id }, fields: ['id'] },
						city: { $: { fields: ['id'] } },
					},
				}
			: null
	)

	const mapsCountByCity: Record<string, number> = {}
	for (const map of mapsCountData?.maps || []) {
		const cityId = map.city?.id
		if (cityId) mapsCountByCity[cityId] = (mapsCountByCity[cityId] || 0) + 1
	}

	const cities = (data?.cities || []).map((city) => ({
		...city,
		mapsCount: mapsCountByCity[city.id] || 0,
	}))

	return {
		cities,
		loading: isLoading,
		error,
		mutate: () => {},
	}
}

export default useCities
