import { useSession } from '@/contexts/session-provider'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { error, success } from '@/messages/edit'
import { phonesService } from '@/services/instantdb'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Step = 'question' | 'details'

const questionOptions = [
	{
		value: 'yes',
		icon: '',
		iconColor: '#719453',
		bgColor: 'bg-success/10',
		title: 'Sim',
		description: 'A pessoa atendeu ou respondeu',
	},
	{
		value: 'no',
		icon: '',
		iconColor: '#bf616a',
		bgColor: 'bg-danger/10',
		title: 'Não',
		description: 'Ninguém atendeu ou respondeu',
	},
]

const answeredOptions = [
	{ value: 'Falei com o surdo', title: 'Falei com o surdo', description: 'A pessoa surda atendeu ou respondeu' },
	{ value: 'Falei com um familiar', title: 'Falei com um familiar', description: 'Um familiar atendeu ou respondeu' },
	{
		value: 'Convidei para a Celebração',
		title: 'Convidei para a Celebração',
		description: 'Enviou convite para a Celebração da Morte de Cristo',
	},
	{ value: 'Convidei para o Congresso', title: 'Convidei para o Congresso', description: 'Enviou convite para o Congresso' },
	{ value: 'Outro', title: 'Outro', description: 'Outra situação ocorreu' },
].map((option) => ({ ...option, icon: '', iconColor: '#bb7424', bgColor: 'bg-primary/10' }))

// Finish flow of a phone territory, shared by the admin ("my assignments") and publisher stacks
const PhoneFinish = () => {
	const { phoneId, calledBy } = useLocalSearchParams<{ phoneId: string; calledBy: string }>()
	const router = useRouter()
	const { publisher } = useSession()
	const { colors } = useThemedColors()
	const insets = useSafeAreaInsets()
	const [step, setStep] = useState<Step>('question')
	const [selected, setSelected] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const save = async (answered: boolean, answeredInfo?: string) => {
		if (!publisher || !phoneId) return

		setLoading(true)
		try {
			await phonesService.finishPhone(phoneId, publisher.id, {
				answered,
				answered_info: answeredInfo,
				called_by: calledBy || publisher.name,
			})
			success('designação')
			router.dismiss(2)
		} catch (err) {
			error('designação')
			console.error('Failed to finish phone assignment:', err)
		} finally {
			setLoading(false)
		}
	}

	const handleFinish = () => {
		if (!selected) return

		if (step === 'question') {
			if (selected === 'yes') {
				setSelected(null)
				setStep('details')
			} else {
				save(false)
			}
		} else {
			save(true, selected)
		}
	}

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator size="large" color={colors.primary[600]} />
				<Text className="mt-4 font-semibold text-base text-foreground">Salvando...</Text>
			</View>
		)
	}

	const options = step === 'question' ? questionOptions : answeredOptions
	const title = step === 'question' ? 'Conseguiu falar com alguém?' : 'O que aconteceu?'

	return (
		<View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
			<Stack.Screen options={{ title: 'Finalizar designação' }} />
			<View className="flex-1 justify-between px-6 py-4">
				<View className="gap-6">
					<Text className="font-bold text-2xl text-foreground">{title}</Text>

					<View className="gap-3">
						{options.map((option) => {
							const isSelected = selected === option.value
							return (
								<TouchableOpacity
									key={option.value}
									activeOpacity={0.8}
									onPress={() => setSelected(option.value)}
									className={`flex-row items-center gap-4 rounded-2xl border-2 p-4 ${
										isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
									}`}>
									<View className={`size-12 items-center justify-center rounded-full p-2 ${option.bgColor}`}>
										<Text className="font-icons text-2xl" style={{ color: option.iconColor }}>
											{option.icon}
										</Text>
									</View>
									<View className="flex-1">
										<Text className="font-bold text-base text-foreground">{option.title}</Text>
										<Text className="font-regular text-sm text-foreground opacity-60">{option.description}</Text>
									</View>
								</TouchableOpacity>
							)
						})}
					</View>
				</View>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={handleFinish}
					disabled={!selected}
					className={`w-full items-center rounded-2xl py-4 ${selected ? 'bg-primary' : 'bg-border'}`}>
					<Text className="font-bold text-[15px] text-white">Finalizar</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default PhoneFinish
