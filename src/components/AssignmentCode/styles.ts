import Ionicons from '@expo/vector-icons/Ionicons'
import { Dimensions, FlatList } from 'react-native'
import styled from 'styled-components/native'

const { width } = Dimensions.get('window')

export const QRContainer = styled.View`
	margin-bottom: 10px;
`
export const QRIcon = styled.Pressable`
	flex-direction: row;
	justify-content: center;
	align-items: center;
`
export const Placeholder = styled.Text`
	color: ${({ theme }) => theme.text};
	font-size: 15px;
	font-family: 'urbanist-medium';
`
export const Container = styled.Pressable`
	display: flex;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background}ca;
`
export const Content = styled.View`
	width: 100%;
	justify-content: center;
	align-items: center;
	height: ${width}px;
	align-items: center;
	background-color: white;
	border-radius: 12px;
`
export const Item = styled.Pressable`
	flex-direction: row;
	align-items: center;
	border-radius: 12px;
	background: ${({ theme }) => theme.background}70;
	padding: 16px;
	margin-top: 5px;
	gap: 10px;
`
export const Label = styled.Text`
	color: ${({ theme }) => theme.text};
	font-size: 16px;
	font-family: 'urbanist-medium';
`
export const Space = styled.View`
	height: 30px;
`
export const List = styled.FlatList`
	width: 100%;
	padding: 10px;
` as typeof FlatList
export const Ionicon = styled(Ionicons).attrs(({ theme }) => ({
	size: 48,
}))`
	color: ${({ theme }) => theme.textAlt};
`
