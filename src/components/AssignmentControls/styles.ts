import Ionicons from '@expo/vector-icons/Ionicons'
import styled from 'styled-components/native'

export const Container = styled.View`
	position: absolute;
	bottom: 40px;
	width: 100%;
	padding: 10px;
`
export const Content = styled.View`
	padding: 10px 16px;
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
	padding-top: 10px;
	color: ${({ theme }) => theme.text};
	font-size: 16px;
	font-family: 'urbanist-bold';
`
export const ButtonGroup = styled.View`
	flex-direction: row;
	gap: 10px;
	margin-top: 10px;
`
export const Button = styled.TouchableOpacity`
	gap: 5px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex: 1;
	padding: 15px 20px;
	border-radius: 12px;
	background: ${({ theme }) => theme.primary};
	font-size: 15px;
	margin-bottom: 10px;
`
export const ButtonPrimary = styled(Button)`
	background: ${({ theme }) => theme.primary};
`
export const ButtonSecondary = styled(Button)`
	background: ${({ theme }) => theme.secondary};
`
export const ButtonTitlePrimary = styled.Text`
	color: ${({ theme }) => theme.secondary};
	font-size: 15px;
	font-family: 'urbanist-bold';
`
export const ButtonTitleSecondary = styled.Text`
	color: ${({ theme }) => theme.primary};
	font-size: 15px;
	font-family: 'urbanist-bold';
`
export const Ionicon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme, color }) => color || theme.secondary};
`
