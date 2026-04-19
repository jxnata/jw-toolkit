import { useSession } from '@/contexts/session-provider'
import { backupService } from '@/services/instantdb/backup-service'
import { validateBackupFile } from '@/utils/validate-backup-file'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { useState } from 'react'

interface BackupRestoreState {
	loading: boolean
	progress: string | null
	error: string | null
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
			await Sharing.shareAsync(filePath, {
				mimeType: 'application/json',
				dialogTitle: 'Backup',
				UTI: 'public.json',
			})
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
