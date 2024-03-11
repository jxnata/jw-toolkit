import Toast from 'react-native-toast-message'

export const success = () => {
	Toast.show({
		type: 'success',
		text1: 'Sucesso',
		text2: `Publicador vinculado ao usuário`,
	})
}

export const error = () => {
	Toast.show({
		type: 'error',
		text1: 'Erro',
		text2: `Erro ao vincular o publicador`,
	})
}
