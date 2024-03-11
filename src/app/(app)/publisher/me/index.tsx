import { useSession } from 'contexts/Auth'
import { Stack } from 'expo-router'

import * as S from './styles'

const PublisherDetails = () => {
	const { session, signOut } = useSession()

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Meu Perfil', presentation: 'modal' }} />
			<S.Content>
				<S.Icon></S.Icon>
				<S.Title>{session.data.name}</S.Title>
				<S.Label>Congregação</S.Label>
				<S.Paragraph>{session.data.congregation.name}</S.Paragraph>
				<S.Button onPress={signOut}>
					<S.ButtonTitle>Sair</S.ButtonTitle>
				</S.Button>
			</S.Content>
		</S.Container>
	)
}

export default PublisherDetails
