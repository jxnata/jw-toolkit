import { PressableProps, TouchableOpacityProps } from 'react-native'

import * as S from './styles'

interface ButtonProps {
	loading?: boolean
}

const Button = (props: TouchableOpacityProps & ButtonProps) => {
	return (
		<S.Button activeOpacity={0.7} {...props}>
			{props.loading && <S.Loading />}
			<S.ButtonTitle disabled={props.loading || props.disabled}>{props.children}</S.ButtonTitle>
		</S.Button>
	)
}

export default Button
