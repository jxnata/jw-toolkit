import { ICongregation } from './Congregation'

export type IPublisher = {
	_id: string
	name: string
	username: string
	privileges: string[]
	congregation: ICongregation
	created_at: string
}
