import { useState } from 'react'
import { Dimensions, Modal } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import * as S from './styles'

type Props = {
	data: string
}

const qrSize = Dimensions.get('screen').width * 0.8

const AssignmentCode = ({ data }: Props) => {
	const [open, setOpen] = useState(false)

	const toggle = () => {
		setOpen(old => !old)
	}

	return (
		<S.QRContainer>
			<S.QRIcon onPress={toggle}>
				<S.Ionicon name='qr-code-outline' />
			</S.QRIcon>
			<Modal animationType='fade' transparent visible={open} onRequestClose={toggle}>
				<S.Container onPress={toggle}>
					<S.Content>
						<QRCode size={qrSize} value={data} />
					</S.Content>
				</S.Container>
			</Modal>
		</S.QRContainer>
	)
}

export default AssignmentCode
