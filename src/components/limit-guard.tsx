import { useSession } from '@/contexts/session-provider'
import { useLimits } from '@/hooks/use-limits'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

interface LimitGuardProps {
	children: React.ReactNode
	checkMaps?: boolean
	checkPublishers?: boolean
}

export const LimitGuard = ({ children, checkMaps = false, checkPublishers = false }: LimitGuardProps) => {
	const { anyLimitReached, mapsReached, publishersReached } = useLimits()
	const { type } = useSession()

	useEffect(() => {
		// Only check limits for admin users
		if (type !== 'admin') return

		// Check if we need to redirect based on what's being checked
		const shouldRedirect = (checkMaps && mapsReached) || (checkPublishers && publishersReached) || anyLimitReached

		if (shouldRedirect) {
			router.push('/limit-alert')
		}
	}, [anyLimitReached, mapsReached, publishersReached, checkMaps, checkPublishers, type])

	return <View style={{ flex: 1 }}>{children}</View>
}
