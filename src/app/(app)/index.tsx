import { useSession } from '@contexts/Auth'
import { Redirect, Slot } from 'expo-router'

export default function App() {
	const { type } = useSession()

	if (type === 'publisher') {
		return <Redirect href='/publisher' />
	}

	if (type === 'admin') {
		return <Redirect href='/admin' />
	}

	return <Slot />
}
