import { useThemedColors } from '@/hooks/use-themed-colors'
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface ButtonProps {
	loading?: boolean
}

const Button = (props: TouchableOpacityProps & ButtonProps) => {
	const { colors } = useThemedColors()

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			{...props}
			className='w-full h-[50px] flex flex-row items-center justify-center rounded-lg bg-primary-600 px-4 mb-[15px]'
		>
			{props.loading && <ActivityIndicator color={colors.card} size='small' className='mr-2' />}
			<Text
				className={`text-white text-[15px] font-semibold ${props.loading || props.disabled ? 'opacity-70' : ''}`}
			>
				{props.children}
			</Text>
		</TouchableOpacity>
	)
}

export default Button
