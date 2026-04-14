import { useSession } from '@/contexts/session-provider'
import { usePersonalAnnotations } from '@/hooks/use-personal-annotations'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { MessageCirclePlus, Save, Trash } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Button from './button'
import Input from './input'
import SheetModal from './sheet-modal'

type PersonalAnnotationProps = {
	map: Map
}

const PersonalAnnotation = ({ map }: PersonalAnnotationProps) => {
	const { current: user } = useSession()
	const { colors } = useThemedColors()
	const [showModal, setShowModal] = useState(false)
	const [annotationText, setAnnotationText] = useState('')

	const { annotation, isLoading, saveAnnotation, hasAnnotation } = usePersonalAnnotations(map.id, user?.id || '')

	useEffect(() => {
		if (annotation) {
			setAnnotationText(annotation)
		}
	}, [annotation])

	const handleSaveAnnotation = () => {
		const success = saveAnnotation(annotationText)
		if (success) {
			setShowModal(false)
		}
	}

	const showDeleteAlert = () => {
		Alert.alert('Excluir', 'Deseja excluir a anotação pessoal? Essa opção não pode ser revertida.', [
			{ text: 'Cancelar', style: 'cancel' },
			{ text: 'Sim, excluir', onPress: handleDeleteAnnotation, style: 'destructive' },
		])
	}

	const handleDeleteAnnotation = () => {
		saveAnnotation('')
		setAnnotationText('')
		setShowModal(false)
	}

	if (!user || isLoading) {
		return null
	}

	return (
		<>
			{hasAnnotation ? (
				<View className="my-4 rounded-xl border border-dashed border-border bg-card p-4">
					<View className="mb-2 flex-row items-start justify-between">
						<Text className="mb-2 font-semibold text-foreground">Anotação Pessoal</Text>
						<TouchableOpacity onPress={() => setShowModal(true)}>
							<Text className="font-medium text-sm text-primary">Editar</Text>
						</TouchableOpacity>
					</View>
					<Text className="font-regular leading-relaxed text-foreground">{annotation}</Text>
				</View>
			) : (
				<View className="my-4">
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => setShowModal(true)}
						className="flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-4">
						<MessageCirclePlus size={20} color={colors.foreground} />
						<Text className="font-medium text-foreground">Adicionar anotação pessoal</Text>
					</TouchableOpacity>
				</View>
			)}

			<SheetModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				title={hasAnnotation ? 'Editar Anotação' : 'Adicionar Anotação'}>
				<KeyboardAvoidingView
					keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
					className="flex-1"
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
					<ScrollView className="flex-1" contentContainerClassName="flex-1">
						<View className="flex-1 p-6">
							<Text className="mb-6 font-regular text-foreground">
								Adicione notas pessoais sobre este mapa que possam ajudá-lo no trabalho de campo.
							</Text>

							<Input
								label="Sua anotação"
								multiline
								numberOfLines={4}
								textAlignVertical="top"
								value={annotationText}
								onChangeText={setAnnotationText}
								placeholder="Ex: Rua muito movimentada de manhã, melhor visitar à tarde. Cachorro no portão da casa verde."
								className="min-h-[100px]"
							/>
						</View>

						<View className="flex-row gap-3 border-t border-card p-6">
							{hasAnnotation && (
								<Button
									variant="danger"
									className="flex-1"
									onPress={showDeleteAlert}
									left={<Trash size={20} color={colors.danger[600]} />}>
									Excluir
								</Button>
							)}
							<Button className="flex-1" onPress={handleSaveAnnotation} left={<Save size={20} color="white" />}>
								{hasAnnotation ? 'Salvar' : 'Adicionar'}
							</Button>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</SheetModal>
		</>
	)
}

export default PersonalAnnotation
