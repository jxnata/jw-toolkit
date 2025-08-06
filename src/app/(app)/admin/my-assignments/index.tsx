import AssignmentItem from '@/components/assignment-item'
import SkeletonItem from '@/components/skeleton-item'
import { useLocation } from '@/hooks/use-location'
import useMyAssignments from '@/hooks/use-my-assignments'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { OneSignal } from 'react-native-onesignal'

const MyAssignments = () => {
	const router = useRouter()
	const { location } = useLocation()
	const { assignments, loading, mutate } = useMyAssignments()

	useEffect(() => {
		OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
			mutate()
		})
	}, [mutate])

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Minhas designações' }} />
			<View className='flex p-2.5 w-full h-full bg-background'>
				{loading && !assignments.length ? (
					<FlatList
						data={Array.from({ length: 8 }, (_, index) => index + 1)}
						keyExtractor={item => String(item)}
						renderItem={() => <SkeletonItem height={100} />}
					/>
				) : (
					<FlatList
						data={assignments}
						keyExtractor={item => item.id}
						refreshControl={<RefreshControl onRefresh={mutate} refreshing={loading} />}
						renderItem={({ item: assignment }) => (
							<AssignmentItem
								key={assignment.id}
								map={assignment}
								location={location}
								onPress={() =>
									router.push({
										pathname: `/admin/my-assignments/${assignment.id}`,
										params: { data: JSON.stringify({ ...assignment }) },
									})
								}
							/>
						)}
						ListEmptyComponent={
							<Text className='text-[15px] text-foreground py-5 px-2.5 font-medium self-center'>
								Nenhuma designação
							</Text>
						}
					/>
				)}
			</View>
		</View>
	)
}

export default MyAssignments
