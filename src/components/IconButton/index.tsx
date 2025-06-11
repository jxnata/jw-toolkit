import { useThemedColors } from '@/hooks/use-themed-colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface ButtonProps {
	icon: string
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
			className='w-[50px] h-[50px] flex flex-row items-center justify-center rounded-xl border-[1.5px] border-border bg-card mb-[15px]'
		>
			{props.loading ? (
				<ActivityIndicator color={colors.primary[600]} size='small' />
			) : (
				<Ionicons name={props.icon as any} size={24} color={props.color || colors.foreground} />
			)}
		</TouchableOpacity>
	)
}

export default IconButton
