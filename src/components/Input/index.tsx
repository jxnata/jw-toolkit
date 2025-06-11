import { useThemedColors } from '@/hooks/use-themed-colors'
import { TextInput, TextInputProps } from 'react-native'

const Input = (props: TextInputProps) => {
	const { colors } = useThemedColors()

	return (
		<TextInput
			{...props}
			placeholderTextColor={colors.foreground + '80'}
			className='w-full h-[50px] px-4 py-4 rounded-lg border-[1.5px] border-border bg-card text-foreground text-[15px] mb-2.5 font-medium'
		/>
	)
}

export default Input
