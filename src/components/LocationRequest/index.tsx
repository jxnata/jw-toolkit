import { useForegroundPermissions } from 'expo-location'
import { Redirect } from 'expo-router'

import * as S from './styles'

const LocationRequest = () => {
	const [status, requestPermission] = useForegroundPermissions()

	if (status) {
		if (status.granted) {
			return <Redirect href='/' />
		}
	}

	return (
		<S.Container>
			<S.Content>
				<S.Title>Localização</S.Title>
				<S.Paragraph>É preciso permitir a leitura da sua localização para usar o aplicativo.</S.Paragraph>
				<S.Button onPress={requestPermission}>
					<S.ButtonTitle>Ativar</S.ButtonTitle>
				</S.Button>
			</S.Content>
		</S.Container>
	)
}

export default LocationRequest
