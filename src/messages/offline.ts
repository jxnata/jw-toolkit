import { OFFLINE_MESSAGE } from '@/utils/is-offline-error'
import Toast from 'react-native-toast-message'

export const offline = () => {
	Toast.show({
		type: 'error',
		text1: 'Sem conexão',
		text2: OFFLINE_MESSAGE,
	})
}
