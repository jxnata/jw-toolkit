import Button from '@/components/button'
import { APP_VERSION } from '@/constants/content'
import { useSession } from '@/contexts/session-provider'
import { useThemedColors } from '@/hooks/use-themed-colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link, Stack, useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const Admin = () => {
	const router = useRouter()
	const { congregation, logout } = useSession()
	const { colors } = useThemedColors()

	const HeaderRight = useCallback(
		() => (
			<View className='flex flex-row justify-center items-center gap-[15px]'>
				<Pressable onPress={() => router.push('/admin/me')}>
					<Ionicons name='person-circle-outline' size={24} color={colors.foreground} />
				</Pressable>
			</View>
		),
		[router, colors]
	)

	const confirmExport = () => {
		Alert.alert(
			'Exportar mapas',
			'Exportar os mapas é uma operação custosa, por favor, faça somente quando realmente necessário. Deseja continuar?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{ text: 'Exportar', onPress: () => router.push('/admin/export') },
			]
		)
	}

	if (!congregation)
		return (
			<View className='flex-1 items-center justify-center'>
				<Button onPress={logout}>Sair</Button>
			</View>
		)
	// if (!congregation) return null

	return (
		<Animated.View className='flex' entering={FadeInDown}>
			<Stack.Screen options={{ title: congregation.name, headerRight: HeaderRight }} />
			<ScrollView className='flex p-3 w-full h-full bg-background' contentContainerClassName='gap-2'>
				<View className='flex flex-row items-center w-full gap-2 my-2'>
					<Text className='text-foreground text-sm py-2 font-medium opacity-70'>ADMINISTRADOR</Text>
					<View className='h-[1px] w-full bg-foreground opacity-20' />
				</View>

				<Link href='/admin/publishers' asChild>
					<Pressable className='flex flex-row items-center justify-between w-full rounded-[10px] bg-card p-5 gap-2.5'>
						<View className='flex flex-row items-center gap-2.5'>
							<Text className='text-[32px] font-icons text-primary'></Text>
							<Text className='text-[15px] text-foreground pl-2.5 font-semibold'>Publicadores</Text>
						</View>
						<View className='flex flex-row items-center gap-2.5'></View>
					</Pressable>
				</Link>

				<Link href='/admin/maps' asChild>
					<Pressable className='flex flex-row items-center justify-between w-full rounded-[10px] bg-card p-5 gap-2.5'>
						<View className='flex flex-row items-center gap-2.5'>
							<Text className='text-[32px] font-icons text-primary'></Text>
							<Text className='text-[15px] text-foreground pl-2.5 font-semibold'>Mapas</Text>
						</View>
						<View className='flex flex-row items-center gap-2.5'></View>
					</Pressable>
				</Link>

				<Link href='/admin/assignments' asChild>
					<Pressable className='flex flex-row items-center justify-between w-full rounded-[10px] bg-card p-5 gap-2.5'>
						<View className='flex flex-row items-center gap-2.5'>
							<Text className='text-[32px] font-icons text-primary'></Text>
							<Text className='text-[15px] text-foreground pl-2.5 font-semibold'>Designações</Text>
						</View>
						<View className='flex flex-row items-center gap-2.5'></View>
					</Pressable>
				</Link>

				<Link href='/admin/cities' asChild>
					<Pressable className='flex flex-row items-center justify-between w-full rounded-[10px] bg-card p-5 gap-2.5'>
						<View className='flex flex-row items-center gap-2.5'>
							<Text className='text-[32px] font-icons text-primary'></Text>
							<Text className='text-[15px] text-foreground pl-2.5 font-semibold'>Cidades</Text>
						</View>
						<View className='flex flex-row items-center gap-2.5'></View>
					</Pressable>
				</Link>

				<Pressable
					onPress={confirmExport}
					className='flex flex-row items-center justify-between w-full rounded-[10px] bg-card p-5 gap-2.5'
				>
					<View className='flex flex-row items-center gap-2.5'>
						<Text className='text-[32px] font-icons text-primary'></Text>
						<Text className='text-[15px] text-foreground pl-2.5 font-semibold'>Exportar mapas</Text>
					</View>
				</Pressable>

				<View className='flex flex-row items-center w-full gap-2 my-2'>
					<Text className='text-foreground text-sm py-2 font-medium opacity-70'>PUBLICADOR</Text>
					<View className='h-[1px] w-full bg-foreground opacity-20' />
				</View>

				<Link href='/admin/my-assignments' asChild>
					<Pressable className='flex flex-row items-center justify-between w-full rounded-[10px] bg-card p-5 gap-2.5'>
						<View className='flex flex-row items-center gap-2.5'>
							<Text className='text-[32px] font-icons text-primary'></Text>
							<Text className='text-[15px] text-foreground pl-2.5 font-semibold'>Minhas designações</Text>
						</View>
					</Pressable>
				</Link>
			</ScrollView>

			<Text className='text-xs text-foreground py-2.5 font-medium absolute bottom-[50px] self-center'>
				Versão: {APP_VERSION}
			</Text>
		</Animated.View>
	)
}

export default Admin
