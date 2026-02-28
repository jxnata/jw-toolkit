import { useThemedColors } from '@/hooks/use-themed-colors'
import { formatDate } from '@/utils/date-format'
import { getLocationDistance } from '@/utils/get-location-distance'
import { mapImage } from '@/utils/map-image'
import { useQuery } from '@tanstack/react-query'
import { LocationObjectCoords } from 'expo-location'
import { useMemo } from 'react'
import { Dimensions, Image, Pressable, Text, View } from 'react-native'

import { STATUS_NAME } from '@/constants/content'
import { Map } from '@/interfaces'
import { firstName } from '@/utils/first-name'
import { getBadgeColor } from '@/utils/get-badge-color'

const screenWidth = Dimensions.get('screen').width

interface MapProps {
	map: Map
	location: LocationObjectCoords | null
	onPress: () => void
	extraMapsCount?: number
}

const MapItem = ({ map, location, onPress, extraMapsCount }: MapProps) => {
	const { colors } = useThemedColors()

	const { data: distance } = useQuery({
		queryKey: ['distance', location?.latitude.toFixed(4), location?.longitude.toFixed(4), map.lat.toFixed(4), map.lng.toFixed(4)],
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
		<Pressable onPress={onPress} className="mb-2 flex w-full flex-row gap-2.5 rounded-lg bg-card p-2.5">
			{map.assigned ? (
				<View
					className="absolute bottom-2 right-2 z-10 rounded-[5px] px-[5px] py-0.5"
					style={{ backgroundColor: colors.primary[600] }}>
					<Text className="font-semibold text-[10px] text-white">DESIGNADO</Text>
				</View>
			) : (
				<View
					className="absolute bottom-2 right-2 z-10 rounded-[5px] px-[5px] py-0.5"
					style={{ backgroundColor: colors.success.DEFAULT }}>
					<Text className="font-semibold text-[10px] text-white">LIVRE</Text>
				</View>
			)}

			<View className="flex">
				<Image resizeMode="contain" source={{ uri: mapImage([map.lat, map.lng]) }} className="h-20 w-20 rounded-[10px]" />
			</View>

			<View className="flex-1 flex-col gap-1">
				<Text className="flex-wrap font-medium text-foreground" style={{ maxWidth: screenWidth - 10 - 10 - 10 - 80 - 20 }}>
					{map.city.name} - {map.name}
				</Text>
				<Text
					numberOfLines={2}
					ellipsizeMode="tail"
					className="flex-wrap font-medium text-foreground"
					style={{ maxWidth: screenWidth - 10 - 10 - 10 - 80 - 20 }}>
					{map.address}
				</Text>
				{!!map.visited ? (
					<View className="flex">
						<Text className="font-regular text-xs" style={{ color: colors.foreground + '80' }}>
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
				{map.tag && (
					<View className={`${getBadgeColor(map.tag)} absolute -right-1 -top-1 rounded-xl px-2 py-1`}>
						<Text className="font-medium text-xs text-white">{STATUS_NAME[map.tag as keyof typeof STATUS_NAME]}</Text>
					</View>
				)}
			</View>

			<View className="absolute bottom-2 left-2 rounded-[5px] px-2 py-0.5" style={{ backgroundColor: colors.background }}>
				<Text className="font-bold text-[10px]" style={{ color: colors.foreground + '80' }}>
					{distance}
				</Text>
			</View>

			{!!extraMapsCount && extraMapsCount > 0 && (
				<View className="absolute bottom-10 right-2">
					<Text className="font-medium text-[10px]" style={{ color: colors.foreground + '80' }}>
						+{extraMapsCount} {extraMapsCount === 1 ? 'mapa adicional' : 'mapas adicionais'}
					</Text>
				</View>
			)}
		</Pressable>
	)
}

export default MapItem
