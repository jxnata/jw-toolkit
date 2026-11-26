import Button from '@/components/button'
import Dropdown from '@/components/dropdown'
import { PhoneCallInfo } from '@/components/phone-item'
import { MAP_STATUS_LABELS } from '@/constants/content'
import usePhone from '@/hooks/use-phone'
import usePublishers from '@/hooks/use-publishers'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { error, success } from '@/messages/add'
import { error as removeError, success as removeSuccess } from '@/messages/delete'
import { phonesService } from '@/services/instantdb'
import { formatPhone } from '@/utils/phone-number'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Trash } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const ViewPhone = () => {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { phone, loading } = usePhone(id)
	const { publishers } = usePublishers()
	const { colors } = useThemedColors()
	const [assignedId, setAssignedId] = useState<string>('')
	const [saving, setSaving] = useState(false)

	const publisherList = publishers.map((p) => ({ label: p.name, value: p.id }))

	const assign = async () => {
		if (!assignedId) return
		setSaving(true)
		try {
			await phonesService.assignPhone(id, assignedId)
			success('designação')
			router.back()
		} catch (err) {
			error('designação')
			console.error('Failed to assign phone:', err)
		} finally {
			setSaving(false)
		}
	}

	const removeAssignment = async () => {
		if (!phone?.assigned) return
		try {
			await phonesService.unassignPhone(id, phone.assigned.id)
			removeSuccess('designação')
			router.back()
		} catch (err) {
			removeError('designação')
			console.error('Failed to remove phone assignment:', err)
		}
	}

	const deletePhone = async () => {
		try {
			await phonesService.deletePhone(id)
			removeSuccess('telefone')
			router.back()
		} catch (err) {
			removeError('telefone')
			console.error('Failed to delete phone:', err)
		}
	}

	const showRemoveAlert = () =>
		Alert.alert('Remover designação', 'Deseja remover a designação deste telefone?', [
			{ text: 'Cancelar', style: 'cancel' },
			{ text: 'Sim, remover', onPress: removeAssignment, style: 'destructive' },
		])

	const showDeleteAlert = () =>
		Alert.alert('Excluir', 'Deseja excluir este telefone? Essa opção não pode ser revertida.', [
			{ text: 'Cancelar', style: 'cancel' },
			{ text: 'Sim, excluir', onPress: deletePhone, style: 'destructive' },
		])

	const HeaderRight = () => (
		<TouchableOpacity onPress={showDeleteAlert} disabled={!phone} className="mx-2">
			<Trash size={24} color={colors.foreground} />
		</TouchableOpacity>
	)

	return (
		<View className="flex-1 bg-background">
			<Stack.Screen options={{ title: phone ? formatPhone(phone.number) : 'Telefone', headerRight: HeaderRight }} />

			{!phone ? (
				<View className="flex-1 items-center justify-center">
					{loading ? (
						<ActivityIndicator size="large" color={colors.primary[600]} />
					) : (
						<Text className="font-regular text-foreground opacity-70">Telefone não encontrado</Text>
					)}
				</View>
			) : (
				<ScrollView contentContainerClassName="px-4 pb-8 pt-4">
					<View className="mb-3 flex-row items-start justify-between">
						<Text className="font-bold text-2xl text-foreground">{formatPhone(phone.number)}</Text>
						{phone.assigned ? (
							<View className="rounded bg-primary-600 px-2 py-0.5">
								<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.ASSIGNED}</Text>
							</View>
						) : (
							<View className="rounded bg-success px-2 py-0.5">
								<Text className="font-semibold text-xs text-white">{MAP_STATUS_LABELS.FREE}</Text>
							</View>
						)}
					</View>

					<View className="mb-3">
						<PhoneCallInfo phone={phone} />
					</View>

					{phone.assigned ? (
						<>
							<Text className="py-2 font-medium text-foreground">Designado para:</Text>
							<View className="mb-3 rounded-xl bg-card px-4 py-3">
								<Text className="font-semibold text-foreground">{phone.assigned.name}</Text>
							</View>
							<Button variant="danger" onPress={showRemoveAlert}>
								Remover Designação
							</Button>
						</>
					) : (
						<>
							<Text className="py-2 font-medium text-foreground">Designar para:</Text>
							<Dropdown
								placeholder="Selecione um publicador..."
								options={publisherList}
								selectedValue={assignedId}
								onValueChange={setAssignedId}
							/>
							<View className="mt-2">
								<Button disabled={!assignedId} loading={saving} onPress={assign}>
									Salvar designação
								</Button>
							</View>
						</>
					)}
				</ScrollView>
			)}
		</View>
	)
}

export default ViewPhone
