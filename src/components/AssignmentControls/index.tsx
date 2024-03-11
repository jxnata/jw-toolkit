import { Linking, Platform } from 'react-native'
import { IAssignment } from 'types/models/Assignment'

import * as S from './styles'

interface AssignmentProps {
	assignment: IAssignment
	onFinish: () => void
}

const AssignmentControls = ({ assignment, onFinish }: AssignmentProps) => {
	const navigate = async () => {
		if (typeof assignment.map !== 'object') return

		const destination = `${assignment.map.coordinates[0]},${assignment.map.coordinates[1]}`

		if (Platform.OS === 'ios' || Platform.OS === 'macos') {
			Linking.openURL(`http://maps.apple.com/?t=r&daddr=${destination}&dirflg=d&t=m`)
		} else {
			Linking.openURL(
				`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`
			)
		}
	}

	return (
		<S.Container>
			{typeof assignment.map === 'object' && (
				<S.Content>
					<S.Title>Endereço</S.Title>
					{typeof assignment.map.city !== 'string' && (
						<>
							<S.Paragraph>
								{assignment.map.address} - {assignment.map.city.name}
							</S.Paragraph>
							{!!assignment.map.details && <S.Paragraph>{assignment.map.details}</S.Paragraph>}
						</>
					)}
					<S.ButtonGroup>
						<S.ButtonPrimary onPress={navigate}>
							<S.Ionicon name='navigate-circle-outline' />
							<S.ButtonTitlePrimary>Ir para</S.ButtonTitlePrimary>
						</S.ButtonPrimary>
						<S.ButtonSecondary onPress={onFinish}>
							<S.ButtonTitleSecondary>Finalizar</S.ButtonTitleSecondary>
						</S.ButtonSecondary>
					</S.ButtonGroup>
				</S.Content>
			)}
		</S.Container>
	)
}

export default AssignmentControls
