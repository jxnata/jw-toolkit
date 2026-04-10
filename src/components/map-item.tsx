import { useThemedColors } from '@/hooks/use-themed-colors'
import { formatDate } from '@/utils/date-format'
import { getLocationDistance } from '@/utils/get-location-distance'
import { useQuery } from '@tanstack/react-query'
import { LocationObjectCoords } from 'expo-location'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'

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

	const found = !!(map?.visited && map.found)

	const handlePress = () => {
		if (selectionMode && !map.group_code) {
			onToggleSelect?.(map.id)
		} else if (!selectionMode) {
			onPress()
		}
	}

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={handlePress} className="mb-2">
			<View className="flex w-full flex-row gap-3 border-b border-dashed border-border px-4 py-3">
				{selectionMode && !map.group_code && (
					<View className="justify-center pr-1">
						<View
							className={`h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? 'border-primary bg-primary' : 'border-border bg-transparent'}`}>
							{selected && <View className="h-2 w-2 rounded-full bg-white" />}
						</View>
					</View>
				)}

				<View className="flex-1 flex-col gap-1">
					<View className="flex-row items-center justify-between">
						<Text className="flex-wrap font-medium text-foreground" style={{ maxWidth: TEXT_MAX_WIDTH }}>
							{map.city.name} - {map.name}
						</Text>
						<View className="flex-row items-center gap-2">
							<Text className="font-bold text-xs text-foreground opacity-90">{distance}</Text>
							{map.assigned ? (
								<View className="rounded bg-primary-600 px-1 py-0.5">
									<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.ASSIGNED}</Text>
								</View>
							) : (
								<View className="rounded bg-success px-1 py-0.5">
									<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.FREE}</Text>
								</View>
							)}
						</View>
					</View>
					<Text
						numberOfLines={2}
						ellipsizeMode="tail"
						className="flex-wrap font-medium text-foreground"
						style={{ maxWidth: TEXT_MAX_WIDTH }}>
						{map.address}
					</Text>

					{hasAnnotation && <Text className="font-medium text-sm text-sky-500">{annotation}</Text>}

					{map.assigned ? (
						<View className="flex-row items-center gap-1">
							<Text className="font-semibold text-sm text-foreground opacity-70">Designado para:</Text>
							<Text className="font-bold text-sm text-primary">{map.assigned.name}</Text>
						</View>
					) : (
						<>
							{!!map.visited ? (
								<View className="flex">
									<Text className="font-regular text-xs text-foreground opacity-80">
										Visitado {map.visited_by ? `por ${firstName(map.visited_by)} ` : ''}em {formatDate(map.visited)}
									</Text>
									{found ? (
										<Text className="pt-0 font-semibold text-xs text-success">Encontrado</Text>
									) : (
										<Text className="pt-0 font-semibold text-xs text-primary-600">Não encontrado</Text>
									)}
								</View>
							) : (
								<Text className="pt-[5px] font-regular text-xs text-foreground opacity-80">Ainda não visitado</Text>
							)}
						</>
					)}
					{map.tag && (
						<View className={`${getBadgeColor(map.tag)} absolute -right-1 -top-1 rounded-xl px-2 py-1`}>
							<Text className="font-medium text-xs text-white">{STATUS_NAME[map.tag as keyof typeof STATUS_NAME]}</Text>
						</View>
					)}
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default MapItem
