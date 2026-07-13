import { checkSubscription } from '@/lib/revenuecat'
import { patchSubscription } from '@/utils/subscriptions'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useSession } from './session-provider'

export const SubscriptionContext = createContext<{
	subscribed: boolean
	expired: boolean
	isUserSubscribed: boolean
	checkSubscription: () => Promise<void>
}>({
	subscribed: false,
	expired: false,
	isUserSubscribed: false,
	checkSubscription: async () => {},
})

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
	const [subscribed, setSubscribed] = useState<boolean>(false)
	const [expired, setExpired] = useState<boolean>(false)
	const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(false)
	const { type, current } = useSession()
	const [prevCurrent, setPrevCurrent] = useState(current)

	if (current !== prevCurrent) {
		setPrevCurrent(current)
		if (!current) {
			setSubscribed(false)
			setIsUserSubscribed(false)
		}
	}

	const fetchSubscription = useCallback(async () => {
		try {
			if (!current) return

			const { isPro, expired } = await patchSubscription(current.refresh_token)
			setSubscribed(isPro)
			setExpired(expired)
		} catch (error) {
			console.error(error)
		}
	}, [current])

	const checkUserSubscription = useCallback(async () => {
		try {
			if (!current) return
			const isSubscribed = await checkSubscription()
			setIsUserSubscribed(!!isSubscribed)
		} catch (error) {
			console.error(error)
		}
	}, [current])

	useEffect(() => {
		if (!current || type === 'publisher') return

		const load = async () => {
			await fetchSubscription()
			await checkUserSubscription()
		}
		load()
	}, [current, type, fetchSubscription, checkUserSubscription])

	return (
		<SubscriptionContext.Provider value={{ subscribed, checkSubscription: fetchSubscription, isUserSubscribed, expired }}>
			{children}
		</SubscriptionContext.Provider>
	)
}
