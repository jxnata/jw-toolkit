import Button from 'components/Button'
import { useSession } from 'contexts/Auth'
import { Stack, useRouter } from 'expo-router'
import { useCallback } from 'react'
import { IUser } from 'types/models/User'

import * as S from './styles'

const UserDetails = () => {
	const { session, loading, signOut, swap } = useSession<IUser>()
	const router = useRouter()

	const handleSwap = useCallback(async () => {
		const swapped = await swap()

		if (!swapped) return alert('Erro ao trocar para publicador.')

		while (router.canGoBack()) {
			router.back()
		}
		router.replace('/publisher')
	}, [router, swap])

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Meu Perfil', presentation: 'modal' }} />
			<S.Content>
				<S.Icon></S.Icon>
				<S.Title>{session.data.name}</S.Title>
				<S.Label>Congregação</S.Label>
				<S.Paragraph>{session.data.congregation.name}</S.Paragraph>
				<S.ButtonGroup>
					{!!session.data.publisher && (
						<Button loading={loading} onPress={handleSwap}>
							Trocar para publicador
						</Button>
					)}
					<S.Button onPress={signOut} disabled={loading}>
						<S.ButtonTitle>Sair</S.ButtonTitle>
					</S.Button>
				</S.ButtonGroup>
			</S.Content>
		</S.Container>
	)
}

export default UserDetails
