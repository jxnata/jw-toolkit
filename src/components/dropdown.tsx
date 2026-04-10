import { useThemedColors } from '@/hooks/use-themed-colors'
import { CheckCircle, ChevronDown, Circle, RefreshCcw, X } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
	TriggerComponent?: React.ReactNode
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
	TriggerComponent = null,
}: Props) => {
	const [open, setOpen] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const { colors } = useThemedColors()

	const toggle = () => {
		setOpen((old) => !old)
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

	const selectedLabel = selectedValue && options?.length ? options.find((o) => o.value === selectedValue)?.label : undefined

	return (
		<View className="mb-2.5">
			{!!label && <Text className="mb-1 ml-1 font-medium text-sm text-foreground opacity-70">{label}</Text>}
			{!!TriggerComponent ? (
				<Pressable
					onPress={toggle}
					disabled={disabled}
					accessibilityLabel={`${label || 'Dropdown'}: ${selectedLabel || placeholder}`}
					accessibilityRole="button"
					accessibilityState={{ selected: selectedValue !== undefined }}>
					{TriggerComponent}
				</Pressable>
			) : (
				<Pressable
					onPress={toggle}
					disabled={disabled}
					accessibilityLabel={`${label || 'Dropdown'}: ${selectedLabel || placeholder}`}
					accessibilityRole="button"
					accessibilityState={{ selected: selectedValue !== undefined }}
					className={`w-full flex-row items-center justify-between rounded-xl border border-border bg-card px-4 py-4 ${disabled ? 'opacity-50' : ''}`}>
					<Text className="font-medium text-foreground">{selectedLabel || placeholder}</Text>
					<ChevronDown size={16} color={colors.foreground + '80'} />
				</Pressable>
			)}

			<Modal animationType="fade" transparent visible={open} onRequestClose={toggle}>
				<View className="flex h-full w-full justify-end" style={{ backgroundColor: colors.background + '90' }}>
					<SafeAreaView className="flex w-full items-center rounded-[10px] bg-card" style={{ maxHeight: height * 0.6 }}>
						{!!onRefresh && (
							<TouchableOpacity
								onPress={handleRefresh}
								disabled={isRefreshing}
								className="border-success-DEFAULT absolute -top-[45px] left-2.5 z-10 rounded-lg border bg-card p-2">
								{isRefreshing ? (
									<ActivityIndicator size="small" color={colors.primary[600]} />
								) : (
									<RefreshCcw size={20} color={colors.foreground + '80'} />
								)}
							</TouchableOpacity>
						)}

						<TouchableOpacity
							onPress={toggle}
							className="absolute -top-[45px] right-2.5 z-10 rounded-lg border border-danger-500 bg-card p-2">
							<X size={20} color={colors.foreground + '80'} />
						</TouchableOpacity>

						<FlatList
							className="w-full p-2"
							data={options}
							renderItem={({ item, index }) => (
								<Pressable
									onPress={() => onPress(item)}
									className="mt-[5px] flex-row items-center gap-2.5 rounded-xl px-4 py-4"
									style={{ backgroundColor: colors.background + '70' }}
									accessibilityLabel={item.label}
									accessibilityRole="button"
									accessibilityState={{ selected: item.value === selectedValue }}>
									{item.value === selectedValue ? (
										<CheckCircle size={20} color={colors.foreground + '80'} />
									) : (
										<Circle size={20} color={colors.foreground + '80'} />
									)}
									<Text className="font-medium text-base text-foreground">{item.label}</Text>
								</Pressable>
							)}
							keyExtractor={(item, index) => `${item.label}-${index}`}
							ListFooterComponent={
								<>
									<View className="h-[30px]" />
									{footerComponent}
									<View className="h-[30px]" />
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
