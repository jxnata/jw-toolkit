import { RestoreResult } from '@/interfaces'
import Toast from 'react-native-toast-message'

export const restored = (result: RestoreResult) => {
	Toast.show({
		type: 'success',
		text1: 'Backup restaurado',
		text2:
			(result.phones === null
				? `${result.cities} cidades, ${result.districts} bairros e ${result.maps} mapas restaurados`
				: `${result.cities} cidades, ${result.districts} bairros, ${result.maps} mapas e ${result.phones} telefones restaurados`) +
			(result.skippedMaps > 0 ? ` (${result.skippedMaps} mapas sem cidade ou coordenadas ignorados)` : ''),
	})
}
