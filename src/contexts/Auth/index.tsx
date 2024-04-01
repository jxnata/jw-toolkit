import { authStorage } from 'database/auth'
import React, { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react'
import { OneSignal } from 'react-native-onesignal'
import { IPublisher } from 'types/models/Publisher'
import { IUser } from 'types/models/User'

import { authHandlerAdmin } from './handlers/admin'
import { authHandlerPublisher } from './handlers/publisher'
import { swapHandlerPublisher } from './handlers/swap-publisher'
import { swapHandlerUser } from './handlers/swap-user'
import { AuthRequest, IAuthContext, ISession } from './types'

const AuthContext = createContext<IAuthContext<IUser | IPublisher> | null>(null)

const initialData = () => {
	try {
		const { data, token, type, private_key } = authStorage.getAuth()
		return { data: JSON.parse(data), token, type, private_key } as ISession<IUser | IPublisher>
	} catch {
		authStorage.clear()
	}
}

export function useSession<T extends IUser | IPublisher = IUser | IPublisher>() {
	const value = useContext(AuthContext)

	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error('useSession must be wrapped in a <SessionProvider />')
		}
	}

	return value as IAuthContext<T>
}

export function SessionProvider(props: PropsWithChildren) {
	const [session, setSession] = useState<ISession<IUser | IPublisher>>(initialData())
	const [loading, setLoading] = useState<boolean>(false)

	const signIn = useCallback(async ({ user, pass, type, congregation }: AuthRequest) => {
		try {
			setLoading(true)

			if (type === 'publisher') {
				await authHandlerPublisher({ user, pass, congregation, setSession })
			}
			if (type === 'admin') {
				await authHandlerAdmin({ user, pass, congregation, setSession })
			}

			return true
		} catch {
			return false
		} finally {
			setLoading(false)
		}
	}, [])

	const swap = useCallback(async () => {
		try {
			setLoading(true)

			if (!session) return false

			OneSignal.logout()

			if (session.type === 'publisher') {
				await swapHandlerPublisher({ setSession })
			}

			if (session.type === 'admin') {
				await swapHandlerUser({ setSession, currentUser: session.data._id })
			}

			setLoading(false)
			return true
		} catch {
			setLoading(false)
			return false
		}
	}, [session])

	const signOut = useCallback(() => {
		OneSignal.logout()
		authStorage.clear()
		setSession(null)
	}, [])

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				swap,
				session,
				loading,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	)
}
