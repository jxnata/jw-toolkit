import { useMemo, useState } from 'react'
import { Modal } from 'react-native'

import * as S from './styles'

type Props = {
	selectedValue: string
	options: { label: string; value: string }[]
	placeholder: string
	disabled?: boolean
	onValueChange: (any) => void
}

const Dropdown = ({ selectedValue, options, placeholder, disabled = false, onValueChange }: Props) => {
	const [open, setOpen] = useState(false)

	const toggle = () => {
		setOpen(old => !old)
	}

	const onPress = (item: { value: string; label: string }) => {
		onValueChange(item.value)
		setTimeout(toggle, 100)
	}

	const selectedLabel = useMemo(() => {
		if (!selectedValue) return
		if (!options) return
		if (!options.length) return

		const selected = options.find(o => o.value === selectedValue)

		if (!selected) return

		return selected.label
	}, [selectedValue, options])

	return (
		<S.DropdowContainer>
			<S.Input aria-disabled={disabled} onPress={toggle} disabled={disabled}>
				<S.Placeholder>{selectedLabel || placeholder}</S.Placeholder>
				<S.Ionicon name='chevron-down' />
			</S.Input>
			<Modal animationType='fade' transparent visible={open} onRequestClose={toggle}>
				<S.Container onPress={toggle}>
					<S.Content>
						<S.List
							data={options}
							renderItem={({ item }) => (
								<S.Item onPress={() => onPress(item)}>
									{item.value === selectedValue ? (
										<S.Ionicon name='checkmark-circle' />
									) : (
										<S.Ionicon name='ellipse-outline' />
									)}
									<S.Label>{item.label}</S.Label>
								</S.Item>
							)}
							keyExtractor={item => item.label}
							ListFooterComponent={<S.Space />}
						/>
					</S.Content>
				</S.Container>
			</Modal>
		</S.DropdowContainer>
	)
}

export default Dropdown
