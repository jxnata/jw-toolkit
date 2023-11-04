import { TouchableOpacityProps } from 'react-native'
import * as S from './styles'

interface ButtonProps {
	loading?: boolean
}

const Button = (props: TouchableOpacityProps & ButtonProps) => {
	return (
		<S.Button {...props}>
			{props.loading && <S.Loading />}
			<S.ButtonTitle disabled={props.loading || props.disabled}>{props.children}</S.ButtonTitle>
		</S.Button>
	)
}

export default Button
