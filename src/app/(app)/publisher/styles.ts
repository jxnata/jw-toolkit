import Ionicons from '@expo/vector-icons/Ionicons'
import styled from 'styled-components/native'

export const Container = styled.View`
	display: flex;
`
export const Content = styled.View`
	display: flex;
	padding: 10px;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background};
`
export const HeaderContainer = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 15px;
`
export const Paragraph = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	padding: 20px 10px;
	font-family: 'urbanist-medium';
	align-self: center;
`
export const IconButton = styled.Pressable``
export const RefreshControl = styled.RefreshControl``
export const Icon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme }) => theme.text};
`
