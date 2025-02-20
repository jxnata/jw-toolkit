import Ionicons from '@expo/vector-icons/Ionicons'
import { Dimensions } from 'react-native'
import MapView from 'react-native-maps'
import styled from 'styled-components/native'

const screenWidth = Dimensions.get('screen').width

export const Container = styled.View`
	display: flex;
`
export const Content = styled.View`
	padding: 10px;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background};
`
export const DataContainer = styled.Pressable`
	padding: 15px;
	width: 100%;
	gap: 10px;
	border-radius: 10px;
	margin-bottom: 10px;
	flex-direction: column;
	align-items: flex-start;
	background-color: ${({ theme }) => theme.backgroundAlt};
`
export const Columm = styled.View`
	gap: 5px;
	flex-direction: column;
`
export const Row = styled.View`
	gap: 10px;
	flex-direction: row;
`
export const RowCenter = styled(Row)`
	align-items: center;
`
export const DetailsContainer = styled.View`
	gap: 15px;
`
export const MapContainer = styled.View`
	border-radius: 12px;
	overflow: hidden;
`
export const Paragraph = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-medium';
	flex-wrap: wrap;
`
export const ParagraphSpace = styled(Paragraph)`
	padding-bottom: 10px;
`
export const ParagraphWrap = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-medium';
	flex-wrap: wrap;
	max-width: ${screenWidth - (screenWidth / 4 + 20)}px;
`
export const Label = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-bold';
`
export const Small = styled.Text`
	color: ${({ theme }) => theme.textAlt};
	font-size: 12px;
	font-family: 'urbanist-regular';
	padding-top: 5px;
`
export const Map = styled(MapView)`
	width: 100%;
	height: 100%;
`
export const HeaderContainer = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 15px;
`
export const IconButton = styled.TouchableOpacity``
export const Ionicon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme }) => theme.text};
`
