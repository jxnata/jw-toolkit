import Button from '@components/Button'
import Dropdown from '@components/Dropdown'
import IconButton from '@components/IconButton'
import Input from '@components/Input'
import MapViewDetails from '@components/MapViewDetails'
import useAssignments from '@hooks/swr/admin/useAssignments'
import useMap from '@hooks/swr/admin/useMap'
import usePublishers from '@hooks/swr/admin/usePublishers'
import { EditAssignmentReq } from '@interfaces/api/assignments'
import { IAssignment } from '@interfaces/models/Assignment'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { error as removeError, success as removeSuccess } from '@messages/delete'
import { error, success } from '@messages/edit'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { edit } from '@services/assignments/edit'
import { remove } from '@services/assignments/remove'
import { colors } from '@themes'

import * as S from './styles'

const EditAssignment = () => {
	const params: Partial<IAssignment> = useLocalSearchParams()
	const { map } = useMap(typeof params.map === 'object' ? params.map._id : params.map)
	const { publishers } = usePublishers({ all: true })
	const { mutate } = useAssignments({ search: '' })

	const defaultValues: EditAssignmentReq = useMemo(
		() => ({
			map: typeof params.map === 'object' ? params.map._id : params.map,
			publisher: typeof params.publisher === 'object' ? params.publisher._id : params.publisher,
			details: params.details,
			permanent: params.permanent,
		}),
		[params.details, params.map, params.permanent, params.publisher]
	)

	const { control, formState, handleSubmit } = useForm<EditAssignmentReq>({ defaultValues })

	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p._id })), [publishers])

	const save: SubmitHandler<EditAssignmentReq> = async data => {
		const result = await edit(params._id, data)

		if (result) {
			success('designação')
			mutate()
			router.back()
			return
		}

		error('designação')
	}

	const deleteAssignment = async () => {
		const result = await remove(params._id)

		if (result) {
			removeSuccess('designação')
			mutate()
			router.back()
			return
		}

		removeError('designação')
	}

	const showDeleteAlert = () =>
		Alert.alert('Excluir', 'Deseja excluir a designação? Essa opção não pode ser revertida.', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'Sim, excluir',
				onPress: () => deleteAssignment(),
				style: 'default',
			},
		])

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Editar Designação' }} />
			<S.Content>
				{!!map && <MapViewDetails map={map} />}
				<Controller
					control={control}
					rules={{ required: true }}
					name='publisher'
					render={({ field: { onChange, value } }) => (
						<Dropdown
							placeholder='Selecione um publicador...'
							options={publisherList}
							selectedValue={value}
							onValueChange={onChange}
						/>
					)}
				/>
				<Controller
					control={control}
					rules={{ required: true }}
					name='permanent'
					render={({ field: { onChange, value } }) => (
						<Dropdown
							placeholder='Designação Permanente'
							options={[
								{ label: 'Permanente', value: 'true' },
								{ label: 'Temporária', value: 'false' },
							]}
							selectedValue={value ? value.toString() : 'false'}
							onValueChange={onChange}
						/>
					)}
				/>
				<Controller
					control={control}
					rules={{ required: false }}
					name='details'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input placeholder='Observações' onBlur={onBlur} onChangeText={onChange} value={value} />
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

export default EditAssignment
