import { useSession } from '@/contexts/session-provider'
import { useSubscription } from '@/hooks/use-subscription'
import db from '@/lib/db'
import { useMemo } from 'react'

const FREE_LIMITS = {
	maps: 75,
	publishers: 30,
}

export const useLimits = () => {
	const { congregation } = useSession()
	const { subscribed } = useSubscription()

	// Query maps count
	const { data: mapsData } = db.useQuery(
		congregation ? {
			maps: {
				$: {
					where: {
						congregation: congregation.id,
					},
				},
			}
		} : null
	)

	// Query publishers count
	const { data: publishersData } = db.useQuery(
		congregation ? {
			publishers: {
				$: {
					where: {
						congregation: congregation.id,
						approved: true,
					},
				},
			}
		} : null
	)

	const limits = useMemo(() => {
		if (subscribed) {
			return {
				mapsReached: false,
				publishersReached: false,
				anyLimitReached: false,
				mapsCount: mapsData?.maps?.length || 0,
				publishersCount: publishersData?.publishers?.length || 0,
			}
		}

		const mapsCount = mapsData?.maps?.length || 0
		const publishersCount = publishersData?.publishers?.length || 0

		const mapsReached = mapsCount >= FREE_LIMITS.maps
		const publishersReached = publishersCount >= FREE_LIMITS.publishers

		return {
			mapsReached,
			publishersReached,
			anyLimitReached: mapsReached || publishersReached,
			mapsCount,
			publishersCount,
		}
	}, [subscribed, mapsData, publishersData])

	return limits
} 