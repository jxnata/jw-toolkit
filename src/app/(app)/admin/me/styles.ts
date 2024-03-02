import styled from 'styled-components/native'

export const Container = styled.View`
	display: flex;
`
export const Content = styled.View`
	display: flex;
	padding: 10px;
	width: 100%;
	height: 100%;
	align-items: center;
	background-color: ${({ theme }) => theme.background};
`
export const Icon = styled.Text`
	font-size: 42px;
	color: ${({ theme }) => theme.text};
	padding: 10px 0;
	font-family: 'jw-icons';
`
export const Title = styled.Text`
	font-size: 17px;
	color: ${({ theme }) => theme.text};
	padding: 20px 0;
	font-family: 'urbanist-bold';
`
export const Paragraph = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	padding: 0 0 20px 0;
	font-family: 'urbanist-medium';
`
export const Label = styled.Text`
	font-size: 12px;
	color: ${({ theme }) => theme.text};
	padding: 10px 0;
	font-family: 'urbanist-medium';
`
export const Button = styled.Pressable`
	gap: 5px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
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
