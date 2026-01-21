import { colors } from '@/utils/color-theme'
import { useColorScheme } from 'react-native'

export function useThemedColors() {
	const colorScheme = useColorScheme()

	return {
		colors: colors[colorScheme || 'light'],
	}
}
