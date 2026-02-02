import { useSession } from '@/contexts/session-provider'
import { usePersonalAnnotations } from '@/hooks/use-personal-annotations'
import { Map } from '@/interfaces'
import { MessageCirclePlus, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import Input from './input'
import Button from './button'

type PersonalAnnotationProps = {
	map: Map
}

const PersonalAnnotation = ({ map }: PersonalAnnotationProps) => {
	const { current: user } = useSession()
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
				<View className="m-4 rounded-xl border border-border bg-card p-4">
					<View className="mb-2 flex-row items-start justify-between">
						<Text className="mb-2 font-semibold text-foreground">Anotação Pessoal</Text>
						<TouchableOpacity onPress={() => setShowModal(true)}>
							<Text className="font-medium text-sm text-primary">Editar</Text>
						</TouchableOpacity>
					</View>
					<Text className="leading-relaxed text-foreground">{annotation}</Text>
				</View>
			) : (
				<View className="m-4">
					<TouchableOpacity
						onPress={() => setShowModal(true)}
						className="flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-4">
						<MessageCirclePlus size={20} className="text-muted-foreground" />
						<Text className="text-muted-foreground font-medium">Adicionar anotação pessoal</Text>
					</TouchableOpacity>
				</View>
			)}

			<Modal visible={showModal} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setShowModal(false)}>
				<View className="flex-1 bg-background">
					<View className="flex-row items-center justify-between border-b border-border p-6">
						<Text className="font-bold text-2xl text-foreground">
							{hasAnnotation ? 'Editar Anotação' : 'Adicionar Anotação'}
						</Text>
						<TouchableOpacity onPress={() => setShowModal(false)}>
							<X size={24} className="text-muted-foreground" />
						</TouchableOpacity>
					</View>

					<View className="flex-1 p-6">
						<Text className="text-muted-foreground mb-4">
							Adicione notas pessoais sobre este mapa que possam ajudá-lo no trabalho de campo.
						</Text>

						<Input
							label="Sua anotação"
							multiline
							numberOfLines={8}
							textAlignVertical="top"
							value={annotationText}
							onChangeText={setAnnotationText}
							placeholder="Ex: Rua muito movimentada de manhã, melhor visitar à tarde. Cachorro no portão da casa verde."
							className="min-h-[200px]"
						/>
					</View>

					<View className="flex-row gap-3 border-t border-border p-6">
						{hasAnnotation && <Button title="Excluir" variant="outline" className="flex-1" onPress={handleDeleteAnnotation} />}
						<Button title={hasAnnotation ? 'Salvar' : 'Adicionar'} className="flex-1" onPress={handleSaveAnnotation} />
					</View>
				</View>
			</Modal>
		</>
	)
}

export default PersonalAnnotation
