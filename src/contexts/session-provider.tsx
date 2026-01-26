import { storage } from '@/database/index'
import usePublisher from '@/hooks/use-publisher'
import { Congregation, Publisher } from '@/interfaces'
import db from '@/lib/db'
import { publishersService } from '@/services/instantdb/publishers-service'
import { User as InstantUser } from '@instantdb/react-native'
import { GoogleSignin, User } from '@react-native-google-signin/google-signin'
import { AppleAuthenticationCredential } from 'expo-apple-authentication'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { Platform } from 'react-native'
import Purchases from 'react-native-purchases'

type LocalSession = {
	current: (InstantUser & { name: string }) | null
	type: 'publisher' | 'admin' | null
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

	const type = useMemo(() => {
		if (!publisher) return null
		return publisher.level === 1 ? 'admin' : 'publisher'
	}, [publisher])

	const congregation = useMemo(() => {
		if (!publisher) return null
		return publisher.congregation
	}, [publisher])

	const isLoadingSession = useMemo(() => {
		if (!user) return isLoading
		return isLoading || publisherLoading
	}, [user, isLoading, publisherLoading])

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
					? appleRequestResponse.fullName.givenName + ' ' + appleRequestResponse.fullName.familyName
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
					? googleRequestResponse.user.givenName + ' ' + googleRequestResponse.user.familyName
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
		storage.remove('congregation.name')
		storage.remove('congregation.id')
		storage.remove('user.publisher')
	}

	// Initialize session data when user changes
	useEffect(() => {
		const getPublisherInfo = async () => {
			if (!user) return

			await Purchases.logIn(user.id)

			const pub = await publishersService.searchByUserId(user.id)

			if (!pub) return

			storage.set('user.publisher', pub.id)

			if (pub.congregation) {
				storage.set('congregation.id', pub.congregation.id)
				storage.set('congregation.name', pub.congregation.name)
			}
		}

		if (user) getPublisherInfo()
	}, [user])

	return (
		<SessionContext.Provider
			value={{
				current: user ? { ...user, name: publisher?.name || '' } : null,
				type,
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
