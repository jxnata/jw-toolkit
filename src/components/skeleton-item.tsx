import Skeleton from '@/components/skeleton'
import { View } from 'react-native'

interface SkeletonItemProps {
	height?: number
}

const SkeletonItem = ({ height = 70 }: SkeletonItemProps) => {
	return (
		<View className="mx-2.5 mb-[5px]">
			<Skeleton height={height} />
		</View>
	)
}

export default SkeletonItem
