import Ionicons from '@expo/vector-icons/Ionicons'
import { Dimensions } from 'react-native'
import MapView, { Callout } from 'react-native-maps'
import styled from 'styled-components/native'

const screenWidth = Dimensions.get('screen').width

export const Container = styled.View`
	display: flex;
`
export const Content = styled.View`
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background};
`
export const AssignLink = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.primary};
	font-family: 'urbanist-bold';
	flex-wrap: wrap;
	align-self: center;
	text-align: center;
	padding: 5px 0;
`
export const Columm = styled.View`
	gap: 5px;
	flex-direction: column;
`
export const Row = styled.View`
	gap: 10px;
	flex-direction: row;
`
export const MarkerCallout = styled(Callout)`
	padding: 10px;
	border-radius: 10px;
	background: ${({ theme }) => theme.background};
	width: ${screenWidth / 2}px;
`
export const MapContainer = styled.View`
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
export const IconButton = styled.Pressable`
	position: absolute;
	top: 5px;
	right: 7px;
`
export const EditIcon = styled(Ionicons).attrs(({ theme }) => ({
	size: 18,
}))`
	color: ${({ theme }) => theme.textAlt};
`
export const Ionicon = styled(Ionicons).attrs(({ theme }) => ({
	size: 40,
}))`
	color: ${props =>
		props['aria-valuetext'] === 'permanent'
			? props.theme.warning
			: props['aria-valuetext'] === 'assigned'
			  ? props.theme.error
			  : props.theme.success};
`
