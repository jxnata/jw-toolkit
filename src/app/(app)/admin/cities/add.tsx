import Button from '@/components/button'
import Input from '@/components/input'
import { useSession } from '@/contexts/session-provider'
import useCities from '@/hooks/use-cities'
import { AddCityReq } from '@/interfaces/api/cities'
import { error, success } from '@/messages/add'
import { citiesService } from '@/services/instantdb'
import { Stack, router } from 'expo-router'
import { Save } from 'lucide-react-native'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, View } from 'react-native'

const AddCity = () => {
	const { congregation } = useSession()
	const { mutate } = useCities({ search: '' })
	const { control, formState, handleSubmit } = useForm<AddCityReq>()

	const save: SubmitHandler<AddCityReq> = async (data) => {
		if (!data.name) return
		if (!congregation) return

		try {
			await citiesService.createCity({
				name: data.name,
				congregationId: congregation.id,
			})
			success('cidade/território')
			mutate()
			router.back()
		} catch (err) {
			error('cidade/território')
			console.error('Failed to create city:', err)
		}
	}

	return (
		<KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Stack.Screen options={{ title: 'Nova Cidade/Território' }} />
			<View className="flex h-full w-full bg-background px-4 py-2">
				<Controller
					control={control}
					rules={{ required: true }}
					name="name"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label="Nome"
							placeholder="Nome da cidade ou território"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
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

export default AddCity
