import Button from '@/components/button'
import Input from '@/components/input'
import { useSession } from '@/contexts/session-provider'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { error, success } from '@/messages/edit'
import { publishersService } from '@/services/instantdb'
import { Stack, router } from 'expo-router'
import { Save } from 'lucide-react-native'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, View } from 'react-native'

interface EditProfileForm {
	name: string
}

const EditProfile = () => {
	const { publisher } = useSession()
	const { colors } = useThemedColors()
	const { control, formState, handleSubmit } = useForm<EditProfileForm>({
		mode: 'onChange',
		defaultValues: { name: publisher?.name || '' },
	})

	const save: SubmitHandler<EditProfileForm> = async (data) => {
		const name = data.name.trim()
		if (!name || !publisher) return

		try {
			// The perms only let a publisher change their own record while keeping level and approval
			await publishersService.updatePublisher(publisher.id, { name })
			success('nome')
			router.back()
		} catch (err) {
			error('nome')
			console.error('Failed to update publisher name:', err)
		}
	}

	return (
		<KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Stack.Screen options={{ title: 'Alterar Nome' }} />
			<View className="flex h-full w-full bg-background px-4 py-2">
				<Controller
					control={control}
					rules={{ required: true, validate: (value) => value.trim().length >= 2 }}
					name="name"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label="Seu nome"
							placeholder="Digite seu nome"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							autoCapitalize="words"
							autoCorrect={false}
						/>
					)}
				/>
				<Button
					disabled={!formState.isValid || !publisher}
					loading={formState.isSubmitting}
					onPress={handleSubmit(save)}
					left={<Save size={16} color={colors.foreground} />}>
					Salvar
				</Button>
			</View>
		</KeyboardAvoidingView>
	)
}

export default EditProfile
