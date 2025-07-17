import { useThemedColors } from '@/hooks/use-themed-colors'
import usePublishers from '@/hooks/usePublishers'
import useRequestPublishers from '@/hooks/useRequestPublishers'
import { database } from '@/services/appwrite'
import { firstLetter } from '@/utils/first-letter'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Stack, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

const Publishers = () => {
	const router = useRouter()
	const { publishers, loading, mutate } = useRequestPublishers()
	const { mutate: mutatePublishers } = usePublishers()
	const [list, setList] = useState(publishers)
	const { colors } = useThemedColors()

	const approve = useCallback(
		async (publisherId: string) => {
			try {
				setList(list.filter(p => p.$id !== publisherId))

				await database.updateDocument('production', 'publishers', publisherId, {
					approved: true,
				})
			} catch (err) {
				console.error('Failed to approve publisher:', err)
				mutate()
			}
		},
		[list, mutate]
	)

	const deny = useCallback(
		async (publisherId: string) => {
			try {
				setList(list.filter(p => p.$id !== publisherId))

				await database.updateDocument('production', 'publishers', publisherId, {
					approved: false,
				})
			} catch (err) {
				console.error('Failed to deny publisher:', err)
				mutate()
			}
		},
		[list, mutate]
	)

	useEffect(() => {
		setList(publishers)
	}, [publishers])

	useEffect(() => {
		return () => {
			mutatePublishers()
		}
	}, [mutatePublishers])

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Solicitações' }} />
			<View className='flex p-2.5 w-full h-full bg-background'>
				<FlatList
					data={list}
					keyExtractor={item => item.$id}
					refreshControl={<RefreshControl onRefresh={mutate} refreshing={loading} />}
					contentContainerClassName='gap-2'
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => (
						<TouchableOpacity
							key={item.$id}
							onPress={() =>
								router.push({
									pathname: `/admin/publishers/edit/${item.$id}`,
									params: { data: JSON.stringify(item) },
								})
							}
							className='flex-row items-center py-2 px-2 bg-card rounded-lg'
						>
							<View className='flex items-center justify-center h-[35px] w-[35px] mr-2.5 bg-card rounded-full'>
								<Text className='text-foreground text-lg font-bold'>{firstLetter(item.name)}</Text>
							</View>
							<View className='flex-1 flex-row items-center justify-between'>
								<Text className='text-foreground font-semibold'>{item.name}</Text>
								<View className='flex-row mt-1 gap-2'>
									<TouchableOpacity
										onPress={() => approve(item.$id)}
										className='w-10 h-10 items-center justify-center'
									>
										<Ionicons
											name='checkmark-circle-outline'
											size={24}
											color={colors.success[500]}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => deny(item.$id)}
										className='w-10 h-10 items-center justify-center'
									>
										<Ionicons name='close-circle-outline' size={24} color={colors.danger[500]} />
									</TouchableOpacity>
								</View>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	)
}

export default Publishers
