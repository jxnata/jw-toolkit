import { useThemedColors } from '@/hooks/use-themed-colors'
import { X } from 'lucide-react-native'
import { Modal, ModalProps, Platform, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = Pick<ModalProps, 'visible' | 'animationType' | 'presentationStyle'> & {
	title: string
	onClose: () => void
	children: React.ReactNode
}

const SheetModal = ({ visible, animationType = 'slide', presentationStyle = 'formSheet', title, onClose, children }: Props) => {
	const { colors } = useThemedColors()
	const insets = useSafeAreaInsets()

	return (
		<Modal visible={visible} animationType={animationType} presentationStyle={presentationStyle} onRequestClose={onClose}>
			<View
				className="flex-1 bg-background"
				style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0, paddingBottom: insets.bottom }}>
				<View className="flex-row items-center justify-between border-b border-border p-6">
					<Text className="font-bold text-2xl text-foreground">{title}</Text>
					<TouchableOpacity onPress={onClose}>
						<X size={24} color={colors.foreground} />
					</TouchableOpacity>
				</View>
				{children}
			</View>
		</Modal>
	)
}

export default SheetModal
