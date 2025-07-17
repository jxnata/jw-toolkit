import Dropdown from '@/components/dropdown'
import { APP_VERSION } from '@/constants/content'
import { history, storage } from '@/database/index'
import { LAST_CONGREGATION } from '@/database/types/keys'
import { useThemedColors } from '@/hooks/use-themed-colors'
import useCongregations from '@/hooks/useCongregations'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import {
	AppleAuthenticationButton,
	AppleAuthenticationButtonStyle,
	AppleAuthenticationButtonType,
	AppleAuthenticationScope,
	signInAsync,
} from 'expo-apple-authentication'
import { Stack } from 'expo-router/stack'
import { useEffect, useMemo, useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	ImageBackground,
	Linking,
	Platform,
	Pressable,
	Text,
	useColorScheme,
	View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSession } from '@/contexts/session'
import { StatusBar } from 'expo-status-bar'

const Login = () => {
	const [congregationId, setCongregationId] = useState<string>()
	const { appleAuthentication, googleAuthentication, loading } = useSession()
	const { congregations } = useCongregations()
	const insets = useSafeAreaInsets()
	const scheme = useColorScheme()
	const { colors } = useThemedColors()

	const congregationsList = useMemo(() => congregations.map(c => ({ label: c.name, value: c.$id })), [congregations])
	const lastCongregation = useMemo(() => history.getString(LAST_CONGREGATION), [])

	const handleCongregation = (c: string) => {
		setCongregationId(c)
	}

	const handleAddCongregation = async () => {
		const url =
			'https://docs.google.com/forms/d/e/1FAIpQLSfxl3tz6ZnXewMWlxAeEW5DP0xUkO_ymfehvl-BqYRg9bQKjQ/viewform'
		Linking.openURL(url)
	}

	const appleAuth = async () => {
		try {
			if (!congregationId) {
				Alert.alert('Congregação', 'Selecione uma congregação')
				return
			}

			const congregation = congregationsList.find(c => c.value === congregationId)

			if (!congregation) return

			const credential = await signInAsync({
				requestedScopes: [AppleAuthenticationScope.FULL_NAME, AppleAuthenticationScope.EMAIL],
			})

			storage.set('congregation.name', congregation.label)
			storage.set('congregation.id', congregation.value)

			await appleAuthentication(credential, congregationId)
		} catch (e: unknown) {
			if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED') {
				// nothing to-do
			} else {
				Alert.alert('Erro', 'Ocorreu um erro ao fazer login...')
			}
			storage.delete('congregation.name')
			storage.delete('congregation.id')
		}
	}

	const googleSign = async () => {
		try {
			if (!congregationId) {
				Alert.alert('Congregação', 'Selecione uma congregação')
				return
			}

			const congregation = congregationsList.find(c => c.value === congregationId)

			if (!congregation) return

			if (Platform.OS === 'android') {
				await GoogleSignin.hasPlayServices()
			}
			const userInfo = await GoogleSignin.signIn()

			if (!userInfo.data) throw new Error('login failed: no user data')

			storage.set('congregation.name', congregation.label)
			storage.set('congregation.id', congregation.value)

			await googleAuthentication(userInfo.data, congregationId)
		} catch (e) {
			console.log(e)
			Alert.alert('Erro', 'Ocorreu um erro ao fazer login...')
		}
	}

	useEffect(() => {
		if (congregationsList.length) {
			if (lastCongregation) {
				setCongregationId(lastCongregation)
				return
			}
		}
	}, [congregationsList, lastCongregation])

	return (
		<View className='flex'>
			<StatusBar style='dark' />
			<Stack.Screen options={{ headerShown: false }} />
			<ImageBackground
				source={require('../../assets/images/login-bg.jpg')}
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
							<Text className='text-center text-lg text-foreground font-bold'>Bem vindo!</Text>
							<Text
								className='text-center text-sm font-regular'
								style={{ color: colors.foreground + '80' }}
							>
								Faça login usando sua conta {Platform.OS === 'ios' ? 'Apple' : 'Google'}
							</Text>
						</View>

						<Dropdown
							label='Congregação'
							placeholder='Selecione uma congregação'
							options={congregationsList}
							selectedValue={congregationId}
							onValueChange={handleCongregation}
							footerComponent={
								<View className='gap-[5px] flex-row justify-center'>
									<Pressable onPress={handleAddCongregation}>
										<Text
											className='text-center text-[15px] font-bold'
											style={{ color: colors.primary[600] }}
										>
											Adicionar congregação
										</Text>
									</Pressable>
								</View>
							}
						/>
						{loading ? (
							<View className='h-[100px] justify-center items-center'>
								<ActivityIndicator size='large' />
							</View>
						) : (
							<>
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
							</>
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
