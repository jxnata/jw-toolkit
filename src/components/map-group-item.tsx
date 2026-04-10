import { useThemedColors } from '@/hooks/use-themed-colors'
import { getLocationDistance } from '@/utils/get-location-distance'
import { MapGroup } from '@/utils/group-maps'
import { useQuery } from '@tanstack/react-query'
import { LocationObjectCoords } from 'expo-location'
import getCenter from 'geolib/es/getCenter'
import { Layers } from 'lucide-react-native'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'

import { MAP_STATUS_LABELS } from '@/constants/content'
import { formatDate } from '@/utils/date-format'
import { firstName } from '@/utils/first-name'
import { compact, uniq, uniqBy } from 'lodash'

const screenWidth = Dimensions.get('screen').width
const TEXT_MAX_WIDTH = screenWidth - 130

interface MapGroupItemProps {
	group: MapGroup
	location: LocationObjectCoords | null
	onPress: () => void
}

const MapGroupItem = ({ group, location, onPress }: MapGroupItemProps) => {
	const { colors } = useThemedColors()
	const first = group.maps[0]
	const someAssigned = group.maps.some((m) => !!m.assigned)
	const noneAssigned = group.maps.every((m) => !m.assigned)

	const mapNames = group.maps.map((m) => m.name).join(', ')
	const mapDistricts = uniqBy(compact(group.maps.map((m) => m.district)), 'district').join(', ')
	const lastVisited = group.maps.sort((a, b) => (b.visited ? 1 : -1))[0]
	const found = !!(lastVisited?.visited && lastVisited?.found)
	const assignedMap = group.maps.find((m) => !!m.assigned)
	const assignedNames = uniq(group.maps.filter((m) => !!m.assigned).map((m) => firstName(m.assigned ? m.assigned.name : ''))).join(', ')

	const center = getCenter(group.maps.map((m) => ({ latitude: m.lat, longitude: m.lng })))

	const { data: distance } = useQuery({
		queryKey: [
			'distance',
			location?.latitude.toFixed(4),
			location?.longitude.toFixed(4),
			center && center.latitude.toFixed(4),
			center && center.longitude.toFixed(4),
		],
		queryFn: () => (center ? getLocationDistance(location, [center.latitude, center.longitude]) : undefined),
		enabled: !!location && !!center,
	})

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress} className="mb-2">
			<View className="flex w-full flex-row gap-3 border-b border-dashed border-border px-4 py-3">
				<View className="flex-1 flex-col gap-1">
					<View className="flex-row items-center justify-between">
						<View className="flex-row items-center gap-1">
							<Layers size={13} color={colors.primary[600]} />
							<Text className="font-semibold text-base" style={{ color: colors.primary[600] }}>
								{group.maps.length} endereços
							</Text>
						</View>
						<View className="flex-row items-center gap-2">
							<Text className="font-bold text-xs text-foreground opacity-90">≈{distance}</Text>
							{someAssigned ? (
								<View className="rounded bg-primary-600 px-1 py-0.5">
									<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.ASSIGNED}</Text>
								</View>
							) : noneAssigned ? (
								<View className="rounded bg-success px-1 py-0.5">
									<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.FREE}</Text>
								</View>
							) : null}
						</View>
					</View>
					<Text
						numberOfLines={2}
						ellipsizeMode="tail"
						className="flex-wrap font-medium text-foreground"
						style={{ maxWidth: TEXT_MAX_WIDTH }}>
						{mapNames}
					</Text>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						className="flex-wrap font-medium text-foreground"
						style={{ maxWidth: TEXT_MAX_WIDTH }}>
						{mapDistricts || first.city.name}
					</Text>
					{assignedMap ? (
						<View className="flex-row items-center gap-1">
							<Text className="font-semibold text-sm text-foreground opacity-70">Designado para:</Text>
							<Text className="font-bold text-sm text-primary">{assignedNames}</Text>
						</View>
					) : (
						<>
							{!!lastVisited.visited ? (
								<View className="flex">
									<Text className="font-regular text-xs text-foreground opacity-80">
										Visitado {lastVisited.visited_by ? `por ${firstName(lastVisited.visited_by)} ` : ''}em{' '}
										{formatDate(lastVisited.visited)}
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
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default MapGroupItem
