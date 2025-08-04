import { patchSubscription } from '@/utils/subscriptions'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useSession } from './session-instantdb'

export const SubscriptionContext = createContext<{
	subscribed: boolean
	checkSubscription: () => Promise<void>
}>({
	subscribed: false,
	checkSubscription: async () => {},
})

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
	const [subscribed, setSubscribed] = useState<boolean>(false)
	const { type, current } = useSession()

	const fetchSubscription = useCallback(async () => {
		if (!current) return
		const isSubscribed = await patchSubscription(current.refresh_token)
		setSubscribed(isSubscribed)
	}, [current])

	useEffect(() => {
		if (!current) return
		if (type === 'publisher') return

		fetchSubscription()
	}, [current, type])

	return (
		<SubscriptionContext.Provider value={{ subscribed, checkSubscription: fetchSubscription }}>
			{children}
		</SubscriptionContext.Provider>
	)
}
