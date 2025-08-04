import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import MapViewDetails from '@/components/map-view-details'
import useMap from '@/hooks/use-map-instant'
import usePublishers from '@/hooks/use-publishers-instant'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { EditAssignmentReq } from '@/interfaces/api/assignments'
import { error as removeError, success as removeSuccess } from '@/messages/delete'
import { error, success } from '@/messages/edit'
import { mapsService } from '@/services/instantdb'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, Pressable, Text, View } from 'react-native'

const EditAssignment = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Map
	const { map } = useMap({ mapId: params.id })
	const { publishers } = usePublishers()
	const { colors } = useThemedColors()

	const defaultValues: EditAssignmentReq = useMemo(
		() => ({
			assigned: typeof params.assigned === 'object' ? params!.assigned!.id : params.assigned,
		}),
		[params.assigned]
	)

	const { control, formState, handleSubmit } = useForm<EditAssignmentReq>({ defaultValues })

	const publisherList = useMemo(() => publishers.map(p => ({ label: p.name, value: p.id })), [publishers])

	const save: SubmitHandler<EditAssignmentReq> = async data => {
		try {
			await mapsService.assignMap(params.id, data.assigned)
			success('designação')

			router.back()
		} catch (err) {
			error('designação')
			console.error('Failed to update map (assigned):', err)
		}
	}

	const deleteAssignment = async () => {
		try {
			await mapsService.assignMap(params.id, null)

			removeSuccess('designação')

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
		<View className='flex'>
			<Stack.Screen options={{ title: 'Editar Designação' }} />
			<View className='flex p-2.5 w-full h-full bg-background'>
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
				<View className='gap-2.5 mt-2.5'>
					<Button disabled={!formState.isValid} loading={formState.isSubmitting} onPress={handleSubmit(save)}>
						Atualizar
					</Button>
					<Pressable
						onPress={showDeleteAlert}
						disabled={formState.isSubmitting}
						className='py-2.5 px-5 rounded-xl border border-border items-center justify-center h-[50px]'
					>
						<Text className='text-[15px] font-bold' style={{ color: colors.foreground + '80' }}>
							Remover designação
						</Text>
					</Pressable>
				</View>
			</View>
		</View>
	)
}

export default EditAssignment
