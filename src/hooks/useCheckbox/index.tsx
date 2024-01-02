import React, { useCallback, useState } from 'react'
import * as S from './styles'

type CheckboxComponentProps = {
	onChange: () => void
}

const useCheckbox = (options: string[]) => {
	const [selectedValues, setSelectedValues] = useState([])

	const isSelected = (option: string) => {
		return selectedValues.includes(option)
	}

	const onChangeSelected = (value, callback) => {
		if (selectedValues.includes(value)) {
			const values = selectedValues.filter(selected => selected !== value)
			setSelectedValues(values)
			callback(values)
		} else {
			setSelectedValues([...selectedValues, value])
			callback([...selectedValues, value])
		}
	}

	const CheckboxComponent = useCallback(
		({ onChange }: CheckboxComponentProps) => {
			return (
				<S.Container>
					{options.map(option => (
						<S.Button
							key={option}
							aria-selected={isSelected(option)}
							onPress={() => onChangeSelected(option, onChange)}
						>
							<S.ButtonText aria-selected={isSelected(option)}>{option}</S.ButtonText>
						</S.Button>
					))}
				</S.Container>
			)
		},
		[selectedValues, options]
	)

	return { CheckboxComponent, selectedValues }
}

export default useCheckbox
