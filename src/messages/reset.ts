import Toast from 'react-native-toast-message'

export const success = (model: string) => {
	Toast.show({
		type: 'success',
		text1: 'Sucesso',
		text2: `Uma nova senha foi gerada para esse ${model}`,
	})
}

export const error = (model: string) => {
	Toast.show({
		type: 'error',
		text1: 'Erro',
		text2: `Erro ao resetar o ${model}`,
	})
}
