import React from 'react'
import Skeleton from '@components/Skeleton'
import * as S from './styles'

interface SkeletonItemProps {
	height?: number
}

const SkeletonItem = ({ height = 70 }: SkeletonItemProps) => {
	return (
		<S.Container>
			<Skeleton height={height} />
		</S.Container>
	)
}

export default SkeletonItem
