// The hook is rendered with react-test-renderer; every native module and the service are mocked
import { useSession } from '@/contexts/session-provider'
import { restored } from '@/messages/backup'
import { backupService } from '@/services/instantdb/backup-service'
import { OFFLINE_MESSAGE } from '@/utils/is-offline-error'
import { INVALID_BACKUP_MESSAGE } from '@/utils/validate-backup-file'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { createElement } from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { useBackupRestore, WRONG_CONGREGATION_MESSAGE } from './use-backup-restore'

// NativeWind's babel plugin routes createElement through css-interop, whose runtime needs react-native
jest.mock('react-native-css-interop', () => ({ createInteropElement: jest.requireActual('react').createElement }))
jest.mock('@/contexts/session-provider', () => ({ useSession: jest.fn() }))
jest.mock('@/messages/backup', () => ({ restored: jest.fn() }))
jest.mock('@/services/instantdb/backup-service', () => ({
	backupService: { fetchBackupData: jest.fn(), restoreBackup: jest.fn() },
}))
jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn() }))
jest.mock('expo-file-system/legacy', () => ({
	cacheDirectory: 'file:///cache/',
	writeAsStringAsync: jest.fn(),
	readAsStringAsync: jest.fn(),
}))
jest.mock('expo-sharing', () => ({ shareAsync: jest.fn() }))

const mockUseSession = useSession as jest.Mock
const mockService = backupService as unknown as { fetchBackupData: jest.Mock; restoreBackup: jest.Mock }
const mockGetDocument = DocumentPicker.getDocumentAsync as jest.Mock
const mockWrite = FileSystem.writeAsStringAsync as jest.Mock
const mockRead = FileSystem.readAsStringAsync as jest.Mock
const mockShare = Sharing.shareAsync as jest.Mock
const mockRestored = restored as jest.Mock
const mockConfirm = jest.fn()

const backup = {
	version: '1.1',
	congregation_id: 'cong-1',
	created_at: '2026-01-01T00:00:00.000Z',
	cities: [{ id: 'c1', name: 'City' }],
	districts: [],
	maps: [],
}

type HookResult = ReturnType<typeof useBackupRestore>

function renderBackupHook() {
	const result: { current: HookResult } = { current: undefined as unknown as HookResult }
	const Probe = () => {
		result.current = useBackupRestore()
		return null
	}
	act(() => {
		TestRenderer.create(createElement(Probe))
	})
	return result
}

function pickFile(content: string) {
	mockGetDocument.mockResolvedValue({ canceled: false, assets: [{ uri: 'file:///picked.json' }] })
	mockRead.mockResolvedValue(content)
}

beforeEach(() => {
	jest.clearAllMocks()
	mockConfirm.mockResolvedValue(true)
	mockUseSession.mockReturnValue({ congregation: { id: 'cong-1' }, type: 'admin' })
})

// ── createBackup ─────────────────────────────────────────────────────────────

describe('createBackup', () => {
	it('writes the backup JSON to the cache directory and shares it', async () => {
		mockService.fetchBackupData.mockResolvedValue(backup)
		const hook = renderBackupHook()

		await act(() => hook.current.createBackup())

		expect(mockService.fetchBackupData).toHaveBeenCalledWith('cong-1')
		const [path, content] = mockWrite.mock.calls[0]
		expect(path).toMatch(/^file:\/\/\/cache\/backup_cong-1_\d+\.json$/)
		expect(JSON.parse(content)).toEqual(backup)
		expect(mockShare).toHaveBeenCalledWith(path, expect.objectContaining({ mimeType: 'application/json' }))
		expect(hook.current.loading).toBe(false)
		expect(hook.current.error).toBeNull()
	})

	it('exposes loading and operation while running', async () => {
		let resolve!: (value: unknown) => void
		mockService.fetchBackupData.mockReturnValue(new Promise((r) => (resolve = r)))
		const hook = renderBackupHook()

		let pending!: Promise<void>
		act(() => {
			pending = hook.current.createBackup()
		})
		expect(hook.current.loading).toBe(true)
		expect(hook.current.operation).toBe('backup')

		await act(async () => {
			resolve(backup)
			await pending
		})
		expect(hook.current.loading).toBe(false)
		expect(hook.current.operation).toBeNull()
	})

	it('sets a backup error on failure', async () => {
		mockService.fetchBackupData.mockRejectedValue(new Error('boom'))
		const hook = renderBackupHook()

		await act(() => hook.current.createBackup())

		expect(hook.current.error).toEqual({ operation: 'backup', message: 'boom' })
		expect(hook.current.loading).toBe(false)
	})

	it('translates offline errors', async () => {
		mockService.fetchBackupData.mockRejectedValue(new Error('device is offline'))
		const hook = renderBackupHook()

		await act(() => hook.current.createBackup())

		expect(hook.current.error?.message).toBe(OFFLINE_MESSAGE)
	})

	it('does nothing for non-admin users', async () => {
		mockUseSession.mockReturnValue({ congregation: { id: 'cong-1' }, type: 'publisher' })
		const hook = renderBackupHook()

		await act(() => hook.current.createBackup())

		expect(mockService.fetchBackupData).not.toHaveBeenCalled()
	})
})

// ── restoreBackup ────────────────────────────────────────────────────────────

describe('restoreBackup', () => {
	it('restores a valid file and shows the summary', async () => {
		pickFile(JSON.stringify(backup))
		const summary = { cities: 1, districts: 0, maps: 0, skippedMaps: 0 }
		mockService.restoreBackup.mockResolvedValue(summary)
		const hook = renderBackupHook()

		await act(() => hook.current.restoreBackup(mockConfirm))

		expect(mockRead).toHaveBeenCalledWith('file:///picked.json', { encoding: 'utf8' })
		expect(mockConfirm).toHaveBeenCalledWith(backup)
		expect(mockService.restoreBackup).toHaveBeenCalledWith(backup, 'cong-1', expect.any(Function))
		expect(mockRestored).toHaveBeenCalledWith(summary)
		expect(hook.current.loading).toBe(false)
		expect(hook.current.error).toBeNull()
	})

	it('accepts json files reported with generic mime types', async () => {
		mockGetDocument.mockResolvedValue({ canceled: true })
		const hook = renderBackupHook()

		await act(() => hook.current.restoreBackup(mockConfirm))

		expect(mockGetDocument.mock.calls[0][0].type).toEqual(
			expect.arrayContaining(['application/json', 'text/plain', 'application/octet-stream'])
		)
	})

	it('does nothing when the picker is cancelled', async () => {
		mockGetDocument.mockResolvedValue({ canceled: true })
		const hook = renderBackupHook()

		await act(() => hook.current.restoreBackup(mockConfirm))

		expect(mockRead).not.toHaveBeenCalled()
		expect(mockService.restoreBackup).not.toHaveBeenCalled()
		expect(hook.current.loading).toBe(false)
		expect(hook.current.error).toBeNull()
	})

	it('does not restore when the user declines the confirmation', async () => {
		pickFile(JSON.stringify(backup))
		mockConfirm.mockResolvedValue(false)
		const hook = renderBackupHook()

		await act(() => hook.current.restoreBackup(mockConfirm))

		expect(mockConfirm).toHaveBeenCalledWith(backup)
		expect(mockService.restoreBackup).not.toHaveBeenCalled()
		expect(hook.current.loading).toBe(false)
		expect(hook.current.error).toBeNull()
	})

	it('rejects malformed JSON with a user-facing message', async () => {
		pickFile('{oops')
		const hook = renderBackupHook()

		await act(() => hook.current.restoreBackup(mockConfirm))

		expect(hook.current.error).toEqual({ operation: 'restore', message: INVALID_BACKUP_MESSAGE })
		expect(mockConfirm).not.toHaveBeenCalled()
		expect(mockService.restoreBackup).not.toHaveBeenCalled()
	})

	it('rejects a file that fails validation', async () => {
		pickFile(JSON.stringify({ ...backup, cities: 'nope' }))
		const hook = renderBackupHook()

		await act(() => hook.current.restoreBackup(mockConfirm))

		expect(hook.current.error?.message).toBe(INVALID_BACKUP_MESSAGE)
		expect(mockConfirm).not.toHaveBeenCalled()
		expect(mockService.restoreBackup).not.toHaveBeenCalled()
	})

	it('rejects a backup from another congregation', async () => {
		pickFile(JSON.stringify({ ...backup, congregation_id: 'other' }))
		const hook = renderBackupHook()

		await act(() => hook.current.restoreBackup(mockConfirm))

		expect(hook.current.error?.message).toBe(WRONG_CONGREGATION_MESSAGE)
		expect(mockConfirm).not.toHaveBeenCalled()
		expect(mockService.restoreBackup).not.toHaveBeenCalled()
	})

	it('does nothing for non-admin users', async () => {
		mockUseSession.mockReturnValue({ congregation: { id: 'cong-1' }, type: 'publisher' })
		const hook = renderBackupHook()

		await act(() => hook.current.restoreBackup(mockConfirm))

		expect(mockGetDocument).not.toHaveBeenCalled()
	})

	it('publishes progress messages for each step', async () => {
		pickFile(JSON.stringify(backup))
		let finishRestore!: (value: unknown) => void
		mockService.restoreBackup.mockReturnValue(new Promise((r) => (finishRestore = r)))
		const hook = renderBackupHook()

		let pending!: Promise<void>
		await act(async () => {
			pending = hook.current.restoreBackup(mockConfirm)
			// let the picker and file read resolve until the service is called
			await new Promise((r) => setTimeout(r, 0))
		})
		const onProgress = mockService.restoreBackup.mock.calls[0][2]

		const expected = {
			cities: 'Restaurando cidades... 1/2',
			districts: 'Restaurando bairros... 1/2',
			maps: 'Restaurando mapas... 1/2',
			cleanup: 'Removendo dados antigos... 1/2',
		}
		for (const [step, message] of Object.entries(expected)) {
			act(() => onProgress(step, 1, 2))
			expect(hook.current.progress).toBe(message)
			expect(hook.current.operation).toBe('restore')
		}

		await act(async () => {
			finishRestore({ cities: 1, districts: 0, maps: 0, skippedMaps: 0 })
			await pending
		})
		expect(hook.current.progress).toBeNull()
		expect(hook.current.loading).toBe(false)
	})

	it('sets a restore error and clears progress when the service fails', async () => {
		pickFile(JSON.stringify(backup))
		mockService.restoreBackup.mockRejectedValue(new Error('Query timed out'))
		const hook = renderBackupHook()

		await act(() => hook.current.restoreBackup(mockConfirm))

		expect(hook.current.error).toEqual({ operation: 'restore', message: OFFLINE_MESSAGE })
		expect(hook.current.progress).toBeNull()
		expect(hook.current.loading).toBe(false)
		expect(mockRestored).not.toHaveBeenCalled()
	})

	it('clears a previous error when a new operation starts', async () => {
		mockService.fetchBackupData.mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce(backup)
		const hook = renderBackupHook()

		await act(() => hook.current.createBackup())
		expect(hook.current.error).not.toBeNull()

		await act(() => hook.current.createBackup())
		expect(hook.current.error).toBeNull()
	})
})
