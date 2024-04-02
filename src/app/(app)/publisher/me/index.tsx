import Button from 'components/Button'
import { APP_VERSION } from 'constants/content'
import { useSession } from 'contexts/Auth'
import { Stack, useRouter } from 'expo-router'
import { useCallback } from 'react'
import { IVinculatedPublisher } from 'types/models/Publisher'

import * as S from './styles'

const PublisherDetails = () => {
	const { session, loading, signOut, swap } = useSession<IVinculatedPublisher>()
	const router = useRouter()

	const handleSwap = useCallback(async () => {
		const swapped = await swap()

		if (!swapped) return alert('Erro ao trocar para admin.')

		while (router.canGoBack()) {
			router.back()
		}
		router.replace('/admin')
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
					{!!session.data.user && (
						<Button onPress={handleSwap} loading={loading}>
							Trocar para admin
						</Button>
					)}
					<S.Button onPress={signOut} disabled={loading}>
						<S.ButtonTitle>Sair</S.ButtonTitle>
					</S.Button>
				</S.ButtonGroup>
				<S.Version>Versão: {APP_VERSION}</S.Version>
			</S.Content>
		</S.Container>
	)
}

export default PublisherDetails
