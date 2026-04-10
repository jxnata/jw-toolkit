import { useSession } from '@/contexts/session-provider'
import useMyAssignments from '@/hooks/use-my-assignments'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { error, success } from '@/messages/edit'
import { mapsService } from '@/services/instantdb'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Circle, EarOff, Users } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Step = 'question' | 'details'

const foundOptions = [
	{ value: 'Encontrou o surdo', icon: <EarOff size={20} color="white" /> },
	{ value: 'Encontrou um familiar', icon: <Users size={20} color="white" /> },
	{ value: 'Outro', icon: <Circle size={20} color="white" /> },
]

const FinishAssignment = () => {
	const { assignmentId, assignmentName } = useLocalSearchParams<{
		assignmentId: string
		assignmentName: string
	}>()
	const router = useRouter()
	const { publisher } = useSession()
	const { mutate } = useMyAssignments()
	const { colors } = useThemedColors()
	const insets = useSafeAreaInsets()
	const [step, setStep] = useState<Step>('question')
	const [loading, setLoading] = useState(false)

	const save = async (found: boolean, found_info: string | null) => {
		setLoading(true)
		try {
			if (!publisher) return
			if (!assignmentId) return

			await mapsService.updateMap(assignmentId, {
				found,
				found_info: found_info ?? undefined,
				visited: new Date().toISOString(),
				visited_by: assignmentName || '',
			})

			await mapsService.unassignMap(assignmentId, publisher.id)

			success('designação')
			mutate()
			router.dismiss(2)
		} catch (err) {
			error('designação')
			console.error('Failed to update assignment:', err)
		} finally {
			setLoading(false)
		}
	}

	const handleNo = () => save(false, null)
	const handleYes = () => setStep('details')
	const handleOption = (option: string) => save(true, option)

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator size="large" color={colors.primary[600]} />
				<Text className="mt-4 font-semibold text-base text-foreground">Salvando...</Text>
			</View>
		)
	}

	return (
		<View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
			<Stack.Screen options={{ title: 'Finalizar designação' }} />
			<View className="flex-1 items-center justify-center px-6">
				{step === 'question' && (
					<View className="w-full items-center gap-6">
						<Text className="font-bold text-2xl text-foreground">Encontrou alguém em casa?</Text>

						<View className="w-full gap-3">
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={handleYes}
								className="w-full items-center rounded-xl bg-success-500 py-5">
								<Text className="font-bold text-[15px] text-white">Sim</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={0.8}
								onPress={handleNo}
								className="w-full items-center rounded-xl bg-danger-500 py-5">
								<Text className="font-bold text-[15px] text-white">Não</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{step === 'details' && (
					<View className="w-full items-center gap-6">
						<Text className="font-bold text-2xl text-foreground">O que aconteceu?</Text>

						<View className="w-full gap-3">
							{foundOptions.map((option) => (
								<TouchableOpacity
									key={option.value}
									onPress={() => handleOption(option.value)}
									className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary-600 py-5">
									{option.icon}
									<Text className="font-bold text-[15px] text-white">{option.value}</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)}
			</View>
		</View>
	)
}

export default FinishAssignment
