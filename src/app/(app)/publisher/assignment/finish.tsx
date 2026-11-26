import { foundOptions, notFoundOptions, questionOptions } from '@/constants/visit-results'
import { useSession } from '@/contexts/session-provider'
import useMyAssignments from '@/hooks/use-my-assignments'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { error, success } from '@/messages/edit'
import { mapsService } from '@/services/instantdb'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Step = 'question' | 'found' | 'not_found'

const steps = {
	question: { title: 'Encontrou alguém em casa?', options: questionOptions },
	found: { title: 'O que aconteceu?', options: foundOptions },
	not_found: { title: 'Por que não encontrou?', options: notFoundOptions },
}

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
	const [selected, setSelected] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const save = async (found: boolean, found_info: string) => {
		setLoading(true)
		try {
			if (!publisher) return
			if (!assignmentId) return

			await mapsService.updateMap(assignmentId, {
				found,
				found_info,
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

	const handleFinish = () => {
		if (!selected) return

		if (step === 'question') {
			setSelected(null)
			setStep(selected === 'yes' ? 'found' : 'not_found')
		} else {
			save(step === 'found', selected)
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

	const { title, options } = steps[step]

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

				<View className="gap-3">
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={handleFinish}
						disabled={!selected}
						className={`w-full items-center rounded-2xl py-4 ${selected ? 'bg-primary' : 'bg-border'}`}>
						<Text className="font-bold text-[15px] text-white">{step === 'question' ? 'Continuar' : 'Finalizar'}</Text>
					</TouchableOpacity>
					{step !== 'question' && (
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								setSelected(null)
								setStep('question')
							}}
							className="w-full items-center py-2">
							<Text className="font-semibold text-[15px] text-foreground opacity-60">Voltar</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>
		</View>
	)
}

export default FinishAssignment
