import { PermissionStatus } from 'expo-location'
import { Redirect } from 'expo-router'
import { Linking } from 'react-native'
import { useEffect, useState } from 'react'
import { requestPermissionsAsync } from 'expo-maps'

import * as S from './styles'

const LocationRequest = () => {
	const [status, setStatus] = useState<PermissionStatus | null>(null)

	useEffect(() => {
		const checkPermissionStatus = async () => {
			const { status: newStatus } = await requestPermissionsAsync()
			setStatus(newStatus)
		}
		checkPermissionStatus()
	}, [status])

	if (status) {
		if (status === PermissionStatus.GRANTED) {
			return <Redirect href='/' />
		}
	}

	const requestLocationPermission = async () => {
		if (!status) return
		if (status === PermissionStatus.DENIED) {
			Linking.openSettings()
			return
		}

		requestPermissionsAsync()
	}

	return (
		<S.Container>
			<S.Content>
				<S.Title>Localização</S.Title>
				<S.Paragraph>
					É preciso permitir a leitura da sua localização para usar o aplicativo. Essa informação não é salva
					fora desse dispositivo.
				</S.Paragraph>
				<S.Button onPress={requestLocationPermission}>
					<S.ButtonTitle>Continuar</S.ButtonTitle>
				</S.Button>
			</S.Content>
		</S.Container>
	)
}

export default LocationRequest
