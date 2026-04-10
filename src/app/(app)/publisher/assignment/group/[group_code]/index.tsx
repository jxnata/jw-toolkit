import AssignmentItem from '@/components/assignment-item'
import SkeletonItem from '@/components/skeleton-item'
import useGroupMaps from '@/hooks/use-group-maps'
import { useLocation } from '@/hooks/use-location'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'

const PublisherGroupDetail = () => {
	const { group_code } = useLocalSearchParams<{ group_code: string }>()
	const router = useRouter()
	const { location } = useLocation()
	const { maps, loading } = useGroupMaps(group_code)

	return (
		<View className="flex-1 bg-background">
			<Stack.Screen options={{ title: `${maps.length} mapas` }} />
			{loading && !maps.length ? (
				<FlatList
					data={Array.from({ length: 4 }, (_, index) => index + 1)}
					keyExtractor={(item) => String(item)}
					renderItem={() => <SkeletonItem height={100} />}
					contentContainerClassName="p-3"
				/>
			) : (
				<FlatList
					data={maps}
					keyExtractor={(item) => item.id}
					contentContainerClassName="p-3"
					renderItem={({ item: map }) => (
						<AssignmentItem
							map={map}
							location={location}
							hidePublisher
							onPress={() =>
								router.push({
									pathname: `/publisher/assignment/${map.id}`,
									params: { data: JSON.stringify({ ...map }) },
								})
							}
						/>
					)}
				/>
			)}
		</View>
	)
}

export default PublisherGroupDetail
