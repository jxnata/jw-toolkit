import Ionicons from '@expo/vector-icons/Ionicons'
import { useCallback, useState } from 'react'
import { TextInputProps } from 'react-native'
import * as S from './styles'

const PasswordInput = (props: TextInputProps) => {
	const [show, setShow] = useState(false)

	const toggleShow = useCallback(() => {
		setShow((old) => !old)
	}, [])

	return (
		<S.Container>
			<S.Input {...props} secureTextEntry={!show} />
			<S.Icon onPress={toggleShow}>
				<Ionicons name={show ? 'eye-outline' : 'eye-off-outline'} size={24} color='#afab9a' />
			</S.Icon>
		</S.Container>
	)
}

export default PasswordInput
