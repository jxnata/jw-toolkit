import { MAP_STATUS_LABELS } from '@/constants/content'
import { useSession } from '@/contexts/session-provider'
import { usePersonalAnnotations } from '@/hooks/use-personal-annotations'
import { Map } from '@/interfaces'
import { formatDate } from '@/utils/date-format'
import { firstName } from '@/utils/first-name'
import { getLocationDistance } from '@/utils/get-location-distance'
import { useQuery } from '@tanstack/react-query'
import { LocationObjectCoords } from 'expo-location'
import { Text, TouchableOpacity, View } from 'react-native'

interface AssignmentProps {
	map: Map
	location: LocationObjectCoords | null
	onPress?: () => void
	hidePublisher?: boolean
}

const AssignmentItem = ({ map, location, hidePublisher, onPress }: AssignmentProps) => {
	const { current } = useSession()
	const { hasAnnotation, annotation } = usePersonalAnnotations(map.id, current!.id)
	const found = !!(map?.visited && map.found)

	const { data: distance } = useQuery({
		queryKey: ['distance', location?.latitude.toFixed(4), location?.longitude.toFixed(4), map.lat.toFixed(4), map.lng.toFixed(4)],
		queryFn: () => getLocationDistance(location, [map.lat, map.lng]),
		enabled: !!location,
	})

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress} className="mb-2">
			<View className="flex w-full flex-row gap-3 border-b border-dashed border-border px-4 py-3">
				<View className="flex-1 flex-col gap-1">
					<View className="flex-row items-center justify-between">
						<Text className="flex-wrap font-medium text-foreground">
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

					<Text numberOfLines={2} ellipsizeMode="tail" className="flex-wrap font-medium text-foreground">
						{map.address}
					</Text>

					{map.district && <Text className="font-regular text-sm text-foreground opacity-80">{map.district}</Text>}

					{hasAnnotation && <Text className="font-medium text-sm text-sky-500">{annotation}</Text>}

					{map.assigned && !hidePublisher && (
						<View className="flex-row items-center gap-1">
							<Text className="font-semibold text-sm text-foreground opacity-70">Designado para:</Text>
							<Text className="font-bold text-sm text-primary">{map.assigned.name}</Text>
						</View>
					)}

					{!!map.visited ? (
						<View>
							<Text className="font-regular text-xs text-foreground opacity-80">
								Visitado {map.visited_by ? `por ${firstName(map.visited_by)} ` : ''}em {formatDate(map.visited)}
							</Text>
							{found ? (
								<Text className="font-semibold text-xs text-success">Encontrado</Text>
							) : (
								<Text className="font-semibold text-xs text-primary-600">Não encontrado</Text>
							)}
						</View>
					) : (
						<Text className="font-regular text-xs text-foreground opacity-80">Ainda não visitado</Text>
					)}
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default AssignmentItem
