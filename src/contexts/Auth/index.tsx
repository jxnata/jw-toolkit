import { ExecutionMethod, Models } from 'react-native-appwrite'
import { AppleAuthenticationCredential } from 'expo-apple-authentication'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import { account, functions } from '@services/appwrite'
import { storage } from '@database/index'
import { router } from 'expo-router'

type LocalSession = {
	current: Models.User<Models.Preferences> | null
	type: 'publisher' | 'admin' | null
	congregation: { id: string; name: string } | null
	appleAuthentication: (appleRequestResponse: AppleAuthenticationCredential) => Promise<void>
	// googleAuthentication: (user: User) => Promise<void>
	logout: () => Promise<void>
	loading: boolean
}

type AppSession = Models.User<Models.Preferences> | null

const initialState: LocalSession = {
	current: null,
	type: null,
	congregation: null,
	loading: true,
	appleAuthentication: async () => {},
	// googleAuthentication: async () => {},
	logout: async () => {},
}

const SessionContext = createContext<LocalSession>(initialState)

export function useSession() {
	return useContext(SessionContext)
}

export function SessionProvider(props: { children: React.ReactNode }) {
	const storedSession = storage.getString('session')
	const localSession: AppSession = storedSession ? JSON.parse(storedSession) : null
	const [loading, setLoading] = useState(!localSession)
	const [user, setUser] = useState<AppSession>(localSession)
	const [congregation, setCongregation] = useState<{ id: string; name: string } | null>(null)
	const type = useMemo(() => (user ? (user.labels.includes('admin') ? 'admin' : 'publisher') : null), [])

	async function appleAuthentication(appleRequestResponse: AppleAuthenticationCredential) {
		try {
			setLoading(true)
			const result = await functions.createExecution(
				'apple-auth',
				JSON.stringify(appleRequestResponse),
				false,
				undefined,
				ExecutionMethod.POST
			)
			if (result.responseStatusCode !== 200) throw new Error(result.responseBody)
			const token: Models.Token = JSON.parse(result.responseBody)
			await account.createSession(token.userId, token.secret)
			await init()
		} finally {
			setLoading(false)
		}
	}

	// async function googleAuthentication(user: User) {
	// 	try {
	// 		setLoading(true)
	// 		const result = await functions.createExecution(
	// 			'google-auth',
	// 			JSON.stringify({ idToken: user.idToken }),
	// 			false,
	// 			undefined,
	// 			ExecutionMethod.POST
	// 		)
	// 		if (result.responseStatusCode !== 200) throw new Error(result.responseBody)
	// 		const token: Models.Token = JSON.parse(result.responseBody)
	// 		await account.createSession(token.userId, token.secret)
	// 		await init()
	// 	} finally {
	// 		setLoading(false)
	// 	}
	// }

	async function logout() {
		// if (Platform.OS === 'android') {
		// 	await GoogleSignin.signOut()
		// }
		await account.deleteSession('current')
		storage.delete('congregation.name')
		storage.delete('congregation.id')
		setUser(null)
		setCongregation(null)
	}

	async function init() {
		try {
			const loggedIn = await account.get()

			const userType = loggedIn.labels.includes('admin') ? 'admin' : 'publisher'

			setUser(loggedIn)
			setCongregation({
				name: storage.getString('congregation.name') || '',
				id: storage.getString('congregation.id') || '',
			})

			storage.set('session', JSON.stringify(loggedIn))

			OneSignal.login(loggedIn.$id)
			OneSignal.User.addEmail(loggedIn.email)

			router.replace(`/${userType}`)
		} catch {
			setUser(null)
			storage.delete('session')
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		init()
	}, [])
	return (
		<SessionContext.Provider
			value={{
				current: user,
				type,
				congregation,
				loading,
				appleAuthentication,
				// googleAuthentication,
				logout,
			}}
		>
			{props.children}
		</SessionContext.Provider>
	)
}
