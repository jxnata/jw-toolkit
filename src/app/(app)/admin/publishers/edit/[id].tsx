import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import IconButton from '@/components/icon-button'
import Input from '@/components/input'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { EditPublisherReq } from '@/interfaces/api/publishers'
import { error as removeError, success as removeSuccess } from '@/messages/delete'
import { error, success } from '@/messages/edit'
import { publishersService } from '@/services/instantdb'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native'

import { Publisher } from '@/interfaces'
import { Save } from 'lucide-react-native'

const EditPublisher = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Publisher
	const { control, formState, handleSubmit } = useForm<EditPublisherReq>({
		defaultValues: { name: params.name, level: params.level ? params.level.toString() : '3' },
	})
	const { colors } = useThemedColors()

	const levelOptions = [
		{ label: 'Admin', value: '1' },
		// { label: 'Editor', value: '2' },
		{ label: 'Publicador', value: '3' },
	]

	const save: SubmitHandler<EditPublisherReq> = async data => {
		if (!data.name) return

		try {
			await publishersService.updatePublisher(params.id, {
				name: data.name,
				level: parseInt(data.level || '3'),
			})
			success('publicador')
			router.back()
		} catch (err) {
			error('publicador')
			console.error('Failed to update publisher:', err)
		}
	}

	const deletePublisher = async () => {
		try {
			await publishersService.deletePublisher(params.id)

			removeSuccess('publicador')
			router.back()
		} catch (err) {
			removeError('publicador')
			console.error('Failed to delete publisher:', err)
		}
	}

	const showDeleteAlert = () =>
		Alert.alert(
			'Excluir',
			'Deseja excluir o publicador e todas as suas designações? Essa opção não pode ser revertida.',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{ text: 'Sim, excluir', onPress: () => deletePublisher(), style: 'default' },
			]
		)

	return (
		<View className='flex-1'>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<Stack.Screen options={{ title: 'Editar Publicador' }} />
				<View className='flex px-4 py-2 w-full h-full bg-background'>
					<Controller
						control={control}
						rules={{ required: true }}
						name='name'
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								placeholder='Nome do publicador'
								label='Nome'
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
							/>
						)}
					/>
					<Controller
						control={control}
						name='level'
						render={({ field: { onChange, value } }) => (
							<Dropdown
								label='Nível de acesso'
								selectedValue={value}
								options={levelOptions}
								placeholder='Selecione o nível'
								onValueChange={onChange}
							/>
						)}
					/>
					<View className='flex-row gap-2.5 mt-5'>
						<View className='flex-1'>
							<Button
								loading={formState.isSubmitting}
								onPress={handleSubmit(save)}
								left={<Save size={16} color={colors.foreground} />}
							>
								Atualizar
							</Button>
						</View>
						<IconButton icon='trash-bin-outline' color={colors.danger[600]} onPress={showDeleteAlert} />
					</View>
				</View>
			</KeyboardAvoidingView>
		</View>
	)
}

export default EditPublisher
