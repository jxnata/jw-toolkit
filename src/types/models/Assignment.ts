import { ICongregation } from './Congregation'
import { IMap } from './Map'
import { IPublisher } from './Publisher'

export type IAssignment = {
	_id: string
	publisher: IPublisher | string
	map: IMap | string
	congregation: ICongregation | string
	details?: string
	permanent: boolean
	found: boolean
	finished: boolean
	created_at: string
}
