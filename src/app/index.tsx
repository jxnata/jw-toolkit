import Button from 'components/Button'
import Input from 'components/Input'
import PasswordInput from 'components/PasswordInput'
import { authStorage } from 'database/authentication'
import { Link, useRouter } from 'expo-router'
import { Stack } from 'expo-router/stack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthRequest, publisherAuth } from 'utils/publisher-auth'
import * as S from './styles'

const Login = () => {
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthRequest>()

	const router = useRouter()

	const auth: SubmitHandler<AuthRequest> = async (data) => {
		console.tron.log(data)
		const authorized = await publisherAuth(data)

		if (!authorized) {
			return alert('Usuário ou senha inválidos')
		}

		authStorage.setAuth({ type: 'publisher', token: authorized.token })

		router.replace('/publisher')
	}

	return (
		<S.Container>
			<Stack.Screen options={{ headerShown: false }} />
			<S.Background source={require('../images/login-bg.jpg')}>
				<S.Mask />
				<SafeAreaView>
					<S.Content>
						<S.Title>Publicador</S.Title>
						<Controller
							control={control}
							rules={{ required: true }}
							name='username'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input placeholder='Seu nome' onBlur={onBlur} onChangeText={onChange} value={value} />
							)}
						/>
						<Controller
							control={control}
							rules={{ required: true }}
							name='passcode'
							render={({ field: { onChange, onBlur, value } }) => (
								<PasswordInput
									placeholder='Sua senha'
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
								/>
							)}
						/>
						<Button onPress={handleSubmit(auth)}>Entrar</Button>
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
