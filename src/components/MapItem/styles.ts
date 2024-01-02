import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

const screenWidth = Dimensions.get('screen').width

export const Container = styled.TouchableOpacity`
	display: flex;
	flex-direction: row;
	margin-bottom: 5px;
	width: 100%;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.backgroundAlt};
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
const Status = styled.View`
	position: absolute;
	top: 5px;
	right: 5px;
	background-color: ${({ theme }) => theme.background};
	padding: 2px 5px;
	border-radius: 5px;
`
export const StatusAssigned = styled(Status)`
	background-color: ${({ theme }) => theme.warning};
`
export const StatusUnassigned = styled(Status)`
	background-color: ${({ theme }) => theme.success};
`
export const AssignedText = styled.Text`
	font-family: 'urbanist-semibold';
	font-size: 10px;
	color: ${({ theme }) => theme.warningAlt};
`
export const UnassignedText = styled.Text`
	font-family: 'urbanist-semibold';
	font-size: 10px;
	color: ${({ theme }) => theme.successAlt};
`
