import db from '@/lib/db'
import { normalizePhone } from '@/utils/phone-number'
import { id } from '@instantdb/react-native'

export interface CreatePhoneInput {
	number: string
	congregationId: string
}

export interface FinishPhoneInput {
	answered: boolean
	answered_info?: string
	called_by: string
}

class PhonesService {
	async createPhone(input: CreatePhoneInput): Promise<string> {
		const phoneId = id()
		await db.transact(
			db.tx.phones[phoneId].update({ number: normalizePhone(input.number) }).link({ congregation: input.congregationId })
		)
		return phoneId
	}

	async existsInCongregation(number: string, congregationId: string): Promise<boolean> {
		const { data } = await db.queryOnce({
			phones: {
				$: {
					where: { number: normalizePhone(number), congregation: congregationId },
					limit: 1,
				},
			},
		})
		return (data.phones?.length ?? 0) > 0
	}

	async assignPhone(phoneId: string, publisherId: string): Promise<void> {
		await db.transact(db.tx.phones[phoneId].link({ assigned: publisherId }))
	}

	async unassignPhone(phoneId: string, publisherId: string): Promise<void> {
		await db.transact(db.tx.phones[phoneId].unlink({ assigned: publisherId }))
	}

	// Records the call result, then releases the phone (same two steps as finishing a map)
	async finishPhone(phoneId: string, publisherId: string, input: FinishPhoneInput): Promise<void> {
		await db.transact(
			db.tx.phones[phoneId].update({
				answered: input.answered,
				answered_info: input.answered_info ?? null,
				called: new Date().toISOString(),
				called_by: input.called_by,
			})
		)
		await this.unassignPhone(phoneId, publisherId)
	}

	async deletePhone(phoneId: string): Promise<void> {
		await db.transact(db.tx.phones[phoneId].delete())
	}
}

export const phonesService = new PhonesService()
