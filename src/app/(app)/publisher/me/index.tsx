import { APP_VERSION } from '@constants/content'
import { useSession } from '@contexts/session'
import { Stack } from 'expo-router'
import { Alert } from 'react-native'

import * as S from './styles'

const PublisherDetails = () => {
	const { current, congregation, loading, logout } = useSession()

	const handleLogout = () => {
		Alert.alert('Sair', 'Tem certeza que deseja sair?', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'Sim',
				onPress: logout,
			},
		])
	}

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
					<S.Button onPress={handleLogout} disabled={loading}>
						<S.ButtonTitle>Sair</S.ButtonTitle>
					</S.Button>
				</S.ButtonGroup>
				<S.Version>Versão: {APP_VERSION}</S.Version>
			</S.Content>
		</S.Container>
	)
}

export default PublisherDetails
