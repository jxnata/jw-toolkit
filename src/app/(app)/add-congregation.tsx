import Button from '@/components/button'
import Input from '@/components/input'
import { useSession } from '@/contexts/session-provider'
import useCongregations from '@/hooks/use-congregations'
import { error, success } from '@/messages/add'
import { congregationsService } from '@/services/instantdb'
import { Stack, router } from 'expo-router'
import { ArrowRight, Crown, Map, Save, Users } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

interface AddCongregationForm {
	name: string
}

const AddCongregation = () => {
	const { current } = useSession()
	const { mutate } = useCongregations()
	const [showExplanation, setShowExplanation] = useState(true)
	const { control, formState, handleSubmit } = useForm<AddCongregationForm>({
		defaultValues: {
			name: '',
		},
	})

	const save: SubmitHandler<AddCongregationForm> = async data => {
		if (!data.name.trim()) return
		if (!current) return

		try {
			await congregationsService.createCongregation({
				name: data.name.trim(),
				enabled: true,
			})
			success('congregação')
			mutate()
			router.back()
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
			<Animated.View className='flex-1 bg-background' entering={FadeInDown}>
				<Stack.Screen options={{ title: 'Nova Congregação' }} />
				<ScrollView showsVerticalScrollIndicator={false}>
					<View className='flex-1 justify-center p-4'>
						<View className='items-center mb-8'>
							<View className='w-16 h-16 bg-primary-100 rounded-full items-center justify-center mb-4'>
								<Map size={32} color='#bb7424' />
							</View>
							<Text className='text-2xl font-bold text-foreground text-center mb-2'>
								Bem-vindo ao LS Maps
							</Text>
							<Text className='font-regular text-foreground opacity-80 text-center leading-6'>
								O objetivo do app é ajudar as congregações de idioma estrangeiro a gerenciarem seus
								mapas e designações para pregação de forma eficiente e organizada.
							</Text>
						</View>

						<View className='bg-card border border-border rounded-lg p-4 mb-4'>
							<Text className='text-lg font-semibold text-foreground mb-3'>
								Limitações da Versão Gratuita
							</Text>
							<View className='space-y-3'>
								<View className='flex-row items-center'>
									<Users size={20} color='#bb7424' />
									<Text className='text-foreground ml-3 flex-1'>
										<Text className='font-semibold'>30 publicadores</Text> por congregação
									</Text>
								</View>
								<View className='flex-row items-center'>
									<Map size={20} color='#bb7424' />
									<Text className='text-foreground ml-3 flex-1'>
										<Text className='font-semibold'>75 mapas</Text> por congregação
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
								Armazenar e disponibilizar todos esses dados online de forma rápida custa caro. Ao
								adquirir a versão Pro, você ajuda a manter o aplicativo ativo para outras congregações e
								usa sem limitações.
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
								Usar Versão Ilimitada
							</Button>

							<Button onPress={handleContinueFree} variant='outline'>
								Continuar com Versão Gratuita
							</Button>
						</View>
					</View>
				</ScrollView>
			</Animated.View>
		)
	}

	return (
		<KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<Stack.Screen options={{ title: 'Nova Congregação' }} />
			<View className='flex px-4 py-2 w-full h-full bg-background'>
				<Controller
					control={control}
					rules={{ required: true, minLength: 2 }}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							label='Nome da Congregação'
							placeholder='Digite o nome da congregação'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							autoCapitalize='words'
							autoCorrect={false}
						/>
					)}
				/>

				<Button
					disabled={!formState.isValid}
					loading={formState.isSubmitting}
					onPress={handleSubmit(save)}
					left={<Save size={16} color='#ffffff' />}
				>
					Salvar Congregação
				</Button>
			</View>
		</KeyboardAvoidingView>
	)
}

export default AddCongregation
