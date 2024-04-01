import styled from 'styled-components/native'

export const Container = styled.View`
	display: flex;
`
export const Content = styled.ScrollView`
	padding: 10px;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background};
	gap: 5px;
`
export const Row = styled.View`
	gap: 5px;
	flex-direction: row;
	justify-content: center;
`
export const RowMargin = styled(Row)`
	margin-top: 15px;
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
export const Text = styled.Text`
	color: ${({ theme }) => theme.text};
	font-size: 15px;
	font-family: 'urbanist-medium';
	margin-bottom: 10px;
`
