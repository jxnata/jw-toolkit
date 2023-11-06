import Button from 'components/Button'
import Input from 'components/Input'
import PasswordInput from 'components/PasswordInput'
import { Link, useRouter } from 'expo-router'
import { Stack } from 'expo-router/stack'
import { useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as S from './styles'

const Login = () => {
	const router = useRouter()

	const auth = useCallback(async () => {
		router.replace('/publisher')
	}, [])

	return (
		<S.Container>
			<Stack.Screen options={{ headerShown: false }} />
			<S.Background source={require('../images/login-bg.jpg')}>
				<S.Mask />
				<SafeAreaView>
					<S.Content>
						<S.Title>Publicador</S.Title>
						<Input placeholder='Seu nome' />
						<PasswordInput placeholder='Sua senha' />
						<Button onPress={auth}>Entrar</Button>
						<Link href='/admin'>
							<S.Accent>Entrar como admininstrador</S.Accent>
						</Link>
					</S.Content>
				</SafeAreaView>
			</S.Background>
		</S.Container>
	)
}

export default Login
