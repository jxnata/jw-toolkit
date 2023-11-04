import Button from 'components/Button'
import Input from 'components/Input'
import PasswordInput from 'components/PasswordInput'
import { Link } from 'expo-router'
import { Stack } from 'expo-router/stack'
import * as S from './styles'

const Login = () => {
	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Publicador' }} />
			<S.Background source={require('../images/login-bg.jpg')}>
				<S.Mask />
				<S.Content>
					<Input placeholder='Seu nome' />
					<PasswordInput placeholder='Sua senha' />
					<Button>Entrar</Button>
					<Link href='/admin'>
						<S.Accent>Entrar como admininstrador</S.Accent>
					</Link>
				</S.Content>
			</S.Background>
		</S.Container>
	)
}

export default Login
