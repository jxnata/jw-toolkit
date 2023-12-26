import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Input from 'components/Input'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useCities from 'hooks/swr/admin/useCities'
import useMap from 'hooks/swr/admin/useMap'
import useMaps from 'hooks/swr/admin/useMaps'
import { error, success } from 'messages/edit'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { edit } from 'services/maps/edit'
import { EditMapReq } from 'types/api/maps'
import { getCoordinates } from 'utils/get-coordinates'
import { setCoordinates } from 'utils/set-coordinates'
import * as S from './styles'

const EditMap = () => {
	const params: Partial<{ id: string }> = useLocalSearchParams()
	const { map, mutate } = useMap(params.id)
	const { mutate: mutateMaps } = useMaps({ search: '' })
	const { cities } = useCities()

	const defaultValues: EditMapReq = useMemo(
		() => ({
			name: map.name,
			address: map.address,
			city: map.city._id,
			coordinates: map.coordinates,
		}),
		[]
	)

	const { control, formState, handleSubmit } = useForm<EditMapReq>({ defaultValues })

	const save: SubmitHandler<EditMapReq> = async data => {
		const result = await edit(params.id, data)

		if (result) {
			success('mapa')
			mutate()
			mutateMaps()
			router.back()
			return
		}

		error('mapa')
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Editar Mapa' }} />
			<S.Content>
				<Controller
					control={control}
					rules={{ required: true }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							placeholder='Nome do mapa'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							editable={!formState.isSubmitting}
						/>
					)}
				/>
				<Controller
					control={control}
					rules={{ required: true }}
					name='address'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							placeholder='Endereço'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							editable={!formState.isSubmitting}
						/>
					)}
				/>
				<Controller
					control={control}
					rules={{ required: true }}
					name='coordinates'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							defaultValue={getCoordinates(value)}
							placeholder='Coordenadas'
							onBlur={onBlur}
							onChangeText={text => onChange(setCoordinates(text))}
							editable={!formState.isSubmitting}
						/>
					)}
				/>
				<Controller
					control={control}
					rules={{ required: true }}
					name='city'
					render={({ field: { onChange, onBlur, value } }) => (
						<Dropdown
							placeholder='Selecione uma cidade...'
							options={cities}
							optionLabel='name'
							optionValue='_id'
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

export default EditMap
