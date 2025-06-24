import { APP_VERSION } from '@/constants/content'
import { useSession } from '@/contexts/session'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack } from 'expo-router'
import { Alert, Pressable, Text, View } from 'react-native'

const PublisherDetails = () => {
	const { current, congregation, loading, logout } = useSession()
	const { colors } = useThemedColors()

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

	if (!current) return null
	if (!congregation) return null

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Meu Perfil', presentation: 'modal' }} />
			<View className='flex p-2.5 w-full h-full items-center bg-background'>
				<Text className='text-[42px] text-foreground py-2.5 font-icons'></Text>
				<Text className='text-[17px] text-foreground py-5 font-bold'>{current.name}</Text>
				<Text className='text-xs text-foreground py-2.5 font-medium'>Congregação</Text>
				<Text className='text-[15px] text-foreground pb-5 font-medium'>{congregation.name}</Text>
				<View className='flex-row gap-2.5 mt-2.5'>
					<Pressable
						onPress={handleLogout}
						disabled={loading}
						className='gap-[5px] flex flex-row items-center justify-center py-2.5 px-5 rounded-xl bg-card text-[15px] h-[50px]'
					>
						<Text className='text-[15px] font-bold' style={{ color: colors.foreground + '80' }}>
							Sair
						</Text>
					</Pressable>
				</View>
				<Text className='text-xs text-foreground py-2.5 font-medium absolute bottom-[50px]'>
					Versão: {APP_VERSION}
				</Text>
			</View>
		</View>
	)
}

export default PublisherDetails
