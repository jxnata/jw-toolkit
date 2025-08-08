import Button from '@/components/button'
import { FREE_LIMITS } from '@/constants/env'
import { useSession } from '@/contexts/session-provider'
import { router, Stack } from 'expo-router'
import { AlertTriangle, ArrowRight, Crown, Map, Users } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const LimitAlert = () => {
	const { current } = useSession()

	const handleUpgradeToUnlimited = () => {
		router.push('/subscription')
	}

	const handleContinueFree = () => {
		router.back()
	}

	return (
		<Animated.View className='flex-1 bg-background' entering={FadeInDown}>
			<Stack.Screen options={{ title: 'Limite Atingido' }} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className='flex-1 justify-center p-4'>
					<View className='items-center mb-8'>
						<View className='w-16 h-16 bg-danger-100 rounded-full items-center justify-center mb-4'>
							<AlertTriangle size={32} color='#bf616a' />
						</View>
						<Text className='text-2xl font-bold text-foreground text-center mb-2'>
							Limite da Versão Gratuita Atingido
						</Text>
						<Text className='font-regular text-foreground opacity-80 text-center leading-6'>
							Você atingiu o limite máximo da versão gratuita. Para continuar usando todos os recursos do
							LS Maps, é necessário fazer upgrade para a versão Pro.
						</Text>
					</View>

					<View className='bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4'>
						<Text className='text-lg font-semibold text-danger-700 mb-3'>
							Limitações da Versão Gratuita
						</Text>
						<View className='space-y-3'>
							<View className='flex-row items-center'>
								<Users size={20} color='#bf616a' />
								<Text className='text-danger-700 ml-3 flex-1'>
									<Text className='font-semibold'>{FREE_LIMITS.publishers} publicadores</Text> por
									congregação
								</Text>
							</View>
							<View className='flex-row items-center'>
								<Map size={20} color='#bf616a' />
								<Text className='text-danger-700 ml-3 flex-1'>
									<Text className='font-semibold'>{FREE_LIMITS.maps} mapas</Text> por congregação
								</Text>
							</View>
						</View>
					</View>

					<View className='bg-card border border-primary-600 rounded-lg p-4 mb-6'>
						<View className='flex-row items-center mb-2'>
							<Crown size={20} color='#bb7424' />
							<Text className='text-lg font-semibold text-primary-600 ml-2'>
								Versão Pro - Sem Limitações
							</Text>
						</View>
						<Text className='text-foreground font-regular leading-6 mb-3'>
							Com a versão Pro, você pode adicionar quantos publicadores e mapas precisar, sem restrições.
							Além disso, você ajuda a manter o aplicativo ativo para outras congregações.
						</Text>
						<Text className='text-foreground font-medium'>✨ 1 mês grátis para testar</Text>
					</View>

					<View className='gap-3'>
						<Button
							onPress={handleUpgradeToUnlimited}
							className='bg-primary'
							left={<Crown size={16} color='#ffffff' />}
							right={<ArrowRight size={16} color='#ffffff' />}
						>
							Fazer Upgrade para Pro
						</Button>
						<Button onPress={handleContinueFree} variant='outline'>
							Voltar
						</Button>
					</View>
				</View>
			</ScrollView>
		</Animated.View>
	)
}

export default LimitAlert
