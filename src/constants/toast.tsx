import { colors } from '@/utils/color-theme'
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message'

export const configToast = (scheme: 'light' | 'dark'): ToastConfig => {
	return {
		success: (props) => (
			<BaseToast
				{...props}
				style={{ borderLeftColor: colors.success[500], backgroundColor: colors.success[600] }}
				text1Style={{
					fontSize: 17,
					fontFamily: 'urbanist-bold',
					color: colors.success[100],
				}}
				text2Style={{
					fontSize: 15,
					fontFamily: 'urbanist-regular',
					color: colors.success[100],
				}}
				text2NumberOfLines={3}
			/>
		),
		error: (props) => (
			<ErrorToast
				{...props}
				style={{ borderLeftColor: colors.danger[500], backgroundColor: colors.danger[600] }}
				text1Style={{
					fontSize: 17,
					fontFamily: 'urbanist-bold',
					color: colors.danger[100],
				}}
				text2Style={{
					fontSize: 15,
					fontFamily: 'urbanist-regular',
					color: colors.danger[100],
				}}
				text2NumberOfLines={3}
			/>
		),
	}
}
