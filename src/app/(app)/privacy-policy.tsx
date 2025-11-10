import Button from '@/components/button'
import { useSession } from '@/contexts/session-provider'
import { storage } from '@/database/index'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PrivacyPolicy = () => {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { type } = useSession()
	const { noButtons } = useLocalSearchParams()
	const [loading, setLoading] = useState(false)

	const handleAccept = async () => {
		setLoading(true)
		storage.set('privacy.policy.accepted', true)
		setLoading(false)

		if (type === 'admin') {
			router.replace('/admin')
		} else if (type === 'publisher') {
			router.replace('/publisher')
		} else {
			router.back()
		}
	}

	const handleReject = () => {
		router.replace('/privacy-blocked')
	}

	return (
		<Animated.View className='flex-1 bg-background' entering={FadeInDown}>
			<Stack.Screen
				options={{
					title: 'Política de Privacidade',
					presentation: 'modal',
				}}
			/>
			<ScrollView
				bounces={false}
				className='flex-1'
				contentContainerClassName='p-4 gap-4'
				contentContainerStyle={{ paddingBottom: !noButtons ? 0 : insets.bottom + 16 }}
			>
				<View className='gap-4'>
					<Text className='text-2xl text-foreground font-bold'>Política de Privacidade – LS Maps</Text>

					<Text className='text-base text-foreground font-regular leading-6'>
						Esta política explica como o aplicativo LS Maps, criado por Jonatã Oliveira, coleta e usa suas
						informações. O app é oferecido como um serviço freemium.
					</Text>

					<Text className='text-xl text-foreground font-semibold mt-2'>Coleta e uso de informações</Text>

					<Text className='text-base text-foreground font-regular leading-6'>
						O app pode coletar dados como:
					</Text>

					<View className='pl-4 gap-2'>
						<Text className='text-base text-foreground font-regular leading-6'>
							• Endereço IP do seu dispositivo
						</Text>
						<Text className='text-base text-foreground font-regular leading-6'>
							• Sistema operacional do dispositivo
						</Text>
						<Text className='text-base text-foreground font-regular leading-6'>
							• Localização aproximada
						</Text>
					</View>

					<Text className='text-base text-foreground font-regular leading-6'>
						Essas informações são usadas para:
					</Text>

					<View className='pl-4 gap-2'>
						<Text className='text-base text-foreground font-regular leading-6'>
							• Oferecer recursos baseados em localização
						</Text>
						<Text className='text-base text-foreground font-regular leading-6'>
							• Analisar o uso geral e melhorar o app
						</Text>
					</View>

					<Text className='text-base text-foreground font-regular leading-6'>
						O app pode solicitar informações pessoais como nome, e-mail e localização, que serão mantidas
						conforme esta política. Todos os dados coletados são transferidos e armazenados com segurança,
						utilizando criptografia.
					</Text>

					<Text className='text-xl text-foreground font-semibold mt-2'>Serviços de terceiros</Text>

					<Text className='text-base text-foreground font-regular leading-6'>
						O LS Maps pode compartilhar dados anônimos com serviços externos para análise e melhorias. Esses
						serviços têm suas próprias políticas de privacidade:
					</Text>

					<View className='pl-4 gap-2'>
						<Text className='text-base text-foreground font-regular leading-6'>• Google Play Services</Text>
						<Text className='text-base text-foreground font-regular leading-6'>• One Signal</Text>
						<Text className='text-base text-foreground font-regular leading-6'>• Expo</Text>
						<Text className='text-base text-foreground font-regular leading-6'>• RevenueCat</Text>
						<Text className='text-base text-foreground font-regular leading-6'>• InstantDB</Text>
					</View>

					<Text className='text-base text-foreground font-regular leading-6'>
						Informações podem ser divulgadas se exigido por lei, para proteger direitos, segurança ou em
						casos de fraude.
					</Text>

					<Text className='text-xl text-foreground font-semibold mt-2'>Seus direitos</Text>

					<Text className='text-base text-foreground font-regular leading-6'>
						Você pode parar a coleta de dados desinstalando o app. Para excluir suas informações, basta
						excluir sua conta na tela de perfil do aplicativo.
					</Text>

					<Text className='text-xl text-foreground font-semibold mt-2'>Segurança</Text>

					<Text className='text-base text-foreground font-regular leading-6'>
						São usadas medidas físicas, eletrônicas e administrativas, incluindo criptografia, para proteger
						suas informações.
					</Text>

					<Text className='text-xl text-foreground font-semibold mt-2'>Alterações</Text>

					<Text className='text-base text-foreground font-regular leading-6'>
						Esta política pode ser atualizada periodicamente. Mudanças serão publicadas nesta página. O uso
						contínuo do app indica concordância com as alterações.
					</Text>
				</View>
			</ScrollView>

			{!noButtons && (
				<View className='p-4 gap-3 border-t border-border' style={{ paddingBottom: insets.bottom + 16 }}>
					<Button onPress={handleAccept} loading={loading} variant='primary'>
						Aceitar
					</Button>
					<Button onPress={handleReject} variant='outline' disabled={loading}>
						Rejeitar
					</Button>
				</View>
			)}
		</Animated.View>
	)
}

export default PrivacyPolicy
