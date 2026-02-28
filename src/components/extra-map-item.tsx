import { useThemedColors } from '@/hooks/use-themed-colors'
import { mapImage } from '@/utils/map-image'
import { Trash } from 'lucide-react-native'
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native'

type ExtraMapData = {
	id: string
	address: string
	details?: string
	lat: number
	lng: number
}

type Props = {
	extraMap: ExtraMapData
	onPress?: () => void
	onRemove?: () => void
}

const ExtraMapItem = ({ extraMap, onPress, onRemove }: Props) => {
	const { colors } = useThemedColors()

	return (
		<Pressable onPress={onPress} className="mb-2 flex w-full flex-row items-center gap-2.5 rounded-lg bg-card p-2.5">
			<View className="flex">
				<Image resizeMode="contain" source={{ uri: mapImage([extraMap.lat, extraMap.lng]) }} className="h-16 w-16 rounded-[10px]" />
			</View>

			<View className="flex-1 flex-col gap-1">
				<Text numberOfLines={2} ellipsizeMode="tail" className="font-medium text-foreground">
					{extraMap.address}
				</Text>
				{!!extraMap.details && (
					<Text numberOfLines={1} ellipsizeMode="tail" className="font-regular text-xs" style={{ color: colors.foreground + '80' }}>
						{extraMap.details}
					</Text>
				)}
			</View>

			{onRemove && (
				<TouchableOpacity onPress={onRemove} className="p-2">
					<Trash size={18} color={colors.danger[500]} />
				</TouchableOpacity>
			)}
		</Pressable>
	)
}

export default ExtraMapItem
