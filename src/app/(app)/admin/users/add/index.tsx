import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Input from 'components/Input'
import PasswordInput from 'components/PasswordInput'
import { Stack, useRouter } from 'expo-router'
import usePublishers from 'hooks/swr/admin/usePublishers'
import useUsers from 'hooks/swr/admin/useUsers'
import { error, success } from 'messages/add'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { add } from 'services/users/add'
import { AddUserReq } from 'types/api/users'

import * as S from './styles'

const AddUser = () => {
	const router = useRouter()
	const { mutate } = useUsers()
	const { control, formState, handleSubmit } = useForm<AddUserReq>()
	const { publishers } = usePublishers({ all: true })
	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p._id })), [publishers])

	const save: SubmitHandler<AddUserReq> = async data => {
		const result = await add(data)

		if (result) {
			success('usuário')
			mutate()
			router.back()
			return
		}

		error('usuário')
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Novo Admininstrador' }} />
			<S.Content>
				<S.Text>
					Atenção, antes de criar um usuário, crie um Publicador para ele, após isso crie o usuário abaixo e
					selecione o publicador vinculado.
				</S.Text>
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
					rules={{ required: true, minLength: 5 }}
					name='password'
					render={({ field: { onChange, onBlur, value } }) => (
						<PasswordInput
							placeholder='Senha do usuário'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
						/>
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
						Salvar
					</Button>
				</S.RowMargin>
			</S.Content>
		</S.Container>
	)
}

export default AddUser
