import Button from '@/components/button'
import Input from '@/components/input'
import { FREE_LIMITS } from '@/constants/env'
import { useSession } from '@/contexts/session-provider'
import { error, success } from '@/messages/add'
import { congregationsService } from '@/services/instantdb'
import { Stack, router } from 'expo-router'
import { ArrowRight, Crown, Map, Save, Users } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

interface AddCongregationForm {
	name: string
}

const AddCongregation = () => {
	const { current } = useSession()
	const [showExplanation, setShowExplanation] = useState(true)
	const { control, formState, handleSubmit } = useForm<AddCongregationForm>({
		defaultValues: {
			name: '',
		},
	})

	const save: SubmitHandler<AddCongregationForm> = async (data) => {
		if (!data.name.trim()) return
		if (!current) return

		try {
			await congregationsService.createCongregation({
				name: data.name.trim(),
				enabled: true,
			})
			success('congregação')

			Alert.alert('Sucesso', 'Congregação criada, selecione-a na próxima tela.', [{ text: 'OK', onPress: () => router.back() }])
		} catch (err) {
			error('congregação')
			console.error('Failed to create congregation:', err)
		}
	}

	const handleContinueFree = () => {
		setShowExplanation(false)
	}

	const handleUpgradeToUnlimited = () => {
		router.push('/subscription')
		setShowExplanation(false)
	}

	if (showExplanation) {
		return (
			<Animated.View className="flex-1 bg-background" entering={FadeInDown}>
				<Stack.Screen options={{ title: 'Nova Congregação' }} />
				<ScrollView showsVerticalScrollIndicator={false}>
					<View className="flex-1 justify-center p-4">
						<View className="mb-8 items-center">
							<View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary-100">
								<Map size={32} color="#bb7424" />
							</View>
							<Text className="mb-2 text-center font-bold text-2xl text-foreground">Bem-vindo ao LS Maps</Text>
							<Text className="text-center font-regular leading-6 text-foreground opacity-80">
								O objetivo do app é ajudar as congregações de idioma estrangeiro a gerenciarem seus mapas e designações para
								pregação de forma eficiente e organizada.
							</Text>
						</View>

						<View className="mb-4 rounded-lg border border-border bg-card p-4">
							<Text className="mb-3 font-semibold text-lg text-foreground">Limitações da Versão Gratuita</Text>
							<View className="space-y-3">
								<View className="flex-row items-center">
									<Users size={20} color="#bb7424" />
									<Text className="ml-3 flex-1 text-foreground">
										<Text className="font-semibold">{FREE_LIMITS.publishers} publicadores</Text> por congregação
									</Text>
								</View>
								<View className="flex-row items-center">
									<Map size={20} color="#bb7424" />
									<Text className="ml-3 flex-1 text-foreground">
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
								Armazenar e disponibilizar todos esses dados online de forma rápida custa caro. Ao adquirir a versão Pro,
								você ajuda a manter o aplicativo ativo para outras congregações e usa sem limitações.
							</Text>
							<Text className="font-medium text-foreground">✨ 1 mês grátis para testar</Text>
						</View>

						<View className="gap-3">
							<Button
								onPress={handleUpgradeToUnlimited}
								className="bg-primary"
								left={<Crown size={16} color="#ffffff" />}
								right={<ArrowRight size={16} color="#ffffff" />}>
								Usar Versão Ilimitada
							</Button>

							<Button onPress={handleContinueFree} variant="outline">
								Continuar com Versão Gratuita
							</Button>
						</View>
					</View>
				</ScrollView>
			</Animated.View>
		)
	}

	return (
		<KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Stack.Screen options={{ title: 'Nova Congregação' }} />
			<View className="flex h-full w-full bg-background px-4 py-2">
				<Controller
					control={control}
					rules={{ required: true, minLength: 2 }}
					name="name"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label="Nome da Congregação"
							placeholder="Digite o nome da congregação"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							autoCapitalize="words"
							autoCorrect={false}
						/>
					)}
				/>

				<Button
					disabled={!formState.isValid}
					loading={formState.isSubmitting}
					onPress={handleSubmit(save)}
					left={<Save size={16} color="#ffffff" />}>
					Salvar Congregação
				</Button>
			</View>
		</KeyboardAvoidingView>
	)
}

export default AddCongregation
