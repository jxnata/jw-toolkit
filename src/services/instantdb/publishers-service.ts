import { Publisher } from '@/interfaces'
import db from '@/lib/db'
import { id } from '@instantdb/react-native'

export interface CreatePublisherInput {
	name: string
	level: number
	approved?: boolean
	congregationId?: string
	userId: string
}

export interface PublisherResponse {
	data: Publisher | null
	error: string | null
}

export interface PublishersResponse {
	data: Publisher[] | null
	error: string | null
}

class PublishersService {
	async createPublisher(input: CreatePublisherInput): Promise<void> {
		const publisherData = {
			name: input.name,
			level: input.level,
			approved: input.approved,
		}

		const links: Record<string, string> = {
			user: input.userId,
		}

		if (input.congregationId) {
			links.congregation = input.congregationId
		}

		await db.transact(
			db.tx.publishers[id()].update(publisherData).link(links)
		)
	}

	async updatePublisher(publisherId: string, updates: Partial<Publisher>): Promise<void> {
		await db.transact(db.tx.publishers[publisherId].update(updates))
	}

	async getPublisher(publisherId: string): Promise<Publisher | null> {
		const { data } = await db.queryOnce({
			publishers: {
				$: {
					where: { id: publisherId }
				},
				congregation: {},
				user: {}
			}
		})
		return data.publishers[0] as Publisher | null
	}

	async searchByUserId(userId: string): Promise<Publisher | null> {
		const { data } = await db.queryOnce({
			publishers: {
				$: { where: { user: userId } },
				congregation: {}
			}
		})
		return data.publishers[0] as Publisher | null
	}

	async deletePublisher(publisherId: string): Promise<void> {
		await db.transact(db.tx.publishers[publisherId].delete())
	}
}

export const publishersService = new PublishersService() 