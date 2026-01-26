import Button from '@/components/button'
import { APP_VERSION } from '@/constants/content'
import { useSession } from '@/contexts/session-provider'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { api } from '@/lib/api'
import { router, Stack } from 'expo-router'
import { LogOut, Shuffle, Trash } from 'lucide-react-native'
import { useState } from 'react'
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

	const HeaderRight = () => (
		<View className="flex-row">
			<Pressable disabled={loadingDelete || loading} hitSlop={10} onPress={deleteAccountConfirm} className="mx-2">
				<Trash size={20} color={colors.danger[500]} />
			</Pressable>
		</View>
	)

	if (!current) return null
	if (!congregation) return null

	return (
		<View className="flex">
			<Stack.Screen options={{ title: 'Meu Perfil', presentation: 'modal', headerRight: HeaderRight }} />
			<View className="flex h-full w-full items-center bg-background p-3">
				<Text className="py-2.5 font-icons text-5xl text-foreground"></Text>
				<Text className="pt-5 font-bold text-lg text-foreground">{current.name}</Text>
				<Text className="pb-5 pt-2.5 font-medium text-primary">{current.email}</Text>
				<View className="flex w-full flex-row items-center justify-between gap-2 rounded-xl bg-card py-2.5 pl-4">
					<View className="flex-col gap-1.5">
						<Text className="font-medium text-sm text-foreground">Congregação</Text>
						<Text className="font-medium text-foreground">{congregation.name}</Text>
					</View>
					<Button
						right={<Shuffle size={16} color={colors.primary[600]} />}
						variant="link"
						onPress={() => router.push('/select-congregation?initial=' + congregation.id)}
						disabled={loading || loadingDelete}>
						Alterar
					</Button>
				</View>
				<Button
					variant="danger"
					onPress={handleLogout}
					disabled={loading || loadingDelete}
					className="mt-6"
					left={<LogOut size={16} color={colors.danger[500]} />}>
					Sair
				</Button>
				<Text className="absolute bottom-[50px] py-2.5 font-medium text-xs text-foreground">Versão: {APP_VERSION}</Text>
			</View>
		</View>
	)
}

export default UserDetails
