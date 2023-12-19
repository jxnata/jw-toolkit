import { TouchableOpacityProps } from 'react-native'
import * as S from './styles'

interface ButtonProps {
	icon: string
	color?: string
	loading?: boolean
}

const IconButton = (props: TouchableOpacityProps & ButtonProps) => {
	return (
		<S.Button disabled={props.loading} {...props}>
			{/* @ts-ignore */}
			{props.loading ? <S.Loading /> : <S.Ionicon name={props.icon} color={props.color} />}
		</S.Button>
	)
}

export default IconButton
