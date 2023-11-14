import { useSession } from 'contexts/Auth'
import { Redirect, Slot } from 'expo-router'

export default function App() {
	const { session } = useSession()

	if (session.type === 'publisher') {
		return <Redirect href='/publisher' />
	}

	if (session.type === 'admin') {
		return <Redirect href='/admin' />
	}

	return <Slot />
}
