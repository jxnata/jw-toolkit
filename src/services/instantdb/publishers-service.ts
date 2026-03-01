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

		await db.transact(db.tx.publishers[id()].update(publisherData).link(links))
	}

	async updatePublisher(publisherId: string, updates: Partial<Publisher>, links?: Record<string, string>): Promise<void> {
		await db.transact(db.tx.publishers[publisherId].update(updates).link(links || {}))
	}

	async getPublisher(publisherId: string): Promise<Publisher | null> {
		const { data } = await db.queryOnce({
			publishers: {
				$: {
					where: { id: publisherId },
				},
				congregation: {},
				user: {},
			},
		})
		return data.publishers[0] as Publisher | null
	}

	async searchByUserId(userId: string): Promise<Publisher | null> {
		const { data } = await db.queryOnce({
			publishers: {
				$: { where: { user: userId } },
				congregation: {},
			},
		})
		return data.publishers[0] as Publisher | null
	}

	async checkIsFirstPublisher(congregationId: string): Promise<boolean> {
		const { data } = await db.queryOnce({
			publishers: {
				$: {
					limit: 1,
					where: { congregation: congregationId },
				},
			},
		})
		return data.publishers.length === 0
	}

	async unlinkCongregation(publisherId: string, congregationId: string): Promise<void> {
		await db.transact(db.tx.publishers[publisherId].unlink({ congregation: congregationId }))
	}

	async deletePublisher(publisherId: string): Promise<void> {
		await db.transact(db.tx.publishers[publisherId].delete())
	}
}

export const publishersService = new PublishersService()
