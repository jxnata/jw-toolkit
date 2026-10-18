import Button from '@/components/button'
import Input from '@/components/input'
import { useSession } from '@/contexts/session-provider'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { error, success } from '@/messages/edit'
import { congregationsService } from '@/services/instantdb'
import { Stack, router } from 'expo-router'
import { Save } from 'lucide-react-native'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, View } from 'react-native'

interface EditCongregationForm {
	name: string
}

const EditCongregation = () => {
	const { congregation, type } = useSession()
	const { colors } = useThemedColors()
	const { control, formState, handleSubmit } = useForm<EditCongregationForm>({
		mode: 'onChange',
		defaultValues: { name: congregation?.name || '' },
	})

	const save: SubmitHandler<EditCongregationForm> = async (data) => {
		const name = data.name.trim()
		if (!name || !congregation || type !== 'admin') return

		try {
			// Only an admin of this congregation passes the update rule in instant.perms.ts
			await congregationsService.updateCongregation(congregation.id, { name })
			success('congregação')
			router.back()
		} catch (err) {
			error('congregação')
			console.error('Failed to rename congregation:', err)
		}
	}

	return (
		<KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Stack.Screen options={{ title: 'Renomear Congregação' }} />
			<View className="flex h-full w-full bg-background px-4 py-2">
				<Controller
					control={control}
					rules={{ required: true, validate: (value) => value.trim().length >= 2 }}
					name="name"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label="Nome da Congregação"
							placeholder="Digite o nome da congregação"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							autoCapitalize="words"
							autoCorrect={false}
						/>
					)}
				/>
				<Button
					disabled={!formState.isValid || !congregation}
					loading={formState.isSubmitting}
					onPress={handleSubmit(save)}
					left={<Save size={16} color={colors.foreground} />}>
					Salvar
				</Button>
			</View>
		</KeyboardAvoidingView>
	)
}

export default EditCongregation
