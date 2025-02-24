import React, { useEffect } from 'react'
import { Animated } from 'react-native'
import * as S from './styles'

interface SkeletonProps {
	width?: number | string
	height?: number | string
}

const Skeleton = ({ width = '100%', height = 50 }: SkeletonProps) => {
	const animatedValue = new Animated.Value(0.1)

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(animatedValue, { toValue: 1, duration: 1000, useNativeDriver: true }),
				Animated.timing(animatedValue, { toValue: 0.1, duration: 1000, useNativeDriver: true }),
			])
		).start()
	}, [])

	return <S.Skeleton style={{ width, height, opacity: animatedValue }} />
}

export default Skeleton
