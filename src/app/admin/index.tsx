import Button from 'components/Button'
import Input from 'components/Input'
import PasswordInput from 'components/PasswordInput'
import { Stack } from 'expo-router/stack'
import * as S from './styles'

const Login = () => {
	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Login Administrador' }} />
			<S.Background source={require('../../images/login-bg.jpg')}>
				<S.Mask />
				<S.Content>
					<S.Paragraph>
						Você está fazendo login como administrador, isso te dará acesso a fazer designações, criar
						publicadores, mapas, etc.
					</S.Paragraph>
					<Input placeholder='Usuário' />
					<PasswordInput placeholder='Senha' />
					<Button>Entrar</Button>
				</S.Content>
			</S.Background>
		</S.Container>
	)
}

export default Login
