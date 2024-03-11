import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

const screenWidth = Dimensions.get('screen').width

export const Container = styled.View`
	display: flex;
	flex-direction: row;
	margin-bottom: 5px;
	width: 100%;
	padding: 10px;
	gap: 10px;
`
export const Column = styled.View`
	display: flex;
`
export const Image = styled.Image`
	border-radius: 10px;
	width: 80px;
	height: 80px;
`
export const Paragraph = styled.Text`
	color: ${({ theme }) => theme.text};
	font-size: 15px;
	font-family: 'urbanist-medium';
	flex-wrap: wrap;
	max-width: ${screenWidth - 10 - 10 - 10 - 80 - 20}px;
`
export const Small = styled.Text`
	color: ${({ theme }) => theme.textAlt};
	font-size: 12px;
	font-family: 'urbanist-regular';
	padding-top: 5px;
`
export const Found = styled(Small)`
	font-family: 'urbanist-semibold';
	color: ${({ theme }) => theme.success};
	padding-top: 0px;
`
export const NotFound = styled(Small)`
	font-family: 'urbanist-semibold';
	color: ${({ theme }) => theme.warning};
	padding-top: 0px;
`
const Status = styled.View`
	position: absolute;
	top: 5px;
	right: 5px;
	background-color: ${({ theme }) => theme.background};
	padding: 2px 5px;
	border-radius: 5px;
`