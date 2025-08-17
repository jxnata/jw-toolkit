import { useThemedColors } from '@/hooks/use-themed-colors'
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface ButtonProps {
	icon: React.ReactNode
	color?: string
	loading?: boolean
}

const IconButton = (props: TouchableOpacityProps & ButtonProps) => {
	const { colors } = useThemedColors()

	return (
		<TouchableOpacity
			disabled={props.loading}
			activeOpacity={0.7}
			{...props}
			className={`w-[48px] h-[48px] flex flex-row items-center justify-center rounded-xl bg-card ${props.className}`}
		>
			{props.loading ? <ActivityIndicator color={colors.primary[600]} size='small' /> : props.icon}
		</TouchableOpacity>
	)
}

export default IconButton
