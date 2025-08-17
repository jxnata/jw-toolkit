import Button from '@/components/button'
import IconButton from '@/components/icon-button'
import Input from '@/components/input'
import useCities from '@/hooks/use-cities'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { City } from '@/interfaces'
import { EditCityReq } from '@/interfaces/api/cities'
import { error as removeError, success as removeSuccess } from '@/messages/delete'
import { error, success } from '@/messages/edit'
import { citiesService } from '@/services/instantdb'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Save, Trash } from 'lucide-react-native'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native'

const EditCity = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as City
	const { mutate } = useCities({ search: '' })
	const { control, formState, handleSubmit } = useForm<EditCityReq>({
		defaultValues: { name: params.name },
	})
	const { colors } = useThemedColors()

	const save: SubmitHandler<EditCityReq> = async data => {
		if (!data.name) return

		try {
			await citiesService.updateCity(params.id, {
				name: data.name,
			})
			success('cidade')
			mutate()
			router.back()
		} catch (err) {
			error('cidade')
			console.error('Failed to update city:', err)
		}
	}

	const deleteCity = async () => {
		try {
			await citiesService.deleteCity(params.id)

			removeSuccess('cidade')
			mutate()
			router.back()
		} catch (err) {
			removeError('cidade')
			console.error('Failed to delete city:', err)
		}
	}

	const showDeleteAlert = () =>
		Alert.alert(
			'Excluir',
			'Deseja excluir a cidade e todos os mapas relacionados? Essa opção não pode ser revertida.',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Sim, excluir',
					onPress: () => deleteCity(),
					style: 'default',
				},
			]
		)

	return (
		<KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Stack.Screen options={{ title: 'Editar Cidade' }} />
			<View className='flex px-4 py-2 w-full h-full bg-background'>
				<Controller
					control={control}
					rules={{ required: true }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label='Nome'
							placeholder='Nome da cidade'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
						/>
					)}
				/>
				<View className='flex-row gap-2.5 mt-2.5'>
					<View className='flex-1'>
						<Button
							loading={formState.isSubmitting}
							onPress={handleSubmit(save)}
							left={<Save size={16} color='#ffffff' />}
						>
							Atualizar
						</Button>
					</View>
					<IconButton icon={<Trash size={16} color={colors.danger[600]} />} onPress={showDeleteAlert} />
				</View>
			</View>
		</KeyboardAvoidingView>
	)
}

export default EditCity
