import AssignmentControls from '@/components/assignment-controls'
import ExtraMapItem from '@/components/extra-map-item'
import ExtraMapViewModal from '@/components/extra-map-view-modal'
import PersonalAnnotation from '@/components/personal-annotation'
import useAssignment from '@/hooks/use-assignment'
import useExtraMaps from '@/hooks/use-extra-maps'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { getMapRegion } from '@/utils/get-map-region'
import { getMarkerCoordinate } from '@/utils/get-marker-coordinate'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const AssigmentDetails = () => {
	const { data } = useLocalSearchParams()
	const params = JSON.parse((data as string) || '{}') as Map
	const router = useRouter()
	const { colors } = useThemedColors()
	const insets = useSafeAreaInsets()
	const { assignment } = useAssignment(params.id)
	const { extraMaps } = useExtraMaps(params.id)
	const [selectedExtraMap, setSelectedExtraMap] = useState<{ id: string; address: string; details?: string; lat: number; lng: number } | null>(null)

	const onFinish = () => {
		router.push({
			pathname: '/publisher/assignment/finish',
			params: { assignmentId: assignment!.id, assignmentName: assignment!.assigned?.name },
		})
	}

	if (!assignment) {
		return (
			<View className="flex">
				<Stack.Screen options={{ presentation: 'modal' }} />
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color={colors.primary[600]} />
				</View>
			</View>
		)
	}

	const hasExtraMaps = extraMaps.length > 0
	const region = getMapRegion([assignment.lat, assignment.lng])
	const marker = getMarkerCoordinate([assignment.lat, assignment.lng])

	return (
		<View className="flex">
			<Stack.Screen options={{ presentation: 'modal' }} />
			{assignment && (
				<View className="flex h-full w-full">
					<Pressable
						onPress={router.back}
						className="absolute left-3 z-10 h-12 w-12 items-center justify-center rounded-xl bg-card"
						style={{ top: insets.top }}>
						<ArrowLeft color={colors.foreground} />
					</Pressable>

					<PersonalAnnotation map={assignment as Map} />

					{hasExtraMaps ? (
						<ScrollView className="flex-1" contentContainerClassName="px-4 pt-16 pb-48">
							<Text className="mb-4 font-bold text-lg text-foreground">{assignment.name}</Text>
							<Text className="mb-2 font-semibold text-foreground opacity-75">Localizações</Text>
							<ExtraMapItem
								extraMap={{ id: assignment.id, address: assignment.address, details: assignment.details, lat: assignment.lat, lng: assignment.lng }}
								onPress={() => setSelectedExtraMap({ id: assignment.id, address: assignment.address, details: assignment.details, lat: assignment.lat, lng: assignment.lng })}
							/>
							{extraMaps.map((em) => (
								<ExtraMapItem key={em.id} extraMap={em} onPress={() => setSelectedExtraMap(em)} />
							))}
						</ScrollView>
					) : (
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
								title={assignment.name}
								description={assignment.address}
							/>
						</MapView>
					)}

					<AssignmentControls assignment={assignment} onFinish={onFinish} />

					<ExtraMapViewModal
						visible={!!selectedExtraMap}
						onClose={() => setSelectedExtraMap(null)}
						extraMap={selectedExtraMap}
						showNavigation={true}
					/>
				</View>
			)}
		</View>
	)
}

export default AssigmentDetails
