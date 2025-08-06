import AssignmentItem from '@/components/assignment-item'
import SkeletonItem from '@/components/skeleton-item'
import useMyAssignments from '@/hooks/use-my-assignments-instant'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { useLocation } from '@/hooks/useLocation'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Stack, useRouter } from 'expo-router'
import { useCallback, useEffect } from 'react'
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import Animated, { FadeInDown } from 'react-native-reanimated'

const PublisherHome = () => {
	const router = useRouter()
	const { location } = useLocation()
	const { assignments, loading, mutate } = useMyAssignments()
	const { colors } = useThemedColors()

	const HeaderRight = useCallback(
		() => (
			<View className='flex flex-row justify-center items-center gap-[15px]'>
				<Pressable onPress={() => router.push('/admin/me')}>
					<Ionicons name='person-circle-outline' size={24} color={colors.foreground} />
				</Pressable>
			</View>
		),
		[router, colors]
	)

	useEffect(() => {
		OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
			event.preventDefault()
			mutate()
			event.getNotification().display()
		})
	}, [mutate])

	return (
		<Animated.View className='flex' entering={FadeInDown}>
			<Stack.Screen options={{ title: 'Minhas designações', headerRight: HeaderRight }} />
			<View className='flex p-3 w-full h-full bg-background'>
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
								hidePublisher
								onPress={() =>
									router.push({
										pathname: `/publisher/assignment/${assignment.id}`,
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
		</Animated.View>
	)
}

export default PublisherHome
