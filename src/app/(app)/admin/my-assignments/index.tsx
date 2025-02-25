import AssignmentItem from '@components/AssignmentItem'
import useMyAssignments from '@hooks/useMyAssignments'
import { useLocation } from '@hooks/useLocation'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { OneSignal } from 'react-native-onesignal'
import { FlatList } from 'react-native'
import SkeletonItem from '@components/SkeletonItem'

import * as S from './styles'
import React from 'react'

const MyAssignments = () => {
	const router = useRouter()
	const { location } = useLocation()
	const { assignments, loading, mutate } = useMyAssignments()

	useEffect(() => {
		OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
			event.preventDefault()
			mutate()
			event.getNotification().display()
		})
	}, [mutate])

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Minhas designações' }} />
			<S.Content>
				{loading && !assignments.length ? (
					<FlatList
						data={Array.from({ length: 8 }, (_, index) => index + 1)}
						keyExtractor={item => String(item)}
						renderItem={() => <SkeletonItem height={100} />}
					/>
				) : (
					<FlatList
						data={assignments}
						keyExtractor={item => item.$id}
						refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
						renderItem={({ item: assignment }) => (
							<AssignmentItem
								key={assignment.$id}
								map={assignment}
								location={location}
								onPress={() =>
									router.push({
										pathname: `/admin/my-assignments/view/${assignment.$id}`,
										params: { data: JSON.stringify({ ...assignment }) },
									})
								}
							/>
						)}
						ListEmptyComponent={<S.Paragraph>Nenhuma designação</S.Paragraph>}
					/>
				)}
			</S.Content>
		</S.Container>
	)
}

export default MyAssignments
