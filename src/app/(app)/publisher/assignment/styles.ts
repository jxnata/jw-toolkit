import Ionicons from '@expo/vector-icons/Ionicons'
import MapView from 'react-native-maps'
import styled from 'styled-components/native'

export const Container = styled.View`
	display: flex;
`
export const Content = styled.View`
	display: flex;
	width: 100%;
	height: 100%;
	align-items: center;
	background-color: ${({ theme }) => theme.background};
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
export const CloseButton = styled.TouchableOpacity`
	position: absolute;
	right: 10px;
	top: 10px;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.text};
	border-radius: 10px;
	width: 40px;
	height: 40px;
	z-index: 10;
`
export const Map = styled(MapView)`
	width: 100%;
	height: 100%;
`
export const Icon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme }) => theme.background};
`
