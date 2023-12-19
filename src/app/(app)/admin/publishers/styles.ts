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
	gap: 10px;
`
export const MenuItem = styled.TouchableOpacity`
	display: flex;
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	border-radius: 10px;
	margin-bottom: 5px;
	background-color: ${({ theme }) => theme.backgroundAlt};
	padding: 10px;
	gap: 5px;
`

export const MenuTitle = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	padding-left: 10px;
	font-family: 'urbanist-semibold';
`
export const Icon = styled.Text`
	font-size: 24px;
	color: ${({ theme }) => theme.text};
	font-family: 'jw-icons';
`
export const IconContainer = styled.View`
	width: 40px;
	height: 40px;
	padding: 5px;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	background: ${({ theme }) => theme.background};
`
export const IconButton = styled.TouchableOpacity``
export const RefreshControl = styled.RefreshControl``
export const Ionicon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme }) => theme.text};
`
