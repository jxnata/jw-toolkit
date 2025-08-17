import AssignmentItem from '@/components/assignment-item'
import Input from '@/components/input'
import { useSession } from '@/contexts/session-provider'
import { useLocation } from '@/hooks/use-location'
import useMaps from '@/hooks/use-maps'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { mapsService } from '@/services/instantdb'
import { Stack, useRouter } from 'expo-router'
import { Trash } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useDebounce } from 'use-debounce'

const Assignments = () => {
	const router = useRouter()
	const [searchInput, setSearchInput] = useState('')
	const [loading, setLoading] = useState(false)
	const [debouncedSearchTerm] = useDebounce(searchInput, 500)
	const { maps } = useMaps({ status: 'assigned', search: debouncedSearchTerm })
	const { location } = useLocation()
	const { congregation } = useSession()
	const { colors } = useThemedColors()

	const removeAllAssignments = async () => {
		try {
			setLoading(true)
			if (!congregation) return
			await mapsService.unassignAllMaps(congregation.id)

			Toast.show({
				type: 'success',
				text1: 'Sucesso',
				text2: 'Designações removidas com sucesso',
			})
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Erro',
				text2: 'Erro ao remover designações',
			})
		} finally {
			setLoading(false)
		}
	}

	const removeAllAssignmentsConfirm = () => {
		Alert.alert('Remover todas as designações', 'Tem certeza que deseja remover todas as designações?', [
			{ text: 'Cancelar', style: 'cancel' },
			{ text: 'Remover', style: 'destructive', onPress: removeAllAssignments },
		])
	}

	const ListHeaderComponent = () => {
		return (
			<View className='flex-row gap-2.5 mb-2.5'>
				<View className='flex-1'></View>
			</View>
		)
	}

	const HeaderRight = useCallback(
		() => (
			<View className='flex-row'>
				<TouchableOpacity
					hitSlop={10}
					onPress={removeAllAssignmentsConfirm}
					disabled={loading}
					className='mx-2'
				>
					<Trash size={20} color={colors.foreground} />
				</TouchableOpacity>
			</View>
		),
		[router, colors.foreground]
	)

	return (
		<View className='flex'>
			<Stack.Screen
				options={{
					title: 'Designações',
					headerRight: HeaderRight,
				}}
			/>
			<View className='flex p-4 w-full h-full bg-background'>
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
							<Text className='text-foreground font-regular opacity-80'>
								Nenhuma designação encontrada
							</Text>
						</View>
					}
				/>
			</View>
		</View>
	)
}

export default Assignments
