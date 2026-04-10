import { useThemedColors } from '@/hooks/use-themed-colors'
import { formatDate } from '@/utils/date-format'
import { getLocationDistance } from '@/utils/get-location-distance'
import { mapImage } from '@/utils/map-image'
import { useQuery } from '@tanstack/react-query'
import { LocationObjectCoords } from 'expo-location'
import { useMemo } from 'react'
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'

import { MAP_STATUS_LABELS, STATUS_NAME } from '@/constants/content'
import { useSession } from '@/contexts/session-provider'
import { usePersonalAnnotations } from '@/hooks/use-personal-annotations'
import { Map } from '@/interfaces'
import { firstName } from '@/utils/first-name'
import { getBadgeColor } from '@/utils/get-badge-color'

const screenWidth = Dimensions.get('screen').width
// horizontal padding (10+10) + gap (10) + thumbnail (80) + badge margin (20)
const TEXT_MAX_WIDTH = screenWidth - 130

interface MapProps {
	map: Map
	location: LocationObjectCoords | null
	onPress: () => void
	selectionMode?: boolean
	selected?: boolean
	onToggleSelect?: (id: string) => void
}

const MapItem = ({ map, location, onPress, selectionMode, selected, onToggleSelect }: MapProps) => {
	const { colors } = useThemedColors()
	const { current } = useSession()
	const { hasAnnotation, annotation } = usePersonalAnnotations(map.id, current!.id)

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

	const handlePress = () => {
		if (selectionMode && !map.group_code) {
			onToggleSelect?.(map.id)
		} else if (!selectionMode) {
			onPress()
		}
	}

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={handlePress} className="mb-2">
			<View className="flex w-full flex-row gap-2.5 rounded-xl border border-border bg-card p-2.5">
				{selectionMode && !map.group_code && (
					<View className="justify-center pr-1">
						<View
							className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selected ? 'border-primary bg-primary' : 'border-border bg-transparent'}`}>
							{selected && <View className="h-2 w-2 rounded-full bg-white" />}
						</View>
					</View>
				)}
				{map.assigned ? (
					<View
						className="absolute bottom-2 right-2 z-10 rounded-[5px] px-[5px] py-0.5"
						style={{ backgroundColor: colors.primary[600] }}>
						<Text className="font-semibold text-[10px] text-white">{MAP_STATUS_LABELS.ASSIGNED}</Text>
					</View>
				) : (
					<View
						className="absolute bottom-2 right-2 z-10 rounded-[5px] px-[5px] py-0.5"
						style={{ backgroundColor: colors.success.DEFAULT }}>
						<Text className="font-semibold text-[10px] text-white">{MAP_STATUS_LABELS.FREE}</Text>
					</View>
				)}

				<View className="flex">
					<Image resizeMode="contain" source={{ uri: mapImage([map.lat, map.lng]) }} className="h-20 w-20 rounded-[10px]" />
				</View>

				<View className="flex-1 flex-col gap-1">
					<Text className="flex-wrap font-medium text-foreground" style={{ maxWidth: TEXT_MAX_WIDTH }}>
						{map.city.name} - {map.name}
					</Text>
					<Text
						numberOfLines={2}
						ellipsizeMode="tail"
						className="flex-wrap font-medium text-foreground"
						style={{ maxWidth: TEXT_MAX_WIDTH }}>
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

			</View>
			{hasAnnotation && (
				<View className="mx-2 rounded-bl-xl rounded-br-xl border border-t-0 border-dashed border-border bg-card px-3 py-2">
					<Text className="font-medium text-xs text-foreground">{annotation}</Text>
				</View>
			)}
		</TouchableOpacity>
	)
}

export default MapItem
