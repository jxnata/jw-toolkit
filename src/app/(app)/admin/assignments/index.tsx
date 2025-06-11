import AssignmentItem from '@/components/AssignmentItem'
import Input from '@/components/Input'
import SkeletonItem from '@/components/SkeletonItem'
import { useLocation } from '@/hooks/useLocation'
import useMaps from '@/hooks/useMaps'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, FlatList } from 'react-native'

import * as S from './styles'

const Assignments = () => {
	const router = useRouter()
	const [search, setSearch] = useState('')
	const { maps, loading, mutate, loadMore, loadingMore, hasMore } = useMaps({ status: 'assigned', search })
	const { location } = useLocation()
	const { control, handleSubmit, reset } = useForm<{ search: string }>()

	const handleSearch = (data: { search: string }) => {
		setSearch(data.search)
	}

	const handleClear = () => {
		setSearch('')
		reset()
	}

	const ListHeaderComponent = () => {
		return (
			<S.FilterContainer>
				<S.SearchContainer>
					<Controller
						control={control}
						rules={{ required: true }}
						name='search'
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								autoCorrect={false}
								placeholder='Buscar por mapa ou bairro'
								onChangeText={onChange}
								onBlur={onBlur}
								value={value}
								returnKeyType='search'
								onSubmitEditing={handleSubmit(handleSearch)}
								style={{ flex: 1, marginBottom: 0 }}
							/>
						)}
					/>
					{search && (
						<S.ClearButton onPress={handleClear}>
							<S.Ionicon name='close-outline' />
						</S.ClearButton>
					)}
					<S.SearchButton onPress={handleSubmit(handleSearch)}>
						<S.Ionicon name='search-outline' />
					</S.SearchButton>
				</S.SearchContainer>
			</S.FilterContainer>
		)
	}

	const ListFooterComponent = () => {
		if (!loadingMore) return null
		return (
			<S.LoadingContainer>
				<ActivityIndicator />
			</S.LoadingContainer>
		)
	}

	const handleEndReached = () => {
		if (hasMore && !loadingMore) {
			loadMore()
		}
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
						ListFooterComponent={<ListFooterComponent />}
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
						onEndReached={handleEndReached}
						onEndReachedThreshold={0.5}
					/>
				)}
			</S.Content>
		</S.Container>
	)
}

export default Assignments
