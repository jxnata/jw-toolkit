import styled from 'styled-components/native'
import { Animated } from 'react-native'

export const Skeleton = styled(Animated.View)`
	border-radius: 8px;
	border: solid 1.5px ${({ theme }) => theme.border}10;
	background: ${({ theme }) => theme.backgroundAlt}70;
`
