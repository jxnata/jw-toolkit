import Ionicons from '@expo/vector-icons/Ionicons'
import { Dimensions, FlatList } from 'react-native'
import styled from 'styled-components/native'

const { height } = Dimensions.get('window')

export const DropdowContainer = styled.View`
	margin-bottom: 10px;
`
export const Input = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 50px;
	padding: 14px 16px;
	border-radius: 8px;
	border: solid 1.5px ${({ theme }) => theme.border};
	background: ${({ theme }) => theme.backgroundAlt};
	opacity: ${props => (props['aria-disabled'] ? 0.5 : 1)};
`
export const Placeholder = styled.Text`
	color: ${({ theme }) => theme.text};
	font-size: 15px;
	font-family: 'urbanist-medium';
`
export const Container = styled.View`
	display: flex;
	justify-content: flex-end;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background}90;
`
export const Content = styled.SafeAreaView`
	display: flex;
	width: 100%;
	max-height: ${height * 0.6}px;
	align-items: center;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.backgroundAlt};
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
	font-size: 12px;
	font-family: 'urbanist-medium';
	margin-bottom: 5px;
	margin-left: 2px;
`
export const ItemLabel = styled.Text`
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
	size: 20,
}))`
	color: ${({ theme }) => theme.textAlt};
`
export const CloseButton = styled.TouchableOpacity`
	position: absolute;
	top: -45px;
	right: 10px;
	background-color: ${({ theme }) => theme.backgroundAlt};
	padding: 8px;
	border-radius: 8px;
	z-index: 1;
`
