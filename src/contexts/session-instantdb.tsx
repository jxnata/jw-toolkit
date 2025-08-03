import { storage } from '@/database/index'
import db from '@/lib/db'
import { id, User as InstantUser } from '@instantdb/react-native'
import { GoogleSignin, User } from '@react-native-google-signin/google-signin'
import { AppleAuthenticationCredential } from 'expo-apple-authentication'
import { router } from 'expo-router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import { OneSignal } from 'react-native-onesignal'

type LocalSession = {
	current: (InstantUser & { name: string }) | null
	type: 'publisher' | 'admin' | null
	congregation: { id: string; name: string } | null
	publisher: string | null
	appleAuthentication: (appleRequestResponse: AppleAuthenticationCredential, cong: string) => Promise<void>
	googleAuthentication: (user: User, cong: string) => Promise<void>
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
	const { user, isLoading, error } = db.useAuth()
	const [publisher, setPublisher] = useState<string | null>(null)
	const [congregation, setCongregation] = useState<{ id: string; name: string } | null>(null)

	// Query publisher data based on authenticated user
	const { data: publisherData } = db.useQuery({
		publishers: {
			$: {
				where: { user: user?.id },
				limit: 1,
			},
			congregation: {},
		},
	})

	const currentPublisher = publisherData?.publishers?.[0]

	// Determine user type based on publisher level
	const type = useMemo(() => {
		if (!currentPublisher) return null
		return currentPublisher.level === 1 ? 'admin' : 'publisher'
	}, [currentPublisher])

	async function appleAuthentication(appleRequestResponse: AppleAuthenticationCredential, congregationId: string) {
		try {
			if (!appleRequestResponse.identityToken) {
				throw new Error('No identity token received from Apple')
			}

			const { user } = await db.auth.signInWithIdToken({
				clientName: 'apple',
				idToken: appleRequestResponse.identityToken,
			})

			// Store congregation info
			storage.set('congregation.id', congregationId)
			await handlePostAuthSetup(congregationId, user)
		} catch (error) {
			console.error('Apple authentication error:', error)
			throw error
		}
	}

	async function googleAuthentication(googleRequestResponse: User, congregationId: string) {
		try {
			if (!googleRequestResponse.idToken) {
				throw new Error('No ID token received from Google')
			}

			const { user } = await db.auth.signInWithIdToken({
				clientName: 'google',
				idToken: googleRequestResponse.idToken,
			})

			// Store congregation info
			storage.set('congregation.id', congregationId)
			await handlePostAuthSetup(congregationId, user)
		} catch (error) {
			console.error('Google authentication error:', error)
			throw error
		}
	}

	async function handlePostAuthSetup(congregationId: string, user: InstantUser) {
		// Get congregation info
		const { data } = await db.queryOnce({
			congregations: {
				$: { where: { id: congregationId } },
			},
			publishers: {
				$: { where: { user: user?.id } },
			},
		})

		const congregationInfo = data?.congregations?.[0]
		const publisherInfo = data?.publishers?.[0]

		if (congregationInfo) {
			storage.set('congregation.name', congregationInfo.name)
			setCongregation({
				id: congregationId,
				name: congregationInfo.name,
			})
		}

		// Check if publisher profile exists, create if not
		if (user && !publisherInfo) {
			const publisherId = id()

			await db.transact([
				db.tx.publishers[publisherId]
					.update({
						name: user.email || 'Unknown User',
						level: 3, // Default publisher level
						approved: false, // Requires admin approval
					})
					.link({
						user: user.id,
						congregation: congregationId,
					}),
			])

			storage.set('user.publisher', publisherId)
			setPublisher(publisherId)
		} else if (currentPublisher) {
			storage.set('user.publisher', currentPublisher.id)
			setPublisher(currentPublisher.id)
		}

		// Setup OneSignal
		OneSignal.login(user!.id)
		OneSignal.User.addEmail(user!.email)

		// Navigate to appropriate section
		const userType = currentPublisher?.level === 1 ? 'admin' : 'publisher'
		router.replace(`/${userType}`)
	}

	async function logout() {
		if (Platform.OS === 'android') {
			await GoogleSignin.signOut()
		}

		await db.auth.signOut()

		// Clear storage
		storage.delete('congregation.name')
		storage.delete('congregation.id')
		storage.delete('user.publisher')

		setPublisher(null)
		setCongregation(null)
	}

	// Initialize session data when user changes
	useEffect(() => {
		if (user && currentPublisher) {
			const storedCongregationId = storage.getString('congregation.id')
			const storedCongregationName = storage.getString('congregation.name')
			const storedPublisher = storage.getString('user.publisher')

			if (storedCongregationId && storedCongregationName) {
				setCongregation({
					id: storedCongregationId,
					name: storedCongregationName,
				})
			} else if (currentPublisher.congregation) {
				setCongregation({
					id: currentPublisher.congregation.id,
					name: currentPublisher.congregation.name,
				})
				storage.set('congregation.id', currentPublisher.congregation.id)
				storage.set('congregation.name', currentPublisher.congregation.name)
			}

			if (storedPublisher) {
				setPublisher(storedPublisher)
			} else {
				setPublisher(currentPublisher.id)
				storage.set('user.publisher', currentPublisher.id)
			}

			// Setup OneSignal
			OneSignal.login(user.id)
			OneSignal.User.addEmail(user.email)
		}
	}, [user, currentPublisher])

	return (
		<SessionContext.Provider
			value={{
				current: user ? { ...user, name: publisherData?.publishers?.[0]?.name || '' } : null,
				type,
				congregation,
				publisher,
				loading: isLoading,
				appleAuthentication,
				googleAuthentication,
				logout,
			}}
		>
			{props.children}
		</SessionContext.Provider>
	)
}
