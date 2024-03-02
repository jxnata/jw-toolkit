import Button from 'components/Button'
import IconButton from 'components/IconButton'
import Input from 'components/Input'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useCities from 'hooks/swr/admin/useCities'
import useCity from 'hooks/swr/admin/useCity'
import { error as removeError, success as removeSuccess } from 'messages/delete'
import { error, success } from 'messages/edit'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { edit } from 'services/cities/edit'
import { remove } from 'services/cities/remove'
import { colors } from 'themes'
import { EditCityReq } from 'types/api/cities'
import { ICity } from 'types/models/City'
import * as S from './styles'

const EditCity = () => {
	const params: Partial<ICity> = useLocalSearchParams()
	const { city, mutate: mutateCity } = useCity(params._id)
	const { mutate } = useCities({ search: '' })
	const { control, formState, handleSubmit } = useForm<EditCityReq>({ defaultValues: { name: params.name } })

	const save: SubmitHandler<EditCityReq> = async data => {
		const result = await edit(city._id, data)

		if (result) {
			success('cidade')
			mutate()
			mutateCity()
			return
		}

		error('cidade')
	}

	const deleteCity = async () => {
		const result = await remove(city._id)

		if (result) {
			removeSuccess('cidade')
			mutate()
			router.back()
			return
		}

		removeError('cidade')
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
					<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
						Atualizar
					</Button>
					<IconButton icon='trash-bin-outline' color={colors.error} onPress={showDeleteAlert} />
				</S.Row>
			</S.Content>
		</S.Container>
	)
}

export default EditCity
