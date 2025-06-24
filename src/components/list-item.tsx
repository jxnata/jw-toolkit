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
		<Pressable key={id} onPress={onPress} className='flex-row items-center py-2 px-4 h-[65px] bg-card rounded-lg'>
			<View className='flex items-center justify-center h-[35px] w-[35px] mr-2.5 bg-border rounded-full'>
				<Text className='text-foreground text-xl font-bold'>{firstLetter(name)}</Text>
			</View>
			<View className='flex-1'>
				<Text className='text-[15px] text-foreground font-semibold'>{name}</Text>
				{label && (
					<View className='flex-row mt-1'>
						<View className={`${label.color} px-2 py-1 rounded`}>
							<Text className='text-white text-xs font-medium'>{label.text}</Text>
						</View>
					</View>
				)}
			</View>
		</Pressable>
	)
}

export default ListItem
