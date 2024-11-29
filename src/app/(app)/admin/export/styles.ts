import styled from 'styled-components/native'

export const Container = styled.View`
	display: flex;
`
export const Content = styled.View`
	display: flex;
	padding: 10px 0;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background};
`
export const ExportContent = styled.View`
	flex: 1;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	padding: 12px;
`
export const ButtonContainer = styled.View`
	width: 100%;
	height: 70px;
`
export const LoadingContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`
export const LoadingContent = styled.View`
	padding: 20px;
	gap: 10px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.background};
`
export const Label = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-bold';
`
export const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
	color: theme.primary,
	size: 'small',
}))``
