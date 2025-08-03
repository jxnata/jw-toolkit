import Button from '@/components/button'
import { useSession } from '@/contexts/session-instantdb'
import useAllMaps from '@/hooks/use-all-maps-instant'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { Stack } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Platform, Share, Text, View } from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf'

const ExportMaps = () => {
	const [generating, setGenerating] = useState(false)
	const { maps, loading } = useAllMaps()
	const { congregation } = useSession()
	const { colors } = useThemedColors()

	const generatePDF = async () => {
		if (!congregation) return

		setGenerating(true)

		const groupedMaps: Record<string, any[]> = maps.reduce(
			(acc, map) => {
				const city = map.city?.name || 'Sem cidade'
				if (!acc[city]) acc[city] = []
				acc[city].push(map)
				return acc
			},
			{} as Record<string, any[]>
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
								.map(map => {
									const googleMapsLink =
										map.lat && map.lng
											? `https://www.google.com/maps?q=${map.lat},${map.lng}`
											: null
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
			const file = await RNHTMLtoPDF.convert({
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

	return (
		<View className='flex'>
			<Stack.Screen options={{ title: 'Exportar Mapas' }} />
			<View className='flex p-2.5 w-full h-full bg-background'>
				{loading && (
					<View className='flex-1 justify-center items-center'>
						<View className='items-center'>
							<ActivityIndicator size='large' color={colors.primary[600]} />
							<Text className='text-xs text-foreground py-2.5 font-medium'>Carregando mapas...</Text>
						</View>
					</View>
				)}
				{!loading && maps.length === 0 && (
					<Text className='text-xs text-foreground py-2.5 font-medium'>Não há mapas para exportar.</Text>
				)}
				{!loading && maps.length > 0 && (
					<View className='flex-1 justify-center items-center'>
						<Text className='text-xs text-foreground py-2.5 font-medium text-center mb-5'>
							{maps.length} mapas encontrados. Pressione o botão abaixo para exportar em PDF.
						</Text>
						<View className='w-full'>
							<Button loading={loading || generating} onPress={generatePDF}>
								Exportar
							</Button>
						</View>
					</View>
				)}
			</View>
		</View>
	)
}

export default ExportMaps
