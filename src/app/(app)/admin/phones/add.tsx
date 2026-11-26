import Button from '@/components/button'
import Input from '@/components/input'
import { useSession } from '@/contexts/session-provider'
import { error, success } from '@/messages/add'
import { phonesService } from '@/services/instantdb'
import { formatPhone, isValidPhone } from '@/utils/phone-number'
import { Stack, router } from 'expo-router'
import { Save } from 'lucide-react-native'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native'

type AddPhoneForm = {
	number: string
}

const AddPhone = () => {
	const { congregation } = useSession()
	const { control, formState, handleSubmit } = useForm<AddPhoneForm>({ mode: 'onChange' })

	const save: SubmitHandler<AddPhoneForm> = async (data) => {
		if (!congregation) return

		try {
			if (await phonesService.existsInCongregation(data.number, congregation.id)) {
				Alert.alert('Telefone já cadastrado', `O número ${formatPhone(data.number)} já está na lista de telefones.`)
				return
			}

			await phonesService.createPhone({ number: data.number, congregationId: congregation.id })
			success('telefone')
			router.back()
		} catch (err) {
			error('telefone')
			console.error('Failed to create phone:', err)
		}
	}

	return (
		<KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Stack.Screen options={{ title: 'Novo telefone' }} />
			<View className="flex h-full w-full bg-background px-4 py-2">
				<Controller
					control={control}
					rules={{ required: true, validate: isValidPhone }}
					name="number"
					render={({ field: { onChange, onBlur, value }, fieldState }) => (
						<Input
							label="Número"
							placeholder="(11) 98765-4321"
							keyboardType="phone-pad"
							autoFocus
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							error={fieldState.error}
						/>
					)}
				/>
				<Button
					disabled={!formState.isValid}
					loading={formState.isSubmitting}
					onPress={handleSubmit(save)}
					left={<Save size={16} color="#ffffff" />}>
					Salvar
				</Button>
			</View>
		</KeyboardAvoidingView>
	)
}

export default AddPhone
