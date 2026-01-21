import { useSession } from '@/contexts/session-provider'
import { useLimits } from '@/hooks/use-limits'
import { router } from 'expo-router'
import { useCallback } from 'react'

export const useLimitCheck = () => {
	const { anyLimitReached, mapsReached, publishersReached } = useLimits()
	const { type } = useSession()

	const checkMapLimit = useCallback(() => {
		if (type !== 'admin') return true
		if (mapsReached) {
			router.push('/(app)/limit-alert')
			return false
		}
		return true
	}, [mapsReached, type])

	const checkPublisherLimit = useCallback(() => {
		if (type !== 'admin') return true
		if (publishersReached) {
			router.push('/(app)/limit-alert')
			return false
		}
		return true
	}, [publishersReached, type])

	const checkAnyLimit = useCallback(() => {
		if (type !== 'admin') return true
		if (anyLimitReached) {
			router.push('/(app)/limit-alert')
			return false
		}
		return true
	}, [anyLimitReached, type])

	return {
		checkMapLimit,
		checkPublisherLimit,
		checkAnyLimit,
		mapsReached,
		publishersReached,
		anyLimitReached,
	}
}
