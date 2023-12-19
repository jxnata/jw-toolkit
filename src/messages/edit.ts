import Toast from 'react-native-toast-message'
import { firstUpper } from 'utils/first-upper'

export const success = (model: string) => {
	Toast.show({
		type: 'success',
		text1: 'Sucesso',
		text2: `${firstUpper(model)} atualizado com sucesso`,
	})
}

export const error = (model: string) => {
	Toast.show({
		type: 'error',
		text1: 'Erro',
		text2: `Erro ao atualizar ${model}`,
	})
}
