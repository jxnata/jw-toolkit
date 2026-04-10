import { useThemedColors } from '@/hooks/use-themed-colors'
import { mapImage } from '@/utils/map-image'
import { MapGroup } from '@/utils/group-maps'
import { LocationObjectCoords } from 'expo-location'
import { Layers } from 'lucide-react-native'
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'

import { MAP_STATUS_LABELS } from '@/constants/content'

const screenWidth = Dimensions.get('screen').width
const TEXT_MAX_WIDTH = screenWidth - 130

interface MapGroupItemProps {
	group: MapGroup
	location: LocationObjectCoords | null
	onPress: () => void
}

const MapGroupItem = ({ group, onPress }: MapGroupItemProps) => {
	const { colors } = useThemedColors()
	const first = group.maps[0]
	const allAssigned = group.maps.every((m) => !!m.assigned)
	const noneAssigned = group.maps.every((m) => !m.assigned)

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress} className="mb-2">
			<View className="flex w-full flex-row gap-2.5 rounded-xl border border-border bg-card p-2.5">
				{allAssigned ? (
					<View
						className="absolute bottom-2 right-2 z-10 rounded-[5px] px-[5px] py-0.5"
						style={{ backgroundColor: colors.primary[600] }}>
						<Text className="font-semibold text-[10px] text-white">{MAP_STATUS_LABELS.ASSIGNED}</Text>
					</View>
				) : noneAssigned ? (
					<View
						className="absolute bottom-2 right-2 z-10 rounded-[5px] px-[5px] py-0.5"
						style={{ backgroundColor: colors.success.DEFAULT }}>
						<Text className="font-semibold text-[10px] text-white">{MAP_STATUS_LABELS.FREE}</Text>
					</View>
				) : null}

				<View className="flex">
					<Image resizeMode="contain" source={{ uri: mapImage([first.lat, first.lng]) }} className="h-20 w-20 rounded-[10px]" />
				</View>

				<View className="flex-1 flex-col gap-1">
					<View className="flex-row items-center gap-1">
						<Layers size={13} color={colors.primary[600]} />
						<Text className="font-semibold text-xs" style={{ color: colors.primary[600] }}>
							{group.maps.length} mapas
						</Text>
					</View>
					<Text className="flex-wrap font-medium text-foreground" style={{ maxWidth: TEXT_MAX_WIDTH }}>
						{first.city.name} - {first.name}
					</Text>
					<Text
						numberOfLines={2}
						ellipsizeMode="tail"
						className="flex-wrap font-medium text-foreground"
						style={{ maxWidth: TEXT_MAX_WIDTH }}>
						{first.address}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default MapGroupItem
