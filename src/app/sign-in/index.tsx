import Dropdown from '@components/Dropdown'
import {
	AppleAuthenticationButton,
	AppleAuthenticationButtonStyle,
	AppleAuthenticationButtonType,
	AppleAuthenticationScope,
	signInAsync,
} from 'expo-apple-authentication'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { APP_VERSION } from '@constants/content'
import { history, storage } from '@database/index'
import { LAST_CONGREGATION } from '@database/types/keys'
import useCongregations from '@hooks/useCongregations'
import { Stack } from 'expo-router/stack'
import { useEffect, useMemo, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import * as S from './styles'
import { Alert, Linking, Platform, useColorScheme } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useSession } from '@contexts/session'
import { ActivityIndicator } from 'react-native'

const Login = () => {
	const [congregationId, setCongregationId] = useState<string>()
	const { appleAuthentication, googleAuthentication, loading } = useSession()
	const { congregations } = useCongregations()
	const insets = useSafeAreaInsets()
	const scheme = useColorScheme()

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
		<S.Container>
			<StatusBar style='dark' />
			<Stack.Screen options={{ headerShown: false }} />
			<S.Background source={require('../../assets/images/login-bg.jpg')}>
				<S.Mask />
				<S.Content>
					<S.Panel style={{ paddingBottom: insets.bottom + 10 }}>
						<S.TitleContainer>
							<S.Title>Bem vindo!</S.Title>
							<S.Small>Faça login usando sua conta {Platform.OS === 'ios' ? 'Apple' : 'Google'}</S.Small>
						</S.TitleContainer>

						<Dropdown
							label='Congregação'
							placeholder='Selecione uma congregação'
							options={congregationsList}
							selectedValue={congregationId}
							onValueChange={handleCongregation}
							footerComponent={
								<S.Row>
									<S.IconButton onPress={handleAddCongregation}>
										<S.Accent>Adicionar congregação</S.Accent>
									</S.IconButton>
								</S.Row>
							}
						/>
						{loading ? (
							<S.LoadingContainer>
								<ActivityIndicator size='large' />
							</S.LoadingContainer>
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
						<S.Version>Versão: {APP_VERSION}</S.Version>
					</S.Panel>
				</S.Content>
			</S.Background>
		</S.Container>
	)
}

export default Login
