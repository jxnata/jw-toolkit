import { useThemedColors } from '@/hooks/use-themed-colors'
import { getLocationDistance } from '@/utils/get-location-distance'
import { mapImage } from '@/utils/map-image'
import { useQuery } from '@tanstack/react-query'
import { LocationObjectCoords } from 'expo-location'
import { Dimensions, Image, Pressable, Text, View } from 'react-native'

import { Map } from '@/interfaces'
import { formatDate } from '@/utils/date-format'
import { firstName } from '@/utils/first-name'
import { useMemo } from 'react'

const screenWidth = Dimensions.get('screen').width

interface AssignmentProps {
	map: Map
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
		queryKey: [
			'distance',
			location?.latitude.toFixed(4),
			location?.longitude.toFixed(4),
			coordinates[0].toFixed(4),
			coordinates[1].toFixed(4),
		],
		queryFn: () => getLocationDistance(location, coordinates),
		enabled: !!location,
	})

	return (
		<Pressable onPress={onPress} className="mb-[5px] flex w-full flex-row gap-2.5 rounded-[10px] bg-card p-2.5">
			<View className="flex">
				<Image resizeMode="contain" source={{ uri: mapImage(coordinates) }} className="h-20 w-20 rounded-[10px]" />
			</View>

			<View className="flex">
				{map.assigned && !hidePublisher && <Text className="font-medium text-foreground">{map.assigned.name}</Text>}
				<Text className="font-medium text-foreground" style={{ width: screenWidth - 10 - 10 - 10 - 80 - 20 }}>
					{map.name} - {map.address}, {map.city.name}
				</Text>
				{!!map.visited ? (
					<View className="flex">
						<Text className="pt-[5px] font-regular text-xs" style={{ color: colors.foreground + '80' }}>
							Visitado {map.visited_by ? `por ${firstName(map.visited_by)} ` : ''}em {formatDate(map.visited)}
						</Text>
						{found ? (
							<Text className="pt-0 font-semibold text-xs" style={{ color: colors.success.DEFAULT }}>
								Encontrado
							</Text>
						) : (
							<Text className="pt-0 font-semibold text-xs" style={{ color: colors.primary[600] }}>
								Não encontrado
							</Text>
						)}
					</View>
				) : (
					<Text className="pt-[5px] font-regular text-xs" style={{ color: colors.foreground + '80' }}>
						Ainda não visitado
					</Text>
				)}
			</View>

			<View
				className="absolute bottom-[5px] right-[5px] rounded-[5px] px-[5px] py-0.5"
				style={{ backgroundColor: colors.background }}>
				<Text className="font-bold text-[10px]" style={{ color: colors.foreground + '80' }}>
					{distance}
				</Text>
			</View>
		</Pressable>
	)
}

export default AssignmentItem
