import { APP_VERSION } from '@/constants/content'
import { useSession } from '@/contexts/session-instantdb'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack } from 'expo-router'
import { LogOut } from 'lucide-react-native'
import { Alert, Text, View } from 'react-native'

import Button from '@/components/button'

const UserDetails = () => {
	const { current, loading, congregation, logout, type } = useSession()
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
				<Text className='text-5xl text-foreground py-2.5 font-icons'></Text>
				<Text className='text-lg text-foreground pt-5 font-bold'>{current.name}</Text>
				<Text className='text-primary pb-5 pt-2.5 font-medium'>{current.email}</Text>
				<Text className='text-sm text-foreground py-2.5 font-medium'>Congregação</Text>
				<Text className='text-foreground pb-5 font-medium'>{congregation.name}</Text>
				<Button
					variant='outline'
					onPress={handleLogout}
					disabled={loading}
					className='mt-3'
					left={<LogOut size={16} color={colors.foreground} />}
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
