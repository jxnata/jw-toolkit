import { useThemedColors } from '@/hooks/use-themed-colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useMemo, useState } from 'react'
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Modal,
	Pressable,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

const { height } = Dimensions.get('window')

type Props = {
	selectedValue: string | undefined
	options: { label: string; value: string }[]
	label?: string
	placeholder: string
	disabled?: boolean
	onValueChange: (value: any) => void
	footerComponent?: React.ReactNode
	onRefresh?: () => Promise<unknown>
}

const Dropdown = ({
	selectedValue,
	options,
	label,
	placeholder,
	disabled = false,
	onValueChange,
	footerComponent,
	onRefresh,
}: Props) => {
	const [open, setOpen] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const { colors } = useThemedColors()

	const toggle = () => {
		setOpen(old => !old)
	}

	const handleRefresh = async () => {
		if (!onRefresh || isRefreshing) return
		setIsRefreshing(true)
		try {
			await onRefresh()
		} finally {
			setIsRefreshing(false)
		}
	}

	const onPress = (item: { value: string; label: string }) => {
		onValueChange(item.value)
		setTimeout(toggle, 100)
	}

	const selectedLabel = useMemo(() => {
		if (!selectedValue) return
		if (!options) return
		if (!options.length) return

		const selected = options.find(o => o.value === selectedValue)

		if (!selected) return

		return selected.label
	}, [selectedValue, options])

	return (
		<View className='mb-2.5'>
			{!!label && <Text className='text-foreground text-xs font-medium mb-[5px] ml-0.5'>{label}</Text>}
			<Pressable
				onPress={toggle}
				disabled={disabled}
				className={`flex-row justify-between items-center w-full h-[50px] px-4 py-[14px] rounded-lg border-[1.5px] border-border bg-card ${disabled ? 'opacity-50' : ''}`}
			>
				<Text className='text-foreground text-[15px] font-medium'>{selectedLabel || placeholder}</Text>
				<Ionicons name='chevron-down' size={20} color={colors.foreground + '80'} />
			</Pressable>

			<Modal animationType='fade' transparent visible={open} onRequestClose={toggle}>
				<View className='flex justify-end w-full h-full' style={{ backgroundColor: colors.background + '90' }}>
					<SafeAreaView
						className='flex w-full items-center rounded-[10px] bg-card'
						style={{ maxHeight: height * 0.6 }}
					>
						{!!onRefresh && (
							<TouchableOpacity
								onPress={handleRefresh}
								disabled={isRefreshing}
								className='absolute -top-[45px] left-2.5 bg-card border border-success-DEFAULT p-2 rounded-lg z-10'
							>
								{isRefreshing ? (
									<ActivityIndicator size='small' color={colors.primary[600]} />
								) : (
									<Ionicons name='refresh' size={20} color={colors.foreground + '80'} />
								)}
							</TouchableOpacity>
						)}

						<TouchableOpacity
							onPress={toggle}
							className='absolute -top-[45px] right-2.5 bg-card border border-danger-500 p-2 rounded-lg z-10'
						>
							<Ionicons name='close' size={20} color={colors.foreground + '80'} />
						</TouchableOpacity>

						<FlatList
							className='w-full px-2.5'
							data={options}
							renderItem={({ item }) => (
								<Pressable
									onPress={() => onPress(item)}
									className='flex-row items-center rounded-xl px-4 py-4 mt-[5px] gap-2.5'
									style={{ backgroundColor: colors.background + '70' }}
								>
									{item.value === selectedValue ? (
										<Ionicons name='checkmark-circle' size={20} color={colors.foreground + '80'} />
									) : (
										<Ionicons name='ellipse-outline' size={20} color={colors.foreground + '80'} />
									)}
									<Text className='text-foreground text-base font-medium'>{item.label}</Text>
								</Pressable>
							)}
							keyExtractor={item => item.label}
							ListFooterComponent={
								<>
									<View className='h-[30px]' />
									{footerComponent}
									<View className='h-[30px]' />
								</>
							}
						/>
					</SafeAreaView>
				</View>
			</Modal>
		</View>
	)
}

export default Dropdown
