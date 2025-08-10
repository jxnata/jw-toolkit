import Button from '@/components/button'
import Input from '@/components/input'
import { useSession } from '@/contexts/session-provider'
import { storage } from '@/database'
import useCongregations from '@/hooks/use-congregations'
import { useSubscription } from '@/hooks/use-subscription'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { publishersService } from '@/services/instantdb/publishers-service'
import { id } from '@instantdb/react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { CheckCircle2, Circle } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDebouncedCallback } from 'use-debounce'

const SelectCongregation = () => {
	const { initial } = useLocalSearchParams()
	const { current, logout } = useSession()
	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')
	const [selectedCongregation, setSelectedCongregation] = useState<string | null>((initial as string) || null)
	const [loading, setLoading] = useState(false)
	const { congregations, loading: congregationsLoading } = useCongregations({ search: debouncedSearch })
	const { isUserSubscribed } = useSubscription()

	const changeCongregationDisabled = useMemo(() => {
		return isUserSubscribed && !!initial
	}, [isUserSubscribed])

	const insets = useSafeAreaInsets()
	const { colors } = useThemedColors()

	// Debounce search input using use-debounce library
	const debouncedSetSearch = useDebouncedCallback(
		(value: string) => {
			setDebouncedSearch(value)
		},
		300 // 300ms delay
	)

	const handleSearchChange = (value: string) => {
		setSearch(value)
		debouncedSetSearch(value)
	}

	const handleSelectCongregation = async () => {
		if (!selectedCongregation) {
			Alert.alert('Erro', 'Selecione uma congregação')
			return
		}

		if (initial && initial === selectedCongregation) {
			router.back()
			return
		}

		setLoading(true)

		try {
			if (!current) {
				Alert.alert('Erro', 'Usuário não autenticado')
				return
			}

			const publisher = await publishersService.searchByUserId(current.id)

			const congregation = congregations.find(c => c.id === selectedCongregation)
			if (!congregation) {
				Alert.alert('Erro', 'Congregação não encontrada')
				return
			}

			const isFirstPublisher = await publishersService.checkIsFirstPublisher(selectedCongregation)

			const updates = {
				level: isFirstPublisher ? 1 : 3,
				approved: true,
			}

			const links = {
				user: current.id,
				congregation: selectedCongregation,
			}

			// Create/update publisher profile and link to congregation
			const publisherId = publisher ? publisher.id : id()

			await publishersService.updatePublisher(publisherId, updates, links)

			// Store congregation info
			storage.set('congregation.id', selectedCongregation)
			storage.set('congregation.name', congregation.name)
			storage.set('user.publisher', publisherId)

			const message = isFirstPublisher
				? 'Você será um administrador da nova congregação após fazer login novamente.'
				: 'Você precisará fazer login novamente e ser aprovado por um administrador da nova congregação.'

			Alert.alert('Sucesso', `Congregação alterada com sucesso! ${message}`, [
				{
					text: 'OK',
					onPress: logout,
				},
			])
		} catch (error) {
			console.error('Error creating publisher profile:', error)
			Alert.alert('Erro', 'Ocorreu um erro ao criar o perfil')
		} finally {
			setLoading(false)
		}
	}

	const renderCongregation = ({ item }: { item: any }) => (
		<Pressable
			className={`flex-row items-center justify-between rounded-xl px-4 py-4 mt-[5px] gap-2 border bg-card ${
				selectedCongregation === item.id ? 'border-primary' : 'border-transparent'
			}`}
			onPress={() => setSelectedCongregation(item.id)}
		>
			<Text
				className={`font-semibold text-base ${selectedCongregation === item.id ? 'text-primary' : 'text-foreground'}`}
			>
				{item.name}
			</Text>
			{selectedCongregation === item.id ? (
				<CheckCircle2 size={20} color={colors.primary[600]} />
			) : (
				<Circle size={20} color={colors.foreground + '40'} />
			)}
		</Pressable>
	)

	return (
		<View className='flex-1'>
			<Stack.Screen options={{ title: 'Selecionar Congregação', presentation: 'modal' }} />
			{!changeCongregationDisabled ? (
				<View className='px-4 flex-1'>
					<Text className='font-regular text-center text-lg text-foreground mb-3'>
						Selecione sua congregação para continuar
					</Text>

					<Input
						placeholder='Buscar congregação...'
						value={search}
						onChangeText={handleSearchChange}
						clearButtonMode='while-editing'
					/>

					{congregationsLoading || search !== debouncedSearch ? (
						<View className='flex-1 justify-center items-center'>
							<ActivityIndicator size='large' />
						</View>
					) : congregations.length === 0 ? (
						<View className='flex-1 justify-center items-center'>
							<Text className='text-foreground text-center font-regular opacity-70'>
								{debouncedSearch ? 'Nenhuma congregação encontrada' : 'Carregando congregações...'}
							</Text>
						</View>
					) : (
						<FlatList
							data={congregations}
							renderItem={renderCongregation}
							keyExtractor={item => item.id}
							showsVerticalScrollIndicator={false}
							className='flex-1 mt-3'
							ListFooterComponent={() => <View className='h-12' />}
						/>
					)}

					<View className='pb-4 gap-4' style={{ paddingBottom: insets.bottom + 16 }}>
						{!initial && (
							<Button variant='link' onPress={() => router.push('/add-congregation')}>
								Criar nova congregação
							</Button>
						)}
						<Button
							onPress={handleSelectCongregation}
							disabled={!selectedCongregation || loading}
							loading={loading}
						>
							{loading ? 'Criando perfil...' : 'Continuar'}
						</Button>
					</View>
				</View>
			) : (
				<View className='px-4 flex-1'>
					<Text className='font-regular text-center text-lg text-foreground mb-3'>
						Você faz o pagamento da assinatura, por isso não é possível alterar a congregação.
					</Text>
				</View>
			)}
		</View>
	)
}

export default SelectCongregation
