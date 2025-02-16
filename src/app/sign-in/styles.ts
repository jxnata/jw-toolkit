import Ionicons from '@expo/vector-icons/Ionicons'
import styled from 'styled-components/native'

export const Container = styled.View`
	display: flex;
`
export const Content = styled.View`
	display: flex;
	height: 100%;
	justify-content: flex-end;
`
export const Mask = styled.View`
	position: absolute;
	flex: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.background};
	opacity: 0.7;
`
export const Accent = styled.Text`
	text-align: center;
	font-size: 15px;
	font-weight: bold;
	color: ${({ theme }) => theme.primary};
	font-family: 'urbanist-bold';
`
export const Title = styled.Text`
	text-align: center;
	font-size: 18px;
	color: ${({ theme }) => theme.text};
	font-family: 'urbanist-bold';
`
export const Small = styled.Text`
	text-align: center;
	font-size: 14px;
	color: ${({ theme }) => theme.textAlt};
	font-family: 'urbanist-regular';
`
export const Version = styled(Small)`
	margin-top: 20px;
	align-self: center;
`
export const TitleContainer = styled.View`
	flex-direction: column;
	text-align: center;
	align-items: center;
	margin-bottom: 25px;
	gap: 10px;
`
export const Panel = styled.View`
	display: flex;
	background-color: ${({ theme }) => theme.background};
	padding-left: 15px;
	padding-right: 15px;
	padding-top: 25px;
	border-radius: 12px;
	opacity: 0.9;
`
export const Row = styled.View`
	gap: 5px;
	flex-direction: row;
	justify-content: center;
`
export const IconButton = styled.Pressable``
export const Icon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme }) => theme.text};
`
export const Background = styled.ImageBackground.attrs(({ theme }) => ({
	resizeMode: 'cover',
}))`
	display: flex;
	width: 100%;
	height: 100%;
`
