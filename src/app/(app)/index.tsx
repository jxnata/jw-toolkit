import { useSession } from '@/contexts/session-provider'
import { Redirect, Slot, Stack } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function App() {
	const { type, loading, congregation } = useSession()

	if (!congregation) {
		return <Redirect href='/select-congregation' />
	}

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
