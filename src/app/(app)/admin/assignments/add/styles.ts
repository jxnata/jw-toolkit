import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

const screenWidth = Dimensions.get('screen').width

export const Container = styled.View`
	display: flex;
`
export const Content = styled.ScrollView`
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
export const Row = styled.View`
	gap: 5px;
	flex-direction: row;
	justify-content: center;
`
export const Paragraph = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-medium';
`
export const MapContainer = styled.View`
	gap: 5px;
	flex-direction: column;
	padding-left: 10px;
	margin-bottom: 10px;
`
export const ParagraphWrap = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-medium';
	flex-wrap: wrap;
	max-width: ${screenWidth - (screenWidth / 4 + 20)}px;
`
export const Small = styled.Text`
	color: ${({ theme }) => theme.textAlt};
	font-size: 12px;
	font-family: 'urbanist-regular';
	padding-top: 5px;
`
export const Label = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-bold';
`
export const LoadingContainer = styled.View`
	display: flex;
	flex: 1;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.background};
`
export const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
	color: theme.primary,
	size: 'large',
}))``
