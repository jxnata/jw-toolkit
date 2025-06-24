import AssignmentItem from '@/components/assignment-item'
import IconButton from '@/components/icon-button'
import Input from '@/components/input'
import SkeletonItem from '@/components/skeleton-item'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { useLocation } from '@/hooks/useLocation'
import useMaps from '@/hooks/useMaps'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native'

const Assignments = () => {
	const router = useRouter()
	const [search, setSearch] = useState('')
	const { maps, loading, mutate, loadMore, loadingMore, hasMore } = useMaps({ status: 'assigned', search })
	const { location } = useLocation()
	const { control, handleSubmit, reset } = useForm<{ search: string }>()
	const { colors } = useThemedColors()

	const handleSearch = (data: { search: string }) => {
		setSearch(data.search)
	}

	const handleClear = () => {
		setSearch('')
		reset()
	}

	const ListHeaderComponent = () => {
		return (
			<View className='flex-row gap-2.5 mb-2.5'>
				<View className='flex-1'>
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
				</View>
				{search && <IconButton icon='close-outline' onPress={handleClear} />}
				<IconButton icon='search-outline' onPress={handleSubmit(handleSearch)} />
			</View>
		)
	}

	const ListFooterComponent = () => {
		if (!loadingMore) return null
		return (
			<View className='py-2.5 items-center'>
				<ActivityIndicator size='small' color={colors.primary[600]} />
			</View>
		)
	}

	const handleEndReached = () => {
		if (hasMore && !loadingMore) {
			loadMore()
		}
	}

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Designações' }} />
			<View className='flex p-2.5 w-full h-full bg-background'>
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
						refreshControl={<RefreshControl onRefresh={mutate} refreshing={loading} />}
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
			</View>
		</View>
	)
}

export default Assignments
