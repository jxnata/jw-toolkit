import { FREE_LIMITS } from '@/constants/env'
import { useSession } from '@/contexts/session-provider'
import { useSubscription } from '@/hooks/use-subscription'
import db from '@/lib/db'

export const useLimits = () => {
	const { congregation } = useSession()
	const { subscribed } = useSubscription()

	// Query maps count
	const { data: mapsData } = db.useQuery(
		congregation
			? {
					maps: {
						$: {
							where: {
								congregation: congregation.id,
							},
						},
					},
				}
			: null
	)

	// Query publishers count
	const { data: publishersData } = db.useQuery(
		congregation
			? {
					publishers: {
						$: {
							where: {
								congregation: congregation.id,
								approved: true,
							},
						},
					},
				}
			: null
	)

	// Query phones count (ids only: a congregation can have hundreds of numbers)
	const { data: phonesData } = db.useQuery(
		congregation
			? {
					phones: {
						$: {
							where: {
								congregation: congregation.id,
							},
							fields: ['id'],
						},
					},
				}
			: null
	)

	const phonesCount = phonesData?.phones?.length || 0

	if (subscribed) {
		return {
			mapsReached: false,
			publishersReached: false,
			phonesReached: false,
			anyLimitReached: false,
			mapsCount: mapsData?.maps?.length || 0,
			publishersCount: publishersData?.publishers?.length || 0,
			phonesCount,
		}
	}

	const mapsCount = mapsData?.maps?.length || 0
	const publishersCount = publishersData?.publishers?.length || 0

	const mapsReached = mapsCount >= Number(FREE_LIMITS.maps)
	const publishersReached = publishersCount >= Number(FREE_LIMITS.publishers)
	const phonesReached = phonesCount >= Number(FREE_LIMITS.phones)

	return {
		mapsReached,
		publishersReached,
		phonesReached,
		anyLimitReached: mapsReached || publishersReached || phonesReached,
		mapsCount,
		publishersCount,
		phonesCount,
	}
}
