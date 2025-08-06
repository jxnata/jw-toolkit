import { APP_VERSION } from '@/constants/content'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import {
	AppleAuthenticationButton,
	AppleAuthenticationButtonStyle,
	AppleAuthenticationButtonType,
	AppleAuthenticationScope,
	signInAsync,
} from 'expo-apple-authentication'
import { Stack } from 'expo-router/stack'
import { ActivityIndicator, Alert, ImageBackground, Platform, Text, useColorScheme, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSession } from '@/contexts/session-instantdb'
import { StatusBar } from 'expo-status-bar'

const Login = () => {
	const { appleAuthentication, googleAuthentication, loading } = useSession()
	const insets = useSafeAreaInsets()
	const scheme = useColorScheme()
	const { colors } = useThemedColors()

	const appleAuth = async () => {
		try {
			const credential = await signInAsync({
				requestedScopes: [AppleAuthenticationScope.FULL_NAME, AppleAuthenticationScope.EMAIL],
			})

			await appleAuthentication(credential)
		} catch (e: unknown) {
			if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED') {
				// nothing to-do
			} else {
				Alert.alert('Erro', 'Ocorreu um erro ao fazer login...')
			}
		}
	}

	const googleSign = async () => {
		try {
			if (Platform.OS === 'android') {
				await GoogleSignin.hasPlayServices()
			}
			const userInfo = await GoogleSignin.signIn()

			if (!userInfo.data) throw new Error('login failed: no user data')

			await googleAuthentication(userInfo.data)
		} catch (e) {
			console.log(e)
			Alert.alert('Erro', 'Ocorreu um erro ao fazer login...')
		}
	}

	return (
		<View className='flex'>
			<StatusBar style='dark' />
			<Stack.Screen options={{ headerShown: false }} />
			<ImageBackground
				source={require('../assets/images/login-bg.jpg')}
				resizeMode='cover'
				className='flex w-full h-full'
			>
				<View
					className='absolute flex-1 top-0 left-0 w-full h-full opacity-70'
					style={{ backgroundColor: colors.background }}
				/>
				<View className='flex h-full justify-end'>
					<View
						className='flex px-[15px] pt-[25px] rounded-xl opacity-90'
						style={{
							backgroundColor: colors.background,
							paddingBottom: insets.bottom + 10,
						}}
					>
						<View className='flex-col text-center items-center mb-[25px] gap-2.5'>
							<Text className='text-center text-xl text-foreground font-bold'>Bem vindo!</Text>
							<Text className='text-center font-regular' style={{ color: colors.foreground + '80' }}>
								Faça login usando sua conta {Platform.OS === 'ios' ? 'Apple' : 'Google'}
							</Text>
						</View>

						{loading ? (
							<View className='h-[100px] justify-center items-center'>
								<ActivityIndicator size='large' />
							</View>
						) : (
							<View className='my-2'>
								{Platform.OS === 'ios' ? (
									<AppleAuthenticationButton
										buttonType={AppleAuthenticationButtonType.SIGN_IN}
										buttonStyle={
											scheme === 'dark'
												? AppleAuthenticationButtonStyle.WHITE
												: AppleAuthenticationButtonStyle.BLACK
										}
										cornerRadius={5}
										style={{ width: 'auto', height: 50 }}
										onPress={appleAuth}
									/>
								) : (
									<GoogleSigninButton
										size={GoogleSigninButton.Size.Wide}
										color={
											scheme === 'dark'
												? GoogleSigninButton.Color.Light
												: GoogleSigninButton.Color.Dark
										}
										style={{ width: 'auto', marginVertical: 5 }}
										onPress={googleSign}
										disabled={loading}
									/>
								)}
							</View>
						)}
						<Text
							className='mt-5 self-center text-center text-sm font-regular'
							style={{ color: colors.foreground + '80' }}
						>
							Versão: {APP_VERSION}
						</Text>
					</View>
				</View>
			</ImageBackground>
		</View>
	)
}

export default Login
