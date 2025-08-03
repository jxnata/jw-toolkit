import { useThemedColors } from '@/hooks/use-themed-colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from 'expo-router'
import React from 'react'
import { Linking, Platform, Text, TouchableOpacity, View } from 'react-native'

interface AssignmentProps {
	assignment: any
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
			Linking.openURL(
				`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`
			)
		}
	}

	return (
		<View className='absolute bottom-10 w-full px-2'>
			<View className='px-4 py-2 rounded-[10px] bg-background gap-2'>
				<Text className='pt-2 text-foreground text-base font-bold'>Endereço</Text>
				<Text className='text-foreground text-base font-medium'>
					{assignment.address} - {assignment.city.name}
				</Text>
				{!!assignment.details && (
					<Text className='text-foreground text-base font-medium'>{assignment.details}</Text>
				)}
				<View className='flex-row gap-2 mt-2'>
					<TouchableOpacity
						onPress={navigate}
						className='gap-[5px] flex flex-row items-center justify-center flex-1 py-[15px] px-5 rounded-xl bg-primary-600 text-[15px] mb-2'
					>
						<Ionicons name='navigate-circle-outline' size={24} color='white' />
						<Text className='text-white text-[15px] font-bold'>Ir para</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={onFinish}
						className='gap-[5px] flex flex-row items-center justify-center flex-1 py-[15px] px-5 rounded-xl text-[15px] mb-2'
						style={{ backgroundColor: colors.card }}
					>
						<Text className='text-[15px] font-bold' style={{ color: colors.primary[600] }}>
							Finalizar
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default AssignmentControls
