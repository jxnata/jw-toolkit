import Ionicons from '@expo/vector-icons/Ionicons'
import styled from 'styled-components/native'

export const Button = styled.TouchableOpacity`
	width: 60px;
	height: 60px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
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