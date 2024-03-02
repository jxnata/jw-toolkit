import Ionicons from '@expo/vector-icons/Ionicons'
import { Dimensions } from 'react-native'
import MapView from 'react-native-maps'
import styled from 'styled-components/native'

const { height, width } = Dimensions.get('window')

export const Container = styled.View`
	display: flex;
	justify-content: flex-end;
	width: 100%;
	height: 100%;
`
export const Content = styled.View`
	display: flex;
	width: 100%;
	height: ${height * 0.9}px;
	align-items: center;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.backgroundAlt};
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
export const CloseButton = styled.Pressable`
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
export const MapType = styled.View`
	position: absolute;
	left: 10px;
	top: 10px;
	background-color: ${({ theme }) => theme.text};
	border-radius: 10px;
	justify-content: center;
	align-items: center;
	padding: 5px;
	z-index: 10;
`
export const Map = styled(MapView)`
	width: 100%;
	height: 100%;
`
export const ButtonContainer = styled.View`
	position: absolute;
	bottom: 30px;
	width: 100%;
	padding: 0 10px;
`
export const LoadingContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`
export const Icon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme }) => theme.background};
`
export const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
	color: theme.primary,
	size: 'large',
}))``
