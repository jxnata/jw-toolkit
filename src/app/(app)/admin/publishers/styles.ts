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
export const MenuItem = styled.TouchableOpacity`
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
export const MenuContent = styled.View`
	flex-direction: column;
	padding-left: 10px;
	align-items: flex-start;
	gap: 2px;
`
export const BadgeContainer = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 2px;
`
export const MenuTitle = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-semibold';
`
export const BadgeText = styled.Text`
	font-size: 10px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-bold';
`
export const Badge = styled.View`
	flex-direction: row;
	background: ${({ theme }) => theme.background}50;
	padding: 2px 5px 2px 5px;
	border-radius: 3px;
	gap: 5px;
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
export const WarningButton = styled.Pressable`
	background-color: ${({ theme }) => theme.warning}20;
	padding: 10px;
	border-radius: 8px;
	margin-top: 10px;
	margin-bottom: 10px;
`
export const WarningText = styled.Text`
	color: ${({ theme }) => theme.warning};
	font-family: 'urbanist-medium';
	text-align: center;
`
export const IconButton = styled.Pressable``
export const RefreshControl = styled.RefreshControl``
export const Ionicon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme }) => theme.text};
`
