import Button from 'components/Button'
import ButtonLink from 'components/ButtonLink'
import Input from 'components/Input'
import PasswordInput from 'components/PasswordInput'
import { Stack } from 'expo-router/stack'
import * as S from './styles'

const Login = () => {
	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Login' }} />
			<S.Background resizeMode='cover' source={require('../images/login-bg.jpg')}>
				<S.Mask />
				<S.Content>
					<Input placeholder='Seu nome' />
					<PasswordInput placeholder='Sua senha' />
					<Button>Entrar</Button>
					<ButtonLink>Entrar como admininstrador</ButtonLink>
				</S.Content>
			</S.Background>
		</S.Container>
	)
}

export default Login
