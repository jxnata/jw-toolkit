import styled from 'styled-components/native'

export const Container = styled.View`
	display: flex;
`
export const Content = styled.ScrollView`
	display: flex;
	padding: 10px;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background};
`
export const Paragraph = styled.Text`
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	padding: 20px 10px;
	font-family: 'urbanist-medium';
	align-self: center;
`
export const RefreshControl = styled.RefreshControl``
