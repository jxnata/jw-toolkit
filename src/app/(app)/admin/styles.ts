import Ionicons from '@expo/vector-icons/Ionicons'
import styled from 'styled-components/native'

export const Container = styled.View`
	display: flex;
`
export const Content = styled.ScrollView`
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
export const MenuItem = styled.Pressable`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 5px;
	width: 100%;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.backgroundAlt};
	padding: 20px;
	gap: 10px;
`
export const Column = styled.View`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;
`
export const MenuTitle = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	padding-left: 10px;
	font-family: 'urbanist-semibold';
`
export const MenuNumber = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-bold';
`
export const Version = styled.Text`
	font-size: 12px;
	color: ${({ theme }) => theme.text};
	padding: 10px 0;
	font-family: 'urbanist-medium';
	position: absolute;
	bottom: 50px;
	align-self: center;
`
export const Icon = styled.Text`
	font-size: 32px;
	color: ${({ theme }) => theme.primary};
	font-family: 'jw-icons';
`
export const IconButton = styled.Pressable``
export const RefreshControl = styled.RefreshControl``
export const Ionicon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme }) => theme.text};
`
