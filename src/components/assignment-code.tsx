import { useThemedColors } from '@/hooks/use-themed-colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useState } from 'react'
import { Dimensions, Modal, Pressable, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

type Props = {
	data: string
}

const qrSize = Dimensions.get('screen').width * 0.8
const { width } = Dimensions.get('window')

const AssignmentCode = ({ data }: Props) => {
	const [open, setOpen] = useState(false)
	const { colors } = useThemedColors()

	const toggle = () => {
		setOpen(old => !old)
	}

	return (
		<View className='mb-2.5'>
			<Pressable onPress={toggle} className='flex-row justify-center items-center'>
				<Ionicons name='qr-code-outline' size={48} color={colors.foreground + '80'} />
			</Pressable>
			<Modal animationType='fade' transparent visible={open} onRequestClose={toggle}>
				<Pressable
					onPress={toggle}
					className='flex justify-center w-full h-full'
					style={{ backgroundColor: colors.background + 'ca' }}
				>
					<View className='w-full justify-center items-center bg-white rounded-xl' style={{ height: width }}>
						<QRCode size={qrSize} value={data} />
					</View>
				</Pressable>
			</Modal>
		</View>
	)
}

export default AssignmentCode
