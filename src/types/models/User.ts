import { ICongregation } from './Congregation'
import { IPublisher } from './Publisher'

export type IUser = {
	_id: string
	name: string
	username: string
	address: string
	private_key: string
	congregation: ICongregation
	publisher?: IPublisher | string
	created_at: string
}

export type IUserParams = {
	_id: string
	name: string
	username: string
	address: string
	private_key: string
	congregation: string
	publisher?: string
	created_at: string
}
