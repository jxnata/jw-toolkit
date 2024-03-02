import Ionicons from '@expo/vector-icons/Ionicons'
import DropdownSelect from 'react-native-input-select'
import styled from 'styled-components/native'

export const Dropdown = styled(DropdownSelect).attrs(({ theme }) => ({
	dropdownStyle: {
		backgroundColor: theme.backgroundAlt,
		borderRadius: 12,
		borderWidth: 0,
		minHeight: 40,
		paddingLeft: 16,
	},
	dropdownContainerStyle: {
		marginBottom: 10,
	},
	modalOptionsContainerStyle: {
		backgroundColor: theme.backgroundAlt,
	},
	placeholderStyle: {
		color: theme.textAlt,
		fontSize: 15,
		fontFamily: 'urbanist-medium',
	},
	selectedItemStyle: {
		color: theme.text,
		fontSize: 15,
		fontFamily: 'urbanist-medium',
	},
	dropdownIconStyle: {
		top: 15,
		right: 16,
	},
	checkboxComponentStyles: {
		checkboxLabelStyle: {
			color: theme.text,
			fontSize: 15,
			fontFamily: 'urbanist-medium',
		},
		checkboxStyle: {
			borderColor: theme.background,
		},
	},
	primaryColor: theme.primary,
}))`
	width: 100%;
	padding: 16px;
	border-radius: 12px;
	background: ${({ theme }) => theme.backgroundAlt};
	color: ${({ theme }) => theme.text};
	font-size: 15px;
	margin-bottom: 10px;
	font-family: 'urbanist-medium';
`
export const Ionicon = styled(Ionicons).attrs(({ theme }) => ({
	size: 24,
}))`
	color: ${({ theme }) => theme.textAlt};
`
