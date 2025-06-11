import { useThemedColors } from '@/hooks/use-themed-colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useCallback, useState } from 'react'
import { Pressable, TextInput, TextInputProps, View } from 'react-native'

const PasswordInput = (props: TextInputProps) => {
	const [show, setShow] = useState(false)
	const { colors } = useThemedColors()

	const toggleShow = useCallback(() => {
		setShow(old => !old)
	}, [])

	return (
		<View className='relative'>
			<TextInput
				{...props}
				secureTextEntry={!show}
				placeholderTextColor={colors.foreground + '80'}
				className='w-full h-[50px] px-4 py-4 rounded-xl border-[1.5px] border-border bg-card text-foreground text-[15px] mb-2.5 font-medium'
			/>
			<Pressable hitSlop={20} onPress={toggleShow} className='absolute right-[15px] top-3'>
				<Ionicons name={show ? 'eye-outline' : 'eye-off-outline'} size={24} color={colors.border} />
			</Pressable>
		</View>
	)
}

export default PasswordInput
