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
		<Animated.View className="flex-1 bg-background" entering={FadeInDown}>
			<Stack.Screen
				options={{
					title: 'Política de Privacidade',
					presentation: 'modal',
				}}
			/>
			<ScrollView
				bounces={false}
				className="flex-1"
				contentContainerClassName="p-4 gap-4"
				contentContainerStyle={{ paddingBottom: !noButtons ? 0 : insets.bottom + 16 }}>
				<View className="gap-4">
					<Text className="font-bold text-2xl text-foreground">Política de Privacidade – LS Maps</Text>

					<Text className="font-regular text-base leading-6 text-foreground">
						Esta política explica como o aplicativo LS Maps, criado por Jonatã Oliveira, coleta e usa suas informações. O app é
						oferecido como um serviço freemium.
					</Text>

					<Text className="mt-2 font-semibold text-xl text-foreground">Coleta e uso de informações</Text>

					<Text className="font-regular text-base leading-6 text-foreground">O app pode coletar dados como:</Text>

					<View className="gap-2 pl-4">
						<Text className="font-regular text-base leading-6 text-foreground">• Endereço IP do seu dispositivo</Text>
						<Text className="font-regular text-base leading-6 text-foreground">• Sistema operacional do dispositivo</Text>
						<Text className="font-regular text-base leading-6 text-foreground">• Localização aproximada</Text>
					</View>

					<Text className="font-regular text-base leading-6 text-foreground">Essas informações são usadas para:</Text>

					<View className="gap-2 pl-4">
						<Text className="font-regular text-base leading-6 text-foreground">
							• Oferecer recursos baseados em localização
						</Text>
						<Text className="font-regular text-base leading-6 text-foreground">• Analisar o uso geral e melhorar o app</Text>
					</View>

					<Text className="font-regular text-base leading-6 text-foreground">
						O app pode solicitar informações pessoais como nome, e-mail e localização, que serão mantidas conforme esta
						política. Todos os dados coletados são transferidos e armazenados com segurança, utilizando criptografia.
					</Text>

					<Text className="mt-2 font-semibold text-xl text-foreground">Serviços de terceiros</Text>

					<Text className="font-regular text-base leading-6 text-foreground">
						O LS Maps pode compartilhar dados anônimos com serviços externos para análise e melhorias. Esses serviços têm suas
						próprias políticas de privacidade:
					</Text>

					<View className="gap-2 pl-4">
						<Text className="font-regular text-base leading-6 text-foreground">• Google Play Services</Text>
						<Text className="font-regular text-base leading-6 text-foreground">• One Signal</Text>
						<Text className="font-regular text-base leading-6 text-foreground">• Expo</Text>
						<Text className="font-regular text-base leading-6 text-foreground">• RevenueCat</Text>
						<Text className="font-regular text-base leading-6 text-foreground">• InstantDB</Text>
					</View>

					<Text className="font-regular text-base leading-6 text-foreground">
						Informações podem ser divulgadas se exigido por lei, para proteger direitos, segurança ou em casos de fraude.
					</Text>

					<Text className="mt-2 font-semibold text-xl text-foreground">Seus direitos</Text>

					<Text className="font-regular text-base leading-6 text-foreground">
						Você pode parar a coleta de dados desinstalando o app. Para excluir suas informações, basta excluir sua conta na
						tela de perfil do aplicativo.
					</Text>

					<Text className="mt-2 font-semibold text-xl text-foreground">Segurança</Text>

					<Text className="font-regular text-base leading-6 text-foreground">
						São usadas medidas físicas, eletrônicas e administrativas, incluindo criptografia, para proteger suas informações.
					</Text>

					<Text className="mt-2 font-semibold text-xl text-foreground">Alterações</Text>

					<Text className="font-regular text-base leading-6 text-foreground">
						Esta política pode ser atualizada periodicamente. Mudanças serão publicadas nesta página. O uso contínuo do app
						indica concordância com as alterações.
					</Text>
				</View>
			</ScrollView>

			{!noButtons && (
				<View className="gap-3 border-t border-border p-4" style={{ paddingBottom: insets.bottom + 16 }}>
					<Button onPress={handleAccept} loading={loading} variant="primary">
						Aceitar
					</Button>
					<Button onPress={handleReject} variant="outline" disabled={loading}>
						Rejeitar
					</Button>
				</View>
			)}
		</Animated.View>
	)
}

export default PrivacyPolicy
