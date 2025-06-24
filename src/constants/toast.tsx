import { colors } from '@/utils/color-theme'
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message'

export const configToast = (scheme: 'light' | 'dark'): ToastConfig => {
	return {
		success: props => (
			<BaseToast
				{...props}
				style={{ borderLeftColor: colors.success[500], backgroundColor: colors[scheme].card }}
				text1Style={{
					fontSize: 17,
					fontFamily: 'urbanist-bold',
					color: colors[scheme].foreground,
				}}
				text2Style={{
					fontSize: 15,
					fontFamily: 'urbanist-regular',
					color: colors[scheme].foreground + '70',
				}}
				text2NumberOfLines={3}
			/>
		),
		error: props => (
			<ErrorToast
				{...props}
				style={{ borderLeftColor: colors.danger[500], backgroundColor: colors[scheme].card }}
				text1Style={{
					fontSize: 17,
					fontFamily: 'urbanist-bold',
					color: colors[scheme].foreground,
				}}
				text2Style={{
					fontSize: 15,
					fontFamily: 'urbanist-regular',
					color: colors[scheme].foreground + '70',
				}}
				text2NumberOfLines={3}
			/>
		),
	}
}
