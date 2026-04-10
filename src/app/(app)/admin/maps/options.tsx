import Button from '@/components/button'
import { useSession } from '@/contexts/session-provider'
import useMaps from '@/hooks/use-maps'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { mapsService } from '@/services/instantdb/maps-service'
import { router, Stack } from 'expo-router'
import { Trash2, X } from 'lucide-react-native'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

const MapsOptions = () => {
	const { congregation } = useSession()
	const { colors } = useThemedColors()

	const { maps } = useMaps()
	const totalMaps = maps.length
	const assignedMaps = maps.filter((m) => m.assigned).length
	const unassignedMaps = maps.filter((m) => !m.assigned).length

	const unassignAll = async () => {
		try {
			if (!congregation) return
			await mapsService.unassignAllMaps(congregation.id)
			Toast.show({
				type: 'success',
				text1: 'Sucesso',
				text2: 'Todas as designações foram removidas',
			})
		} catch {
			Toast.show({
				type: 'error',
				text1: 'Erro',
				text2: 'Erro ao remover designações',
			})
		}
	}

	const confirmUnassignAll = () => {
		Alert.alert('Remover todas as designações', 'Tem certeza que deseja remover todas as designações?', [
			{ text: 'Cancelar', style: 'cancel' },
			{ text: 'Remover', style: 'destructive', onPress: unassignAll },
		])
	}

	const goBack = () => {
		router.back()
	}

	const HeaderRight = () => (
		<View className="flex-row">
			<TouchableOpacity hitSlop={10} onPress={goBack}>
				<X size={20} color={colors.foreground} />
			</TouchableOpacity>
		</View>
	)

	return (
		<View className="flex">
			<Stack.Screen options={{ title: 'Opções', headerRight: HeaderRight }} />
			<View className="flex h-full w-full bg-background p-4">
				<View className="mb-6 flex-col gap-3">
					<Text className="font-semibold text-base text-foreground opacity-60">Resumo</Text>
					<View className="flex-col gap-2 rounded-xl bg-card p-4">
						<View className="flex-row items-center justify-between py-1">
							<Text className="font-medium text-foreground">Total de mapas</Text>
							<Text className="font-bold text-foreground">{totalMaps}</Text>
						</View>
						<View className="h-px bg-border" />
						<View className="flex-row items-center justify-between py-1">
							<Text className="font-medium text-foreground">Designados</Text>
							<Text className="font-bold text-primary">{assignedMaps}</Text>
						</View>
						<View className="h-px bg-border" />
						<View className="flex-row items-center justify-between py-1">
							<Text className="font-medium text-foreground">Livres</Text>
							<Text className="font-bold text-foreground">{unassignedMaps}</Text>
						</View>
					</View>
				</View>

				<View className="flex-col gap-3">
					<Text className="font-semibold text-base text-foreground opacity-60">Ações</Text>
					<Button
						variant="danger"
						onPress={confirmUnassignAll}
						disabled={assignedMaps === 0}
						left={<Trash2 size={16} color={colors.danger[500]} />}>
						Remover todas as designações
					</Button>
				</View>
			</View>
		</View>
	)
}

export default MapsOptions
