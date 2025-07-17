import { useThemedColors } from '@/hooks/use-themed-colors'
import { Text, TextInput, TextInputProps, View } from 'react-native'

const Input = (props: TextInputProps & { label?: string }) => {
	const { colors } = useThemedColors()

	return (
		<View className='flex flex-col gap-1'>
			{props.label && <Text className='text-foreground text-sm font-medium opacity-70 ml-1'>{props.label}</Text>}
			<TextInput
				{...props}
				placeholderTextColor={colors.foreground + '80'}
				className='w-full px-4 py-4 rounded-lg border border-border bg-card text-foreground mb-2 font-medium'
			/>
		</View>
	)
}

export default Input
