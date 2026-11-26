import { MAP_STATUS_LABELS } from '@/constants/content'
import { Phone } from '@/interfaces'
import { formatDate } from '@/utils/date-format'
import { firstName } from '@/utils/first-name'
import { formatPhone } from '@/utils/phone-number'
import { Text, TouchableOpacity, View } from 'react-native'

interface PhoneItemProps {
	phone: Phone
	onPress?: () => void
	hidePublisher?: boolean
}

export const PhoneCallInfo = ({ phone }: { phone: Phone }) =>
	phone.called ? (
		<View>
			<Text className="font-regular text-xs text-foreground opacity-80">
				Contatado {phone.called_by ? `por ${firstName(phone.called_by)} ` : ''}em {formatDate(phone.called)}
			</Text>
			{phone.answered ? (
				<Text className="font-semibold text-xs text-success">Atendeu {!!phone.answered_info && '- ' + phone.answered_info}</Text>
			) : (
				<Text className="font-semibold text-xs text-primary-600">Sem resposta</Text>
			)}
		</View>
	) : (
		<Text className="font-regular text-xs text-foreground opacity-80">Ainda não contatado</Text>
	)

const PhoneItem = ({ phone, hidePublisher, onPress }: PhoneItemProps) => (
	<TouchableOpacity activeOpacity={0.8} onPress={onPress} className="mb-2">
		<View className="flex w-full flex-col gap-1 border-b border-dashed border-border px-4 py-3">
			<View className="flex-row items-center justify-between">
				<Text className="font-semibold text-base text-foreground">{formatPhone(phone.number)}</Text>
				{phone.assigned ? (
					<View className="rounded-xl bg-primary-600 px-2 py-1">
						<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.ASSIGNED}</Text>
					</View>
				) : (
					<View className="rounded-xl bg-success px-2 py-1">
						<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.FREE}</Text>
					</View>
				)}
			</View>

			{phone.assigned && !hidePublisher && (
				<View className="flex-row items-center gap-1">
					<Text className="font-semibold text-sm text-foreground opacity-70">Designado para:</Text>
					<Text className="font-bold text-sm text-primary">{phone.assigned.name}</Text>
				</View>
			)}

			<PhoneCallInfo phone={phone} />
		</View>
	</TouchableOpacity>
)

export default PhoneItem
