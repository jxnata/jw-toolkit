import styled from 'styled-components/native'

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
export const Label = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-bold';
`
export const ButtonOutline = styled.Pressable`
	gap: 5px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 10px 20px;
	border-radius: 8px;
	background: ${({ theme }) => theme.backgroundAlt};
	font-size: 15px;
	height: 50px;
`
export const ButtonOutlineText = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-bold';
`
