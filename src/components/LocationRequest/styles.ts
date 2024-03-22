import styled from 'styled-components/native'

export const Container = styled.SafeAreaView`
	display: flex;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background};
`
export const Content = styled.View`
	align-items: center;
	padding: 10px;
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
	background: ${({ theme }) => theme.primary};
	font-size: 15px;
	margin-bottom: 15px;
`
export const ButtonTitle = styled.Text`
	color: ${({ theme }) => theme.secondary};
	font-size: 15px;
	font-family: 'urbanist-bold';
`
