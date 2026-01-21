import Button from '@/components/button'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack, useRouter } from 'expo-router'
import { AlertCircle } from 'lucide-react-native'
import { Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const PrivacyBlocked = () => {
	const router = useRouter()
	const { colors } = useThemedColors()

	const handleOpenPolicy = () => {
		router.replace('/privacy-policy')
	}

	return (
		<Animated.View className="flex-1 items-center justify-center bg-background p-4" entering={FadeInDown}>
			<Stack.Screen
				options={{
					title: 'Política de Privacidade',
					headerShown: false,
				}}
			/>
			<View className="max-w-md flex-1 items-center justify-center gap-6">
				<AlertCircle size={64} color={colors.danger[500]} />
				<Text className="text-center font-bold text-xl text-foreground">
					Não é possível usar o app sem aceitar a política de privacidade
				</Text>
				<Text className="text-center font-regular text-base leading-6 text-foreground opacity-70">
					Para continuar usando o aplicativo, é necessário aceitar os termos da política de privacidade.
				</Text>
				<View className="w-full" style={{ marginTop: 16 }}>
					<Button onPress={handleOpenPolicy} variant="primary">
						Ver Política de Privacidade
					</Button>
				</View>
			</View>
		</Animated.View>
	)
}

export default PrivacyBlocked
