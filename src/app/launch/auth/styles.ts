import styled from 'styled-components/native'

export const Container = styled.View`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.background};
`
export const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
	color: theme.primary,
	size: 'large',
}))``