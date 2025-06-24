import { useThemedColors } from '@/hooks/use-themed-colors'
import { getLocationDistance } from '@/utils/get-location-distance'
import { mapImage } from '@/utils/map-image'
import { useQuery } from '@tanstack/react-query'
import { LocationObjectCoords } from 'expo-location'
import { Dimensions, Image, Pressable, Text, View } from 'react-native'

import { formatDate } from '@/utils/date-format'
import { firstName } from '@/utils/first-name'
import { useMemo } from 'react'
import { Models } from 'react-native-appwrite'

const screenWidth = Dimensions.get('screen').width

interface AssignmentProps {
	map: Models.Document
	location: LocationObjectCoords | null
	onPress?: () => void
	hidePublisher?: boolean
}

const AssignmentItem = ({ map, location, hidePublisher, onPress }: AssignmentProps) => {
	const { colors } = useThemedColors()
	const coordinates: [number, number] = [map.lat, map.lng]

	const found = useMemo(() => {
		if (map) {
			if (map.visited) {
				if (map.found) {
					return true
				}
			}
		}

		return false
	}, [map])

	const { data: distance } = useQuery({
		queryKey: ['distance', location?.latitude, location?.longitude, coordinates[0], coordinates[1]],
		queryFn: () => getLocationDistance(location, coordinates),
		enabled: !!location,
	})

	return (
		<Pressable onPress={onPress} className='flex flex-row mb-[5px] w-full rounded-[10px] bg-card p-2.5 gap-2.5'>
			<View className='flex'>
				<Image
					resizeMode='contain'
					source={{ uri: mapImage(coordinates) }}
					className='rounded-[10px] w-20 h-20'
				/>
			</View>

			<View className='flex'>
				{map.assigned && !hidePublisher && (
					<Text className='text-foreground font-medium'>{map.assigned.name}</Text>
				)}
				<Text className='text-foreground font-medium' style={{ width: screenWidth - 10 - 10 - 10 - 80 - 20 }}>
					{map.name} - {map.address}, {map.city.name}
				</Text>
				{!!map.visited ? (
					<View className='flex'>
						<Text className='font-regular text-xs pt-[5px]' style={{ color: colors.foreground + '80' }}>
							Visitado {map.visited_by ? `por ${firstName(map.visited_by)} ` : ''}em{' '}
							{formatDate(map.visited)}
						</Text>
						{found ? (
							<Text className='font-semibold text-xs pt-0' style={{ color: colors.success.DEFAULT }}>
								Encontrado
							</Text>
						) : (
							<Text className='font-semibold text-xs pt-0' style={{ color: colors.primary[600] }}>
								Não encontrado
							</Text>
						)}
					</View>
				) : (
					<Text className='font-regular text-xs pt-[5px]' style={{ color: colors.foreground + '80' }}>
						Ainda não visitado
					</Text>
				)}
			</View>

			<View
				className='absolute bottom-[5px] right-[5px] px-[5px] py-0.5 rounded-[5px]'
				style={{ backgroundColor: colors.background }}
			>
				<Text className='font-bold text-[10px]' style={{ color: colors.foreground + '80' }}>
					{distance}
				</Text>
			</View>
		</Pressable>
	)
}

export default AssignmentItem
