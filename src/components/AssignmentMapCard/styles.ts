import styled from 'styled-components/native'

export const Container = styled.View`
	position: absolute;
	bottom: 40px;
	width: 100%;
	padding: 10px;
`
export const Content = styled.View`
	align-items: center;
	padding: 10px;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.backgroundAlt};
	gap: 10px;
`
export const Image = styled.Image`
	border-radius: 10px;
	width: 80px;
	height: 80px;
`
export const Paragraph = styled.Text`
	color: ${({ theme }) => theme.text};
	font-size: 16px;
	font-family: 'urbanist-medium';
`
export const Title = styled.Text`
	padding: 10px 0;
	color: ${({ theme }) => theme.text};
	font-size: 16px;
	font-family: 'urbanist-bold';
`
export const ButtonGroup = styled.View`
	flex-direction: row;
	gap: 10px;
`
export const Button = styled.TouchableOpacity`
	gap: 5px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex: 1;
	padding: 20px;
	border-radius: 12px;
	background: ${({ theme }) => theme.primary};
	font-size: 15px;
	margin-bottom: 15px;
`
export const ButtonPositive = styled(Button)`
	background: ${({ theme }) => theme.success};
`
export const ButtonNegative = styled(Button)`
	background:${({ theme }) => theme.error};
`
export const ButtonTitlePositive = styled.Text`
	color: ${({ theme }) => theme.successAlt};
	font-size: 15px;
	font-family: 'urbanist-bold';
`
export const ButtonTitleNegative = styled.Text`
	color: ${({ theme }) => theme.errorAlt};
	font-size: 15px;
	font-family: 'urbanist-bold';
`
