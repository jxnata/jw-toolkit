import styled from 'styled-components/native'

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
	max-width: 85%;
`
export const Small = styled.Text`
	color: ${({ theme }) => theme.textAlt};
	font-size: 12px;
	font-family: 'urbanist-regular';
	padding-top: 5px;
`
