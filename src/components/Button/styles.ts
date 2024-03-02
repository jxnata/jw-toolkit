import styled from 'styled-components/native'

export const Button = styled.Pressable`
	flex: 1;
	gap: 5px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 50px;
	border-radius: 12px;
	background: ${({ theme }) => theme.secondary};
	opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
	font-size: 15px;
	margin-bottom: 15px;
`
export const ButtonTitle = styled.Text`
	color: ${({ theme }) => theme.primary};
	font-size: 15px;
	font-family: 'urbanist-bold';
`
export const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
	color: theme.primary,
	size: 'small',
}))``
