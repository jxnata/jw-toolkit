import Button from '@/components/button'
import { FEATURES } from '@/constants/env'
import { useSession } from '@/contexts/session-provider'
import { useBackupRestore } from '@/hooks/use-backup-restore'
import useAllMaps from '@/hooks/use-all-maps'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Map } from '@/interfaces'
import { Stack } from 'expo-router'
import { Download, RotateCcw, Save } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Alert, Platform, ScrollView, Share, Text, View } from 'react-native'
import { generatePDF } from 'react-native-html-to-pdf'

const ExportMaps = () => {
	const [generating, setGenerating] = useState(false)
	const { maps, loading } = useAllMaps()
	const { congregation } = useSession()
	const { colors } = useThemedColors()
	const { loading: backupLoading, progress, error, createBackup, restoreBackup } = useBackupRestore()

	const createPDF = async () => {
		if (!congregation) return

		setGenerating(true)

		const groupedMaps: Record<string, Map[]> = maps.reduce(
			(acc, map) => {
				const city = map.city?.name || 'Sem cidade'
				if (!acc[city]) acc[city] = []
				acc[city].push(map as Map)
				return acc
			},
			{} as Record<string, Map[]>
		)

		let mapIndex = 1

		const htmlContent = `
			<html>
			<head>
				<style>
					body {
						font-family: Arial, sans-serif;
						padding: 16px;
					}
					h1, h2 {
						text-align: center;
						color: #333;
					}
					.section {
						margin-bottom: 20px;
						page-break-after: always;
					}
					.card {
						position: relative;
						border: 1px solid #ddd;
						padding: 10px;
						margin-bottom: 10px;
						border-radius: 5px;
						page-break-inside: avoid;
					}
					.card h2 {
						margin: 0;
						color: #333;
					}
					.card h3 {
						margin: 0;
						color: #333;
					}
					.card p {
						margin: 5px 0 0;
						color: #666;
					}
					.card .index {
						position: absolute;
						top: 5px;
						right: 10px;
						font-size: 12px;
						color: #666;
					}
					.card a {
						color: #1a73e8;
						text-decoration: none;
						font-size: 14px;
						margin-top: 5px;
						display: inline-block;
					}
				</style>
			</head>
			<body>
				<h1>Lista de mapas</h1>
				${Object.entries(groupedMaps)
					.map(
						([city, cityMaps]) => `
						<div class="section">
							<h2>${city}</h2>
							${cityMaps
								.map((map) => {
									const googleMapsLink = map.lat && map.lng ? `https://www.google.com/maps?q=${map.lat},${map.lng}` : null
									return `
								<div class="card">
									<span class="index">${mapIndex++}</span> <!-- Número do mapa -->
									<h3>${map.name || ''}</h3>
									<p>Endereço: ${map.address || ''}</p>
									<p>Bairro: ${map.district || ''}</p>
									<p>Observações: ${map.details || ''}</p>
									${googleMapsLink ? `<a href="${googleMapsLink}" target="_blank">${googleMapsLink}</a>` : ''}
								</div>
							`
								})
								.join('')}
						</div>
					`
					)
					.join('')}
			</body>
			</html>
		`

		try {
			const file = await generatePDF({
				html: htmlContent,
				fileName: `Mapas da congregação ${congregation.name}`,
				base64: true,
			})

			await Share.share({
				url: Platform.OS === 'ios' ? file.filePath : `file://${file.filePath}`,
				title: 'Compartilhar PDF',
				message: `Mapas da congregação ${congregation.name}`,
			})
		} catch (error) {
			console.error('Erro ao gerar PDF:', error)
		} finally {
			setGenerating(false)
		}
	}

	const confirmRestore = () => {
		Alert.alert(
			'Confirmar restauração',
			'Todos os mapas e cidades serão apagados e substituídos pelos dados do backup. Deseja continuar?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{ text: 'Confirmar', style: 'destructive', onPress: restoreBackup },
			]
		)
	}

	return (
		<View className="flex-1 bg-background">
			<Stack.Screen options={{ title: 'Exportar Mapas' }} />
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				{/* Card 1 - Export PDF */}
				<View className="mb-4 rounded-xl border border-border bg-card p-4">
					<Text className="mb-1 font-semibold text-foreground">Exportar PDF</Text>
					<Text className="mb-4 text-sm text-foreground opacity-60">
						Exporta todos os mapas da congregação em formato PDF
					</Text>
					{loading && (
						<View className="items-center py-2">
							<ActivityIndicator size="small" color={colors.primary[600]} />
							<Text className="mt-1 text-sm font-medium text-foreground">Carregando mapas...</Text>
						</View>
					)}
					{!loading && maps.length === 0 && (
						<Text className="text-sm text-foreground opacity-60">Não há mapas para exportar.</Text>
					)}
					{!loading && maps.length > 0 && (
						<Button
							loading={generating}
							onPress={createPDF}
							left={!generating ? <Download size={20} color="white" /> : undefined}>
							Exportar
						</Button>
					)}
				</View>

			{FEATURES.backup && (
					<>
						{/* Card 2 - Backup */}
						<View className="mb-4 rounded-xl border border-border bg-card p-4">
							<Text className="mb-1 font-semibold text-foreground">Backup</Text>
							<Text className="mb-4 text-sm text-foreground opacity-60">
								Salva todas as cidades e mapas em um arquivo .json que pode ser restaurado posteriormente
							</Text>
							{backupLoading && progress && (
								<View className="mb-3 flex-row items-center gap-2">
									<ActivityIndicator size="small" color={colors.primary[600]} />
									<Text className="text-sm text-foreground">{progress}</Text>
								</View>
							)}
							<Button
								loading={backupLoading && !progress}
								disabled={backupLoading}
								onPress={createBackup}
								left={!backupLoading ? <Save size={20} color="white" /> : undefined}>
								Fazer Backup
							</Button>
							{error && !progress && (
								<Text className="mt-2 text-sm text-danger-500">{error}</Text>
							)}
						</View>

						{/* Card 3 - Restore */}
						<View className="mb-4 rounded-xl border border-border bg-card p-4">
							<Text className="mb-1 font-semibold text-foreground">Restaurar Backup</Text>
							<Text className="mb-3 text-sm text-danger-500">
								Atenção: esta ação não pode ser desfeita. Todos os dados atuais serão substituídos pelo backup.
							</Text>
							{backupLoading && progress && (
								<View className="mb-3 flex-row items-center gap-2">
									<ActivityIndicator size="small" color={colors.primary[600]} />
									<Text className="text-sm text-foreground">{progress}</Text>
								</View>
							)}
							<Button
								variant="danger"
								loading={backupLoading && !progress}
								disabled={backupLoading}
								onPress={confirmRestore}
								left={!backupLoading ? <RotateCcw size={20} color={colors.danger[500]} /> : undefined}>
								Restaurar
							</Button>
							{error && progress === null && (
								<Text className="mt-2 text-sm text-danger-500">{error}</Text>
							)}
						</View>
					</>
				)}
			</ScrollView>
		</View>
	)
}

export default ExportMaps
