import { TouchableOpacityProps } from 'react-native'
import * as S from './styles'

const Button = (props: TouchableOpacityProps) => {
	return (
		<S.Button {...props}>
			<S.ButtonTitle>{props.children}</S.ButtonTitle>
		</S.Button>
	)
}

export default Button
