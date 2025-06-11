import { useThemedColors } from '@/hooks/use-themed-colors'
import { useEffect } from 'react'
import { Animated, ViewStyle } from 'react-native'

interface SkeletonProps {
	width?: number | string
	height?: number | string
}

const Skeleton = ({ width = '100%', height = 50 }: SkeletonProps) => {
	const animatedValue = new Animated.Value(0.3)
	const { colors } = useThemedColors()

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(animatedValue, { toValue: 1, duration: 1000, useNativeDriver: true }),
				Animated.timing(animatedValue, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
			])
		).start()
	}, [])

	const dynamicStyle: ViewStyle = {
		width: width as ViewStyle['width'],
		height: height as ViewStyle['height'],
	}

	return (
		<Animated.View
			className='rounded-lg border-[1.5px]'
			style={[
				{
					opacity: animatedValue,
					borderColor: colors.border + '10',
					backgroundColor: colors.card + '70',
				},
				dynamicStyle,
			]}
		/>
	)
}

export default Skeleton
