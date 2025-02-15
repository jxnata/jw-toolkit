import AssignmentItem from '@components/AssignmentItem'
import Input from '@components/Input'
import useAssignments from '@hooks/swr/admin/useAssignments'
import { useLocation } from '@hooks/useLocation'
import { Stack, useRouter } from 'expo-router'
import debounce from 'lodash/debounce'
import { useCallback, useState } from 'react'
import { Alert, FlatList } from 'react-native'
import { restore } from '@services/assignments/restore'

import * as S from './styles'

const Assignments = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const { assignments, loading, mutate, next } = useAssignments({ search: searchTerm })
	const { location } = useLocation()

	const restoreAssignments = useCallback(async () => {
		const result = await restore()

		if (result) mutate()
	}, [mutate])

	const showDeleteAlert = useCallback(
		() =>
			Alert.alert('Restaurar', 'Deseja restaurar todas as designações? Essa opção não pode ser revertida.', [
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Sim',
					onPress: restoreAssignments,
					style: 'default',
				},
			]),
		[restoreAssignments]
	)

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={showDeleteAlert}>
					<S.IoniconWarning name='backspace-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[showDeleteAlert]
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
						<AssignmentItem
							key={item._id}
							assignment={item}
							location={location}
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
					onEndReached={next}
				/>
			</S.Content>
		</S.Container>
	)
}

export default Assignments
