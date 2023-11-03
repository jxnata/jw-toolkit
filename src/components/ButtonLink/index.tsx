import { TouchableOpacityProps } from 'react-native'
import * as S from './styles'

const ButtonLink = (props: TouchableOpacityProps) => {
	return (
		<S.Button {...props}>
			<S.ButtonTitle>{props.children}</S.ButtonTitle>
		</S.Button>
	)
}

export default ButtonLink
