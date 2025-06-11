import { useThemedColors } from '@/hooks/use-themed-colors'
import { formatDate } from '@/utils/date-format'
import { getLocationDistance } from '@/utils/get-location-distance'
import { mapImage } from '@/utils/map-image'
import { useQuery } from '@tanstack/react-query'
import { LocationObjectCoords } from 'expo-location'
import { useMemo } from 'react'
import { Dimensions, Image, Pressable, Text, View } from 'react-native'

import { firstName } from '@/utils/first-name'
import { Models } from 'react-native-appwrite'

const screenWidth = Dimensions.get('screen').width

interface MapProps {
	map: Models.Document
	location: LocationObjectCoords | null
	onPress: () => void
}

const MapItem = ({ map, location, onPress }: MapProps) => {
	const { colors } = useThemedColors()

	const { data: distance } = useQuery({
		queryKey: ['distance', location?.latitude, location?.longitude, map.lat, map.lng],
		queryFn: () => getLocationDistance(location, [map.lat, map.lng]),
		enabled: !!location,
	})

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

	return (
		<Pressable onPress={onPress} className='flex flex-row mb-[5px] w-full rounded-[10px] bg-card p-2.5 gap-2.5'>
			{map.assigned ? (
				<View
					className='absolute top-[5px] right-[5px] px-[5px] py-0.5 rounded-[5px]'
					style={{ backgroundColor: colors.primary[600] }}
				>
					<Text className='font-semibold text-[10px] text-white'>DESIGNADO</Text>
				</View>
			) : (
				<View
					className='absolute top-[5px] right-[5px] px-[5px] py-0.5 rounded-[5px]'
					style={{ backgroundColor: colors.success.DEFAULT }}
				>
					<Text className='font-semibold text-[10px] text-white'>LIVRE</Text>
				</View>
			)}

			<View className='flex'>
				<Image
					resizeMode='contain'
					source={{ uri: mapImage([map.lat, map.lng]) }}
					className='rounded-[10px] w-20 h-20'
				/>
			</View>

			<View className='flex'>
				<Text
					className='text-foreground text-[15px] font-medium flex-wrap'
					style={{ maxWidth: screenWidth - 10 - 10 - 10 - 80 - 20 }}
				>
					{map.city.name} - {map.name}
				</Text>
				<Text
					numberOfLines={2}
					ellipsizeMode='tail'
					className='text-foreground text-[15px] font-medium flex-wrap'
					style={{ maxWidth: screenWidth - 10 - 10 - 10 - 80 - 20 }}
				>
					{map.address}
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

export default MapItem
