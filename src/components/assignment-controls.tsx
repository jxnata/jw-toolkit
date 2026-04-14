import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { useNavigation } from 'expo-router'
import { MapPin } from 'lucide-react-native'
import React from 'react'
import { Linking, Platform, Text, TouchableOpacity, View } from 'react-native'
import PersonalAnnotation from './personal-annotation'

interface AssignmentMap {
	id: string
	name: string
	lat: number
	lng: number
	address: string
	details?: string
	district?: string
	city?: { name: string }
	found?: boolean | null
	found_info?: string | null
}

interface AssignmentProps {
	assignment: AssignmentMap
	onFinish: () => void
}

const AssignmentControls = ({ assignment, onFinish }: AssignmentProps) => {
	const navigation = useNavigation()
	const { colors } = useThemedColors()

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
			Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`)
		}
	}

	return (
		<View className="absolute bottom-10 w-full px-2">
			<View className="gap-1 rounded-3xl bg-background px-4 py-2">
				<Text className="pt-2 font-bold text-base text-foreground">Endereço</Text>
				<Text className="font-medium text-base text-foreground">{assignment.address}</Text>
				{!!assignment.district && <Text className="font-medium text-base text-foreground">{assignment.district}</Text>}
				<Text className="font-medium text-base text-foreground">{assignment.city?.name}</Text>
				{!!assignment.details && <Text className="font-medium text-base text-foreground">{assignment.details}</Text>}
				{!!assignment.found && (
					<Text className="font-semibold text-xs text-success">
						Encontrado {!!assignment.found_info && '- ' + assignment.found_info}
					</Text>
				)}

				<PersonalAnnotation map={assignment as Map} />

				<View className="mt-2 flex-row gap-2">
					<TouchableOpacity
						onPress={navigate}
						className="mb-2 flex flex-1 flex-row items-center justify-center gap-[5px] rounded-xl bg-primary-600 px-5 py-[15px] text-[15px]">
						<MapPin size={24} color="white" />
						<Text className="font-bold text-[15px] text-white">Ir para</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={onFinish}
						className="mb-2 flex flex-1 flex-row items-center justify-center gap-[5px] rounded-xl px-5 py-[15px] text-[15px]"
						style={{ backgroundColor: colors.card }}>
						<Text className="font-bold text-[15px]" style={{ color: colors.primary[600] }}>
							Finalizar
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default AssignmentControls
