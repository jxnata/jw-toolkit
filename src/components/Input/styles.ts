import styled from 'styled-components/native'

export const Input = styled.TextInput.attrs(({ theme }) => ({
	placeholderTextColor: theme.textAlt,
}))`
	width: 100%;
	height: 50px;
	padding: 16px;
	border-radius: 8px;
	border: solid 1.5px ${({ theme }) => theme.border};
	background: ${({ theme }) => theme.backgroundAlt};
	color: ${({ theme }) => theme.text};
	font-size: 15px;
	margin-bottom: 10px;
	font-family: 'urbanist-medium';
`
