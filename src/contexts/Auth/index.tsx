import { authStorage } from 'database/auth'
import React, { createContext, useCallback, useContext, useState } from 'react'
import { AuthRequest, publisherAuth } from 'utils/publisher-auth'
import { IAuthContext, ISession } from './types'

const AuthContext = createContext<IAuthContext | null>(null)

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

export function SessionProvider(props: React.PropsWithChildren) {
	const [session, setSession] = useState<ISession>(initialData())
	const [loading, setLoading] = useState<boolean>(false)

	const signIn = useCallback(async (data: AuthRequest) => {
		setLoading(true)

		const authorized = await publisherAuth(data)

		if (!authorized) return false

		authStorage.setAuth({ type: 'publisher', token: authorized.token, data: JSON.stringify(authorized.publisher) })

		setSession({
			data: authorized.publisher,
			token: authorized.token,
			type: 'publisher',
		})

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
