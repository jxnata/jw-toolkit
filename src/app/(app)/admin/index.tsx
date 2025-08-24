import Button from '@/components/button'
import { APP_VERSION } from '@/constants/content'
import { useSession } from '@/contexts/session-provider'
import { useSubscription } from '@/hooks/use-subscription'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Link, Stack, useRouter } from 'expo-router'
import { CircleAlert, UserCircle2 } from 'lucide-react-native'
import { useCallback } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Admin = () => {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { expired, subscribed } = useSubscription()
	const { congregation, logout } = useSession()
	const { colors } = useThemedColors()

	const HeaderRight = useCallback(
		() => (
			<View className='flex flex-row justify-center items-center gap-base'>
				<TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/admin/me')}>
					<UserCircle2 size={24} color={colors.foreground} />
				</TouchableOpacity>
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

	return (
		<Animated.View className='flex' entering={FadeInDown}>
			<Stack.Screen options={{ title: congregation.name, headerRight: HeaderRight }} />
			<ScrollView className='flex p-3 w-full h-full bg-background' contentContainerClassName='gap-2'>
				<View className='flex flex-row items-center w-full gap-2 my-2'>
					<Text className='text-foreground text-sm py-2 font-medium opacity-70'>ADMINISTRADOR</Text>
					<View className='h-[1px] w-full bg-foreground opacity-20' />
				</View>

				<Link href='/admin/publishers' asChild>
					<TouchableOpacity
						activeOpacity={0.7}
						className='flex flex-row items-center justify-between w-full rounded-xl bg-card p-4 gap-3'
					>
						<View className='flex flex-row items-center gap-3'>
							<Text className='text-4xl font-icons text-primary'></Text>
							<Text className='text-base text-foreground font-semibold'>Publicadores</Text>
						</View>
						<View className='flex flex-row items-center gap-3'></View>
					</TouchableOpacity>
				</Link>

				<Link href='/admin/maps' asChild>
					<TouchableOpacity
						activeOpacity={0.7}
						className='flex flex-row items-center justify-between w-full rounded-xl bg-card p-4 gap-3'
					>
						<View className='flex flex-row items-center gap-3'>
							<Text className='text-4xl font-icons text-primary'></Text>
							<Text className='text-base text-foreground font-semibold'>Mapas</Text>
						</View>
						<View className='flex flex-row items-center gap-3'></View>
					</TouchableOpacity>
				</Link>

				<Link href='/admin/assignments' asChild>
					<TouchableOpacity
						activeOpacity={0.7}
						className='flex flex-row items-center justify-between w-full rounded-xl bg-card p-4 gap-3'
					>
						<View className='flex flex-row items-center gap-3'>
							<Text className='text-4xl font-icons text-primary'></Text>
							<Text className='text-base text-foreground font-semibold'>Designações</Text>
						</View>
						<View className='flex flex-row items-center gap-3'></View>
					</TouchableOpacity>
				</Link>

				<Link href='/admin/cities' asChild>
					<TouchableOpacity
						activeOpacity={0.7}
						className='flex flex-row items-center justify-between w-full rounded-xl bg-card p-4 gap-3'
					>
						<View className='flex flex-row items-center gap-3'>
							<Text className='text-4xl font-icons text-primary'></Text>
							<Text className='text-base text-foreground font-semibold'>Cidades</Text>
						</View>
						<View className='flex flex-row items-center gap-3'></View>
					</TouchableOpacity>
				</Link>

				<TouchableOpacity
					activeOpacity={0.7}
					onPress={confirmExport}
					className='flex flex-row items-center justify-between w-full rounded-xl bg-card p-4 gap-3'
				>
					<View className='flex flex-row items-center gap-3'>
						<Text className='text-4xl font-icons text-primary'></Text>
						<Text className='text-base text-foreground font-semibold'>Exportar mapas</Text>
					</View>
				</TouchableOpacity>

				<View className='flex flex-row items-center w-full gap-2 my-2'>
					<Text className='text-foreground text-sm py-2 font-medium opacity-70'>PUBLICADOR</Text>
					<View className='h-[1px] w-full bg-foreground opacity-20' />
				</View>

				<Link href='/admin/my-assignments' asChild>
					<TouchableOpacity
						activeOpacity={0.7}
						className='flex flex-row items-center justify-between w-full rounded-xl bg-card p-4 gap-3'
					>
						<View className='flex flex-row items-center gap-3'>
							<Text className='text-4xl font-icons text-primary'></Text>
							<Text className='text-base text-foreground font-semibold'>Minhas designações</Text>
						</View>
					</TouchableOpacity>
				</Link>

				{expired && (
					<View className='flex flex-col gap-4'>
						<View className='h-[1px] w-full bg-foreground opacity-20 mt-2' />
						<Link href='/subscription' asChild>
							<TouchableOpacity
								activeOpacity={0.7}
								className='flex flex-row items-center justify-between w-full rounded-xl bg-card p-4 gap-3 border border-danger'
							>
								<View className='flex flex-row items-center gap-3'>
									<CircleAlert size={24} color={colors.danger[500]} />
									<Text className='text-base text-foreground font-semibold flex-1'>
										A assinatura da sua congregação está expirada, toque aqui para renová-la.
									</Text>
								</View>
							</TouchableOpacity>
						</Link>
					</View>
				)}
			</ScrollView>

			<Text
				className='text-xs text-foreground font-medium absolute self-center'
				style={{ bottom: insets.bottom + 10 }}
			>
				Versão: {APP_VERSION}
			</Text>
		</Animated.View>
	)
}

export default Admin
