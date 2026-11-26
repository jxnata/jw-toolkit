import Dropdown from '@/components/dropdown'
import Input from '@/components/input'
import PhoneItem from '@/components/phone-item'
import SkeletonItem from '@/components/skeleton-item'
import usePhones, { PhoneStatus } from '@/hooks/use-phones'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack, useRouter } from 'expo-router'
import { FilterIcon, PlusCircle } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { useDebounce } from 'use-debounce'

const statusList = [
	{ label: 'Todos', value: '' },
	{ label: 'Designados', value: 'assigned' },
	{ label: 'Livres', value: 'unassigned' },
]

const Phones = () => {
	const router = useRouter()
	const { colors } = useThemedColors()
	const [searchInput, setSearchInput] = useState('')
	const [status, setStatus] = useState<PhoneStatus>('')
	const [search] = useDebounce(searchInput, 500)

	const { phones, loading, total } = usePhones({ search, status })

	const selectedStatus = statusList.find((s) => s.value === status)?.label

	const HeaderRight = () => (
		<TouchableOpacity onPress={() => router.push('/admin/phones/add')} className="mx-2">
			<PlusCircle size={24} color={colors.foreground} />
		</TouchableOpacity>
	)

	return (
		<View className="flex-1 bg-background">
			<Stack.Screen options={{ title: 'Telefones', headerRight: HeaderRight }} />
			<View className="flex-row items-center justify-between px-4 py-2">
				<Dropdown
					placeholder="Todos"
					options={statusList}
					selectedValue={status}
					onValueChange={setStatus}
					TriggerComponent={
						<View className="flex-row items-center gap-1">
							<FilterIcon size={16} color={colors.primary[600]} fill={colors.primary[600]} />
							<Text className="font-bold text-lg text-primary underline">{selectedStatus}</Text>
						</View>
					}
				/>
				<Text className="font-medium text-sm text-foreground opacity-70">{total} telefones</Text>
			</View>
			<View className="px-4">
				<Input
					autoCorrect={false}
					placeholder="Buscar por número"
					keyboardType="phone-pad"
					onChangeText={setSearchInput}
					value={searchInput}
					clearButtonMode="always"
				/>
			</View>

			{loading && !phones.length ? (
				<FlatList
					data={Array.from({ length: 8 }, (_, index) => index + 1)}
					keyExtractor={(item) => String(item)}
					renderItem={() => <SkeletonItem height={80} />}
				/>
			) : (
				<FlatList
					data={phones}
					keyExtractor={(item) => item.id}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					ListFooterComponent={<View className="h-14" />}
					ListEmptyComponent={
						<View className="flex-1 items-center justify-center py-8">
							<Text className="font-regular text-foreground opacity-80">Nenhum telefone encontrado</Text>
						</View>
					}
					renderItem={({ item }) => <PhoneItem phone={item} onPress={() => router.push(`/admin/phones/${item.id}`)} />}
				/>
			)}
		</View>
	)
}

export default Phones
