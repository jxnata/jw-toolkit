import { useSession } from '@/contexts/session-provider'
import { useLimits } from '@/hooks/use-limits'
import { router } from 'expo-router'

export const useLimitCheck = () => {
	const { anyLimitReached, mapsReached, publishersReached } = useLimits()
	const { type } = useSession()

	const checkMapLimit = () => {
		if (type !== 'admin') return true
		if (mapsReached) {
			router.push('/(app)/limit-alert')
			return false
		}
		return true
	}

	const checkPublisherLimit = () => {
		if (type !== 'admin') return true
		if (publishersReached) {
			router.push('/(app)/limit-alert')
			return false
		}
		return true
	}

	const checkAnyLimit = () => {
		if (type !== 'admin') return true
		if (anyLimitReached) {
			router.push('/(app)/limit-alert')
			return false
		}
		return true
	}

	return {
		checkMapLimit,
		checkPublisherLimit,
		checkAnyLimit,
		mapsReached,
		publishersReached,
		anyLimitReached,
	}
}
