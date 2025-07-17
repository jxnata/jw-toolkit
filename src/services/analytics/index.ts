import { storage } from '@/database/index'
import analytics from '@react-native-firebase/analytics'

type DatabaseOperation = 'create' | 'read' | 'update' | 'delete' | 'list'

export const trackDatabaseOperation = async (
	operation: DatabaseOperation,
	collectionId: string,
	documentId?: string
) => {
	try {
		const userId = storage.getString('session.user.id')
		const congregationId = storage.getString('congregation.id')

		if (__DEV__) return

		await analytics().logEvent('database_operation', {
			operation,
			collection_id: collectionId,
			document_id: documentId || 'none',
			user_id: userId || 'anonymous',
			congregation_id: congregationId || 'none',
			timestamp: new Date().toISOString(),
		})
	} catch (error) {
		console.error('Failed to track database operation:', error)
	}
}
