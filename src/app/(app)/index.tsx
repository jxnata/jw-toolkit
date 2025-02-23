import { useSession } from '@contexts/session'
import { Redirect, Slot, Stack } from 'expo-router'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function App() {
	const { type, loading } = useSession()

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			{loading ? (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size='large' />
				</View>
			) : type === 'publisher' ? (
				<Redirect href='/publisher' />
			) : type === 'admin' ? (
				<Redirect href='/admin' />
			) : (
				<Slot />
			)}
		</>
	)
}
