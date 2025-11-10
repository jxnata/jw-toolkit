import AssignmentItem from '@/components/assignment-item'
import SkeletonItem from '@/components/skeleton-item'
import { storage } from '@/database/index'
import { useLocation } from '@/hooks/use-location'
import useMyAssignments from '@/hooks/use-my-assignments'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Redirect, Stack, useRouter } from 'expo-router'
import { Map, UserCircle2 } from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import Animated, { FadeInDown } from 'react-native-reanimated'

const PublisherHome = () => {
	const router = useRouter()
	const { location } = useLocation()
	const { assignments, loading, mutate } = useMyAssignments()
	const { colors } = useThemedColors()
	const [privacyAccepted, setPrivacyAccepted] = useState<boolean | null>(null)

	useEffect(() => {
		const accepted = storage.getBoolean('privacy.policy.accepted') ?? false
		setPrivacyAccepted(accepted)
		if (!accepted) {
			router.replace('/privacy-policy')
		}
	}, [router])

	const HeaderRight = useCallback(
		() => (
			<View className='flex flex-row justify-center items-center gap-[15px]'>
				<Pressable onPress={() => router.push('/publisher/me')}>
					<UserCircle2 size={24} color={colors.foreground} />
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

	if (!privacyAccepted) {
		return <Redirect href='/privacy-blocked' />
	}

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
							<View className='flex flex-col items-center justify-center gap-3 pt-8'>
								<Map size={48} color={colors.border} strokeWidth={1.5} />
								<Text className='text-foreground px-3 font-regular text-center opacity-70'>
									Nenhuma designação até agora.{'\n'}Seus mapas serão exibidos aqui quando você
									receber uma designação.
								</Text>
							</View>
						}
					/>
				)}
			</View>
		</Animated.View>
	)
}

export default PublisherHome
