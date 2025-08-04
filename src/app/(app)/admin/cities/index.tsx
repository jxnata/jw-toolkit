import Input from '@/components/input'
import ListItem from '@/components/list-item'
import SkeletonItem from '@/components/skeleton-item'
import useCities from '@/hooks/use-cities-instant'
import { useThemedColors } from '@/hooks/use-themed-colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Stack, useRouter } from 'expo-router'
import debounce from 'lodash/debounce'
import { useCallback, useState } from 'react'
import { FlatList, Pressable, RefreshControl, View } from 'react-native'

const Cities = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const { cities, loading, mutate } = useCities({ search: searchTerm })
	const { colors } = useThemedColors()

	const HeaderRight = useCallback(
		() => (
			<View>
				<Pressable onPress={() => router.push('/admin/cities/add')} className='mx-2'>
					<Ionicons name='add-circle-outline' size={24} color={colors.foreground} />
				</Pressable>
			</View>
		),
		[router, colors.foreground]
	)

	const debouncedSearch = debounce(async term => {
		setSearchTerm(term)
	}, 500)

	const ListHeaderComponent = () => {
		return (
			<Input
				autoCorrect={false}
				placeholder='Buscar uma cidade...'
				onChangeText={debouncedSearch}
				clearButtonMode='always'
			/>
		)
	}

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Cidades', headerRight: HeaderRight }} />
			<View className='flex p-2 w-full h-full bg-background'>
				{loading && !cities.length ? (
					<FlatList
						data={[1, 2, 3, 4, 5]}
						keyExtractor={item => String(item)}
						ListHeaderComponent={<ListHeaderComponent />}
						renderItem={() => <SkeletonItem />}
					/>
				) : (
					<FlatList
						ListHeaderComponent={<ListHeaderComponent />}
						data={cities}
						keyExtractor={item => item.id}
						refreshControl={<RefreshControl onRefresh={mutate} refreshing={loading} />}
						contentContainerClassName='gap-2'
						showsVerticalScrollIndicator={false}
						renderItem={({ item }) => (
							<ListItem
								id={item.id}
								name={item.name}
								onPress={() =>
									router.push({
										pathname: `/admin/cities/edit/${item.id}`,
										params: { data: JSON.stringify(item) },
									})
								}
							/>
						)}
					/>
				)}
			</View>
		</View>
	)
}

export default Cities
