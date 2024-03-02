import styled from 'styled-components/native'

export const Container = styled.View`
	gap: 5px;
	align-items: center;
	flex-direction: row;
`
export const Button = styled.Pressable`
	padding: 10px;
	border-radius: 8px;
	background-color: ${props => (props['aria-selected'] ? props.theme.primary : props.theme.backgroundAlt)};
`
export const ButtonText = styled.Text`
	font-size: 12px;
	color: ${props => (props['aria-selected'] ? props.theme.secondary : props.theme.text)};
	font-family: 'urbanist-bold';
`
