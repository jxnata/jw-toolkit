import { useSession } from '@/contexts/session-provider'
import { BackupData } from '@/interfaces'
import { restored } from '@/messages/backup'
import { backupService, RestoreStep } from '@/services/instantdb/backup-service'
import { isOfflineError, OFFLINE_MESSAGE } from '@/utils/is-offline-error'
import { parseBackupFile } from '@/utils/validate-backup-file'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { useState } from 'react'

export type BackupOperation = 'backup' | 'restore'

interface BackupRestoreState {
	operation: BackupOperation | null
	progress: string | null
	error: { operation: BackupOperation; message: string } | null
}

const STEP_LABELS: Record<RestoreStep, string> = {
	cities: 'Restaurando cidades...',
	districts: 'Restaurando bairros...',
	maps: 'Restaurando mapas...',
	cleanup: 'Removendo dados antigos...',
}

// Some Android file providers report .json files as plain text or a generic binary
const BACKUP_MIME_TYPES = ['application/json', 'text/plain', 'application/octet-stream']

export const BACKUP_ERROR_MESSAGE = 'Erro ao criar backup'
export const RESTORE_ERROR_MESSAGE = 'Erro ao restaurar backup'
export const WRONG_CONGREGATION_MESSAGE = 'Este backup pertence a outra congregação'

// Asked after the picked file is validated; resolving false aborts the restore
export type ConfirmRestore = (backup: BackupData) => Promise<boolean>

function getErrorMessage(err: unknown, fallback: string) {
	if (isOfflineError(err)) return OFFLINE_MESSAGE
	return err instanceof Error ? err.message : fallback
}

export function useBackupRestore() {
	const { congregation, type } = useSession()
	const [state, setState] = useState<BackupRestoreState>({
		operation: null,
		progress: null,
		error: null,
	})

	function start(operation: BackupOperation) {
		setState({ operation, progress: null, error: null })
	}

	function setProgress(progress: string | null) {
		setState((s) => ({ ...s, progress }))
	}

	function fail(operation: BackupOperation, message: string) {
		setState({ operation: null, progress: null, error: { operation, message } })
	}

	function finish() {
		setState((s) => ({ ...s, operation: null, progress: null }))
	}

	async function createBackup(): Promise<void> {
		if (!congregation || type !== 'admin' || state.operation) return

		start('backup')
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
			finish()
		} catch (err) {
			fail('backup', getErrorMessage(err, BACKUP_ERROR_MESSAGE))
		}
	}

	async function restoreBackup(confirm: ConfirmRestore): Promise<void> {
		if (!congregation || type !== 'admin' || state.operation) return

		start('restore')
		try {
			const result = await DocumentPicker.getDocumentAsync({ type: BACKUP_MIME_TYPES })
			if (result.canceled) {
				finish()
				return
			}

			const raw = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'utf8' })
			const backup = parseBackupFile(raw)

			if (backup.congregation_id !== congregation.id) {
				throw new Error(WRONG_CONGREGATION_MESSAGE)
			}

			if (!(await confirm(backup))) {
				finish()
				return
			}

			const summary = await backupService.restoreBackup(backup, congregation.id, (step, done, total) => {
				setProgress(`${STEP_LABELS[step]} ${done}/${total}`)
			})

			finish()
			restored(summary)
		} catch (err) {
			fail('restore', getErrorMessage(err, RESTORE_ERROR_MESSAGE))
		}
	}

	return {
		loading: state.operation !== null,
		operation: state.operation,
		progress: state.progress,
		error: state.error,
		createBackup,
		restoreBackup,
	}
}
