import Button from '@/components/button'
import { useSession } from '@/contexts/session-provider'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { router, Stack } from 'expo-router'
import { Clock, LogOut, Shuffle } from 'lucide-react-native'
import { Alert, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

// Shown while an admin has not approved the publisher yet. The session updates in real time,
// so the app leaves this screen by itself as soon as the request is approved.
const Pending = () => {
	const { current, congregation, logout } = useSession()
	const { colors } = useThemedColors()

	const handleLogout = () => {
		Alert.alert('Sair', 'Tem certeza que deseja sair?', [
			{ text: 'Cancelar', style: 'cancel' },
			{ text: 'Sim', onPress: logout },
		])
	}

	return (
		<Animated.View className="flex-1 items-center justify-center bg-background p-4" entering={FadeInDown}>
			<Stack.Screen options={{ title: 'Aguardando aprovação', headerShown: false }} />
			<View className="w-full max-w-md flex-1 items-center justify-center gap-6">
				<Clock size={64} color={colors.primary[600]} />
				<Text className="text-center font-bold text-xl text-foreground">Aguardando aprovação</Text>
				<Text className="text-center font-regular text-base leading-6 text-foreground opacity-70">
					Seu pedido para participar da congregação <Text className="font-semibold">{congregation?.name}</Text> foi enviado. Um
					administrador precisa aprovar seu acesso antes que você possa ver os mapas.
				</Text>
				<Text className="text-center font-regular text-sm text-foreground opacity-60">
					Esta tela será atualizada automaticamente assim que seu acesso for aprovado.
				</Text>
				{current?.email && <Text className="font-medium text-sm text-primary">{current.email}</Text>}
				<View className="mt-4 w-full gap-3">
					<Button
						variant="link"
						onPress={() => router.push('/select-congregation?initial=' + congregation?.id)}
						right={<Shuffle size={16} color={colors.primary[600]} />}>
						Trocar congregação
					</Button>
					<Button variant="danger" onPress={handleLogout} left={<LogOut size={16} color={colors.danger[500]} />}>
						Sair
					</Button>
				</View>
			</View>
		</Animated.View>
	)
}

export default Pending
