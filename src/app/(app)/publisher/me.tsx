import Button from '@/components/button'
import { APP_VERSION } from '@/constants/content'
import { useSession } from '@/contexts/session-provider'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { api } from '@/lib/api'
import { router, Stack } from 'expo-router'
import { LogOut, Shuffle, Trash } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'

const UserDetails = () => {
	const { current, loading, congregation, logout } = useSession()
	const { colors } = useThemedColors()
	const [loadingDelete, setLoadingDelete] = useState(false)

	const handleLogout = () => {
		Alert.alert('Sair', 'Tem certeza que deseja sair?', [
			{
				text: 'Cancelar',
				style: 'cancel',
			},
			{
				text: 'Sim',
				onPress: logout,
			},
		])
	}

	const deleteAccountConfirm = () => {
		Alert.alert('Deletar conta', 'Tem certeza que deseja deletar sua conta? Esta ação é irreversível.', [
			{ text: 'Cancelar', style: 'cancel' },
			{ text: 'Deletar', style: 'destructive', onPress: deleteAccount },
		])
	}

	const deleteAccount = async () => {
		if (!current) return

		try {
			setLoadingDelete(true)

			await api.delete('/users/me', {
				headers: {
					token: current.refresh_token,
				},
			})

			logout()
		} catch (error) {
			console.error(error)
		} finally {
			setLoadingDelete(false)
		}
	}

	const HeaderRight = useCallback(
		() => (
			<View className='flex-row'>
				<Pressable
					disabled={loadingDelete || loading}
					hitSlop={10}
					onPress={deleteAccountConfirm}
					className='mx-2'
				>
					<Trash size={20} color={colors.danger[500]} />
				</Pressable>
			</View>
		),
		[router, colors.foreground, loadingDelete, loading]
	)

	if (!current) return null
	if (!congregation) return null

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Meu Perfil', presentation: 'modal', headerRight: HeaderRight }} />
			<View className='flex p-2.5 w-full h-full items-center bg-background'>
				<Text className='text-5xl text-foreground py-2.5 font-icons'></Text>
				<Text className='text-lg text-foreground pt-5 font-bold'>{current.name}</Text>
				<Text className='text-primary pb-5 pt-2.5 font-medium'>{current.email}</Text>
				<View className='flex flex-row items-center justify-between gap-2 w-full bg-card rounded-xl pl-4 py-2.5'>
					<View className='flex-col gap-1.5'>
						<Text className='text-sm text-foreground font-medium'>Congregação</Text>
						<Text className='text-foreground font-medium'>{congregation.name}</Text>
					</View>
					<Button
						right={<Shuffle size={16} color={colors.primary[600]} />}
						variant='link'
						onPress={() => router.push('/select-congregation?initial=' + congregation.id)}
						disabled={loading || loadingDelete}
					>
						Alterar
					</Button>
				</View>
				<Button
					variant='danger'
					onPress={handleLogout}
					disabled={loading || loadingDelete}
					className='mt-6'
					left={<LogOut size={16} color={colors.danger[500]} />}
				>
					Sair
				</Button>
				<Text className='text-xs text-foreground py-2.5 font-medium absolute bottom-[50px]'>
					Versão: {APP_VERSION}
				</Text>
			</View>
		</View>
	)
}

export default UserDetails
