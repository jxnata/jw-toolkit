import { useState } from 'react'
import { Text, TextInput, TextInputProps } from 'react-native'

const Input = (props: TextInputProps & { label?: React.ReactNode; error?: unknown }) => {
	const [focused, setFocused] = useState(false)

	return (
		<>
			{typeof props.label === 'string' && <Text className="mb-2 font-semibold text-foreground opacity-75">{props.label}</Text>}
			{typeof props.label === 'object' && props.label}
			<TextInput
				{...props}
				className={`mb-3 rounded-xl border bg-card p-4 font-regular text-foreground ${props.error ? 'border-red-500' : focused ? 'border-primary' : 'border-border'} ${props.className}`}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
			/>
		</>
	)
}

export default Input
