import Button from '@/components/button'
import { APP_VERSION } from '@/constants/content'
import { useSession } from '@/contexts/session-provider'
import { storage } from '@/database/index'
import { useSubscription } from '@/hooks/use-subscription'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Link, Redirect, Stack, useRouter } from 'expo-router'
import { CircleAlert, UserCircle2 } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Admin = () => {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { expired } = useSubscription()
	const { congregation, logout } = useSession()
	const { colors } = useThemedColors()
	const [privacyAccepted] = useState<boolean>(() => storage.getBoolean('privacy.policy.accepted') ?? false)

	useEffect(() => {
		if (!privacyAccepted) {
			router.replace('/privacy-policy')
		}
	}, [privacyAccepted, router])

	const HeaderRight = () => (
		<TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/admin/me')} className="p-2">
			<UserCircle2 size={24} color={colors.foreground} />
		</TouchableOpacity>
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

	if (!privacyAccepted) {
		return <Redirect href="/privacy-blocked" />
	}

	if (!congregation)
		return (
			<View className="flex-1 items-center justify-center">
				<Button onPress={logout}>Sair</Button>
			</View>
		)

	return (
		<Animated.View className="flex" entering={FadeInDown}>
			<Stack.Screen options={{ title: congregation.name, headerRight: HeaderRight }} />
			<ScrollView className="flex h-full w-full bg-background p-3" contentContainerClassName="gap-2">
				<View className="my-2 flex w-full flex-row items-center gap-2">
					<Text className="py-2 font-medium text-sm text-foreground opacity-70">ADMINISTRADOR</Text>
					<View className="h-[1px] w-full bg-foreground opacity-20" />
				</View>

				<Link href="/admin/publishers" asChild>
					<TouchableOpacity
						activeOpacity={0.7}
						className="flex w-full flex-row items-center justify-between gap-3 rounded-xl bg-card p-4">
						<View className="flex flex-row items-center gap-3">
							<Text className="font-icons text-4xl text-primary"></Text>
							<Text className="font-semibold text-base text-foreground">Publicadores</Text>
						</View>
						<View className="flex flex-row items-center gap-3"></View>
					</TouchableOpacity>
				</Link>

				<Link href="/admin/maps" asChild>
					<TouchableOpacity
						activeOpacity={0.7}
						className="flex w-full flex-row items-center justify-between gap-3 rounded-xl bg-card p-4">
						<View className="flex flex-row items-center gap-3">
							<Text className="font-icons text-4xl text-primary"></Text>
							<Text className="font-semibold text-base text-foreground">Mapas & Designações</Text>
						</View>
						<View className="flex flex-row items-center gap-3"></View>
					</TouchableOpacity>
				</Link>

				<Link href="/admin/cities" asChild>
					<TouchableOpacity
						activeOpacity={0.7}
						className="flex w-full flex-row items-center justify-between gap-3 rounded-xl bg-card p-4">
						<View className="flex flex-row items-center gap-3">
							<Text className="font-icons text-4xl text-primary"></Text>
							<Text className="font-semibold text-base text-foreground">Cidades/Territórios</Text>
						</View>
						<View className="flex flex-row items-center gap-3"></View>
					</TouchableOpacity>
				</Link>

				<TouchableOpacity
					activeOpacity={0.7}
					onPress={confirmExport}
					className="flex w-full flex-row items-center justify-between gap-3 rounded-xl bg-card p-4">
					<View className="flex flex-row items-center gap-3">
						<Text className="font-icons text-4xl text-primary"></Text>
						<Text className="font-semibold text-base text-foreground">Exportar/Backup</Text>
					</View>
				</TouchableOpacity>

				<View className="my-2 flex w-full flex-row items-center gap-2">
					<Text className="py-2 font-medium text-sm text-foreground opacity-70">PUBLICADOR</Text>
					<View className="h-[1px] w-full bg-foreground opacity-20" />
				</View>

				<Link href="/admin/my-assignments" asChild>
					<TouchableOpacity
						activeOpacity={0.7}
						className="flex w-full flex-row items-center justify-between gap-3 rounded-xl bg-card p-4">
						<View className="flex flex-row items-center gap-3">
							<Text className="font-icons text-4xl text-primary"></Text>
							<Text className="font-semibold text-base text-foreground">Minhas designações</Text>
						</View>
					</TouchableOpacity>
				</Link>

				{expired && (
					<View className="flex flex-col gap-4">
						<View className="mt-2 h-[1px] w-full bg-foreground opacity-20" />
						<Link href="/subscription" asChild>
							<TouchableOpacity
								activeOpacity={0.7}
								className="flex w-full flex-row items-center justify-between gap-3 rounded-xl border border-danger bg-card p-4">
								<View className="flex flex-row items-center gap-3">
									<CircleAlert size={24} color={colors.danger[500]} />
									<Text className="flex-1 font-semibold text-base text-foreground">
										A assinatura da sua congregação está expirada, toque aqui para renová-la.
									</Text>
								</View>
							</TouchableOpacity>
						</Link>
					</View>
				)}
			</ScrollView>

			<Text className="absolute self-center font-medium text-xs text-foreground" style={{ bottom: insets.bottom + 10 }}>
				Versão: {APP_VERSION}
			</Text>
		</Animated.View>
	)
}

export default Admin
