import { upperFirst } from 'lodash'
import Toast from 'react-native-toast-message'

export const success = (model: string) => {
	Toast.show({
		type: 'success',
		text1: 'Sucesso',
		text2: `${upperFirst(model)} removido com sucesso`,
	})
}

export const error = (model: string) => {
	Toast.show({
		type: 'error',
		text1: 'Erro',
		text2: `Erro ao remover ${model}`,
	})
}
