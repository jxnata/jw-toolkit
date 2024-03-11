import { authStorage } from 'database/auth'
import React, { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react'
import { IPublisher } from 'types/models/Publisher'
import { IUser } from 'types/models/User'
import { adminAuth } from 'utils/admin-auth'
import { publisherAuth } from 'utils/publisher-auth'

import { IAuthContext, ISession } from './types'

const AuthContext = createContext<IAuthContext<IUser | IPublisher> | null>(null)

export type AuthRequest = {
	user: string
	pass: string
	type: 'publisher' | 'admin'
}

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

	const authHandlerPublisher = useCallback(async ({ user, pass, type }: AuthRequest) => {
		const authorized = await publisherAuth({ username: user, passcode: pass })

		if (!authorized) return false

		authStorage.setAuth({ type, token: authorized.token, data: JSON.stringify(authorized.publisher) })

		setSession({
			data: authorized.publisher,
			token: authorized.token,
			type,
		})
	}, [])

	const authHandlerAdmin = useCallback(async ({ user, pass, type }: AuthRequest) => {
		const authorized = await adminAuth({ username: user, password: pass })

		if (!authorized) return false

		authStorage.setAuth({
			type,
			token: authorized.token,
			data: JSON.stringify(authorized.user),
			private_key: authorized.private_key,
		})

		setSession({
			data: authorized.user,
			token: authorized.token,
			private_key: authorized.private_key,
			type,
		})
	}, [])

	const signIn = useCallback(
		async ({ user, pass, type }: AuthRequest) => {
			setLoading(true)

			if (type === 'publisher') {
				await authHandlerPublisher({ user, pass, type })
			}
			if (type === 'admin') {
				await authHandlerAdmin({ user, pass, type })
			}

			setLoading(false)

			return true
		},
		[authHandlerAdmin, authHandlerPublisher]
	)

	const signOut = useCallback(() => {
		authStorage.clear()
		setSession(null)
	}, [])

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				session,
				loading,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	)
}
