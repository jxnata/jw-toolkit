import Button from 'components/Button'
import Input from 'components/Input'
import PasswordInput from 'components/PasswordInput'
import { useSession } from 'contexts/Auth'
import { Link, useRouter } from 'expo-router'
import { Stack } from 'expo-router/stack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthRequest } from 'utils/publisher-auth'
import * as S from './styles'

const Login = () => {
	const { control, formState, handleSubmit } = useForm<AuthRequest>()

	const router = useRouter()
	const { signIn } = useSession()

	const auth: SubmitHandler<AuthRequest> = async (data) => {
		const authorized = await signIn(data)

		if (!authorized) return alert('Usuário ou senha inválidos')

		router.replace('/publisher')
	}

	return (
		<S.Container>
			<Stack.Screen options={{ headerShown: false }} />
			<S.Background source={require('../../images/login-bg.jpg')}>
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
						<Button loading={formState.isSubmitting} onPress={handleSubmit(auth)}>
							Entrar
						</Button>
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
