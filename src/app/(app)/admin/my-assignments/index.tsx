import AssignmentItem from '@/components/assignment-item'
import MapGroupItem from '@/components/map-group-item'
import SkeletonItem from '@/components/skeleton-item'
import { useLocation } from '@/hooks/use-location'
import useMyAssignments from '@/hooks/use-my-assignments'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { MapGroup } from '@/utils/group-maps'
import { Stack, useRouter } from 'expo-router'
import { Map } from 'lucide-react-native'
import { FlatList, RefreshControl, Text, View } from 'react-native'

const MyAssignments = () => {
	const router = useRouter()
	const { location } = useLocation()
	const { grouped, loading, mutate } = useMyAssignments()
	const { colors } = useThemedColors()

	return (
		<View className="flex">
			<Stack.Screen options={{ title: 'Minhas designações' }} />
			<View className="flex h-full w-full bg-background p-2.5">
				{loading && !grouped.length ? (
					<FlatList
						data={Array.from({ length: 8 }, (_, index) => index + 1)}
						keyExtractor={(item) => String(item)}
						renderItem={() => <SkeletonItem height={100} />}
					/>
				) : (
					<FlatList
						data={grouped}
						keyExtractor={(item) => item.group_code}
						refreshControl={<RefreshControl onRefresh={mutate} refreshing={loading} />}
						renderItem={({ item: group }: { item: MapGroup }) => {
							if (group.maps.length > 1) {
								return (
									<MapGroupItem
										group={group}
										location={location}
										onPress={() =>
											router.push({
												pathname: `/admin/my-assignments/group/${group.group_code}`,
											})
										}
									/>
								)
							}
							const assignment = group.maps[0]
							return (
								<AssignmentItem
									key={assignment.id}
									map={assignment}
									location={location}
									hidePublisher
									onPress={() =>
										router.push({
											pathname: `/admin/my-assignments/${assignment.id}`,
											params: { data: JSON.stringify({ ...assignment }) },
										})
									}
								/>
							)
						}}
						ListEmptyComponent={
							<View className="flex flex-col items-center justify-center gap-3 pt-8">
								<Map size={48} color={colors.border} strokeWidth={1.5} />
								<Text className="px-3 text-center font-regular text-foreground opacity-70">
									Nenhuma designação até agora.{'\n'}Seus mapas serão exibidos aqui quando você receber uma designação.
								</Text>
							</View>
						}
					/>
				)}
			</View>
		</View>
	)
}

export default MyAssignments
