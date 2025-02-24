import AssignmentItem from '@components/AssignmentItem'
import Input from '@components/Input'
import { useLocation } from '@hooks/useLocation'
import { Stack, useRouter } from 'expo-router'
import debounce from 'lodash/debounce'
import { useState } from 'react'
import { FlatList } from 'react-native'
import useMaps from '@hooks/useMaps'
import SkeletonItem from '@components/SkeletonItem'

import * as S from './styles'

const Assignments = () => {
	const router = useRouter()
	const [search, setSearch] = useState('')
	const { maps, loading, mutate } = useMaps({ status: 'assigned', search })
	const { location } = useLocation()

	const debouncedSearch = debounce(async term => {
		setSearch(term)
	}, 500)

	const ListHeaderComponent = () => {
		return (
			<Input
				autoCorrect={false}
				placeholder='Buscar uma designação...'
				onChangeText={debouncedSearch}
				clearButtonMode='always'
			/>
		)
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Designações' }} />
			<S.Content>
				{loading && !maps.length ? (
					<FlatList
						data={Array.from({ length: 8 }, (_, index) => index + 1)}
						keyExtractor={item => String(item)}
						ListHeaderComponent={<ListHeaderComponent />}
						renderItem={() => <SkeletonItem />}
					/>
				) : (
					<FlatList
						data={maps}
						ListHeaderComponent={<ListHeaderComponent />}
						keyExtractor={item => item.$id}
						refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}
						renderItem={({ item }) => (
							<AssignmentItem
								key={item.$id}
								map={item}
								location={location}
								onPress={() =>
									router.push({
										pathname: `/admin/assignments/edit/${item.$id}`,
										params: { data: JSON.stringify({ ...item, search }) },
									})
								}
							/>
						)}
					/>
				)}
			</S.Content>
		</S.Container>
	)
}

export default Assignments
