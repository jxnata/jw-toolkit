import Button from '@components/Button'
import Input from '@components/Input'
import useCities from '@hooks/useCities'
import { AddCityReq } from '@interfaces/api/cities'
import { Stack, router } from 'expo-router'
import { error, success } from '@messages/add'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useSession } from '@contexts/session'
import { database } from '@services/appwrite'
import { ID, Permission, Role } from 'react-native-appwrite'

import * as S from './styles'

const AddCity = () => {
	const { congregation } = useSession()
	const { mutate } = useCities({ search: '' })
	const { control, formState, handleSubmit } = useForm<AddCityReq>()

	const save: SubmitHandler<AddCityReq> = async data => {
		if (!data.name) return
		if (!congregation) return

		try {
			await database.createDocument(
				'production',
				'cities',
				ID.unique(),
				{
					name: data.name,
					congregation: congregation.id,
				},
				[
					Permission.read(Role.label(congregation.id)),
					Permission.update(Role.label(congregation.id)),
					Permission.delete(Role.label(congregation.id)),
				]
			)
			success('cidade')
			mutate()
			router.back()
		} catch (err) {
			error('cidade')
			console.error('Failed to create city:', err)
		}
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Nova Cidade' }} />
			<S.Content>
				<Controller
					control={control}
					rules={{ required: true }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input placeholder='Nome da cidade' onBlur={onBlur} onChangeText={onChange} value={value} />
					)}
				/>
				<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
					Salvar
				</Button>
			</S.Content>
		</S.Container>
	)
}

export default AddCity
