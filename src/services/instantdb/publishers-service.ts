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
	async createPublisher(input: CreatePublisherInput): Promise<string> {
		const publisherId = id()
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

		await db.transact(db.tx.publishers[publisherId].update(publisherData).link(links))
		return publisherId
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

	// Each step is a separate transaction because link rules are evaluated against the state before the transaction:
	// the role must be reset before linking, and only a linked creator can promote themselves (see instant.perms.ts)
	async joinCongregation(publisherId: string, congregationId: string, asCreator: boolean): Promise<void> {
		await db.transact(db.tx.publishers[publisherId].update({ level: 3, approved: false }))
		await db.transact(db.tx.publishers[publisherId].link({ congregation: congregationId }))

		if (asCreator) {
			await db.transact(db.tx.publishers[publisherId].update({ level: 1, approved: true }))
		}
	}

	async unlinkCongregation(publisherId: string, congregationId: string): Promise<void> {
		await db.transact(db.tx.publishers[publisherId].unlink({ congregation: congregationId }))
	}

	async deletePublisher(publisherId: string): Promise<void> {
		await db.transact(db.tx.publishers[publisherId].delete())
	}
}

export const publishersService = new PublishersService()
