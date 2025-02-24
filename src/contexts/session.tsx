import { ExecutionMethod, Models } from 'react-native-appwrite'
import { AppleAuthenticationCredential } from 'expo-apple-authentication'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import { account, functions } from '@services/appwrite'
import { history, storage } from '@database/index'
import { router } from 'expo-router'
import { GoogleSignin, User } from '@react-native-google-signin/google-signin'

type LocalSession = {
	current: Models.User<Models.Preferences> | null
	type: 'publisher' | 'admin' | null
	congregation: { id: string; name: string } | null
	publisher: string | null
	appleAuthentication: (appleRequestResponse: AppleAuthenticationCredential, cong: string) => Promise<void>
	googleAuthentication: (user: User, cong: string) => Promise<void>
	logout: () => Promise<void>
	loading: boolean
}

type AppSession = Models.User<Models.Preferences> | null

const initialState: LocalSession = {
	current: null,
	type: null,
	congregation: null,
	publisher: null,
	loading: true,
	appleAuthentication: async () => {},
	googleAuthentication: async () => {},
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
	const [publisher, setPublisher] = useState<string | null>(null)
	const [congregation, setCongregation] = useState<{ id: string; name: string } | null>(null)
	const type = useMemo(() => (user ? (user.labels.includes('admin') ? 'admin' : 'publisher') : null), [user])

	async function appleAuthentication(appleRequestResponse: AppleAuthenticationCredential, cong: string) {
		try {
			setLoading(true)
			const result = await functions.createExecution(
				'oauth',
				JSON.stringify({ ...appleRequestResponse, provider: 'apple', congregation: cong }),
				false,
				undefined,
				ExecutionMethod.POST
			)
			if (result.responseStatusCode !== 200) throw new Error(result.responseBody)
			const token: Models.Token & { publisherId: string } = JSON.parse(result.responseBody)
			await account.createSession(token.userId, token.secret)
			storage.set('user.publisher', token.publisherId)
			await init()
		} finally {
			setLoading(false)
		}
	}

	async function googleAuthentication(user: User, cong: string) {
		try {
			setLoading(true)
			const result = await functions.createExecution(
				'oauth',
				JSON.stringify({ idToken: user.idToken, provider: 'google', congregation: cong }),
				false,
				undefined,
				ExecutionMethod.POST
			)
			if (result.responseStatusCode !== 200) throw new Error(result.responseBody)
			const token: Models.Token & { publisherId: string } = JSON.parse(result.responseBody)
			await account.createSession(token.userId, token.secret)
			storage.set('user.publisher', token.publisherId)
			await init()
		} finally {
			setLoading(false)
		}
	}

	async function logout() {
		if (Platform.OS === 'android') {
			await GoogleSignin.signOut()
		}
		await account.deleteSession('current')
		storage.delete('congregation.name')
		storage.delete('congregation.id')
		storage.delete('user.publisher')
		setUser(null)
		setPublisher(null)
		setCongregation(null)
	}

	async function init() {
		try {
			setLoading(true)

			const loggedIn = await account.get()

			const userType = loggedIn.labels.includes('admin') ? 'admin' : 'publisher'

			setUser(loggedIn)
			setCongregation({
				name: storage.getString('congregation.name') || '',
				id: storage.getString('congregation.id') || '',
			})
			setPublisher(storage.getString('user.publisher') || null)

			storage.set('session', JSON.stringify(loggedIn))
			history.set('last.congregation', storage.getString('congregation.id') || '')

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
				publisher,
				loading,
				appleAuthentication,
				googleAuthentication,
				logout,
			}}
		>
			{props.children}
		</SessionContext.Provider>
	)
}
