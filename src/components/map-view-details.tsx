import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { formatDate } from '@/utils/date-format'
import { mapImage } from '@/utils/map-image'
import { useMemo } from 'react'
import { Dimensions, Image, Text, View } from 'react-native'

import { firstName } from '@/utils/first-name'

const screenWidth = Dimensions.get('screen').width

interface MapProps {
	map: Map
	showImage?: boolean
}

const MapViewDetails = ({ map, showImage }: MapProps) => {
	const { colors } = useThemedColors()

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
		<View className='flex flex-row mb-2 w-full p-2 gap-2'>
			{showImage && (
				<View className='flex'>
					<Image
						resizeMode='contain'
						source={{ uri: mapImage([map.lat, map.lng]) }}
						className='rounded-[10px] w-20 h-20'
					/>
				</View>
			)}
			<View className='flex'>
				<Text
					className='text-foreground font-medium flex-wrap'
					style={{ maxWidth: screenWidth - 10 - 10 - 10 - 80 - 20 }}
				>
					{map.city.name} - {map.name}
				</Text>
				<Text
					numberOfLines={2}
					ellipsizeMode='tail'
					className='text-foreground font-medium flex-wrap'
					style={{ maxWidth: screenWidth - 10 - 10 - 10 - 80 - 20 }}
				>
					{map.address}
				</Text>
				<Text
					numberOfLines={1}
					ellipsizeMode='tail'
					className='text-foreground font-medium flex-wrap'
					style={{ maxWidth: screenWidth - 10 - 10 - 10 - 80 - 20 }}
				>
					{map.district}
				</Text>
				{!!map.details && (
					<Text
						className='text-foreground font-medium flex-wrap'
						style={{ maxWidth: screenWidth - 10 - 10 - 10 - 80 - 20 }}
					>
						{map.details}
					</Text>
				)}
				{!!map.visited ? (
					<View className='flex'>
						<Text className='font-regular text-sm pt-2' style={{ color: colors.foreground + '80' }}>
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
					<Text className='font-regular text-sm pt-2' style={{ color: colors.foreground + '80' }}>
						Ainda não visitado
					</Text>
				)}
			</View>
		</View>
	)
}

export default MapViewDetails
