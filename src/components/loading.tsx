import { useThemedColors } from '@/hooks/use-themed-colors'
import { ActivityIndicator, View } from 'react-native'

export function Loading() {
	const { colors } = useThemedColors()

	return (
		<View className="flex-1 items-center justify-center">
			<ActivityIndicator size="large" color={colors.primary[500]} />
		</View>
	)
}
