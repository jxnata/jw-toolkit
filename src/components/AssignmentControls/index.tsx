import { Linking, Platform } from 'react-native'
import { useNavigation } from 'expo-router'
import React from 'react'

import * as S from './styles'
import { Models } from 'react-native-appwrite'

interface AssignmentProps {
	assignment: Models.Document
	onFinish: () => void
}

const AssignmentControls = ({ assignment, onFinish }: AssignmentProps) => {
	const navigation = useNavigation()

	React.useEffect(() => {
		navigation.setOptions({
			title: assignment.name,
		})
	}, [assignment.name, navigation])

	const navigate = async () => {
		const destination = `${assignment.lat},${assignment.lng}`

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
			<S.Content>
				<S.Title>Endereço</S.Title>
				<S.Paragraph>
					{assignment.address} - {assignment.city.name}
				</S.Paragraph>
				{!!assignment.details && <S.Paragraph>{assignment.details}</S.Paragraph>}
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
		</S.Container>
	)
}

export default AssignmentControls
