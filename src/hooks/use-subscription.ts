import { SubscriptionContext } from '@/contexts/subscription-provider'
import { useContext } from 'react'

export const useSubscription = () => {
	const context = useContext(SubscriptionContext)
	if (!context) {
		throw new Error('useSubscription must be used within an SubscriptionProvider')
	}
	return context
}
