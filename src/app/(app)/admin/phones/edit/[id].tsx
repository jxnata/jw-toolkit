import Button from '@/components/button'
import Input from '@/components/input'
import { useSession } from '@/contexts/session-provider'
import usePhone from '@/hooks/use-phone'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { error, success } from '@/messages/edit'
import { phonesService } from '@/services/instantdb'
import { formatPhone, isValidPhone, normalizePhone } from '@/utils/phone-number'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Save } from 'lucide-react-native'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native'

type EditPhoneForm = {
	number: string
}

const EditPhone = () => {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { congregation } = useSession()
	const { phone, loading } = usePhone(id)
	const { colors } = useThemedColors()
	const { control, formState, handleSubmit, reset } = useForm<EditPhoneForm>({ mode: 'onChange' })

	useEffect(() => {
		if (phone) reset({ number: formatPhone(phone.number) })
	}, [phone?.id]) // eslint-disable-line react-hooks/exhaustive-deps

	const save: SubmitHandler<EditPhoneForm> = async (data) => {
		if (!congregation || !phone) return

		const number = normalizePhone(data.number)
		if (number === phone.number) {
			router.back()
			return
		}

		try {
			if (await phonesService.existsInCongregation(number, congregation.id)) {
				Alert.alert('Telefone já cadastrado', `O número ${formatPhone(number)} já está na lista de telefones.`)
				return
			}

			await phonesService.updatePhoneNumber(phone.id, number)
			success('telefone')
			router.back()
		} catch (err) {
			error('telefone')
			console.error('Failed to update phone:', err)
		}
	}

	return (
		<KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Stack.Screen options={{ title: 'Editar telefone' }} />
			{!phone ? (
				<View className="flex-1 items-center justify-center bg-background">
					{loading ? (
						<ActivityIndicator size="large" color={colors.primary[600]} />
					) : (
						<Text className="font-regular text-foreground opacity-70">Telefone não encontrado</Text>
					)}
				</View>
			) : (
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
			)}
		</KeyboardAvoidingView>
	)
}

export default EditPhone
