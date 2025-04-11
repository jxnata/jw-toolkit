import { Platform } from 'react-native'
import { Client, Databases, Models } from 'react-native-appwrite'
import { trackDatabaseOperation } from '../analytics'

class TrackedDatabase extends Databases {
	async createDocument<Document extends Models.Document>(
		databaseId: string,
		collectionId: string,
		documentId: string,
		data: object,
		permissions?: string[]
	): Promise<Document> {
		const result = await super.createDocument<Document>(databaseId, collectionId, documentId, data, permissions)
		await trackDatabaseOperation('create', collectionId, documentId)
		return result
	}

	async getDocument<Document extends Models.Document>(
		databaseId: string,
		collectionId: string,
		documentId: string,
		queries?: string[]
	): Promise<Document> {
		const result = await super.getDocument<Document>(databaseId, collectionId, documentId, queries)
		await trackDatabaseOperation('read', collectionId, documentId)
		return result
	}

	async updateDocument<Document extends Models.Document>(
		databaseId: string,
		collectionId: string,
		documentId: string,
		data?: object,
		permissions?: string[]
	): Promise<Document> {
		const result = await super.updateDocument<Document>(databaseId, collectionId, documentId, data, permissions)
		await trackDatabaseOperation('update', collectionId, documentId)
		return result
	}

	async deleteDocument(databaseId: string, collectionId: string, documentId: string): Promise<{}> {
		const result = await super.deleteDocument(databaseId, collectionId, documentId)
		await trackDatabaseOperation('delete', collectionId, documentId)
		return result
	}

	async listDocuments<Document extends Models.Document>(
		databaseId: string,
		collectionId: string,
		queries?: string[]
	): Promise<Models.DocumentList<Document>> {
		const result = await super.listDocuments<Document>(databaseId, collectionId, queries)
		await trackDatabaseOperation('list', collectionId)
		return result
	}
}

const client = new Client()
	.setProject('ls-maps')
	.setPlatform(Platform.OS === 'ios' ? 'dev.jxnata.jwtoolkit' : 'dev.jxnata.jwmaps')

export const database = new TrackedDatabase(client)
