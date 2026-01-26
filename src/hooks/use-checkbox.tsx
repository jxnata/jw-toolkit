import { useCallback, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

type CheckboxComponentProps = {
	onChange?: () => void
}

const useCheckbox = (options: string[], initialSelected?: string[], unique?: boolean) => {
	const [selectedValues, setSelectedValues] = useState(initialSelected || [])

	const isSelected = useCallback(
		(option: string) => {
			return selectedValues.includes(option)
		},
		[selectedValues]
	)

	const onChangeSelected = useCallback(
		(value: string, callback?: (values: string[]) => void) => {
			if (unique) {
				setSelectedValues([value])
				if (callback) callback([value])
				return
			}

			if (selectedValues.includes(value)) {
				const values = selectedValues.filter((selected) => selected !== value)
				setSelectedValues(values)
				if (callback) callback(values)
			} else {
				setSelectedValues([...selectedValues, value])
				if (callback) callback([...selectedValues, value])
			}
		},
		[selectedValues, unique]
	)

	const CheckboxComponent = useCallback(
		({ onChange }: CheckboxComponentProps) => {
			return (
				<View className="flex-row items-center gap-1">
					{options.map((option) => (
						<Pressable
							key={option}
							className={`rounded-lg p-2.5 ${isSelected(option) ? 'bg-primary-600' : 'bg-card'}`}
							onPress={() => onChangeSelected(option, onChange)}>
							<Text className={`font-bold text-xs ${isSelected(option) ? 'text-background' : 'text-foreground'}`}>
								{option}
							</Text>
						</Pressable>
					))}
				</View>
			)
		},
		[options, isSelected, onChangeSelected]
	)

	return { CheckboxComponent, selectedValues }
}

export default useCheckbox
