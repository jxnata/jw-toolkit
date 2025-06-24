import Button from '@/components/button'
import Input from '@/components/input'
import { useSession } from '@/contexts/session'
import useCities from '@/hooks/useCities'
import { AddCityReq } from '@/interfaces/api/cities'
import { error, success } from '@/messages/add'
import { database } from '@/services/appwrite'
import { Stack, router } from 'expo-router'
import { Save } from 'lucide-react-native'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { ID, Permission, Role } from 'react-native-appwrite'

const AddCity = () => {
	const { congregation } = useSession()
	const { mutate } = useCities({ search: '' })
	const { control, formState, handleSubmit } = useForm<AddCityReq>()

	const save: SubmitHandler<AddCityReq> = async data => {
		if (!data.name) return
		if (!congregation) return

		try {
			await database.createDocument(
				'production',
				'cities',
				ID.unique(),
				{
					name: data.name,
					congregation: congregation.id,
				},
				[
					Permission.read(Role.label(congregation.id)),
					Permission.update(Role.label(congregation.id)),
					Permission.delete(Role.label(congregation.id)),
				]
			)
			success('cidade')
			mutate()
			router.back()
		} catch (err) {
			error('cidade')
			console.error('Failed to create city:', err)
		}
	}

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Nova Cidade' }} />
			<View className='flex px-4 py-2 w-full h-full bg-background'>
				<Controller
					control={control}
					rules={{ required: true }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label='Nome'
							placeholder='Nome da cidade'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
						/>
					)}
				/>
				<Button
					disabled={!formState.isValid}
					loading={formState.isSubmitting}
					onPress={handleSubmit(save)}
					left={<Save size={16} color='#ffffff' />}
				>
					Salvar
				</Button>
			</View>
		</View>
	)
}

export default AddCity
