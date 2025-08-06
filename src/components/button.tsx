import { useThemedColors } from '@/hooks/use-themed-colors'
import { forwardRef } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

type ButtonProps = {
	title?: string
	left?: React.ReactNode
	right?: React.ReactNode
	loading?: boolean
	variant?: 'primary' | 'outline' | 'danger' | 'link'
	size?: 'sm' | 'md' | 'lg'
	children?: React.ReactNode
} & TouchableOpacityProps

const Button = forwardRef<View, ButtonProps>(
	({ title, left, right, loading, variant = 'primary', size = 'md', children, ...touchableProps }, ref) => {
		const { colors } = useThemedColors()

		const getVariantBgClassName = () => {
			switch (variant) {
				case 'primary':
					return 'bg-primary'
				case 'outline':
					return 'bg-card'
				case 'danger':
					return 'bg-transparent'
				case 'link':
					return 'bg-transparent'
			}
		}

		const getVariantTextClassName = () => {
			switch (variant) {
				case 'primary':
					return 'text-white'
				case 'outline':
					return 'text-foreground'
				case 'danger':
					return 'text-danger-500'
				case 'link':
					return 'text-primary'
			}
		}

		const getHeightClassName = () => {
			switch (size) {
				case 'sm':
					return 'h-12'
				case 'md':
					return 'h-14'
				case 'lg':
					return 'h-16'
			}
		}

		return (
			<TouchableOpacity
				ref={ref}
				{...touchableProps}
				activeOpacity={0.7}
				className={`flex-row items-center justify-center gap-2 rounded-xl px-8 ${getHeightClassName()} ${getVariantBgClassName()} ${touchableProps.className}`}
				style={{ opacity: touchableProps.disabled ? 0.5 : 1 }}
			>
				{left && !loading && <View>{left}</View>}
				{loading && <ActivityIndicator size='small' color={colors.foreground} />}
				{typeof children === 'string' ? (
					<Text className={`font-bold text-${size} ${getVariantTextClassName()}`}>{children}</Text>
				) : (
					children
				)}
				{right && <View>{right}</View>}
			</TouchableOpacity>
		)
	}
)

Button.displayName = 'Button'

export default Button
