import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Input from 'components/Input'
import { Stack, router } from 'expo-router'
import useCities from 'hooks/swr/admin/useCities'
import useMaps from 'hooks/swr/admin/useMaps'
import useResume from 'hooks/swr/admin/useResume'
import { error, success } from 'messages/add'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { add } from 'services/maps/add'
import { AddMapReq } from 'types/api/maps'
import { setCoordinates } from 'utils/set-coordinates'
import * as S from './styles'

const AddMap = () => {
	const { cities } = useCities()
	const { mutate } = useMaps()
	const { resume } = useResume()
	const defaultValues: Partial<AddMapReq> = { name: `Mapa ${resume.maps + 1}` }
	const { control, formState, handleSubmit } = useForm<AddMapReq>({ defaultValues })

	const save: SubmitHandler<AddMapReq> = async data => {
		const result = await add(data)

		if (result) {
			success('mapa')
			mutate()
			router.back()
			return
		}

		error('mapa')
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Novo Mapa' }} />
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

export default AddMap
