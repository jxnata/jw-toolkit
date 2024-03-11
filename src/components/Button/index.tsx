import { PressableProps } from 'react-native'

import * as S from './styles'

interface ButtonProps {
	loading?: boolean
}

const Button = (props: PressableProps & ButtonProps) => {
	return (
		<S.Button {...props}>
			{props.loading && <S.Loading />}
			{/* @ts-ignore */}
			<S.ButtonTitle disabled={props.loading || props.disabled}>{props.children}</S.ButtonTitle>
		</S.Button>
	)
}

export default Button
