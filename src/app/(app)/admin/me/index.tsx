import { APP_VERSION } from '@constants/content'
import { useSession } from '@contexts/Auth'
import { Stack } from 'expo-router'

import * as S from './styles'

const UserDetails = () => {
	const { current, loading, congregation, logout } = useSession()

	if (!current) return null
	if (!congregation) return null

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Meu Perfil', presentation: 'modal' }} />
			<S.Content>
				<S.Icon></S.Icon>
				<S.Title>{current.name}</S.Title>
				<S.Label>Congregação</S.Label>
				<S.Paragraph>{congregation.name}</S.Paragraph>
				<S.ButtonGroup>
					<S.Button onPress={logout} disabled={loading}>
						<S.ButtonTitle>Sair</S.ButtonTitle>
					</S.Button>
				</S.ButtonGroup>
				<S.Version>Versão: {APP_VERSION}</S.Version>
			</S.Content>
		</S.Container>
	)
}

export default UserDetails
