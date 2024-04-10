import { useForegroundPermissions } from 'expo-location'
import { Redirect } from 'expo-router'
import { Linking } from 'react-native'

import * as S from './styles'

const LocationRequest = () => {
	const [status, requestPermission] = useForegroundPermissions()

	if (status) {
		if (status.granted) {
			return <Redirect href='/' />
		}
	}

	const requestLocationPermission = async () => {
		if (status.canAskAgain === false) {
			Linking.openSettings()
			return
		}

		requestPermission()
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
