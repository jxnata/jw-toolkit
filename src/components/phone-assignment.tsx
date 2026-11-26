import Button from '@/components/button'
import { PhoneCallInfo } from '@/components/phone-item'
import usePhone from '@/hooks/use-phone'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { formatPhone, getCallUrl, getWhatsAppUrl } from '@/utils/phone-number'
import { Href, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { MessageCircle, PhoneCall } from 'lucide-react-native'
import { ActivityIndicator, Alert, Linking, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
	finishPathname: '/admin/my-assignments/phone/finish' | '/publisher/phone/finish'
}

// Assignment screen of a phone territory, shared by the admin ("my assignments") and publisher stacks
const PhoneAssignment = ({ finishPathname }: Props) => {
	const { id } = useLocalSearchParams<{ id: string }>()
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { colors } = useThemedColors()
	const { phone, loading } = usePhone(id)

	const open = async (url: string) => {
		try {
			await Linking.openURL(url)
		} catch {
			Alert.alert('Erro', 'Não foi possível abrir este número.')
		}
	}

	const onFinish = () => {
		if (!phone) return
		router.push({ pathname: finishPathname, params: { phoneId: phone.id, calledBy: phone.assigned?.name ?? '' } } as Href)
	}

	if (!phone) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Stack.Screen options={{ title: 'Telefone' }} />
				{loading ? (
					<ActivityIndicator size="large" color={colors.primary[600]} />
				) : (
					<Text className="font-regular text-foreground opacity-70">Esta designação não está mais disponível.</Text>
				)}
			</View>
		)
	}

	return (
		<View className="flex-1 bg-background px-4 pt-4" style={{ paddingBottom: insets.bottom + 16 }}>
			<Stack.Screen options={{ title: 'Telefone' }} />
			<View className="flex-1 gap-4">
				<View className="items-center gap-2 rounded-3xl bg-card px-4 py-8">
					<Text className="font-bold text-3xl text-foreground">{formatPhone(phone.number)}</Text>
					<PhoneCallInfo phone={phone} />
				</View>

				<View className="flex-row gap-2">
					<View className="flex-1">
						<Button onPress={() => open(getCallUrl(phone.number))} left={<PhoneCall size={20} color="white" />}>
							Ligar
						</Button>
					</View>
					<View className="flex-1">
						<Button
							variant="outline"
							onPress={() => open(getWhatsAppUrl(phone.number))}
							left={<MessageCircle size={20} color={colors.primary[600]} />}>
							WhatsApp
						</Button>
					</View>
				</View>
			</View>

			{!!phone.assigned && <Button onPress={onFinish}>Finalizar</Button>}
		</View>
	)
}

export default PhoneAssignment
