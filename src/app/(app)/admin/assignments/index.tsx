import AssignmentItem from '@components/AssignmentItem'
import Input from '@components/Input'
import { useLocation } from '@hooks/useLocation'
import { Stack, useRouter } from 'expo-router'
import debounce from 'lodash/debounce'
import { useCallback, useState } from 'react'
import { Alert, FlatList } from 'react-native'

import * as S from './styles'
import useMaps from '@hooks/swr/admin/useMaps'

const Assignments = () => {
	const router = useRouter()
	const [search, setSearch] = useState('')
	const { maps, loading, mutate } = useMaps({ status: 'assigned', search })
	const { location } = useLocation()

	const debouncedSearch = debounce(async term => {
		setSearch(term)
	}, 500)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Designações' }} />
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
					data={maps}
					keyExtractor={item => item.$id}
					refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
					renderItem={({ item }) => (
						<AssignmentItem
							key={item.$id}
							map={item}
							location={location}
							showPublisher
							onPress={() =>
								router.push({
									pathname: `/admin/assignments/edit/${item.$id}`,
									params: {
										data: JSON.stringify({ ...item, search }),
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
