import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message'
import { colors, dark, light } from '@themes'

export const configToast = (scheme: 'light' | 'dark'): ToastConfig => {
	const theme = { dark, light }

	return {
		success: props => (
			<BaseToast
				{...props}
				style={{ borderLeftColor: colors.success, backgroundColor: theme[scheme].backgroundAlt }}
				text1Style={{
					fontSize: 17,
					fontFamily: 'urbanist-bold',
					color: theme[scheme].text,
				}}
				text2Style={{
					fontSize: 15,
					fontFamily: 'urbanist-regular',
					color: theme[scheme].textAlt,
				}}
			/>
		),
		error: props => (
			<ErrorToast
				{...props}
				style={{ borderLeftColor: colors.error, backgroundColor: theme[scheme].backgroundAlt }}
				text1Style={{
					fontSize: 17,
					fontFamily: 'urbanist-bold',
					color: theme[scheme].text,
				}}
				text2Style={{
					fontSize: 15,
					fontFamily: 'urbanist-regular',
					color: theme[scheme].textAlt,
				}}
			/>
		),
	}
}
