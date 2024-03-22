import Ionicons from '@expo/vector-icons/Ionicons'
import styled from 'styled-components/native'

export const Button = styled.Pressable`
	width: 50px;
	height: 50px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	border: solid 1.5px ${({ theme }) => theme.border};
	background: ${({ theme }) => theme.backgroundAlt};
	font-size: 15px;
	margin-bottom: 15px;
`
export const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
	color: theme.primary,
	size: 'small',
}))``

export const Ionicon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme, color }) => color || theme.text};
`
