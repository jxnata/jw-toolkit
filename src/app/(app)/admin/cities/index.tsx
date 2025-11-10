import Input from '@/components/input'
import ListItem from '@/components/list-item'
import useCities from '@/hooks/use-cities'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack, useRouter } from 'expo-router'
import debounce from 'lodash/debounce'
import { PlusCircle } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

const Cities = () => {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const { cities, loading, mutate } = useCities({ search: searchTerm })
	const { colors } = useThemedColors()

	const HeaderRight = useCallback(
		() => (
			<View>
				<TouchableOpacity onPress={() => router.push('/admin/cities/add')} className='mx-2'>
					<PlusCircle size={24} color={colors.foreground} />
				</TouchableOpacity>
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
				placeholder='Buscar uma cidade/território...'
				onChangeText={debouncedSearch}
				clearButtonMode='always'
			/>
		)
	}

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Cidades/Territórios', headerRight: HeaderRight }} />
			<View className='flex p-4 w-full h-full bg-background'>
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
					ListFooterComponent={() => <View className='h-[60px]' />}
					ListEmptyComponent={
						<View className='flex-1 py-8 items-center justify-center'>
							<Text className='text-foreground font-regular opacity-80'>
								Nenhuma cidade/território encontrado
							</Text>
						</View>
					}
				/>
			</View>
		</View>
	)
}

export default Cities
