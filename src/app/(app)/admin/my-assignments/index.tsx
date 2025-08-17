import AssignmentItem from '@/components/assignment-item'
import { useLocation } from '@/hooks/use-location'
import useMyAssignments from '@/hooks/use-my-assignments'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack, useRouter } from 'expo-router'
import { Map } from 'lucide-react-native'
import { useEffect } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { OneSignal } from 'react-native-onesignal'

const MyAssignments = () => {
	const router = useRouter()
	const { location } = useLocation()
	const { assignments, loading, mutate } = useMyAssignments()
	const { colors } = useThemedColors()

	useEffect(() => {
		OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
			mutate()
		})
	}, [mutate])

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Minhas designações' }} />
			<View className='flex p-2.5 w-full h-full bg-background'>
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
						<View className='flex flex-col items-center justify-center gap-3 pt-8'>
							<Map size={48} color={colors.border} strokeWidth={1.5} />
							<Text className='text-foreground px-3 font-regular text-center opacity-70'>
								Nenhuma designação até agora.{'\n'}Seus mapas serão exibidos aqui quando você receber
								uma designação.
							</Text>
						</View>
					}
				/>
			</View>
		</View>
	)
}

export default MyAssignments
