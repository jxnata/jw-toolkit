import Button from '@components/Button'
import Dropdown from '@components/Dropdown'
import MapViewDetails from '@components/MapViewDetails'
import useMap from '@hooks/useMap'
import usePublishers from '@hooks/usePublishers'
import { EditAssignmentReq } from '@interfaces/api/assignments'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { error as removeError, success as removeSuccess } from '@messages/delete'
import { error, success } from '@messages/edit'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'

import * as S from './styles'
import { Models } from 'react-native-appwrite'
import { database } from '@services/appwrite'
import useMaps from '@hooks/useMaps'

const EditAssignment = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const { map } = useMap(params.$id)
	const { publishers } = usePublishers()
	const { mutate } = useMaps({ status: 'assigned', search: params.search || '' })

	const defaultValues: EditAssignmentReq = useMemo(
		() => ({
			assigned: typeof params.assigned === 'object' ? params.assigned.$id : params.assigned,
		}),
		[params.assigned]
	)

	const { control, formState, handleSubmit } = useForm<EditAssignmentReq>({ defaultValues })

	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p.$id })), [publishers])

	const save: SubmitHandler<EditAssignmentReq> = async data => {
		try {
			await database.updateDocument('production', 'maps', params.$id!, {
				assigned: data.assigned,
			})

			success('designação')
			mutate()
			router.back()
		} catch (err) {
			error('designação')
			console.error('Failed to update map (assigned):', err)
		}
	}

	const deleteAssignment = async () => {
		try {
			await database.updateDocument('production', 'maps', params.$id!, {
				assigned: null,
			})

			removeSuccess('designação')
			mutate()
			router.back()
		} catch (err) {
			removeError('designação')
			console.error('Failed to update map (assigned):', err)
		}
	}

	const showDeleteAlert = () =>
		Alert.alert('Remover', 'Deseja remover a designação? Essa opção não pode ser revertida.', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'Sim, remover',
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
					name='assigned'
					render={({ field: { onChange, value } }) => (
						<Dropdown
							label='Designado para'
							placeholder='Selecione um publicador...'
							options={publisherList}
							selectedValue={value}
							onValueChange={onChange}
						/>
					)}
				/>
				<S.Row>
					<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
						Atualizar
					</Button>
					<S.ButtonOutline onPress={showDeleteAlert} disabled={formState.isSubmitting}>
						<S.ButtonOutlineText>Remover designação</S.ButtonOutlineText>
					</S.ButtonOutline>
				</S.Row>
			</S.Content>
		</S.Container>
	)
}

export default EditAssignment
