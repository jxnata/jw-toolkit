import { useSession } from '@/contexts/session-provider'
import useMyAssignments from '@/hooks/use-my-assignments'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { error, success } from '@/messages/edit'
import { mapsService } from '@/services/instantdb'
import { useRouter } from 'expo-router'
import { XCircle } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'

interface AssignmentProps {
	assignment: any
	onCancel: () => void
}

const AssignmentMapCard = ({ assignment, onCancel }: AssignmentProps) => {
	const router = useRouter()
	const { mutate } = useMyAssignments()
	const [loading, setLoading] = useState(false)
	const { colors } = useThemedColors()
	const { publisher } = useSession()

	const save = async (found: boolean) => {
		setLoading(true)
		try {
			if (!publisher) return
			if (!assignment.assigned) return

			await mapsService.updateMap(assignment.id, {
				found,
				visited: new Date().toISOString(),
				visited_by: assignment.assigned.name,
			})

			await mapsService.unassignMap(assignment.id, publisher.id)

			success('designação')
			mutate()
			router.back()
		} catch (err) {
			error('designação')
			console.error('Failed to update assignment:', err)
		} finally {
			setLoading(false)
		}
	}

	const saveFound = () => save(true)
	const saveNotFound = () => save(false)

	return (
		<View className="absolute bottom-10 w-full px-2">
			<View className="items-center gap-2 rounded-[10px] border-[1px] border-border bg-background p-4">
				<Pressable
					onPress={onCancel}
					disabled={loading}
					className="absolute right-1 top-1 flex h-[50px] w-[50px] flex-row items-center justify-center rounded-xl">
					<XCircle size={24} color={colors.foreground} />
				</Pressable>

				<Text className="py-2 font-bold text-base text-foreground">Encontrou alguém?</Text>

				<View className="mt-2 flex-row gap-2">
					<TouchableOpacity
						onPress={saveFound}
						disabled={loading}
						className="mb-[15px] flex flex-1 flex-row items-center justify-center gap-[5px] rounded-xl bg-success-500 px-5 py-5 text-[15px]">
						<Text className="font-bold text-[15px] text-white">{loading ? 'Salvando...' : 'Sim'}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={saveNotFound}
						disabled={loading}
						className="mb-[15px] flex flex-1 flex-row items-center justify-center gap-[5px] rounded-xl bg-danger-500 px-5 py-5 text-[15px]">
						<Text className="font-bold text-[15px] text-white">{loading ? 'Salvando...' : 'Não'}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default AssignmentMapCard
