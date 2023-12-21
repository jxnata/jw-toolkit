import Ionicons from '@expo/vector-icons/Ionicons'
import { Dimensions } from 'react-native'
import MapView from 'react-native-maps'
import styled from 'styled-components/native'

const screenHeight = Dimensions.get('screen').height
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
export const DataContainer = styled.TouchableOpacity`
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
export const DetailsContainer = styled.View`
	flex: 1;
	gap: 15px;
`
export const MapContainer = styled.View`
	flex: 1;
	border-radius: 12px;
	overflow: hidden;
`
export const Paragraph = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-medium';
	flex-wrap: wrap;
`
export const ParagraphWrap = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-medium';
	flex-wrap: wrap;
	max-width: ${screenWidth - ((screenWidth / 4) + 20)}px;
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
export const ShareIcon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	position: absolute;
	top: 10px;
	right: 10px;
	color: ${({ theme }) => theme.textAlt};
`
