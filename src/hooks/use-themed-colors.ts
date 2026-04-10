import { colors } from '@/utils/color-theme'
import { useColorScheme } from 'react-native'

export function useThemedColors() {
	const colorScheme = useColorScheme()
	const themeKey: 'light' | 'dark' = colorScheme === 'dark' ? 'dark' : 'light'

	return {
		colors: colors[themeKey],
	}
}
