import { authStorage } from 'database/auth'
import React, { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react'
import { adminAuth } from 'utils/admin-auth'
import { publisherAuth } from 'utils/publisher-auth'
import { IAuthContext, ISession } from './types'

const AuthContext = createContext<IAuthContext | null>(null)

export type AuthRequest = {
	user: string
	pass: string
	type: 'publisher' | 'admin'
}

const initialData = () => {
	try {
		const { data, token, type } = authStorage.getAuth()
		return { data: JSON.parse(data), token, type } as ISession
	} catch (error) {
		authStorage.clear()
	}
}

export function useSession() {
	const value = useContext(AuthContext)

	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error('useSession must be wrapped in a <SessionProvider />')
		}
	}

	return value
}

export function SessionProvider(props: PropsWithChildren) {
	const [session, setSession] = useState<ISession>(initialData())
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

		authStorage.setAuth({ type, token: authorized.token, data: JSON.stringify(authorized.user) })

		setSession({
			data: authorized.user,
			token: authorized.token,
			type,
		})
	}, [])

	const signIn = useCallback(async ({ user, pass, type }: AuthRequest) => {
		setLoading(true)

		if (type === 'publisher') {
			await authHandlerPublisher({ user, pass, type })
		}
		if (type === 'admin') {
			await authHandlerAdmin({ user, pass, type })
		}

		setLoading(false)

		return true
	}, [])

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
