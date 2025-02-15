import Button from '@components/Button'
import { useSession } from '@contexts/Auth'
import useAllMaps from '@hooks/swr/admin/useAllMaps'
import { IMap } from '@interfaces/models/Map'
import { Stack } from 'expo-router'
import { useState } from 'react'
import { Platform, Share } from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf'

import * as S from './styles'

const ExportMaps = () => {
	const [generating, setGenerating] = useState(false)
	const { maps, loading } = useAllMaps()
	const { session } = useSession()

	const generatePDF = async () => {
		if (!session) return

		setGenerating(true)

		const groupedMaps: Record<string, IMap[]> = maps.reduce((acc, map) => {
			const city = map.city.name
			if (!acc[city]) acc[city] = []
			acc[city].push(map)
			return acc
		}, {})

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
									const googleMapsLink = map.coordinates
										? `https://www.google.com/maps?q=${map.coordinates[0]},${map.coordinates[1]}`
										: null
									return `
								<div class="card">
									<span class="index">${mapIndex++}</span> <!-- Número do mapa -->
									<h3>${map.name || ''}</h3>
									<p>Endereço: ${map.address || ''}</p>
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
				fileName: `Mapas da congregação ${session.data.congregation.name}`,
				base64: true,
			})

			await Share.share({
				url: Platform.OS === 'ios' ? file.filePath : `file://${file.filePath}`,
				title: 'Compartilhar PDF',
				message: `Mapas da congregação ${session.data.congregation.name}`,
			})
		} catch (error) {
			console.error('Erro ao gerar PDF:', error)
		} finally {
			setGenerating(false)
		}
	}

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Exportar Mapas' }} />
			<S.Content>
				{loading && (
					<S.LoadingContainer>
						<S.LoadingContent>
							<S.Loading />
							<S.Label>Carregando mapas...</S.Label>
						</S.LoadingContent>
					</S.LoadingContainer>
				)}
				{!loading && maps.length === 0 && <S.Label>Não há mapas para exportar.</S.Label>}
				{!loading && maps.length > 0 && (
					<S.ExportContent>
						<S.Label>
							{maps.length} mapas encontrados. Pressione o botão abaixo para exportar em PDF.
						</S.Label>
						<S.ButtonContainer>
							<Button loading={loading || generating} onPress={generatePDF}>
								Exportar
							</Button>
						</S.ButtonContainer>
					</S.ExportContent>
				)}
			</S.Content>
		</S.Container>
	)
}

export default ExportMaps
