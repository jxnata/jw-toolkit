import Button from '@components/Button'
import Dropdown from '@components/Dropdown'
import IconButton from '@components/IconButton'
import Input from '@components/Input'
import usePublishers from '@hooks/swr/admin/usePublishers'
import useUsers from '@hooks/swr/admin/useUsers'
import { EditUserReq } from '@interfaces/api/users'
import { IUserParams } from '@interfaces/models/User'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { error as removeError, success as removeSuccess } from '@messages/delete'
import { error, success } from '@messages/edit'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { edit } from '@services/users/edit'
import { remove } from '@services/users/remove'
import { colors } from '@themes/index'

import * as S from './styles'

const EditUser = () => {
	const params: Partial<IUserParams> = useLocalSearchParams()
	const { mutate } = useUsers()
	const { control, formState, handleSubmit } = useForm<EditUserReq>({
		defaultValues: { name: params.name, publisher: params.publisher },
	})
	const { publishers } = usePublishers({ all: true })
	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p._id })), [publishers])

	const save: SubmitHandler<EditUserReq> = async data => {
		const result = await edit(params._id, data)

		if (result) {
			success('usuário')
			mutate()
			return
		}

		error('usuário')
	}

	const deleteUser = async () => {
		const result = await remove(params._id)

		if (result) {
			removeSuccess('usuário')
			mutate()
			router.back()
			return
		}

		removeError('usuário')
	}

	const showDeleteAlert = () =>
		Alert.alert('Excluir', 'Deseja excluir o usuário? Essa opção não pode ser revertida.', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'Sim, excluir',
				onPress: () => deleteUser(),
				style: 'default',
			},
		])

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Editar Admininstrador' }} />
			<S.Content>
				<Controller
					control={control}
					rules={{ required: true }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input placeholder='Nome do usuário' onBlur={onBlur} onChangeText={onChange} value={value} />
					)}
				/>
				<Controller
					control={control}
					rules={{ required: true }}
					name='publisher'
					render={({ field: { onChange, onBlur, value } }) => (
						<Dropdown
							placeholder='Publicador vinculado'
							options={publisherList}
							selectedValue={value}
							onValueChange={onChange}
						/>
					)}
				/>
				<S.RowMargin>
					<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
						Atualizar
					</Button>
					<IconButton icon='trash-bin-outline' color={colors.error} onPress={showDeleteAlert} />
				</S.RowMargin>
			</S.Content>
		</S.Container>
	)
}

export default EditUser
