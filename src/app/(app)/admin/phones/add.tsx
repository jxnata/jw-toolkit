import Button from '@/components/button'
import Input from '@/components/input'
import { useSession } from '@/contexts/session-provider'
import { error, success } from '@/messages/add'
import { phonesService } from '@/services/instantdb'
import { formatPhone, parsePhoneList } from '@/utils/phone-number'
import { Stack, router } from 'expo-router'
import { Save } from 'lucide-react-native'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native'

type AddPhoneForm = {
	numbers: string
}

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

const AddPhone = () => {
	const { congregation } = useSession()
	const { control, formState, handleSubmit } = useForm<AddPhoneForm>({ mode: 'onChange', defaultValues: { numbers: '' } })

	const parsed = parsePhoneList(useWatch({ control, name: 'numbers' }))

	const save: SubmitHandler<AddPhoneForm> = async (data) => {
		if (!congregation) return

		const { numbers, invalid, repeated } = parsePhoneList(data.numbers)
		if (numbers.length === 0) return

		try {
			const existing = await phonesService.findExistingNumbers(numbers, congregation.id)
			const toCreate = numbers.filter((number) => !existing.includes(number))

			if (toCreate.length === 0) {
				Alert.alert(
					numbers.length === 1 ? 'Telefone já cadastrado' : 'Telefones já cadastrados',
					numbers.length === 1
						? `O número ${formatPhone(numbers[0])} já está na lista de telefones.`
						: 'Todos os números da lista já estão cadastrados.'
				)
				return
			}

			await phonesService.createPhones(toCreate, congregation.id)

			const skipped = [
				existing.length > 0 && plural(existing.length, 'já estava cadastrado', 'já estavam cadastrados'),
				repeated > 0 && plural(repeated, 'repetido na lista', 'repetidos na lista'),
				invalid.length > 0 && plural(invalid.length, 'inválido', 'inválidos'),
			].filter(Boolean)

			if (skipped.length === 0 && toCreate.length === 1) {
				success('telefone')
			} else {
				const message = skipped.length > 0 ? `Ignorados: ${skipped.join(', ')}.` : undefined
				Alert.alert(`${plural(toCreate.length, 'telefone adicionado', 'telefones adicionados')}`, message)
			}
			router.back()
		} catch (err) {
			error('telefone')
			console.error('Failed to create phones:', err)
		}
	}

	return (
		<KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Stack.Screen options={{ title: 'Novos telefones' }} />
			<ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-2" keyboardShouldPersistTaps="handled">
				<Controller
					control={control}
					rules={{ validate: (value) => parsePhoneList(value).numbers.length > 0 }}
					name="numbers"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label="Números"
							placeholder={'(11) 98765-4321\n(11) 3456-7890'}
							multiline
							textAlignVertical="top"
							className="min-h-40"
							autoFocus
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
						/>
					)}
				/>
				<Text className="mb-3 font-regular text-sm text-foreground opacity-70">
					Digite ou cole um número por linha. Números repetidos ou já cadastrados são ignorados.
				</Text>
				{(parsed.numbers.length > 0 || parsed.invalid.length > 0) && (
					<Text className="mb-3 font-medium text-sm text-foreground">
						{plural(parsed.numbers.length, 'número válido', 'números válidos')}
						{parsed.repeated > 0 && ` · ${plural(parsed.repeated, 'repetido', 'repetidos')}`}
						{parsed.invalid.length > 0 && ` · ${plural(parsed.invalid.length, 'inválido', 'inválidos')}`}
					</Text>
				)}
				{parsed.invalid.length > 0 && (
					<Text className="mb-3 font-regular text-sm text-danger">
						Não serão salvos: {parsed.invalid.slice(0, 5).join(', ')}
						{parsed.invalid.length > 5 && '…'}
					</Text>
				)}
				<Button
					disabled={!formState.isValid}
					loading={formState.isSubmitting}
					onPress={handleSubmit(save)}
					left={<Save size={16} color="#ffffff" />}>
					{parsed.numbers.length > 1 ? `Salvar ${parsed.numbers.length} telefones` : 'Salvar'}
				</Button>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

export default AddPhone
