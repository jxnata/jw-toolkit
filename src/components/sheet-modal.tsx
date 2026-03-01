import { X } from 'lucide-react-native'
import { Modal, ModalProps, Text, TouchableOpacity, View } from 'react-native'

type Props = Pick<ModalProps, 'visible' | 'animationType' | 'presentationStyle'> & {
	title: string
	onClose: () => void
	children: React.ReactNode
}

const SheetModal = ({ visible, animationType = 'slide', presentationStyle = 'formSheet', title, onClose, children }: Props) => {
	return (
		<Modal visible={visible} animationType={animationType} presentationStyle={presentationStyle} onRequestClose={onClose}>
			<View className="flex-1 bg-background">
				<View className="flex-row items-center justify-between border-b border-border p-6">
					<Text className="font-bold text-2xl text-foreground">{title}</Text>
					<TouchableOpacity onPress={onClose}>
						<X size={24} className="text-muted-foreground" />
					</TouchableOpacity>
				</View>
				{children}
			</View>
		</Modal>
	)
}

export default SheetModal
