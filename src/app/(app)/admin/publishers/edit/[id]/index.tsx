import Button from '@components/Button'
import IconButton from '@components/IconButton'
import Input from '@components/Input'
import usePublishers from '@hooks/usePublishers'
import { EditPublisherReq } from '@interfaces/api/publishers'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { error as removeError, success as removeSuccess } from '@messages/delete'
import { error, success } from '@messages/edit'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { colors } from '@themes/index'
import Dropdown from '@components/Dropdown'

import * as S from './styles'
import { database } from '@services/appwrite'
import { Models } from 'react-native-appwrite'

const EditPublisher = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const { mutate } = usePublishers({ search: '' })
	const { control, formState, handleSubmit } = useForm<EditPublisherReq>({
		defaultValues: {
			name: params.name,
			level: params.level ? params.level.toString() : '3',
		},
	})

	const levelOptions = [
		{ label: 'Admin', value: '1' },
		{ label: 'Editor', value: '2' },
		{ label: 'Publicador', value: '3' },
	]

	const save: SubmitHandler<EditPublisherReq> = async data => {
		if (!data.name) return

		try {
			await database.updateDocument('production', 'publishers', params.$id, {
				name: data.name,
				level: parseInt(data.level || '3'),
			})
			success('publicador')
			mutate()
		} catch (err) {
			error('publicador')
			console.error('Failed to update publisher:', err)
		}
	}

	const deletePublisher = async () => {
		try {
			await database.deleteDocument('production', 'publishers', params.$id)

			removeSuccess('publicador')
			mutate()
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
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Sim, excluir',
					onPress: () => deletePublisher(),
					style: 'default',
				},
			]
		)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Editar Publicador' }} />
			<S.Content>
				<Controller
					control={control}
					rules={{ required: true }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input placeholder='Nome do publicador' onBlur={onBlur} onChangeText={onChange} value={value} />
					)}
				/>
				<Controller
					control={control}
					name='level'
					render={({ field: { onChange, value } }) => (
						<Dropdown
							selectedValue={value}
							options={levelOptions}
							placeholder='Selecione o nível'
							onValueChange={onChange}
						/>
					)}
				/>
				<S.RowMargin>
					<Button loading={formState.isSubmitting} onPress={handleSubmit(save)}>
						Atualizar
					</Button>
					<IconButton icon='trash-bin-outline' color={colors.error} onPress={showDeleteAlert} />
				</S.RowMargin>
			</S.Content>
		</S.Container>
	)
}

export default EditPublisher
