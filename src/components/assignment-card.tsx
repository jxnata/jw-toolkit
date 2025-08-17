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
		<View className='absolute bottom-10 w-full px-2'>
			<View className='items-center p-4 rounded-[10px] border-[1px] border-border bg-background gap-2'>
				<Pressable
					onPress={onCancel}
					disabled={loading}
					className='absolute top-1 right-1 w-[50px] h-[50px] flex flex-row items-center justify-center rounded-xl'
				>
					<XCircle size={24} color={colors.foreground} />
				</Pressable>

				<Text className='py-2 text-foreground text-base font-bold'>Encontrou alguém?</Text>

				<View className='mt-2 flex-row gap-2'>
					<TouchableOpacity
						onPress={saveFound}
						disabled={loading}
						className='gap-[5px] flex flex-row items-center justify-center flex-1 px-5 py-5 rounded-xl bg-success-500 text-[15px] mb-[15px]'
					>
						<Text className='text-white text-[15px] font-bold'>{loading ? 'Salvando...' : 'Sim'}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={saveNotFound}
						disabled={loading}
						className='gap-[5px] flex flex-row items-center justify-center flex-1 px-5 py-5 rounded-xl bg-danger-500 text-[15px] mb-[15px]'
					>
						<Text className='text-white text-[15px] font-bold'>{loading ? 'Salvando...' : 'Não'}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default AssignmentMapCard
