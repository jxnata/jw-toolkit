import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import MapViewDetails from '@/components/map-view-details'
import { useThemedColors } from '@/hooks/use-themed-colors'
import useMap from '@/hooks/useMap'
import usePublishers from '@/hooks/usePublishers'
import { EditAssignmentReq } from '@/interfaces/api/assignments'
import { error as removeError, success as removeSuccess } from '@/messages/delete'
import { error, success } from '@/messages/edit'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, Pressable, Text, View } from 'react-native'

import { database } from '@/services/appwrite'
import { useQueryClient } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'

const EditAssignment = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Models.Document
	const { map } = useMap(params.$id)
	const { publishers } = usePublishers()
	const queryClient = useQueryClient()
	const { colors } = useThemedColors()

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
			const updatedMap = await database.updateDocument('production', 'maps', params.$id!, {
				assigned: data.assigned,
			})

			success('designação')

			queryClient.setQueryData(['map', updatedMap.$id], updatedMap)

			router.back()
		} catch (err) {
			error('designação')
			console.error('Failed to update map (assigned):', err)
		}
	}

	const deleteAssignment = async () => {
		try {
			const updatedMap = await database.updateDocument('production', 'maps', params.$id!, {
				assigned: null,
			})

			removeSuccess('designação')

			queryClient.setQueryData(['map', updatedMap.$id], updatedMap)

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
