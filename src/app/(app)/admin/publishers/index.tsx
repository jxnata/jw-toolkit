import Input from '@/components/input'
import ListItem from '@/components/list-item'
import usePublishers from '@/hooks/use-publishers'
import useRequestPublishers from '@/hooks/use-request-publishers'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack, useRouter } from 'expo-router'
import debounce from 'lodash/debounce'
import { Mail, MailWarning } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

const Publishers = () => {
	const router = useRouter()
	const [search, setSearch] = useState('')
	const { publishers, loading, mutate } = usePublishers({ search: search })
	const { requestPublishers } = useRequestPublishers()
	const { colors } = useThemedColors()

	const HeaderRight = () => (
		<View>
			<TouchableOpacity onPress={() => router.push('/admin/publishers/review')} className="mx-2">
				{requestPublishers.length ? (
					<MailWarning size={24} color={colors.primary[500]} />
				) : (
					<Mail size={24} color={colors.foreground} />
				)}
			</TouchableOpacity>
		</View>
	)

	const ListHeaderComponent = () => {
		return (
			<>
				<Input autoCorrect={false} placeholder="Buscar um publicador..." onChangeText={debouncedSearch} clearButtonMode="always" />
				{requestPublishers?.length > 0 && (
					<Pressable onPress={() => router.push('/admin/publishers/review')} className="my-2.5 rounded-lg bg-danger p-2.5">
						<Text className="text-center font-medium text-sm text-white">
							{requestPublishers.length} solicitação(ões) pendente(s) para aprovação
						</Text>
					</Pressable>
				)}
			</>
		)
	}

	const debouncedSearch = debounce(async (term) => {
		setSearch(term)
	}, 500)

	return (
		<View className="flex">
			<Stack.Screen options={{ title: 'Publicadores', headerRight: HeaderRight }} />
			<View className="flex h-full w-full bg-background p-2.5">
				<FlatList
					ListHeaderComponent={<ListHeaderComponent />}
					data={publishers}
					keyExtractor={(item) => item.id}
					refreshControl={<RefreshControl onRefresh={mutate} refreshing={loading} />}
					contentContainerClassName="gap-2"
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => {
						const getLabel = (level: number) => {
							if (level === 1) {
								return { text: 'admin', color: 'bg-primary-600' }
							}
							if (level === 2) {
								return { text: 'editor', color: 'bg-success' }
							}
							return undefined
						}

						return (
							<ListItem
								id={item.id}
								name={item.name}
								onPress={() =>
									router.push({
										pathname: `/admin/publishers/edit/${item.id}`,
										params: { data: JSON.stringify(item) },
									})
								}
								label={getLabel(item.level)}
							/>
						)
					}}
					ListFooterComponent={() => <View className="h-[60px]" />}
					ListEmptyComponent={
						<View className="flex-1 items-center justify-center py-8">
							<Text className="font-regular text-foreground opacity-80">Nenhum publicador encontrado</Text>
						</View>
					}
				/>
			</View>
		</View>
	)
}

export default Publishers
