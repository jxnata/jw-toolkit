import AssignmentItem from '@/components/assignment-item'
import Input from '@/components/input'
import { useLocation } from '@/hooks/use-location'
import useMaps from '@/hooks/use-maps'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { useDebounce } from 'use-debounce'

const Assignments = () => {
	const router = useRouter()
	const [searchInput, setSearchInput] = useState('')
	const [debouncedSearchTerm] = useDebounce(searchInput, 500)
	const { maps, loading } = useMaps({ status: 'assigned', search: debouncedSearchTerm })
	const { location } = useLocation()

	const handleClear = () => {
		setSearchInput('')
	}

	const ListHeaderComponent = () => {
		return (
			<View className='flex-row gap-2.5 mb-2.5'>
				<View className='flex-1'></View>
			</View>
		)
	}

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Designações' }} />
			<View className='flex p-3 w-full h-full bg-background'>
				<Input
					autoCorrect={false}
					placeholder='Buscar por mapa ou bairro'
					onChangeText={setSearchInput}
					value={searchInput}
					clearButtonMode='always'
					returnKeyType='search'
				/>

				<FlatList
					data={maps}
					ListHeaderComponent={<ListHeaderComponent />}
					ListFooterComponent={<View className='h-14' />}
					keyExtractor={item => item.id}
					keyboardDismissMode='none'
					renderItem={({ item }) => (
						<AssignmentItem
							key={item.id}
							map={item}
							location={location}
							onPress={() =>
								router.push({
									pathname: `/admin/assignments/edit/${item.id}`,
									params: { data: JSON.stringify({ ...item }) },
								})
							}
						/>
					)}
					ListEmptyComponent={
						<View className='flex-1 py-8 items-center justify-center'>
							<Text className='text-foreground font-light opacity-80'>Nenhuma designação encontrada</Text>
						</View>
					}
				/>
			</View>
		</View>
	)
}

export default Assignments
