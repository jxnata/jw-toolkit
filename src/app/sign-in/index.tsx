import Dropdown from '@components/Dropdown'
import {
	AppleAuthenticationButton,
	AppleAuthenticationButtonStyle,
	AppleAuthenticationButtonType,
	AppleAuthenticationScope,
	signInAsync,
} from 'expo-apple-authentication'
import { APP_VERSION } from '@constants/content'
// import { useSession } from '@contexts/Auth'
import { history, storage } from '@database/index'
import { LAST_CONGREGATION, LAST_TYPE, LAST_USER } from '@database/types/keys'
import useCongregations from '@hooks/swr/general/useCongregations'
import { Stack } from 'expo-router/stack'
import { useEffect, useMemo, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import * as S from './styles'
import { Alert, Platform, useColorScheme } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useSession } from '@contexts/Auth'

const Login = () => {
	const [congregationId, setCongregationId] = useState<string>()
	const { appleAuthentication, loading } = useSession()
	const { congregations } = useCongregations()
	const insets = useSafeAreaInsets()
	const scheme = useColorScheme()

	const congregationsList = useMemo(() => congregations.map(c => ({ label: c.name, value: c._id })), [congregations])
	const lastCongregation = useMemo(() => history.getString(LAST_CONGREGATION), [])

	const handleCongregation = (c: string) => {
		setCongregationId(c)
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

			await appleAuthentication(credential)
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
						/>
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
							<></>
						)}
						<S.Version>Versão: {APP_VERSION}</S.Version>
					</S.Panel>
				</S.Content>
			</S.Background>
		</S.Container>
	)
}

export default Login
