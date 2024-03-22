import Button from 'components/Button'
import Input from 'components/Input'
import PasswordInput from 'components/PasswordInput'
import { AuthRequest, useSession } from 'contexts/Auth'
import { useRouter } from 'expo-router'
import { Stack } from 'expo-router/stack'
import { useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as S from './styles'

const Login = () => {
	const { control, formState, handleSubmit } = useForm<AuthRequest>()
	const [type, setType] = useState<'publisher' | 'admin'>('publisher')

	const router = useRouter()
	const { signIn } = useSession()

	const switchType = useCallback(() => {
		setType(old => (old === 'publisher' ? 'admin' : 'publisher'))
	}, [])

	const auth: SubmitHandler<AuthRequest> = useCallback(
		async data => {
			const authorized = await signIn({ ...data, type })
			console.log(authorized)
			if (!authorized) return alert('Usuário ou senha inválidos')

			router.replace(`/${type}`)
		},
		[router, signIn, type]
	)

	return (
		<S.Container>
			<Stack.Screen options={{ headerShown: false }} />
			<S.Background source={require('../../images/login-bg.jpg')}>
				<S.Mask />
				<SafeAreaView>
					<S.Content>
						<S.TitleContainer>
							<S.Small>Login</S.Small>
							<S.Title>{type === 'publisher' ? 'Publicador' : 'Admin'}</S.Title>
							<S.IconButton hitSlop={20} onPress={switchType}>
								<S.Icon name='swap-horizontal-outline' />
							</S.IconButton>
						</S.TitleContainer>
						<Controller
							control={control}
							rules={{ required: true }}
							name='user'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									autoCorrect={false}
									placeholder='Seu nome'
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
								/>
							)}
						/>
						<Controller
							control={control}
							rules={{ required: true }}
							name='pass'
							render={({ field: { onChange, onBlur, value } }) => (
								<PasswordInput
									autoCapitalize={type === 'publisher' ? 'characters' : 'none'}
									placeholder='Sua senha'
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
								/>
							)}
						/>
						<S.Row>
							<Button
								disabled={!formState.isValid}
								loading={formState.isSubmitting}
								onPress={handleSubmit(auth)}
							>
								Entrar {type === 'publisher' ? '' : 'como admininstrador'}
							</Button>
						</S.Row>
					</S.Content>
				</SafeAreaView>
			</S.Background>
		</S.Container>
	)
}

export default Login
