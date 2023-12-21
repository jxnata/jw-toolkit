import { DropdownProps } from 'react-native-input-select/lib/typescript/types/index.types'
import * as S from './styles'

const Dropdown = (props: DropdownProps) => {
	return <S.Dropdown {...props} dropdownIcon={<S.Ionicon name='chevron-down-outline' />} />
}

export default Dropdown
