import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useAssignments from 'hooks/swr/admin/useAssignments'
import useMaps from 'hooks/swr/admin/useMaps'
import usePublishers from 'hooks/swr/admin/usePublishers'
import useUnassignedMaps from 'hooks/swr/admin/useUnassignedMaps'
import { error, success } from 'messages/add'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { add } from 'services/assignments/add'
import { AddAssignmentReq } from 'types/api/assignments'
import * as S from './styles'

const AddAssignment = () => {
	const params: Partial<{ map: string }> = useLocalSearchParams()
	const { maps } = useUnassignedMaps()
	const { publishers } = usePublishers({ all: true })
	const { mutate } = useAssignments({ search: '' })
	const { mutate: mutateMaps } = useMaps({ all: true })
	const { control, formState, handleSubmit } = useForm<AddAssignmentReq>({ defaultValues: { map: params?.map } })

	const mapList = useMemo(() => maps.map(p => ({ label: p.name, value: p._id })), [maps])
	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p._id })), [publishers])

	const save: SubmitHandler<AddAssignmentReq> = async data => {
		const result = await add(data)

		if (result) {
			success('designação')
			mutate()
			mutateMaps()
			router.back()
			return
		}

		error('designação')
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Nova Designação' }} />
			<S.Content>
				<Controller
					control={control}
					rules={{ required: true }}
					name='map'
					render={({ field: { onChange, onBlur, value } }) => (
						<Dropdown
							placeholder='Selecione um mapa...'
							options={mapList}
							selectedValue={value}
							onValueChange={onChange}
						/>
					)}
				/>
				<Controller
					control={control}
					rules={{ required: true }}
					name='publisher'
					render={({ field: { onChange, onBlur, value } }) => (
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
					rules={{ required: false }}
					name='permanent'
					render={({ field: { onChange, value } }) => (
						<Dropdown
							placeholder='Designação permanente ou temporária?'
							options={[
								{ label: 'Permanente', value: 'true' },
								{ label: 'Temporária', value: 'false' },
							]}
							selectedValue={value}
							onValueChange={onChange}
						/>
					)}
				/>
				<Button loading={formState.isSubmitting} onPress={handleSubmit(save)}>
					Salvar
				</Button>
			</S.Content>
		</S.Container>
	)
}

export default AddAssignment
