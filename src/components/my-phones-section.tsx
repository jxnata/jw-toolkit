import PhoneItem from '@/components/phone-item'
import { Phone } from '@/interfaces'
import { Text, View } from 'react-native'

type Props = {
	phones: Phone[]
	hasMaps: boolean
	onPress: (phone: Phone) => void
}

// Phone territories assigned to the current publisher, shown above their maps
const MyPhonesSection = ({ phones, hasMaps, onPress }: Props) => {
	if (!phones.length) return null

	return (
		<View className="mb-2">
			<View className="flex w-full flex-row items-center gap-2 px-4">
				<Text className="py-2 font-medium text-sm text-foreground opacity-70">TELEFONES</Text>
				<View className="h-[1px] flex-1 bg-foreground opacity-20" />
			</View>
			{phones.map((phone) => (
				<PhoneItem key={phone.id} phone={phone} hidePublisher onPress={() => onPress(phone)} />
			))}
			{hasMaps && (
				<View className="flex w-full flex-row items-center gap-2 px-4">
					<Text className="py-2 font-medium text-sm text-foreground opacity-70">MAPAS</Text>
					<View className="h-[1px] flex-1 bg-foreground opacity-20" />
				</View>
			)}
		</View>
	)
}

export default MyPhonesSection
