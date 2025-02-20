import Button from '@components/Button'
import IconButton from '@components/IconButton'
import Input from '@components/Input'
import useCities from '@hooks/swr/admin/useCities'
import { EditCityReq } from '@interfaces/api/cities'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { error as removeError, success as removeSuccess } from '@messages/delete'
import { error, success } from '@messages/edit'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { colors } from '@themes/index'
import { database } from '@services/appwrite'

import * as S from './styles'
import { Models } from 'react-native-appwrite'

const EditCity = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const { mutate } = useCities({ search: '' })
	const { control, formState, handleSubmit } = useForm<EditCityReq>({
		defaultValues: { name: params.name },
	})

	const save: SubmitHandler<EditCityReq> = async data => {
		if (!data.name) return

		try {
			await database.updateDocument('production', 'cities', params.$id, {
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
			await database.deleteDocument('production', 'cities', params.$id)

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
		<S.Container>
			<Stack.Screen options={{ title: 'Editar Cidade' }} />
			<S.Content>
				<Controller
					control={control}
					rules={{ required: true }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input placeholder='Nome do cidade' onBlur={onBlur} onChangeText={onChange} value={value} />
					)}
				/>
				<S.Row>
					<Button loading={formState.isSubmitting} onPress={handleSubmit(save)}>
						Atualizar
					</Button>
					<IconButton icon='trash-bin-outline' color={colors.error} onPress={showDeleteAlert} />
				</S.Row>
			</S.Content>
		</S.Container>
	)
}

export default EditCity
