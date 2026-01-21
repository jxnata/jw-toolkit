import Button from '@/components/button'
import { FREE_LIMITS } from '@/constants/env'
import { router, Stack } from 'expo-router'
import { AlertTriangle, ArrowRight, Crown, Map, Users } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const LimitAlert = () => {
	const handleUpgradeToUnlimited = () => {
		router.push('/subscription')
	}

	const handleContinueFree = () => {
		router.back()
	}

	return (
		<Animated.View className="flex-1 bg-background" entering={FadeInDown}>
			<Stack.Screen options={{ title: 'Limite Atingido' }} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="flex-1 justify-center p-4">
					<View className="mb-8 items-center">
						<View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-danger-100">
							<AlertTriangle size={32} color="#bf616a" />
						</View>
						<Text className="mb-2 text-center font-bold text-2xl text-foreground">Limite da Versão Gratuita Atingido</Text>
						<Text className="text-center font-regular leading-6 text-foreground opacity-80">
							Você atingiu o limite máximo da versão gratuita. Para continuar usando todos os recursos do LS Maps, é
							necessário fazer upgrade para a versão Pro.
						</Text>
					</View>

					<View className="mb-4 rounded-lg border border-danger-200 bg-danger-50 p-4">
						<Text className="mb-3 font-semibold text-lg text-danger-700">Limitações da Versão Gratuita</Text>
						<View className="space-y-3">
							<View className="flex-row items-center">
								<Users size={20} color="#bf616a" />
								<Text className="ml-3 flex-1 text-danger-700">
									<Text className="font-semibold">{FREE_LIMITS.publishers} publicadores</Text> por congregação
								</Text>
							</View>
							<View className="flex-row items-center">
								<Map size={20} color="#bf616a" />
								<Text className="ml-3 flex-1 text-danger-700">
									<Text className="font-semibold">{FREE_LIMITS.maps} mapas</Text> por congregação
								</Text>
							</View>
						</View>
					</View>

					<View className="mb-6 rounded-lg border border-primary-600 bg-card p-4">
						<View className="mb-2 flex-row items-center">
							<Crown size={20} color="#bb7424" />
							<Text className="ml-2 font-semibold text-lg text-primary-600">Versão Pro - Sem Limitações</Text>
						</View>
						<Text className="mb-3 font-regular leading-6 text-foreground">
							Com a versão Pro, você pode adicionar quantos publicadores e mapas precisar, sem restrições. Além disso, você
							ajuda a manter o aplicativo ativo para outras congregações.
						</Text>
						<Text className="font-medium text-foreground">✨ 1 mês grátis para testar</Text>
					</View>

					<View className="gap-3">
						<Button
							onPress={handleUpgradeToUnlimited}
							className="bg-primary"
							left={<Crown size={16} color="#ffffff" />}
							right={<ArrowRight size={16} color="#ffffff" />}>
							Fazer Upgrade para Pro
						</Button>
						<Button onPress={handleContinueFree} variant="outline">
							Voltar
						</Button>
					</View>
				</View>
			</ScrollView>
		</Animated.View>
	)
}

export default LimitAlert
