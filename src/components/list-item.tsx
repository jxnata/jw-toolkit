import { firstLetter } from '@/utils/first-letter'
import { Pressable, Text, View } from 'react-native'

interface ListItemProps {
	id: string
	name: string
	onPress: () => void
	label?: {
		text: string
		color: string
	}
}

const ListItem = ({ id, name, onPress, label }: ListItemProps) => {
	return (
		<Pressable key={id} onPress={onPress} className="h-[65px] flex-row items-center rounded-lg bg-card px-4 py-2">
			<View className="mr-2.5 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-border">
				<Text className="font-bold text-xl text-foreground">{firstLetter(name)}</Text>
			</View>
			<View className="flex-1">
				<Text className="font-semibold text-[15px] text-foreground">{name}</Text>
				{label && (
					<View className="mt-1 flex-row">
						<View className={`${label.color} rounded px-2 py-1`}>
							<Text className="font-medium text-xs text-white">{label.text}</Text>
						</View>
					</View>
				)}
			</View>
		</Pressable>
	)
}

export default ListItem
