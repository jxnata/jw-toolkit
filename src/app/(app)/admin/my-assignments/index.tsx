import AssignmentItem from '@/components/assignment-item'
import { useLocation } from '@/hooks/use-location'
import useMyAssignments from '@/hooks/use-my-assignments'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack, useRouter } from 'expo-router'
import { Map } from 'lucide-react-native'
import { FlatList, RefreshControl, Text, View } from 'react-native'

const MyAssignments = () => {
	const router = useRouter()
	const { location } = useLocation()
	const { assignments, loading, mutate } = useMyAssignments()
	const { colors } = useThemedColors()

	return (
		<View className="flex">
			<Stack.Screen options={{ title: 'Minhas designações' }} />
			<View className="flex h-full w-full bg-background p-2.5">
				<FlatList
					data={assignments}
					keyExtractor={(item) => item.id}
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
						<View className="flex flex-col items-center justify-center gap-3 pt-8">
							<Map size={48} color={colors.border} strokeWidth={1.5} />
							<Text className="px-3 text-center font-regular text-foreground opacity-70">
								Nenhuma designação até agora.{'\n'}Seus mapas serão exibidos aqui quando você receber uma designação.
							</Text>
						</View>
					}
				/>
			</View>
		</View>
	)
}

export default MyAssignments
