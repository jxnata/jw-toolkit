import { useSession } from '@/contexts/session-provider'
import { BackupData } from '@/interfaces'
import { backupService } from '@/services/instantdb/backup-service'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import { useState } from 'react'
import { Share } from 'react-native'

interface BackupRestoreState {
	loading: boolean
	progress: string | null
	error: string | null
}

function validateBackupFile(data: unknown): data is BackupData {
	if (!data || typeof data !== 'object') return false
	const d = data as Record<string, unknown>
	if (typeof d.congregation_id !== 'string') return false
	if (typeof d.version !== 'string') return false
	if (!Array.isArray(d.cities)) return false
	if (!Array.isArray(d.maps)) return false
	for (const city of d.cities) {
		if (!city || typeof city !== 'object') return false
		if (typeof city.id !== 'string' || typeof city.name !== 'string') return false
	}
	for (const map of d.maps) {
		if (!map || typeof map !== 'object') return false
		if (
			typeof map.id !== 'string' ||
			typeof map.city_id !== 'string' ||
			typeof map.name !== 'string' ||
			typeof map.address !== 'string'
		)
			return false
	}
	return true
}

export function useBackupRestore() {
	const { congregation, type } = useSession()
	const [state, setState] = useState<BackupRestoreState>({
		loading: false,
		progress: null,
		error: null,
	})

	function setLoading(loading: boolean) {
		setState((s) => ({ ...s, loading }))
	}

	function setProgress(progress: string | null) {
		setState((s) => ({ ...s, progress }))
	}

	function setError(error: string | null) {
		setState((s) => ({ ...s, error }))
	}

	async function createBackup(): Promise<void> {
		if (!congregation || type !== 'admin') return

		setLoading(true)
		setError(null)
		try {
			const data = await backupService.fetchBackupData(congregation.id)
			const json = JSON.stringify(data, null, 2)
			const timestamp = Date.now()
			const filePath = `${FileSystem.cacheDirectory}backup_${congregation.id}_${timestamp}.json`
			await FileSystem.writeAsStringAsync(filePath, json, { encoding: 'utf8' })
			await Share.share({ url: filePath, title: 'Backup', message: 'Backup da congregação' })
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao criar backup')
		} finally {
			setLoading(false)
		}
	}

	async function restoreBackup(): Promise<void> {
		if (!congregation || type !== 'admin') return

		setLoading(true)
		setError(null)
		setProgress(null)
		try {
			const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' })
			if (result.canceled) {
				setLoading(false)
				return
			}

			const fileUri = result.assets[0].uri
			const raw = await FileSystem.readAsStringAsync(fileUri, { encoding: 'utf8' })
			const parsed: unknown = JSON.parse(raw)

			if (!validateBackupFile(parsed)) {
				throw new Error('Arquivo de backup inválido')
			}

			if (parsed.congregation_id !== congregation.id) {
				throw new Error('Este backup pertence a outra congregação')
			}

			setProgress('Removendo mapas...')
			await backupService.deleteAllMaps(congregation.id, (done, total) => {
				setProgress(`Removendo mapas... ${done}/${total}`)
			})

			setProgress('Removendo cidades...')
			await backupService.deleteAllCities(congregation.id)

			setProgress('Restaurando cidades...')
			const cityIdMap = await backupService.restoreCities(parsed.cities, congregation.id)

			setProgress('Restaurando mapas...')
			await backupService.restoreMaps(parsed.maps, cityIdMap, congregation.id, (done, total) => {
				setProgress(`Restaurando mapas... ${done}/${total}`)
			})

			setProgress(null)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao restaurar backup')
			setProgress(null)
		} finally {
			setLoading(false)
		}
	}

	return {
		loading: state.loading,
		progress: state.progress,
		error: state.error,
		createBackup,
		restoreBackup,
	}
}
