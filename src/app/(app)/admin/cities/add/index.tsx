import Button from 'components/Button'
import Input from 'components/Input'
import { Stack, router } from 'expo-router'
import useCities from 'hooks/swr/admin/useCities'
import { error, success } from 'messages/add'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { add } from 'services/cities/add'
import { AddCityReq } from 'types/api/cities'

import * as S from './styles'

const AddCity = () => {
	const { mutate } = useCities({ search: '' })
	const { control, formState, handleSubmit } = useForm<AddCityReq>()

	const save: SubmitHandler<AddCityReq> = async data => {
		const result = await add(data)

		if (result) {
			success('cidade')
			mutate()
			router.back()
			return
		}

		error('cidade')
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
