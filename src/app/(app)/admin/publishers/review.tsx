import { useSession } from '@/contexts/session-provider'
import { useLimitCheck } from '@/hooks/use-limit-check'
import usePublishers from '@/hooks/use-publishers'
import useRequestPublishers from '@/hooks/use-request-publishers'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { publishersService } from '@/services/instantdb'
import { firstLetter } from '@/utils/first-letter'
import { Stack, useRouter } from 'expo-router'
import { CheckCircle, XCircle } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

const Publishers = () => {
	const router = useRouter()
	const { requestPublishers: publishers, loading, mutate } = useRequestPublishers()
	const { mutate: mutatePublishers } = usePublishers()
	const { checkPublisherLimit } = useLimitCheck()
	const [list, setList] = useState(publishers)
	const { colors } = useThemedColors()
	const { congregation } = useSession()

	const approve = async (publisherId: string) => {
		// Check if publisher limit is reached
		if (!checkPublisherLimit()) {
			return
		}

		try {
			setList(list.filter((p) => p.id !== publisherId))

			await publishersService.updatePublisher(publisherId, {
				approved: true,
			})
		} catch (err) {
			console.error('Failed to approve publisher:', err)
			mutate()
		}
	}

	const deny = async (publisherId: string) => {
		if (!congregation) return

		try {
			setList(list.filter((p) => p.id !== publisherId))

			await publishersService.updatePublisher(publisherId, {
				approved: false,
			})

			await publishersService.unlinkCongregation(publisherId, congregation.id)
		} catch (err) {
			console.error('Failed to deny publisher:', err)
			mutate()
		}
	}

	useEffect(() => {
		setList(publishers)
	}, [publishers])

	useEffect(() => {
		return () => {
			mutatePublishers()
		}
	}, [mutatePublishers])

	return (
		<View className="flex">
			<Stack.Screen options={{ title: 'Solicitações' }} />
			<View className="flex h-full w-full bg-background p-2.5">
				<FlatList
					data={list}
					keyExtractor={(item) => item.id}
					refreshControl={<RefreshControl onRefresh={mutate} refreshing={loading} />}
					contentContainerClassName="gap-2"
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => (
						<TouchableOpacity
							key={item.id}
							onPress={() =>
								router.push({
									pathname: `/admin/publishers/edit/${item.id}`,
									params: { data: JSON.stringify(item) },
								})
							}
							className="flex-row items-center rounded-lg bg-card px-2 py-2">
							<View className="mr-2.5 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-card">
								<Text className="font-bold text-lg text-foreground">{firstLetter(item.name)}</Text>
							</View>
							<View className="flex-1 flex-row items-center justify-between">
								<Text className="font-semibold text-foreground">{item.name}</Text>
								<View className="mt-1 flex-row gap-2">
									<TouchableOpacity onPress={() => approve(item.id)} className="h-10 w-10 items-center justify-center">
										<CheckCircle size={24} color={colors.success[500]} />
									</TouchableOpacity>
									<TouchableOpacity onPress={() => deny(item.id)} className="h-10 w-10 items-center justify-center">
										<XCircle size={24} color={colors.danger[500]} />
									</TouchableOpacity>
								</View>
							</View>
						</TouchableOpacity>
					)}
					ListEmptyComponent={
						<View className="flex-1 items-center justify-center py-8">
							<Text className="font-regular text-foreground opacity-80">Nenhuma solicitação pendente.</Text>
						</View>
					}
				/>
			</View>
		</View>
	)
}

export default Publishers
