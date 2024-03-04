import { ICongregation } from './Congregation'

export type IUser = {
	_id: string
	name: string
	username: string
	address: string
	private_key: string
	congregation: ICongregation
	created_at: string
}
