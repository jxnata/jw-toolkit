import { useThemedColors } from '@/hooks/use-themed-colors'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { ArrowLeft, MapPin } from 'lucide-react-native'
import { Linking, Modal, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ExtraMapData = {
	id: string
	address: string
	details?: string
	lat: number
	lng: number
}

type Props = {
	visible: boolean
	onClose: () => void
	extraMap: ExtraMapData | null
	showNavigation?: boolean
}

const ExtraMapViewModal = ({ visible, onClose, extraMap, showNavigation = false }: Props) => {
	const { colors } = useThemedColors()
	const insets = useSafeAreaInsets()

	if (!extraMap) return null

	const region = getMapRegion([extraMap.lat, extraMap.lng])
	const marker = getMarkerCoordinate([extraMap.lat, extraMap.lng])

	const navigate = () => {
		const destination = `${extraMap.lat},${extraMap.lng}`

		if (Platform.OS === 'ios' || Platform.OS === 'macos') {
			Linking.openURL(`http://maps.apple.com/?t=r&daddr=${destination}&dirflg=d&t=m`)
		} else {
			Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`)
		}
	}

	return (
		<Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
			<View className="flex-1">
				<Pressable
					onPress={onClose}
					className="absolute left-3 z-10 h-12 w-12 items-center justify-center rounded-xl bg-card"
					style={{ top: insets.top }}>
					<ArrowLeft color={colors.foreground} />
				</Pressable>

				<MapView
					style={{ width: '100%', height: '100%' }}
					initialRegion={{
						latitude: region.latitude,
						longitude: region.longitude,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
					}}
					showsUserLocation={true}>
					<Marker
						coordinate={{
							latitude: marker.latitude,
							longitude: marker.longitude,
						}}
						title={extraMap.address}
						description={extraMap.details}
					/>
				</MapView>

				<View className="absolute bottom-10 w-full px-2">
					<View className="gap-2 rounded-[10px] bg-background px-4 py-2">
						<Text className="pt-2 font-bold text-base text-foreground">Endereço</Text>
						<Text className="font-medium text-base text-foreground">{extraMap.address}</Text>
						{!!extraMap.details && <Text className="font-medium text-base text-foreground">{extraMap.details}</Text>}
						{showNavigation && (
							<View className="mt-2">
								<TouchableOpacity
									onPress={navigate}
									className="mb-2 flex flex-row items-center justify-center gap-[5px] rounded-xl bg-primary-600 px-5 py-[15px]">
									<MapPin size={24} color="white" />
									<Text className="font-bold text-[15px] text-white">Ir para</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default ExtraMapViewModal
