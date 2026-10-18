import { STORAGE_KEYS } from '@/constants/storage-keys'
import { storage } from '@/database/index'
import usePublisher from '@/hooks/use-publisher'
import { Congregation, Publisher } from '@/interfaces'
import db from '@/lib/db'
import { publishersService } from '@/services/instantdb/publishers-service'
import { isOfflineError } from '@/utils/is-offline-error'
import { isPendingPublisher } from '@/utils/is-pending-publisher'
import { User as InstantUser } from '@instantdb/react-native'
import NetInfo from '@react-native-community/netinfo'
import { GoogleSignin, User } from '@react-native-google-signin/google-signin'
import { AppleAuthenticationCredential } from 'expo-apple-authentication'
import * as Sentry from '@sentry/react-native'
import { createContext, useContext, useEffect } from 'react'
import { AppState, Platform } from 'react-native'
import Purchases from 'react-native-purchases'

type LocalSession = {
	current: (InstantUser & { name: string }) | null
	type: 'publisher' | 'admin' | null
	// Joined a congregation but was not approved by an admin yet
	pending: boolean
	congregation: Congregation | null
	publisher: Publisher | null
	appleAuthentication: (appleRequestResponse: AppleAuthenticationCredential) => Promise<void>
	googleAuthentication: (user: User) => Promise<void>
	logout: () => Promise<void>
	loading: boolean
}

const initialState: LocalSession = {
	current: null,
	type: null,
	pending: false,
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
	const { user, isLoading } = db.useAuth()
	const { publisher, loading: publisherLoading } = usePublisher({
		userId: user ? user.id : undefined,
		enabled: !!user,
	})

	const type = publisher ? (publisher.level === 1 ? 'admin' : 'publisher') : null

	const congregation = publisher ? publisher.congregation : null

	const pending = isPendingPublisher(publisher)

	const isLoadingSession = !user ? isLoading : isLoading || publisherLoading

	async function appleAuthentication(appleRequestResponse: AppleAuthenticationCredential) {
		try {
			if (!appleRequestResponse.identityToken) {
				throw new Error('No identity token received from Apple')
			}

			const { user } = await db.auth.signInWithIdToken({
				clientName: 'apple',
				idToken: appleRequestResponse.identityToken,
			})

			await createPublisherIfNotExists(
				user.id,
				appleRequestResponse.fullName
					? appleRequestResponse.fullName.givenName + ' ' + appleRequestResponse.fullName.familyName || ''
					: 'Apple User'
			)
		} catch (error) {
			console.error('Apple authentication error:', error)
			throw error
		}
	}

	async function googleAuthentication(googleRequestResponse: User) {
		try {
			if (!googleRequestResponse.idToken) {
				throw new Error('No ID token received from Google')
			}

			const { user } = await db.auth.signInWithIdToken({
				clientName: 'google-android',
				idToken: googleRequestResponse.idToken,
			})

			await createPublisherIfNotExists(
				user.id,
				googleRequestResponse.user
					? googleRequestResponse.user.givenName + ' ' + googleRequestResponse.user.familyName || ''
					: 'Google User'
			)
		} catch (error) {
			console.error('Google authentication error:', error)
			throw error
		}
	}

	const createPublisherIfNotExists = async (userId: string, name: string) => {
		const pub = await publishersService.searchByUserId(userId)
		if (pub) return

		await publishersService.createPublisher({
			userId,
			name,
			level: 3,
			approved: false,
		})
	}

	async function logout() {
		if (Platform.OS === 'android') {
			await GoogleSignin.signOut()
		}

		await Purchases.logOut()

		await db.auth.signOut()

		// Clear storage
		storage.remove(STORAGE_KEYS.CONGREGATION_NAME)
		storage.remove(STORAGE_KEYS.CONGREGATION_ID)
		storage.remove(STORAGE_KEYS.USER_PUBLISHER)
	}

	// Initialize session data when user changes
	useEffect(() => {
		if (!user) return

		let cancelled = false
		let synced = false
		let syncing = false

		// Without connection the values already saved are kept and the sync runs again later
		const report = (error: unknown) => {
			if (isOfflineError(error)) return
			Sentry.captureException(error)
		}

		const getPublisherInfo = async () => {
			if (cancelled || synced || syncing) return
			syncing = true

			try {
				await Purchases.logIn(user.id).catch(report)

				const pub = await publishersService.searchByUserId(user.id)

				if (cancelled) return

				synced = true

				if (!pub) return

				storage.set(STORAGE_KEYS.USER_PUBLISHER, pub.id)

				if (pub.congregation) {
					storage.set(STORAGE_KEYS.CONGREGATION_ID, pub.congregation.id)
					storage.set(STORAGE_KEYS.CONGREGATION_NAME, pub.congregation.name)
				}
			} catch (error) {
				report(error)
			} finally {
				syncing = false
			}
		}

		getPublisherInfo()

		const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
			if (state.isConnected) getPublisherInfo()
		})

		const appState = AppState.addEventListener('change', (status) => {
			if (status === 'active') getPublisherInfo()
		})

		return () => {
			cancelled = true
			unsubscribeNetInfo()
			appState.remove()
		}
	}, [user])

	return (
		<SessionContext.Provider
			value={{
				current: user ? { ...user, name: publisher?.name || '' } : null,
				type,
				pending,
				congregation: congregation || null,
				publisher: publisher as Publisher,
				loading: isLoadingSession,
				appleAuthentication,
				googleAuthentication,
				logout,
			}}>
			{props.children}
		</SessionContext.Provider>
	)
}
