export const OFFLINE_MESSAGE = 'Sem conexão. Verifique sua internet e tente novamente.'

// Messages thrown by InstantDB `queryOnce`, which needs an active connection to the server
const OFFLINE_PATTERNS = ['device is offline', 'Query timed out']

export const isOfflineError = (error: unknown): boolean => {
	const message = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
	return OFFLINE_PATTERNS.some((pattern) => message.includes(pattern))
}
