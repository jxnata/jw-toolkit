import AssignmentCard from 'components/AssignmentItem'
import Input from 'components/Input'
import { Stack, useRouter } from 'expo-router'
import useAssignments from 'hooks/swr/admin/useAssignments'
import debounce from 'lodash/debounce'
import { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import * as S from './styles'

const Assignments = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const { assignments, loading, mutate } = useAssignments({ search: searchTerm })

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/assignments/add')}>
					<S.Ionicon name='add-circle-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[]
	)

	const debouncedSearch = debounce(async term => {
		setSearchTerm(term)
	}, 500)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Designações', headerRight: HeaderRight }} />
			<S.Content>
				<FlatList
					ListHeaderComponent={
						<Input
							autoCorrect={false}
							placeholder='Buscar uma designação...'
							onChangeText={debouncedSearch}
							clearButtonMode='always'
						/>
					}
					data={assignments}
					keyExtractor={item => item._id}
					refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
					renderItem={({ item }) => (
						<AssignmentCard
							key={item._id}
							assignment={item}
							showPublisher
							onPress={() =>
								router.push({
									pathname: `/admin/assignments/edit/${item._id}`,
									params: {
										...item,
										map: typeof item.map === 'object' ? item.map._id : item.map,
										publisher:
											typeof item.publisher === 'object' ? item.publisher?._id : item.publisher,
									},
								})
							}
						/>
					)}
				/>
			</S.Content>
		</S.Container>
	)
}

export default Assignments
