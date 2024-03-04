import styled from 'styled-components/native'

export const Container = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.background};
`
export const Content = styled.View`
	gap: 20px;
	align-items: center;
	justify-content: center;
`
export const Error = styled.Text`
	color: ${({ theme }) => theme.text};
	font-size: 18px;
	font-family: 'urbanist-semibold';
`
export const Button = styled.Pressable`
	gap: 5px;
	padding: 20px;
	border-radius: 12px;
	background: ${({ theme }) => theme.backgroundAlt};
	font-size: 15px;
	margin-bottom: 15px;
`
export const ButtonTitle = styled.Text`
	color: ${({ theme }) => theme.textAlt};
	font-size: 15px;
	font-family: 'urbanist-bold';
`
export const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
	color: theme.primary,
	size: 'large',
}))``
