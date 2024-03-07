import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useAllMaps from 'hooks/swr/admin/useAllMaps'
import useAssignments from 'hooks/swr/admin/useAssignments'
import useMap from 'hooks/swr/admin/useMap'
import usePublishers from 'hooks/swr/admin/usePublishers'
import { error, success } from 'messages/add'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { add } from 'services/assignments/add'
import { AddAssignmentReq } from 'types/api/assignments'
import { formatDate } from 'utils/date-format'
import * as S from './styles'

const AddAssignment = () => {
	const params: Partial<{ map: string }> = useLocalSearchParams()
	const { map, loading } = useMap(params?.map)
	const { publishers } = usePublishers({ all: true })
	const { mutate } = useAssignments({ search: '' })
	const { mutate: mutateMaps } = useAllMaps()
	const { control, formState, handleSubmit } = useForm<AddAssignmentReq>({ defaultValues: { map: params?.map } })

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
			{!loading && (
				<S.Content>
					<S.MapContainer>
						<S.Paragraph>{map.name}</S.Paragraph>
						<S.ParagraphWrap numberOfLines={3} ellipsizeMode='tail'>
							{map.address}, {map.city.name}
						</S.ParagraphWrap>
						{!!map.last_visited_by && typeof map.last_visited_by === 'object' ? (
							<S.Small>
								Visitado por {map.last_visited_by.name} em {formatDate(map.last_visited)}
							</S.Small>
						) : (
							<S.Small>Ainda não visitado</S.Small>
						)}
					</S.MapContainer>
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
								selectedValue={value ? value.toString() : 'false'}
								onValueChange={onChange}
							/>
						)}
					/>
					<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
						Salvar
					</Button>
				</S.Content>
			)}
			{loading && (
				<S.LoadingContainer>
					<S.Loading />
				</S.LoadingContainer>
			)}
		</S.Container>
	)
}

export default AddAssignment
